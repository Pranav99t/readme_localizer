import { createClient } from '@supabase/supabase-js';

// ─── Supabase Configuration ───────────────────────────────────────────
// Keys loaded from .env file (VITE_ prefix exposes them to client via Vite)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '⚠️ Missing Supabase credentials! Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// ─── Auth Service (Real Supabase Auth) ───────────────────────────────
export const authService = {
  /**
   * Sign up a new user with email, password, and optional display name.
   * Supabase will send a confirmation email if email confirmation is enabled.
   */
  async signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}&backgroundColor=6366f1`,
        },
      },
    });

    if (error) throw error;

    // Supabase returns the user even before email confirmation
    return data.user;
  },

  /**
   * Sign in an existing user with email and password.
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  },

  /**
   * Sign out the current user, clearing the session.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current authenticated user from the session.
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return data.session?.user || null;
  },

  /**
   * Listen for auth state changes (login, logout, token refresh).
   * Returns the subscription object (call .unsubscribe() to stop).
   */
  onAuthStateChange(callback) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return data;
  },
};

// ─── Projects Service ─────────────────────────────────────────────────
export const projectsService = {
  async getAll(userId) {
    // Try Supabase first, fall back to localStorage
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase projects fetch failed, using localStorage:', err.message);
      return localDB.getProjects();
    }
  },

  async save(project, userId) {
    try {
      const record = {
        id: project.id,
        user_id: userId,
        owner: project.owner,
        repo: project.repo,
        name: project.name,
        description: project.description,
        stars: project.stars,
        forks: project.forks,
        language: project.language,
        readme_files: project.readmeFiles,
        url: project.url,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('projects')
        .upsert(record, { onConflict: 'id,user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase project save failed, using localStorage:', err.message);
      return localDB.saveProject(project);
    }
  },

  async delete(id, userId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (err) {
      console.warn('Supabase project delete failed, using localStorage:', err.message);
      localDB.deleteProject(id);
    }
  },
};

// ─── Translation History Service ──────────────────────────────────────
export const translationsService = {
  async getAll(userId) {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase translations fetch failed, using localStorage:', err.message);
      return localDB.getTranslationHistory();
    }
  },

  async save(translation, userId) {
    try {
      const record = {
        user_id: userId,
        repo: translation.repo,
        file: translation.file,
        source_lang: translation.source_lang || 'en',
        target_lang: translation.target_lang,
        target_lang_name: translation.target_lang_name,
        original_words: translation.original_words,
        translated_words: translation.translated_words,
        code_blocks_preserved: translation.code_blocks_preserved,
      };

      const { data, error } = await supabase
        .from('translations')
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase translation save failed, using localStorage:', err.message);
      return localDB.saveTranslation(translation);
    }
  },
};

// ─── Local Storage Fallback ───────────────────────────────────────────
// Used as fallback when Supabase tables don't exist yet
export const localDB = {
  getProjects: () => {
    const data = localStorage.getItem('grl_projects');
    return data ? JSON.parse(data) : [];
  },
  saveProject: (project) => {
    const projects = localDB.getProjects();
    const existing = projects.findIndex(p => p.id === project.id);
    if (existing >= 0) {
      projects[existing] = { ...projects[existing], ...project, updated_at: new Date().toISOString() };
    } else {
      projects.push({ ...project, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    localStorage.setItem('grl_projects', JSON.stringify(projects));
    return project;
  },
  deleteProject: (id) => {
    const projects = localDB.getProjects().filter(p => p.id !== id);
    localStorage.setItem('grl_projects', JSON.stringify(projects));
  },
  getTranslationHistory: () => {
    const data = localStorage.getItem('grl_translations');
    return data ? JSON.parse(data) : [];
  },
  saveTranslation: (translation) => {
    const history = localDB.getTranslationHistory();
    history.unshift({ ...translation, created_at: new Date().toISOString() });
    if (history.length > 100) history.pop();
    localStorage.setItem('grl_translations', JSON.stringify(history));
    return translation;
  },
};
