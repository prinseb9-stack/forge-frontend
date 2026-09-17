import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PaymentCallback } from './pages/PaymentCallback';
import { Platforms } from './pages/Platforms';
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
      <Route
        path="/payment/callback"
        element={user ? <PaymentCallback /> : <Navigate to="/" replace />}
      />
      <Route
        path="/platforms"
        element={user ? <Platforms /> : <Navigate to="/" replace />}
      />
      <Route
        path="/"
        element={user ? <Dashboard /> : <Login />}
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
