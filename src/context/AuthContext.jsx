import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize user shape from Supabase auth user object
  function normalizeUser(supabaseUser) {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name:
        supabaseUser.user_metadata?.name ||
        supabaseUser.email?.split('@')[0] ||
        'User',
      avatar:
        supabaseUser.user_metadata?.avatar_url ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(supabaseUser.email)}&backgroundColor=6366f1`,
      created_at: supabaseUser.created_at,
    };
  }

  useEffect(() => {
    // 1. Check existing session on mount
    const initAuth = async () => {
      try {
        const sessionUser = await authService.getSession();
        setUser(normalizeUser(sessionUser));
      } catch (err) {
        console.warn('Auth init error:', err);
        setUser(null);
      }
      setLoading(false);
    };
    initAuth();

    // 2. Listen for auth state changes (login, logout, token refresh)
    const subscription = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(normalizeUser(session?.user || null));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const supabaseUser = await authService.signIn(email, password);
    const normalized = normalizeUser(supabaseUser);
    setUser(normalized);
    return normalized;
  };

  const signUp = async (email, password, name) => {
    const supabaseUser = await authService.signUp(email, password, name);
    const normalized = normalizeUser(supabaseUser);
    setUser(normalized);
    return normalized;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
