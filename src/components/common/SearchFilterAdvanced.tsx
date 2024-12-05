// src/components/common/SearchFilterAdvanced.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import { DateInput } from './DateInput';

interface SearchFilterAdvancedProps {
  onSearch: (search: string) => void;
  onFilterPriority: (priority: string) => void;
  onFilterDate: (startDate: string, endDate: string) => void;
  onFilterStatus?: (status: string) => void;
  onReset: () => void;
  searchTerm: string;
  priorityFilter: string;
  statusFilter: string;
  startTimeFilter: string;
  endTimeFilter: string;
}

export const SearchFilterAdvanced: React.FC<SearchFilterAdvancedProps> = ({
  onSearch,
  onFilterPriority,
  onFilterDate,
  onFilterStatus,
  onReset,
  searchTerm,
  priorityFilter,
  statusFilter,
  startTimeFilter,
  endTimeFilter,
}) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchTerm && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchTerm]);

  const handleDateChange = (start: string, end: string) => {
    onFilterDate(start, end);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* 搜索输入框 */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 h-10"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* 优先级筛选 */}
        <div className="flex-shrink-0 min-w-[100px]">
          <select
            value={priorityFilter}
            onChange={(e) => onFilterPriority(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10"
          >
            <option value="">{t('common.allPriorities')}</option>
            <option value="high">{t('common.priority.high')}</option>
            <option value="medium">{t('common.priority.medium')}</option>
            <option value="low">{t('common.priority.low')}</option>
          </select>
        </div>

        {/* 状态筛选 */}
        {onFilterStatus && (
          <div className="flex-shrink-0 min-w-[100px]">
            <select
              value={statusFilter}
              onChange={(e) => onFilterStatus(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10"
            >
              <option value="">{t('common.allStatuses')}</option>
              <option value="todo">{t('common.status.todo')}</option>
              <option value="inProgress">{t('common.status.inProgress')}</option>
              <option value="completed">{t('common.status.completed')}</option>
            </select>
          </div>
        )}

        {/* 日期筛选 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateInput
            value={startTimeFilter}
            onChange={(date) => handleDateChange(date, endTimeFilter)}
            placeholder={t('common.startDate')}
          />
          <DateInput
            value={endTimeFilter}
            onChange={(date) => handleDateChange(startTimeFilter, date)}
            placeholder={t('common.endDate')}
          />
        </div>

        {/* 重置按钮 */}
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
        >
          {t('common.reset')}
        </button>
      </div>
    </div>
  );
};