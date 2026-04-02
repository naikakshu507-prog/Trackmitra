import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import VehicleSelectPage from './pages/VehicleSelectPage';
import TrackingPage from './pages/TrackingPage';
import RoutesPage from './pages/RoutesPage';
import FarePage from './pages/FarePage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="splash-loader"><div className="loader-ring"></div></div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="splash-loader"><div className="loader-ring"></div></div>;
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/"               element={<LandingPage />} />
          <Route path="/login"          element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register"       element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/select-vehicle" element={<ProtectedRoute><VehicleSelectPage /></ProtectedRoute>} />
          <Route path="/track"          element={<ProtectedRoute><TrackingPage /></ProtectedRoute>} />
          <Route path="/routes"         element={<ProtectedRoute><RoutesPage /></ProtectedRoute>} />
          <Route path="/fare"           element={<ProtectedRoute><FarePage /></ProtectedRoute>} />
          <Route path="/profile"        element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*"               element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
