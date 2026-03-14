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
      {/* Immersive Hero Section */}
      <section className="hero-centered">
        <div className="container">
          <div className="hero-badge-outer">
            <div className="hero-badge animate-fade-in">
              <span className="hero-badge-dot pulse"></span>
              Lingo.dev Engine v2.4 Live
            </div>
          </div>

          <h1 className="hero-title-giant animate-fade-in" style={{ animationDelay: '0.1s' }}>
            The Global Standard for <br />
            <span className="hero-gradient-text">Open Source Documentation</span>
          </h1>

          <p className="hero-subtitle-large animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Translate your entire technical ecosystem in seconds. 
            Native-grade accuracy across 16+ languages with 100% code preservation.
          </p>

          <div className="hero-main-action animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="hero-input-group glass-panel">
              <div className="input-with-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Paste GitHub Repository URL..."
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
              <button className="btn btn-primary btn-xl" onClick={handleAnalyze}>
                Localize Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            
            <div className="hero-links">
              <span>Popular:</span>
              <button onClick={() => setRepoUrl('https://github.com/facebook/react')}>react</button>
              <button onClick={() => setRepoUrl('https://github.com/vercel/next.js')}>next.js</button>
              <button onClick={() => setRepoUrl('https://github.com/tailwindlabs/tailwindcss')}>tailwind</button>
            </div>
          </div>
        </div>

        {/* Floating Code Visual */}
        <div className="hero-visual-floating animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="terminal-window glass-panel">
            <div className="terminal-bar">
              <div className="terminal-controls">
                <span></span><span></span><span></span>
              </div>
              <div className="terminal-tab">README.md — Localization</div>
            </div>
            <div className="terminal-content">
              <div className="code-line"><span className="code-p">$</span> <span className="code-c">lingo</span> <span className="code-f">analyze</span> .</div>
              <div className="code-line info">✓ Deep scanning 42 files...</div>
              <div className="code-line info">✓ Identifying 12 documentable segments</div>
              <div className="code-line"><span className="code-p">$</span> <span className="code-c">lingo</span> <span className="code-f">localize</span> <span className="code-v">--target</span>=es,ja,fr</div>
              <div className="code-line success">✓ Translation complete in 2.4s</div>
              <div className="code-line info">→ <span className="code-s">100% Code Integrity Verified</span></div>
              <div className="code-line blink">_</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Stats Section */}
      <section className="stats-strip">
        <div className="container">
          <div className="stats-row">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-v">{stat.value}</div>
                <div className="stat-l">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Capabilities - Bento Style */}
      <section className="features-bento">
        <div className="container">
          <div className="section-head-centered">
            <h2 className="title-md">Engineered for Excellence</h2>
            <p className="subtitle-md">Localization isn't just about translation. It's about preserving developer intent.</p>
          </div>

          <div className="bento-grid">
            <div className="bento-item bento-main glass-panel">
              <div className="bento-icon-box" style={{ background: 'var(--accent-primary-rgb)', color: 'white' }}>
                {features[2].icon}
              </div>
              <h3>Superior Code Preservation</h3>
              <p>Our proprietary parser treats code blocks as sacred. Shell commands, JSON configurations, and complex code snippets remain untouched while text flows around them naturally.</p>
              <div className="bento-visual">
                <div className="code-comparison">
                  <div className="code-side">
                    <span className="label">Original</span>
                    <pre><code>npx start{"\n"}# run locally</code></pre>
                  </div>
                  <div className="code-arrow">→</div>
                  <div className="code-side">
                    <span className="label">Japanese</span>
                    <pre><code>npx start{"\n"}# ローカルで実行</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-item bento-side glass-panel">
              <div className="bento-icon-box" style={{ color: 'var(--accent-cyan)' }}>
                {features[1].icon}
              </div>
              <h3>16+ Core Locales</h3>
              <p>Support for major global markets with high-fidelity linguistic models.</p>
            </div>

            <div className="bento-item bento-side glass-panel">
              <div className="bento-icon-box" style={{ color: 'var(--accent-rose)' }}>
                {features[0].icon}
              </div>
              <h3>GitHub Native</h3>
              <p>Deep integration allows for automatic repository crawling and structured analysis.</p>
            </div>

            <div className="bento-item bento-wide glass-panel">
              <div className="bento-flex">
                <div className="bento-text">
                  <h3>Enterprise Grade SDK</h3>
                  <p>Built on the Lingo.dev core, providing stability and security for mission-critical documentation.</p>
                </div>
                <div className="bento-visual-icons">
                  <div className="tech-badge">SDK</div>
                  <div className="tech-badge">CLI</div>
                  <div className="tech-badge">API</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Reveal */}
      <section className="cta-reveal">
        <div className="container">
          <div className="cta-box-premium">
            <div className="cta-glow"></div>
            <h2 className="cta-title">Start Your Global Journey</h2>
            <p className="cta-desc">Join thousands of developers making their work accessible to everyone.</p>
            <div className="cta-btns">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'auth')}>
                {isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}
              </button>
              <button className="btn btn-ghost btn-lg">View Demo</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-premium">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand-large">
              <div className="logo-f">README</div>
              <div className="logo-l">Localizer</div>
            </div>
            <div className="footer-nav-groups">
              <div className="footer-group">
                <h4>Product</h4>
                <a href="#">CLI</a>
                <a href="#">Documentation</a>
                <a href="#">API</a>
              </div>
              <div className="footer-group">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 README Localizer. Powered by Lingo.dev Localization Engine.</p>
            <div className="social-links">
              {/* Icons here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
