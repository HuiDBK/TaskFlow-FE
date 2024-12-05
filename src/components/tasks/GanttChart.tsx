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
  const startDate = new Date(Math.min(...tasks.map(task => new Date(task.start_time).getTime())));
  const endDate = new Date(Math.max(...tasks.map(task => new Date(task.end_time).getTime())));
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const monthNames = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    zh: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  };

  const getTaskPosition = (task: ITask) => {
    const taskStart = new Date(task.start_time);
    const taskEnd = new Date(task.end_time);
    const left = ((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    const width = ((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const getStatusColor = (status: string, bg: boolean = true) => {
    switch (status) {
      case 'todo': return bg ? 'bg-yellow-500' : 'text-yellow-500';
      case 'completed': return bg ? 'bg-green-500' : 'text-green-500';
      case 'inProgress': return bg ? 'bg-blue-500' : 'text-blue-500';
      default: return bg ? 'bg-gray-500' : 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: string, bg: boolean = true) => {
    switch (priority) {
      case 'high': return bg ? 'bg-red-500' : 'text-red-500';
      case 'medium': return bg ? 'bg-yellow-500' : 'text-yellow-500';
      case 'low': return bg ? 'bg-green-500' : 'text-green-500';
      default: return bg ? 'bg-gray-500' : 'text-gray-500';
    }
  };

  const handleTaskHover = (event: React.MouseEvent, task: ITask) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipX = rect.left + rect.width / 4;
    const tooltipY = rect.top - 50;
    setTooltipPosition({
      x: tooltipX,
      y: tooltipY
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
            {tasks[0]?.project_id > 0 ? t('common.tasks') : t('common.projects')}
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
                {task.task_name}
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
                    {/* <div className="absolute top-0 -translate-x-1/2 -translate-y-4 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                      Today
                    </div> */}
                  </div>
                )}

                {/* Task bar */}
                <div
                  className={`absolute h-8 rounded-full shadow-md transition-all duration-200 
                            ${getStatusColor(task.task_status)} opacity-90 group-hover:opacity-100 
                            group-hover:h-9 cursor-pointer`}
                  style={getTaskPosition(task)}
                  onMouseEnter={(e) => handleTaskHover(e, task)}
                  onMouseLeave={() => setTooltipTask(null)}
                >
                  <div className="px-3 py-1.5 text-sm text-white truncate">
                    {task.task_name}
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
            <h4 className="font-semibold text-gray-900">{tooltipTask.task_name}</h4>
            <p className="text-sm text-gray-600 mt-1">{tooltipTask.task_desc}</p>
            <p className="text-sm text-gray-600 mt-1">{t('dashboard.priority')}: <span className={getPriorityColor(tooltipTask.task_priority, false)}>{t(`common.priority.${tooltipTask.task_priority}`)}</span></p>
            <p className="text-sm text-gray-600 mt-1">{t('dashboard.status')}: <span className={getStatusColor(tooltipTask.task_status, false)}>{t(`common.status.${tooltipTask.task_status}`)}</span></p>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(tooltipTask.start_time).toLocaleDateString()} - {new Date(tooltipTask.end_time).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};