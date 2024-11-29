// src/components/common/SearchFilterAdvanced.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { ITag } from '../../types';
import 'react-datepicker/dist/react-datepicker.css';
import { DateInput } from './DateInput';

interface SearchFilterAdvancedProps {
  tags: ITag[];
  onSearch: (search: string) => void;
  onFilterPriority: (priority: string) => void;
  onFilterTag: (tagId: string) => void;
  onFilterDate: (startDate: string, endDate: string) => void;
  onFilterStatus?: (status: string) => void;
}

export const SearchFilterAdvanced: React.FC<SearchFilterAdvancedProps> = ({
  tags,
  onSearch,
  onFilterPriority,
  onFilterTag,
  onFilterDate,
  onFilterStatus,
}) => {
  const { t } = useTranslation();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    onFilterDate(start, end);
  };

  const CustomDateInput = React.forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <div
        className="relative w-full"
        ref={ref}
      >
        <input
          type="text"
          value={value || ''}
          onClick={onClick}
          readOnly
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 
                   focus:ring-blue-500 cursor-pointer pl-4 pr-10 py-2"
          placeholder={t('common.selectDate')}
        />
        <svg
          className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Main Search and Priority Filter */}
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 h-10"
              placeholder={t('common.search')}
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

        <div className="flex-shrink-0 min-w-[160px]">
          <select
            onChange={(e) => onFilterPriority(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10"
          >
            <option value="">{t('common.allPriorities')}</option>
            <option value="high">{t('common.priority.high')}</option>
            <option value="medium">{t('common.priority.medium')}</option>
            <option value="low">{t('common.priority.low')}</option>
          </select>
        </div>

        {onFilterStatus && (
        <div className="flex-shrink-0 min-w-[160px]">
              <select
                onChange={(e) => onFilterStatus(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10"
              >
                <option value="">{t('common.allStatuses')}</option>
                <option value="todo">{t('common.status.todo')}</option>
                <option value="in-progress">{t('common.status.inProgress')}</option>
                <option value="completed">{t('common.status.completed')}</option>
              </select>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateInput
            value={startDate}
            onChange={(date) => handleDateChange(date, endDate)}
            placeholder={t('common.startDate')}
          />
          <DateInput
            value={endDate}
            onChange={(date) => handleDateChange(startDate, date)}
            placeholder={t('common.endDate')}
          />
        </div>

       {/* <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex-shrink-0 p-2 rounded-md hover:bg-gray-100 transition-colors"
          title={t('common.advancedFilters')}
        >
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform ${
              showAdvancedFilters ? 'rotate-180' : ''
            }`}
            fill="n one"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button> */}
      </div>
    </div>
  );
};