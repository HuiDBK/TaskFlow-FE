// src/components/tasks/GanttChart.tsx
import React, { useState } from 'react';
import { ITask } from '../../types';
import { t } from 'i18next';
import i18n from 'i18next';

interface GanttChartProps {
  tasks: ITask[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const [tooltipTask, setTooltipTask] = useState<ITask | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const today = new Date();
  const startDate = new Date(Math.min(...tasks.map(task => new Date(task.startDate).getTime())));
  const endDate = new Date(Math.max(...tasks.map(task => new Date(task.endDate).getTime())));
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const monthNames = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  };

  const getTaskPosition = (task: ITask) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const left = ((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    const width = ((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleTaskHover = (event: React.MouseEvent, task: ITask) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 5
    });
    setTooltipTask(task);
  };

  if (!tasks.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">{t('dashboard.noTasks')}</h3>
        <p className="mt-1 text-gray-500">{t('dashboard.createFirst')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto relative">
      <div className="min-w-[800px]">
        {/* Timeline header */}
        <div className="flex mb-6 border-b border-gray-200">
          <div className="w-1/4 pr-4 py-2 font-semibold text-gray-700">
            {tasks[0]?.projectId > 0 ? t('common.tasks') : t('common.projects')}
          </div>
          <div className="w-3/4 relative h-16">
            {Array.from({ length: totalDays }).map((_, index) => {
              const date = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000);
              return (
                <div
                  key={index}
                  className={`absolute text-xs ${date.getDate() === 1 ? 'border-l border-gray-300' : ''}`}
                  style={{ left: `${(index / totalDays) * 100}%` }}
                >
                  {date.getDate() === 1 && (
                    <div className="ml-1 font-medium text-gray-600">{monthNames[i18n.language][date.getMonth()]}</div>
                  )}
                  {date.getDate() % 5 === 0 && (
                    <div className="mt-6 text-gray-500">{date.getDate()}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks timeline */}
        <div className="relative space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center h-12 group">
              <div className="w-1/4 pr-4 truncate font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                {task.title}
              </div>
              <div className="w-3/4 relative">
                {/* Background grid */}
                <div className="absolute inset-0">
                  {Array.from({ length: totalDays }).map((_, index) => (
                    <div
                      key={index}
                      className="absolute h-full border-l border-gray-100"
                      style={{ left: `${(index / totalDays) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Today line */}
                {today >= startDate && today <= endDate && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                    style={{
                      left: `${((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100}%`,
                    }}
                  >
                    <div className="absolute top-0 -translate-x-1/2 -translate-y-4 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                      Today
                    </div>
                  </div>
                )}

                {/* Task bar */}
                <div
                  className={`absolute h-8 rounded-full shadow-md transition-all duration-200 
                            ${getStatusColor(task.status)} opacity-90 group-hover:opacity-100 
                            group-hover:h-9 cursor-pointer`}
                  style={getTaskPosition(task)}
                  onMouseEnter={(e) => handleTaskHover(e, task)}
                  onMouseLeave={() => setTooltipTask(null)}
                >
                  <div className="px-3 py-1.5 text-sm text-white truncate">
                    {task.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {tooltipTask && (
          <div
            className="fixed z-50 bg-white p-3 rounded-lg shadow-lg border border-gray-200 w-64"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y - 100}px`
            }}
          >
            <h4 className="font-semibold text-gray-900">{tooltipTask.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{tooltipTask.description}</p>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(tooltipTask.startDate).toLocaleDateString()} - {new Date(tooltipTask.endDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};