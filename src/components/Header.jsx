import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header({ onNavigate, currentPage }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <button className="header-logo" onClick={() => onNavigate('landing')}>
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#logoGrad)" />
                <path d="M8 10h12M8 14h8M8 18h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="18" r="3" fill="white" fillOpacity="0.9" />
                <path d="M19 18l1 1 2-2" stroke="url(#logoGrad2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26">
                    <stop stopColor="#ff2d55" />
                    <stop offset="1" stopColor="#ff7e5f" />
                  </linearGradient>
                  <linearGradient id="logoGrad2" x1="19" y1="17" x2="22" y2="19">
                    <stop stopColor="#ff2d55" />
                    <stop offset="1" stopColor="#ff7e5f" />
                  </linearGradient>
                </defs>

              </svg>
            </div>
            <span className="logo-text">
              <span className="logo-primary">README</span>
              <span className="logo-accent">Localizer</span>
            </span>
          </button>

          <nav className="header-nav">
            <button
              className={`nav-link ${currentPage === 'landing' ? 'active' : ''}`}
              onClick={() => onNavigate('landing')}
            >
              Home
            </button>
            {isAuthenticated && (
              <button
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('dashboard')}
              >
                Console
              </button>
            )}
            <button
              className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
              onClick={() => onNavigate('history')}
            >
              Deployments
            </button>
          </nav>
        </div>

        <div className="header-right">
          <div className="header-status">
            <div className="pulse-dot"></div>
            <span className="status-text">Lingo.dev Engine Online</span>
          </div>

          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button className="user-avatar-btn" onClick={() => setShowMenu(!showMenu)}>
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              {showMenu && (
                <div className="user-dropdown animate-fade-in-scale">
                  <div className="dropdown-header">
                    <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
                    <div>
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => { onNavigate('dashboard'); setShowMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="5" height="5" rx="1" />
                      <rect x="9" y="2" width="5" height="5" rx="1" />
                      <rect x="2" y="9" width="5" height="5" rx="1" />
                      <rect x="9" y="9" width="5" height="5" rx="1" />
                    </svg>
                    Console
                  </button>
                  <button className="dropdown-item" onClick={() => { onNavigate('history'); setShowMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="8" cy="8" r="6" />
                      <path d="M8 5v3l2 2" strokeLinecap="round" />
                    </svg>
                    Deployments
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item dropdown-item-danger" onClick={() => { signOut(); setShowMenu(false); onNavigate('landing'); }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h2M10 11l3-3-3-3M6 8h7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate('auth')}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
