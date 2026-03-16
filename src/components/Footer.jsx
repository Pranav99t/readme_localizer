import React from 'react';
import './Footer.css';

const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo" onClick={() => onNavigate('landing')}>
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#footerLogoGrad)" />
                <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="18" r="3" fill="white" fillOpacity="0.9" />
                <path d="M19 18l1 1 2-2" stroke="url(#footerLogoGrad2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="footerLogoGrad" x1="2" y1="2" x2="26" y2="26">
                    <stop stopColor="#ff2d55" />
                    <stop offset="1" stopColor="#ff7e5f" />
                  </linearGradient>
                  <linearGradient id="footerLogoGrad2" x1="19" y1="17" x2="22" y2="19">
                    <stop stopColor="#ff2d55" />
                    <stop offset="1" stopColor="#ff7e5f" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-text-white">README</span>
              <span className="logo-text-accent">Localizer</span>
            </div>
          </div>
          <p className="footer-tagline">
            Making your documentation accessible to developers worldwide.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Product</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>CLI</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>Documentation</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>API</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>About</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>Privacy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}>Terms</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {currentYear} README Localizer. Powered by Lingo.dev Localization Engine.</p>
        </div>
      </div>
      
      {/* Visual Accent Strip */}
      <div className="footer-accent-strip"></div>
    </footer>
  );
};

export default Footer;
