import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/auth';

export function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = location.pathname === '/';
  const isScheduled = location.pathname === '/scheduled';
  const isPlatforms = location.pathname === '/platforms';

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

        {/* Desktop nav — hidden on mobile */}
        {user && (
          <nav className="header-nav header-nav-desktop">
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

        {/* Desktop user menu — hidden on mobile */}
        {user && (
          <div className="header-actions header-actions-desktop">
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button onClick={handleSignOut} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Mobile hamburger — visible only on mobile */}
        {user && (
          <button
            className="header-hamburger"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile menu overlay */}
      {user && mobileMenuOpen && (
        <>
          <div
            className="header-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav className="header-mobile-menu">
            <Link
              to="/"
              className={`header-mobile-link ${isDashboard ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/scheduled"
              className={`header-mobile-link ${isScheduled ? 'active' : ''}`}
            >
              Scheduled
            </Link>
            <Link
              to="/platforms"
              className={`header-mobile-link ${isPlatforms ? 'active' : ''}`}
            >
              Platforms
            </Link>

            <div className="header-mobile-divider" />

            <div className="header-mobile-user">
              <span className="header-mobile-email">{user.email}</span>
              <button onClick={handleSignOut} className="logout-btn header-mobile-logout">
                Logout
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
