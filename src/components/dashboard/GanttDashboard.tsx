// src/components/dashboard/GanttDashboard.tsx
import React, { useEffect, useState } from 'react';
import { getProjects, getTasks } from '../../services/api';
import { IProject, ITask } from '../../types';
import { GanttChart } from '../tasks/GanttChart';
import { t } from 'i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export const GanttDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'projects' | 'tasks'>('projects');

  useEffect(() => {
    // 如果有传入的项目数据，直接使用
    if (location.state?.projects) {
      setProjects(location.state.projects);
      loadTasks(location.state.projects);
    } else {
      // 否则重新加载数据
      loadData();
    }
  }, [location.state]);

  const loadTasks = async (projectsList: IProject[]) => {
    try {
      setLoading(true);
      const projectIds = projectsList.map(project => project.id);
      if (projectIds.length > 0) {
        const {tasks: loadedTasks} = await getTasks({project_ids: projectIds.join(','), page_size: 10});
        setAllTasks(loadedTasks);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load projects(max 6)
      const {projects: loadedProjects} = await getProjects({page_size: 6});
      setProjects(loadedProjects);

      // Load tasks for all projects(max 10)
      const projectIds = loadedProjects.map(project => project.id);
      if (projectIds.length > 0) {
        const {tasks: loadedTasks} = await getTasks({project_ids: projectIds.join(','), page_size: 10});
        setAllTasks(loadedTasks);
      } else {
        setAllTasks([]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
          onClick={loadData}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.ganttDashboard')}</h2>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setView('projects')}
            className={`px-4 py-2 rounded-md ${
              view === 'projects' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {t('dashboard.projectsTimeline')}
          </button>
          <button
            onClick={() => setView('tasks')}
            className={`px-4 py-2 rounded-md ${
              view === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {t('dashboard.tasksTimeline')}
          </button>
        </div>
      </div>

      {view === 'projects' ? (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.projectsTimeline')}</h3>
          <GanttChart tasks={projects.map(project => ({
            id: project.id,
            project_id: 0,
            task_name: project.project_name,
            task_desc: project.project_desc,
            start_time: project.start_time,
            end_time: project.end_time,
            task_status: project.project_status,
            task_tags: project.project_tags,
            task_priority: project.project_priority
          }))} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4">{t('dashboard.tasksTimeline')}</h3>
          <GanttChart tasks={allTasks} />
        </div>
      )}
    </div>
  );
};