import { useState, useEffect } from 'react';
import { localDB } from '../lib/supabase';
import { SUPPORTED_LANGUAGES } from '../services/translator';
import './HistoryPage.css';

export default function HistoryPage({ onNavigate }) {
  const [translations, setTranslations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTranslations(localDB.getTranslationHistory());
  }, []);

  const langCounts = {};
  translations.forEach(t => {
    langCounts[t.target_lang] = (langCounts[t.target_lang] || 0) + 1;
  });

  const filteredTranslations = filter === 'all'
    ? translations
    : translations.filter(t => t.target_lang === filter);

  const totalWords = translations.reduce((sum, t) => sum + (t.translated_words || 0), 0);
  const codePreservedCount = translations.filter(t => t.code_blocks_preserved).length;

  return (
    <div className="history-v2">
      <div className="container">
        <header className="page-header-v2 animate-fade-in">
          <div className="header-meta">
            <h1 className="title-md">Deployment Logs</h1>
            <p className="subtitle-xs">Audit trail of all synthesized localizations</p>
          </div>
          
          <div className="log-stats glass-panel">
            <div className="l-stat">
              <span className="l-val">{translations.length}</span>
              <span className="l-lab">Deployments</span>
            </div>
            <div className="l-stat">
              <span className="l-val">{totalWords.toLocaleString()}</span>
              <span className="l-lab">Words</span>
            </div>
            <div className="l-stat">
              <span className="l-val success">{codePreservedCount}</span>
              <span className="l-lab">Integrity Checks</span>
            </div>
          </div>
        </header>

        {/* Filter Navigation */}
        <nav className="filter-nav-v2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <button
            className={`nav-item-v2 ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Logs
          </button>
          <div className="nav-divider"></div>
          {Object.entries(langCounts).map(([lang, count]) => {
            const info = SUPPORTED_LANGUAGES.find(l => l.code === lang);
            return (
              <button
                key={lang}
                className={`nav-item-v2 ${filter === lang ? 'active' : ''}`}
                onClick={() => setFilter(lang)}
              >
                <span className="nav-flag">{info?.flag}</span>
                <span className="nav-label">{info?.name || lang}</span>
                <span className="nav-count">{count}</span>
              </button>
            );
          })}
        </nav>

        {/* Log Table */}
        {filteredTranslations.length === 0 ? (
          <div className="empty-logs glass-panel animate-fade-in">
            <div className="empty-icon-v2">📋</div>
            <h3>No deployments detected</h3>
            <p>Ready to initialize your first localization?</p>
            <button className="btn btn-primary" onClick={() => onNavigate('landing')}>
              Initialize
            </button>
          </div>
        ) : (
          <div className="log-table-v2 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="table-row-v2 header">
              <div className="table-col-v2 t-repo">Source</div>
              <div className="table-col-v2 t-file">Path</div>
              <div className="table-col-v2 t-lang">Matrix</div>
              <div className="table-col-v2 t-volume">Volume</div>
              <div className="table-col-v2 t-status">Status</div>
              <div className="table-col-v2 t-time">Timestamp</div>
            </div>
            
            <div className="table-body-v2">
              {filteredTranslations.map((t, i) => {
                const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === t.target_lang);
                return (
                  <div key={i} className="table-row-v2 glass-panel" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="table-col-v2 t-repo">
                      <span className="repo-pill">{t.repo || 'internal'}</span>
                    </div>
                    <div className="table-col-v2 t-file">
                      <code className="mono-file">{t.file || 'README.md'}</code>
                    </div>
                    <div className="table-col-v2 t-lang">
                      <div className="lang-pill-v2">
                        <span>{langInfo?.flag}</span>
                        <span>{langInfo?.code.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="table-col-v2 t-volume">
                      <div className="volume-stats">
                        <span className="v-orig">{t.original_words || 0}</span>
                        <span className="v-sep">→</span>
                        <span className="v-trans">{t.translated_words || 0}</span>
                      </div>
                    </div>
                    <div className="table-col-v2 t-status">
                      {t.code_blocks_preserved ? (
                        <span className="status-tag success">Verified</span>
                      ) : (
                        <span className="status-tag warning">Partial</span>
                      )}
                    </div>
                    <div className="table-col-v2 t-time">
                      <span className="time-v2">{formatDate(t.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
