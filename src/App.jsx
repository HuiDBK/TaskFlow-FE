// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProjectList } from './components/projects/ProjectList';
import { ProjectDetail } from './components/projects/ProjectDetail';
import { GanttDashboard } from './components/dashboard/GanttDashboard';
import { Header } from './components/common/Header';
import { t } from 'i18next';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // 初始化时检查 localStorage 中是否存在有效的 token
    const token = localStorage.getItem('token');
    return !!token;
  });
  const [showRegister, setShowRegister] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {showRegister ? (
            <>
              <RegisterForm onSuccess={() => {
                setIsAuthenticated(true);
              }} />
              <p className="mt-4 text-center text-gray-600">
                {t('auth.alreadyHaveAccount')}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  {t('auth.login')}
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onSuccess={() => {
                setIsAuthenticated(true);
              }} />
              <p className="mt-4 text-center text-gray-600">
                {t('auth.dontHaveAccount')}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  {t('auth.register')}
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
          setIsAuthenticated(false);
        }} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/login" element={<LoginForm />} />
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