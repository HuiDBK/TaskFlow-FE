// src/components/common/LanguageSwitch.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';

export const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2"
      title={currentLang === 'en' ? 'Switch to Chinese' : 'Switch to English'}
    >
      <span className="text-sm font-medium">
        {currentLang === 'en' ? (
          <span className="flex items-center">
            <span className="w-6 inline-block">EN</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        ) : (
          <span className="flex items-center">
            <span className="w-7 inline-block">中文</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        )}
      </span>
    </button>
  );
};