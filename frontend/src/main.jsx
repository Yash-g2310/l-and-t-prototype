import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AuthConnector from './components/auth-connector';
import Dashboard from './components/dashboard';
import { AuroraBackground } from './components/ui/aurora-background';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes with Aurora background */}
          <Route path="/" element={
            <PublicRoute>
              <AuroraBackground>
                <AuthConnector />
              </AuroraBackground>
            </PublicRoute>
          } />
          
          {/* Protected routes without Aurora background */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Add more routes as needed */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Render the App to the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);