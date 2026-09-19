import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/auth';

export function Header() {
  const { user } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname === '/';
  const isScheduled = location.pathname === '/scheduled';
  const isPlatforms = location.pathname === '/platforms';

  async function handleSignOut() {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-container logo-link">
          <h1 className="logo">⚡ FORGE</h1>
          <span className="tagline">AI Content Studio</span>
        </Link>

        {user && (
          <nav className="header-nav">
            <Link to="/" className={`header-nav-link ${isDashboard ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link
              to="/scheduled"
              className={`header-nav-link ${isScheduled ? 'active' : ''}`}
            >
              Scheduled
            </Link>
            <Link
              to="/platforms"
              className={`header-nav-link ${isPlatforms ? 'active' : ''}`}
            >
              Platforms
            </Link>
          </nav>
        )}

        {user && (
          <div className="header-actions">
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button onClick={handleSignOut} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
