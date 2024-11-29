// src/components/projects/ProjectDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTasks, updateTask } from '../../services/api';
import { IProject, ITask } from '../../types';
import { TaskList } from '../tasks/TaskList';
import { GanttChart } from '../tasks/GanttChart';
import { QuickEditMenu } from '../common/QuickEditMenu';

export const ProjectDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectId: projectIdStr } = useParams<{ projectId: string }>();
  const projectId = parseInt(projectIdStr ?? '0');
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project as IProject;
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!project) {
      navigate('/projects');
      return;
    }
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks(projectId!);
      setTasks(response.data || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setError(t('task.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    try {
      await updateTask(projectId!, taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (!project) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <button
        onClick={() => navigate('/projects')}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-600"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        {t('common.backToProjects')}
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <QuickEditMenu
            type="priority"
            currentValue={project.priority}
            onSelect={(value) => { }}
            showDropdownIcon={true}
          />
        </div>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: tag.color + '20', color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={loadTasks}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            {t('common.retry')}
          </button>
        </div>
      ) : (
        <TaskList
          projectId={projectId!}
        />
      )}
    </div>
  );
};