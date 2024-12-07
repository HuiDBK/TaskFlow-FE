// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { IUser } from '../../types';
import { t } from 'i18next';

interface RegisterFormProps {
  onSuccess?: (user?: IUser) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {token} = await authAPI.register(username, password, email, phone);
      onSuccess?.();
      window.location.href = '/projects';
    } catch (err) {
      setError(t('auth.registerFailed'));
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
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 tracking-widest">{t('auth.register')}</h2>
          {error && <div className="text-red-500 mb-6 text-center text-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.username')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 px-2 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('auth.password')} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 px-2 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('auth.email')} ({t('auth.optional')})</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 px-2 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('auth.phone')} ({t('auth.optional')})</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 px-2 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {t('auth.register')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};