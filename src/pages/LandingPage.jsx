import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

export default function LandingPage({ onNavigate }) {
  const { isAuthenticated } = useAuth();
  const [repoUrl, setRepoUrl] = useState('');

  const handleAnalyze = () => {
    if (!repoUrl.trim()) return;
    if (!isAuthenticated) {
      onNavigate('auth', { returnTo: 'project', repoUrl });
      return;
    }
    onNavigate('project', { repoUrl });
  };

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'GitHub Integration',
      desc: 'Paste any GitHub repository link and instantly analyze its full structure including README files, configs, and documentation.',
      color: 'var(--accent-primary)',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
      title: '16+ Languages',
      desc: 'Translate documentation into Spanish, French, German, Japanese, Chinese, Korean, and many more with native accuracy.',
      color: 'var(--accent-cyan)',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16,18 22,12 16,6" />
          <polyline points="8,6 2,12 8,18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      ),
      title: 'Code Preservation',
      desc: 'Code blocks, terminal commands, JSON structures, config snippets stay perfectly intact — zero formatting corruption.',
      color: 'var(--accent-emerald)',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Lingo.dev Powered',
      desc: 'Built on the Lingo.dev SDK and CLI for enterprise-grade AI localization with developer-first tooling and automation.',
      color: 'var(--accent-secondary)',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      title: 'Side-by-Side View',
      desc: 'Compare original and localized READMEs in a clean split-panel interface designed for developer workflows.',
      color: 'var(--accent-amber)',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Supabase Backend',
      desc: 'Secure authentication, persistent project storage, and complete translation history powered by Supabase infrastructure.',
      color: 'var(--accent-rose)',
    },
  ];

  const stats = [
    { value: '16+', label: 'Languages' },
    { value: '100%', label: 'Code Preserved' },
    { value: '<30s', label: 'Translation Time' },
    { value: '∞', label: 'Repositories' },
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="hero-badge-dot"></span>
            Powered by Lingo.dev SDK & CLI
          </div>

          <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Make Your Open Source
            <br />
            <span className="hero-gradient-text">Globally Accessible</span>
          </h1>

          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AI-powered README localization for GitHub repositories. Translate technical documentation
            into 16+ languages while perfectly preserving code blocks, commands, and developer intent.
          </p>

          <div className="hero-input-wrapper animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="hero-input-container">
              <div className="hero-input-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 3C4.239 3 2 5.239 2 8s2.239 5 5 5c1.519 0 2.878-.68 3.797-1.75M13 17c2.761 0 5-2.239 5-5s-2.239-5-5-5c-1.519 0-2.878.68-3.797 1.75" strokeLinecap="round" />
                </svg>
              </div>
              <input
                type="text"
                className="hero-input"
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button className="btn btn-primary hero-btn" onClick={handleAnalyze}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 9h10M10 5l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Analyze & Localize
              </button>
            </div>
            <div className="hero-input-hints">
              <span>Try:</span>
              <button className="hint-btn" onClick={() => { setRepoUrl('https://github.com/facebook/react'); }}>facebook/react</button>
              <button className="hint-btn" onClick={() => { setRepoUrl('https://github.com/vercel/next.js'); }}>vercel/next.js</button>
              <button className="hint-btn" onClick={() => { setRepoUrl('https://github.com/tailwindlabs/tailwindcss'); }}>tailwindcss</button>
            </div>
          </div>

          {/* Stats */}
          <div className="hero-stats animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="hero-stat">
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="terminal-preview">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <span className="terminal-title">README.md → translated</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line">
                <span className="t-prompt">$</span>
                <span className="t-cmd"> npx lingo.dev@latest</span>
                <span className="t-flag"> i18n</span>
              </div>
              <div className="terminal-line t-dim">
                <span>  ✓ Analyzing repository structure...</span>
              </div>
              <div className="terminal-line t-dim">
                <span>  ✓ Found 3 README files, 2 docs</span>
              </div>
              <div className="terminal-line t-dim">
                <span>  ✓ Extracting translatable segments</span>
              </div>
              <div className="terminal-line">
                <span className="t-success">  ✓ Translated to 5 languages</span>
              </div>
              <div className="terminal-line">
                <span className="t-info">  → Code blocks preserved: 12/12</span>
              </div>
              <div className="terminal-line t-blink">
                <span className="t-prompt">$</span>
                <span className="t-cursor">▋</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge badge badge-primary">Features</span>
            <h2 className="section-title">Everything You Need for<br />Global Documentation</h2>
            <p className="section-subtitle">
              A complete toolkit for open source maintainers to instantly make their repositories accessible worldwide.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card glass-panel animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="feature-icon" style={{ color: feature.color, background: `${feature.color}15` }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge badge badge-info">How It Works</span>
            <h2 className="section-title">Three Steps to<br />Global Reach</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card animate-fade-in">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Paste Repository URL</h3>
                <p>Enter any public GitHub repository link. We'll automatically crawl the structure, find README files, and identify all documentation.</p>
              </div>
              <div className="step-visual">
                <div className="mini-input">
                  <span className="mini-input-icon">🔗</span>
                  <span className="mini-input-text">github.com/owner/repo</span>
                </div>
              </div>
            </div>

            <div className="step-connector">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M12 20h16M24 14l6 6-6 6" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="step-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Select Languages</h3>
                <p>Choose from 16+ target languages. Our AI preserves technical terms, code blocks, and formatting while translating natural language content.</p>
              </div>
              <div className="step-visual">
                <div className="mini-flags">
                  <span>🇪🇸</span><span>🇫🇷</span><span>🇩🇪</span><span>🇯🇵</span><span>🇰🇷</span><span>+11</span>
                </div>
              </div>
            </div>

            <div className="step-connector">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M12 20h16M24 14l6 6-6 6" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="step-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Review & Export</h3>
                <p>Compare translations side-by-side, verify code preservation, then download or copy the localized README for your repository.</p>
              </div>
              <div className="step-visual">
                <div className="mini-compare">
                  <span className="mini-panel">EN</span>
                  <span className="mini-arrow">→</span>
                  <span className="mini-panel mini-panel-accent">ES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-panel">
            <h2>Ready to Go Global?</h2>
            <p>Start localizing your README in seconds. No configuration needed.</p>
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 9h10M10 5l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="logo-primary">README</span>
              <span className="logo-accent">Localizer</span>
            </div>
            <div className="footer-links">
              <span>Built with</span>
              <span className="footer-tech">Lingo.dev SDK</span>
              <span>•</span>
              <span className="footer-tech">Supabase</span>
              <span>•</span>
              <span className="footer-tech">React</span>
            </div>
            <div className="footer-copy">© 2026 Global README Localizer</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
