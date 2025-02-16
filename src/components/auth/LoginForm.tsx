// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../../services/api';
import { IUser } from '../../types';

interface LoginFormProps {
  onSuccess?: (user?: IUser) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await authAPI.login(username, password);
      onSuccess?.();
      window.location.href = '/projects';
    } catch (err) {
      setError(t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="flex h-[80vh] my-[5vh] min-w-full bg-gray-50">
      {/* 左侧品牌区域 */}
      <div className="hidden lg:flex lg:w-[50%] bg-gradient-to-r from-blue-400 to-blue-500 p-12 items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6 tracking-wider">{t('app.title')}</h1>
          <p className="text-blue-100 text-1xl leading-relaxed tracking-wide">
            {t('auth.slogan')}
          </p>
        </div>
      </div>

      {/* 右侧表单区域 */}
      <div className="w-full lg:w-[50%] flex items-center justify-center px-16 py-12">
        <div className="w-full">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 tracking-widest">{t('auth.login')}</h2>
          {error && <div className="text-red-500 mb-6 text-center text-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('auth.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`${t('auth.username')} / ${t('auth.email')} / ${t('auth.phone')}`}
                className="mt-1 h-12 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.inputPassword')}
                className="mt-1 h-12 px-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {t('auth.login')}
            </button>
          </form>
          <button
            onClick={() => authAPI.githubLogin()}
            className="w-full mt-4 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t('auth.loginWithGithub')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};