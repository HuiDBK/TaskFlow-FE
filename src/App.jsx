// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectDetail } from './components/projects/ProjectDetail';
import { GanttDashboard } from './components/dashboard/GanttDashboard';
import { Header } from './components/common/Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showRegister ? (
            <>
              <RegisterForm onSuccess={() => {
                setIsAuthenticated(true);
              }} />
              <p className="mt-4 text-center text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onSuccess={() => {
                setIsAuthenticated(true);
              }} />
              <p className="mt-4 text-center text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Register
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/gantt" element={<GanttDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;