// src/components/common/LayoutControl.tsx
import React from 'react';

export type LayoutType = '1x6' | '2x3' | '3x2';

interface LayoutControlProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export const LayoutControl: React.FC<LayoutControlProps> = ({
  currentLayout,
  onLayoutChange,
}) => {
  const layouts: { type: LayoutType; icon: JSX.Element; label: string }[] = [
    {
      type: '1x6',
      label: 'Single Column',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      type: '2x3',
      label: 'Two Columns',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 4.5v15M15 4.5v15M4.5 9h15M4.5 15h15" />
        </svg>
      ),
    },
    {
      type: '3x2',
      label: 'Three Columns',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16M8 3v18M16 3v18" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      {layouts.map(({ type, icon, label }) => (
        <button
          key={type}
          onClick={() => onLayoutChange(type)}
          className={`p-2 rounded-md flex items-center justify-center transition-colors ${
            currentLayout === type
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};