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
    <div className="history-page">
      <div className="container">
        <div className="history-header animate-fade-in">
          <div>
            <h1 className="history-title">Translation History</h1>
            <p className="history-subtitle">
              {translations.length} translations • {totalWords.toLocaleString()} words translated • {codePreservedCount}/{translations.length} code preserved
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="history-filters animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({translations.length})
          </button>
          {Object.entries(langCounts).map(([lang, count]) => {
            const info = SUPPORTED_LANGUAGES.find(l => l.code === lang);
            return (
              <button
                key={lang}
                className={`filter-btn ${filter === lang ? 'active' : ''}`}
                onClick={() => setFilter(lang)}
              >
                {info?.flag} {info?.name || lang} ({count})
              </button>
            );
          })}
        </div>

        {/* Translation List */}
        {filteredTranslations.length === 0 ? (
          <div className="history-empty glass-panel animate-fade-in">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <circle cx="24" cy="24" r="18" />
              <path d="M24 16v8l5 3" strokeLinecap="round" />
            </svg>
            <h3>No Translation History</h3>
            <p>Your translations will appear here after you localize a README.</p>
            <button className="btn btn-primary" onClick={() => onNavigate('landing')}>
              Start Translating
            </button>
          </div>
        ) : (
          <div className="history-list animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="history-table-header">
              <span className="ht-col ht-repo">Repository</span>
              <span className="ht-col ht-file">File</span>
              <span className="ht-col ht-lang">Language</span>
              <span className="ht-col ht-words">Words</span>
              <span className="ht-col ht-code">Code</span>
              <span className="ht-col ht-time">Time</span>
            </div>
            {filteredTranslations.map((t, i) => {
              const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === t.target_lang);
              return (
                <div key={i} className="history-row glass-panel" style={{ animationDelay: `${i * 0.03}s` }}>
                  <span className="ht-col ht-repo">
                    <span className="ht-repo-name">{t.repo || 'Unknown'}</span>
                  </span>
                  <span className="ht-col ht-file">
                    <code className="ht-filename">{t.file || 'README.md'}</code>
                  </span>
                  <span className="ht-col ht-lang">
                    <span className="ht-lang-badge">
                      <span>{langInfo?.flag}</span>
                      <span>{langInfo?.name || t.target_lang}</span>
                    </span>
                  </span>
                  <span className="ht-col ht-words">
                    <span className="ht-word-count">{t.original_words || 0}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                      <path d="M4 6h4M6 4l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="ht-word-count">{t.translated_words || 0}</span>
                  </span>
                  <span className="ht-col ht-code">
                    {t.code_blocks_preserved ? (
                      <span className="badge badge-success">Preserved</span>
                    ) : (
                      <span className="badge badge-warning">Modified</span>
                    )}
                  </span>
                  <span className="ht-col ht-time">
                    {formatDate(t.created_at)}
                  </span>
                </div>
              );
            })}
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
