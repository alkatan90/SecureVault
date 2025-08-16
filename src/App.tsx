import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PasswordProvider } from './contexts/PasswordContext';
import LoginPage from './components/auth/LoginPage';
import Dashboard from './components/dashboard/Dashboard';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <PasswordProvider>
        <AppContent />
      </PasswordProvider>
    </AuthProvider>
  );
}

export default App;