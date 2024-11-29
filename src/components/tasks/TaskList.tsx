// src/components/tasks/TaskList.tsx
import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../../services/api';
import { ITask } from '../../types';
import { TaskForm } from './TaskForm';
import { GanttChart } from './GanttChart';
import { EnhancedPagination } from '../common/EnhancedPagination';
import { LayoutControl, LayoutType } from '../common/LayoutControl';
import { SearchFilterAdvanced } from '../common/SearchFilterAdvanced';
import { t } from 'i18next';

const TASKS_PER_PAGE = 6;

interface TaskListProps {
  projectId: number;
}

export const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [view, setView] = useState<'list' | 'gantt'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<LayoutType>('3x2');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, priorityFilter, tagFilter, dateFilter, statusFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks(projectId);
      setTasks(response.data || []);
      setFilteredTasks(response.data || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setError('Failed to load tasks. Please try again later.');
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (tagFilter) {
      filtered = filtered.filter(task =>
        task.tags.some(tag => tag.name === tagFilter)
      );
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(task => {
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        return startDate <= filterDate && filterDate <= endDate;
      });
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(projectId, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError('Failed to delete task. Please try again later.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'in-progress': return t('common.status.inProgress');
      case 'completed': return t('common.status.completed');
      case 'todo': return t('common.status.todo');
      default: return status;
    }
  };

  const getLayoutClass = (layout: LayoutType) => {
    switch (layout) {
      case '1x6': return 'grid-cols-1';
      case '2x3': return 'grid-cols-1 md:grid-cols-2';
      case '3x2': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags)));

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const endIndex = startIndex + TASKS_PER_PAGE;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={loadTasks}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">{t('common.tasks')}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'list' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {t('common.listView')}
            </button>
            <button
              onClick={() => setView('gantt')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'gantt' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {t('common.ganttView')}
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 
                   transition-colors duration-200 flex items-center space-x-2 shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{t('task.newTask')}</span>
        </button>
      </div>

      <SearchFilterAdvanced
        tags={allTags}
        onSearch={setSearchTerm}
        onFilterPriority={setPriorityFilter}
        onFilterTag={setTagFilter}
        onFilterDate={setDateFilter}
        onFilterStatus={setStatusFilter}
      />

      {showForm && (
        <TaskForm
          projectId={projectId}
          task={selectedTask}
          onSubmit={() => {
            setShowForm(false);
            setSelectedTask(null);
            loadTasks();
          }}
          onCancel={() => {
            setShowForm(false);
            setSelectedTask(null);
          }}
        />
      )}

      {view === 'gantt' ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <GanttChart tasks={filteredTasks} />
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-2 mt-2">
            <LayoutControl currentLayout={layout} onLayoutChange={setLayout} />
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-gray-500">Get started by creating a new task.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {t('task.createFirst')}
              </button>
            </div>
          ) : (
            <>
              <div className={`grid ${getLayoutClass(layout)} gap-6`}>
                {currentTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(task.status)}`}>
                          {getStatusDisplay(task.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {task.tags?.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                          {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowForm(true);
                            }}
                            className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8">
                  <EnhancedPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
