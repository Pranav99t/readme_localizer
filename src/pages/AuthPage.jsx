import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage({ onNavigate, navData }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const result = await signUp(email, password, name);
        // Supabase may require email confirmation
        if (result && !result.confirmed_at && result.identities?.length === 0) {
          setSuccess('Account created! Check your email to confirm, then sign in.');
          setMode('signin');
          setLoading(false);
          return;
        }
        // If auto-confirm is enabled or user confirmed instantly
        setSuccess('Account created successfully!');
      } else {
        await signIn(email, password);
      }

      // Navigate to intended destination
      setTimeout(() => {
        if (navData?.returnTo) {
          onNavigate(navData.returnTo, navData);
        } else {
          onNavigate('dashboard');
        }
      }, 300);
    } catch (err) {
      const msg = err.message || 'Authentication failed';
      // Friendlier error messages for common Supabase auth errors
      if (msg.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (msg.includes('already registered')) {
        setError('This email is already registered. Try signing in instead.');
      } else if (msg.includes('Password should be')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-visual-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="10" fill="url(#authGrad)" />
                <path d="M14 18h20M14 24h14M14 30h17" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="34" cy="30" r="5" fill="white" fillOpacity="0.9" />
                <path d="M32 30l2 2 3-3" stroke="url(#authGrad2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="authGrad" x1="4" y1="4" x2="44" y2="44">
                    <stop stopColor="#ff2d55" />
                    <stop offset="1" stopColor="#ff7e5f" />
                  </linearGradient>
                  <linearGradient id="authGrad2" x1="32" y1="29" x2="37" y2="32">
                    <stop stopColor="#ff2d55" />
                    <stop offset="1" stopColor="#ff7e5f" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2>Global Access Starts Here</h2>
            <p>Join the ecosystem of developers making their technical work understandable to everyone, everywhere.</p>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="dot-v"></span>
                <span>Native High-Fidelity Localization</span>
              </div>
              <div className="auth-feature">
                <span className="dot-v"></span>
                <span>Developer-First Experience</span>
              </div>
              <div className="auth-feature">
                <span className="dot-v"></span>
                <span>Persistent History & Sync</span>
              </div>
            </div>
          </div>
        </div>


        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h2>{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
            <p>{mode === 'signin' ? 'Sign in to access your translations' : 'Start localizing your repositories'}</p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5v4M8 11v0" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="6" />
                <path d="M5 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'signin' ? (
              <p>Don't have an account? <button onClick={() => setMode('signup')}>Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setMode('signin')}>Sign in</button></p>
            )}
          </div>

          <div className="auth-powered-by">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <rect x="2" y="2" width="10" height="10" rx="2" />
              <path d="M5 5h4M5 7h3M5 9h2" strokeLinecap="round" />
            </svg>
            <span>Secured by Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
