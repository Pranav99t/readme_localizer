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

  const steps = [
    {
      number: '01',
      title: 'Repository Link',
      text: 'Simply paste your GitHub repository URL. Our engine supports any public repository and private ones with authorized access.',
    },
    {
      number: '02',
      title: 'Deep Scan',
      text: 'Our AI engine scans every file in your project, identifying documentation, READMEs, and text segments that need localization.',
    },
    {
      number: '03',
      title: 'Context-Aware AI',
      text: 'We use Lingo.dev\'s advanced LLMs to translate your content while preserving technical context, code blocks, and markdown structure.',
    },
    {
      number: '04',
      title: 'Deployment',
      text: 'Download your localized files or push them directly to a new branch in your repository with a single click.',
    }
  ];

  const faqs = [
    {
      q: 'Is the code preservation really 100%?',
      a: 'Absolutely. Our proprietary parser is fine-tuned for technical markups. It treats code blocks, inline snippets, and shell commands as sacred tokens, ensuring your technical logic remains functional and correctly formatted in every language.'
    },
    {
      q: 'Which languages do you support?',
      a: 'We currently support over 16 core languages including Japanese, Mandarin Chinese, Spanish, French, German, Korean, Portuguese, Italian, Russian, and more. We are constantly adding new locales based on developer demand.'
    },
    {
      q: 'Does it work with MONOREPOS?',
      a: 'Yes! Our deep crawler can navigate complex folder structures. You can specify deep paths to READMEs or let the engine auto-discover documentation across your entire monorepo architecture.'
    },
    {
      q: 'How does it handle Markdown updates?',
      a: 'If you update your original README, you can re-run the localization. Our engine is smart enough to detect changes and only process the updated segments, saving time and maintaining consistency.'
    },
    {
      q: 'Is there an API or CLI available?',
      a: 'Built on the Lingo.dev SDK, our engine is fully accessible via CLI for CI/CD integrations. You can automate your documentation localization as part of your deployment pipeline.'
    }
  ];

  const languages = [
    { name: 'Japanese', code: 'JA', native: '日本語' },
    { name: 'Spanish', code: 'ES', native: 'Español' },
    { name: 'French', code: 'FR', native: 'Français' },
    { name: 'German', code: 'DE', native: 'Deutsch' },
    { name: 'Chinese', code: 'ZH', native: '中文' },
    { name: 'Korean', code: 'KO', native: '한국어' },
    { name: 'Portuguese', code: 'PT', native: 'Português' },
    { name: 'Italian', code: 'IT', native: 'Italiano' },
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

      {/* NEW: How it Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-head-centered">
            <h2 className="title-md">How it actually works</h2>
            <p className="subtitle-md">Four simple steps to take your documentation global.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card glass-panel">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Languages Grid */}
      <section className="languages-section">
        <div className="container">
          <div className="section-head-centered">
            <h2 className="title-md">Global Coverage</h2>
            <p className="subtitle-md">Support for the world's most spoken developer languages.</p>
          </div>
          <div className="languages-grid">
            {languages.map((lang, i) => (
              <div key={i} className="lang-pill glass-panel">
                <span className="lang-code">{lang.code}</span>
                <div className="lang-info">
                  <div className="lang-name">{lang.name}</div>
                  <div className="lang-native">{lang.native}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="languages-more">
            And 8+ more languages including Russian, Hindi, Arabic, and Dutch.
          </div>
        </div>
      </section>

      {/* NEW: Use Cases Section */}
      <section className="use-cases">
        <div className="container">
          <div className="use-cases-layout">
            <div className="use-cases-text">
              <h2 className="title-md">Tailored for your ecosystem</h2>
              <div className="use-case-item">
                <div className="uc-icon">🚀</div>
                <div>
                  <h4>Open Source Maintainers</h4>
                  <p>Increase project adoption by welcoming developers from every corner of the globe with native documentation.</p>
                </div>
              </div>
              <div className="use-case-item">
                <div className="uc-icon">🏢</div>
                <div>
                  <h4>Enterprise Teams</h4>
                  <p>Scale technical communication across distributed international teams with zero manual translation overhead.</p>
                </div>
              </div>
              <div className="use-case-item">
                <div className="uc-icon">📚</div>
                <div>
                  <h4>Technical Writers</h4>
                  <p>Focus on high-quality content creation while letting AI handle the repetitive task of multi-language localization.</p>
                </div>
              </div>
            </div>
            <div className="use-cases-visual">
              <div className="comparison-card glass-panel">
                <div className="cc-header">
                  <span>Growth Metrics after Localization</span>
                </div>
                <div className="cc-body">
                  <div className="chart-bar-row">
                    <span>Global Visitors</span>
                    <div className="bar-bg"><div className="bar-fill" style={{ width: '85%' }}></div></div>
                  </div>
                  <div className="chart-bar-row">
                    <span>Avg. Time on Page</span>
                    <div className="bar-bg"><div className="bar-fill" style={{ width: '60%' }}></div></div>
                  </div>
                  <div className="chart-bar-row">
                    <span>Fork Rate</span>
                    <div className="bar-bg"><div className="bar-fill" style={{ width: '45%' }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-head-centered">
            <h2 className="title-md">Frequently Asked Questions</h2>
            <p className="subtitle-md">Everything you need to know about Global README Localizer.</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item glass-panel">
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-grid">
            <div className="testimonial-card glass-panel">
              <p>"The code preservation is unbelievable. It kept our complex Docker and Kubernetes configs perfectly intact while translating the surrounding guide to Japanese."</p>
              <div className="t-author">
                <div className="t-avatar">JD</div>
                <div>
                  <div className="t-name">James Dalton</div>
                  <div className="t-role">Cloud Architect</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card glass-panel">
              <p>"We saw a significant jump in contributions from French and German developers within weeks of localizing our repo with this tool. Highly recommended."</p>
              <div className="t-author">
                <div className="t-avatar">AL</div>
                <div>
                  <div className="t-name">Anna Lopez</div>
                  <div className="t-role">OS Maintainer</div>
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
