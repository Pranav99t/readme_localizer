import { useState, useEffect } from 'react';
import { localDB } from '../lib/supabase';
import './DashboardPage.css';

export default function DashboardPage({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [repoUrl, setRepoUrl] = useState('');

  useEffect(() => {
    setProjects(localDB.getProjects());
    setTranslations(localDB.getTranslationHistory());
  }, []);

  const handleQuickAnalyze = () => {
    if (repoUrl.trim()) {
      onNavigate('project', { repoUrl });
    }
  };

  const handleDeleteProject = (id) => {
    localDB.deleteProject(id);
    setProjects(localDB.getProjects());
  };

  const recentTranslations = translations.slice(0, 5);
  const totalTranslations = translations.length;
  const uniqueLangs = new Set(translations.map(t => t.target_lang));
  const totalWords = translations.reduce((sum, t) => sum + (t.translated_words || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dash-header animate-fade-in">
          <div>
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-subtitle">Manage your localization projects and translation history</p>
          </div>
          <div className="dash-quick-analyze">
            <input
              type="text"
              className="input input-mono"
              placeholder="github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAnalyze()}
            />
            <button className="btn btn-primary" onClick={handleQuickAnalyze}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 8h8M8 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Analyze
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="dash-stats animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="dash-stat-card glass-panel">
            <div className="dash-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 16l4-8 4 4 5-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="dash-stat-value">{totalTranslations}</div>
              <div className="dash-stat-label">Translations</div>
            </div>
          </div>

          <div className="dash-stat-card glass-panel">
            <div className="dash-stat-icon" style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--accent-cyan)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </div>
            <div>
              <div className="dash-stat-value">{uniqueLangs.size}</div>
              <div className="dash-stat-label">Languages Used</div>
            </div>
          </div>

          <div className="dash-stat-card glass-panel">
            <div className="dash-stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: 'var(--accent-emerald)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="dash-stat-value">{totalWords.toLocaleString()}</div>
              <div className="dash-stat-label">Words Translated</div>
            </div>
          </div>

          <div className="dash-stat-card glass-panel">
            <div className="dash-stat-icon" style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--accent-amber)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </div>
            <div>
              <div className="dash-stat-value">{projects.length}</div>
              <div className="dash-stat-label">Projects</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="dash-grid">
          {/* Projects */}
          <div className="dash-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="dash-section-header">
              <h2>Recent Projects</h2>
              {projects.length > 0 && (
                <span className="badge badge-primary">{projects.length}</span>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="dash-empty glass-panel">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <rect x="6" y="6" width="28" height="28" rx="4" />
                  <path d="M14 14h12M14 20h8M14 26h10" strokeLinecap="round" />
                </svg>
                <p>No projects yet. Analyze a repository to get started.</p>
              </div>
            ) : (
              <div className="project-list">
                {projects.slice(0, 8).map(project => (
                  <div key={project.id} className="project-card glass-panel">
                    <div className="project-card-header">
                      <div className="project-info">
                        <h3 className="project-name">{project.repo}</h3>
                        <span className="project-owner">{project.owner}</span>
                      </div>
                      <div className="project-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => onNavigate('project', { repoUrl: project.url || `https://github.com/${project.id}` })}
                        >
                          Open
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleDeleteProject(project.id)}
                          style={{ color: 'var(--accent-rose)' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    {project.description && (
                      <p className="project-desc">{project.description}</p>
                    )}
                    <div className="project-meta">
                      {project.stars > 0 && (
                        <span className="project-meta-item">⭐ {project.stars?.toLocaleString()}</span>
                      )}
                      {project.language && (
                        <span className="project-meta-item">
                          <span className="lang-dot" style={{ background: getLanguageColor(project.language) }}></span>
                          {project.language}
                        </span>
                      )}
                      {project.readmeFiles?.length > 0 && (
                        <span className="project-meta-item">📄 {project.readmeFiles.length} READMEs</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="dash-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="dash-section-header">
              <h2>Recent Translations</h2>
              {recentTranslations.length > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('history')}>
                  View All
                </button>
              )}
            </div>

            {recentTranslations.length === 0 ? (
              <div className="dash-empty glass-panel">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                  <circle cx="20" cy="20" r="14" />
                  <line x1="6" y1="20" x2="34" y2="20" />
                  <path d="M20 6a22 22 0 016 14 22 22 0 01-6 14 22 22 0 01-6-14A22 22 0 0120 6z" />
                </svg>
                <p>No translations yet. Translate a README to see activity here.</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentTranslations.map((t, i) => (
                  <div key={i} className="activity-item glass-panel">
                    <div className="activity-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5">
                        <circle cx="8" cy="8" r="6" />
                        <path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">
                        Translated <strong>{t.repo}</strong> to {t.target_lang_name}
                      </div>
                      <div className="activity-meta">
                        {t.translated_words} words • {t.code_blocks_preserved ? 'Code preserved ✓' : ''}
                      </div>
                    </div>
                    <div className="activity-time">
                      {formatTime(t.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CLI Integration Section */}
        <div className="dash-cli-section animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="cli-card glass-panel">
            <div className="cli-header">
              <div>
                <h3>Lingo.dev CLI Integration</h3>
                <p>Automate extraction and synchronization of text content for continuous multilingual documentation.</p>
              </div>
              <span className="badge badge-info">CLI</span>
            </div>
            <div className="cli-steps">
              <div className="cli-step">
                <div className="cli-step-num">1</div>
                <div className="cli-step-code">
                  <code>npx lingo.dev@latest init</code>
                </div>
                <span className="cli-step-label">Initialize</span>
              </div>
              <div className="cli-step-arrow">→</div>
              <div className="cli-step">
                <div className="cli-step-num">2</div>
                <div className="cli-step-code">
                  <code>npx lingo.dev@latest i18n</code>
                </div>
                <span className="cli-step-label">Translate</span>
              </div>
              <div className="cli-step-arrow">→</div>
              <div className="cli-step">
                <div className="cli-step-num">3</div>
                <div className="cli-step-code">
                  <code>git push origin main</code>
                </div>
                <span className="cli-step-label">Deploy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getLanguageColor(lang) {
  const colors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', Go: '#00ADD8', Rust: '#dea584',
    Ruby: '#701516', PHP: '#4F5D95',
  };
  return colors[lang] || '#8b949e';
}
