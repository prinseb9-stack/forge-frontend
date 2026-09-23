import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { PaymentCallback } from './pages/PaymentCallback';
import { Platforms } from './pages/Platforms';
import { Scheduled } from './pages/Scheduled';
import './App.css';

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public: landing when logged out, dashboard when logged in */}
      <Route path="/" element={user ? <Dashboard /> : <Landing />} />

      {/* Public: login when logged out, redirect to / when logged in */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected routes */}
      <Route
        path="/payment/callback"
        element={user ? <PaymentCallback /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/platforms"
        element={user ? <Platforms /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/scheduled"
        element={user ? <Scheduled /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
