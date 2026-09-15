import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/auth';

export function Header() {
  const { user } = useAuth();

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
        <div className="logo-container">
          <h1 className="logo">⚡ FORGE</h1>
          <span className="tagline">AI Content Studio</span>
        </div>

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
