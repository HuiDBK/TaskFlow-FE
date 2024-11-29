// src/components/common/UserMenu.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';

interface UserMenuProps {
  user: {
    username: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
          alt={user.username}
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden md:inline-block text-sm font-medium text-gray-700">
          {user.username}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <a
            href="#profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('user.profile')}
          </a>
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 mb-1">{t('user.language')}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => changeLanguage('en')}
                className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200"
              >
                {t('user.english')}
              </button>
              <button
                onClick={() => changeLanguage('zh')}
                className="px-2 py-1 text-xs rounded-md bg-gray-100 hover:bg-gray-200"
              >
                {t('user.chinese')}
              </button>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            {t('auth.logout')}
          </button>
        </div>
      )}
    </div>
  );
};