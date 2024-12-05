// src/components/common/QuickEditMenu.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MenuButton, Menu, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface QuickEditMenuProps {
  type: 'priority' | 'status';
  currentValue: string;
  showDropdownIcon: boolean;
  onSelect: (value: string) => void;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const QuickEditMenu: React.FC<QuickEditMenuProps> = ({
  type,
  currentValue,
  showDropdownIcon,
  onSelect,
  onClick,
  className,
}) => {
  const { t } = useTranslation();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inProgress': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'todo': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }
  };

  const options = type === 'priority'
    ? ['high', 'medium', 'low']
    : ['todo', 'inProgress', 'completed'];

  return (
    <Menu as="div" className="relative">
      <MenuButton
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
          type === 'priority' ? getPriorityColor(currentValue) : getStatusColor(currentValue)
        } ${className || ''}`}
      >
        {type === 'priority'
          ? t(`common.priority.${currentValue}`)
          : t(`common.status.${currentValue}`)
        }
        {showDropdownIcon && (
          <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
        )}
      </MenuButton>

      <MenuItems className="absolute z-10 mt-2 w-40 bg-white rounded-md shadow-lg py-1">
        {options.map((option) => (
          <MenuItem key={option}>
            {({ }) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(option);
                }}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  type === 'priority' ? getPriorityColor(option) : getStatusColor(option)
                }`}
              >
                {type === 'priority'
                  ? t(`common.priority.${option}`)
                  : t(`common.status.${option}`)
                }
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};