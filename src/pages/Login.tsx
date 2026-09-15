import { useState, type FormEvent } from 'react';
import { signIn, signUp, authErrorMessage } from '../services/auth';

export function Login() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-logo">⚡ FORGE</span>
          <p className="login-tagline">AI Content Studio</p>
        </div>

        <h1 className="login-title">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Email
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="login-label">
            Password
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading || !email || !password}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-switch">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className="login-switch-btn"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="login-switch-btn"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
