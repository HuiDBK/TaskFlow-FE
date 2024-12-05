// src/components/common/DateInput.tsx
import { t } from 'i18next';
import React, { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import { zhCN, enUS } from 'date-fns/locale';

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  label,
  required = false,
  className = '',
  placeholder = t("common.selectDate")
}) => {
  const { i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'zh':
      case 'zh-CN':
        return zhCN;
      default:
        return enUS;
    }
  };

  const CustomInput = forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <div
        className="relative w-full"
        ref={ref}
      >
        <input
          type="text"
          value={value}
          onClick={onClick}
          readOnly
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 
                   focus:ring-blue-500 cursor-pointer pl-4 pr-10 py-2"
          placeholder={placeholder}
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
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => {
          setSelectedDate(date);
          if (date) {
            onChange(date.toISOString().split('T')[0]);
          }
        }}
        locale={getDateLocale()}
        dateFormat="yyyy-MM-dd"
        customInput={<CustomInput />}
        wrapperClassName="w-full"
        calendarClassName="shadow-lg border border-gray-200 rounded-lg"
      />
    </div>
  );
};