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
    <div className="dashboard-v2">
      <div className="container">
        {/* Welcome Section */}
        <section className="dash-welcome animate-fade-in">
          <div className="welcome-text">
            <h1 className="title-lg">Console</h1>
            <p className="subtitle-sm">Managing your global documentation pipeline</p>
          </div>
          <div className="dash-search-box glass-panel">
            <div className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <input
              type="text"
              placeholder="Analyze new repository..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAnalyze()}
            />
            <button className="btn btn-primary btn-sm" onClick={handleQuickAnalyze}>Go</button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid-v2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-card-v2 glass-panel">
            <div className="stat-header">
              <span className="stat-label">Total Volume</span>
              <div className="stat-icon-v2" style={{ color: 'var(--accent-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              </div>
            </div>
            <div className="stat-value-v2">{totalWords.toLocaleString()}</div>
            <div className="stat-footer">Words Localized</div>
          </div>

          <div className="stat-card-v2 glass-panel">
            <div className="stat-header">
              <span className="stat-label">Reach</span>
              <div className="stat-icon-v2" style={{ color: 'var(--accent-cyan)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              </div>
            </div>
            <div className="stat-value-v2">{uniqueLangs.size}</div>
            <div className="stat-footer">Languages Matrix</div>
          </div>

          <div className="stat-card-v2 glass-panel">
            <div className="stat-header">
              <span className="stat-label">Operations</span>
              <div className="stat-icon-v2" style={{ color: 'var(--accent-emerald)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              </div>
            </div>
            <div className="stat-value-v2">{totalTranslations}</div>
            <div className="stat-footer">Successful Syncs</div>
          </div>

          <div className="stat-card-v2 glass-panel">
            <div className="stat-header">
              <span className="stat-label">Ecosystem</span>
              <div className="stat-icon-v2" style={{ color: 'var(--accent-amber)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
            </div>
            <div className="stat-value-v2">{projects.length}</div>
            <div className="stat-footer">Tracked Repos</div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="dash-layout-v2">
          {/* Projects Column */}
          <section className="dash-col animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="col-header">
              <h3>Tracked Repositories</h3>
              <button className="btn btn-ghost btn-xs">View all</button>
            </div>
            
            <div className="project-grid-v2">
              {projects.length === 0 ? (
                <div className="empty-mini glass-panel">
                  <p>No projects tracked yet.</p>
                </div>
              ) : (
                projects.slice(0, 6).map(project => (
                  <div key={project.id} className="repo-card-v2 glass-panel">
                    <div className="repo-card-top">
                      <div className="repo-main">
                        <span className="repo-name-v2">{project.repo}</span>
                        <span className="repo-owner-v2">{project.owner}</span>
                      </div>
                      <button className="delete-btn" onClick={() => handleDeleteProject(project.id)}>×</button>
                    </div>
                    {project.description && <p className="repo-desc-v2">{project.description}</p>}
                    <div className="repo-footer-v2">
                      <div className="repo-tags">
                        {project.language && <span className="repo-tag" style={{ '--tag-color': getLanguageColor(project.language) }}>{project.language}</span>}
                        <span className="repo-tag">⭐ {project.stars}</span>
                      </div>
                      <button 
                        className="btn btn-secondary btn-xs" 
                        onClick={() => onNavigate('project', { repoUrl: project.url || `https://github.com/${project.id}` })}
                      >
                        Sync
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Activity Column */}
          <section className="dash-col animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="col-header">
              <h3>Recent Deployment</h3>
              <button className="btn btn-ghost btn-xs" onClick={() => onNavigate('history')}>History</button>
            </div>

            <div className="activity-stack-v2">
              {recentTranslations.length === 0 ? (
                <div className="empty-mini glass-panel">
                  <p>No recent activity detected.</p>
                </div>
              ) : (
                recentTranslations.map((t, i) => (
                  <div key={i} className="activity-tile-v2 glass-panel">
                    <div className="tile-icon-v2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                    </div>
                    <div className="tile-content-v2">
                      <div className="tile-top-v2">
                        <span className="tile-repo">{t.repo}</span>
                        <span className="tile-lang">{t.target_lang_name}</span>
                      </div>
                      <div className="tile-mid-v2">
                        <span>{t.translated_words} words syntesized</span>
                        {t.code_blocks_preserved && <span className="integrity-check">Integrity OK</span>}
                      </div>
                      <div className="tile-time-v2">{formatTime(t.created_at)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* System Status Mini-Card */}
            <div className="system-status-card glass-panel animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="system-status-header">
                <div className="status-indicator-live pulse-dot"></div>
                <h4>Lingo.dev Engine</h4>
              </div>
              <div className="status-details">
                <div className="status-row">
                  <span>API Latency</span>
                  <span className="status-value" style={{color: 'var(--accent-cyan)'}}>42ms</span>
                </div>
                <div className="status-row">
                  <span>Translation Nodes</span>
                  <span className="status-value">16 Active</span>
                </div>
                <div className="status-row">
                  <span>Queue Depth</span>
                  <span className="status-value" style={{color: 'var(--accent-emerald)'}}>0 Tasks</span>
                </div>
              </div>
            </div>
          </section>
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
