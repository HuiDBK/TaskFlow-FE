// src/components/common/MobileHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from './LanguageSwitch';
import { UserMenu } from './UserMenu';
import { getCurrentUser } from '../../services/api';

interface HeaderProps {
  onLogout: () => void;
  username: string;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { t } = useTranslation();

  function getUsernameFromLocalStorage(): string {
    const user = getCurrentUser();
    return user?.username || '';
  }

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900">{t('app.title')}</h1>
          </Link>

          {/* Navigation Links */}
          {/* <nav className="flex items-center space-x-8">
            <Link to="/projects" className="text-gray-700 hover:text-gray-900">
              {t('common.projects')}
            </Link>
            <Link to="/gantt" className="text-gray-700 hover:text-gray-900">
              {t('common.ganttView')}
            </Link>
          </nav> */}

          {/* <UserMenu user={{ username }} onLogout={onLogout} /> */}

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            <LanguageSwitch />
            <span className="text-gray-700 font-medium">
              {getUsernameFromLocalStorage()}
            </span>
            <button
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              {t('auth.logout')}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};