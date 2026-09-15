import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import './App.css';
import { InstallPrompt } from './components/InstallPrompt';
function AppRouter() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <InstallPrompt />
    </AuthProvider>
  );
}

export default App;
// trigger rebuild Tue Sep 15 17:15:40 WAT 2026
