// src/components/projects/ProjectDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { updateProject } from '../../services/api';
import { IProject } from '../../types';
import { TaskList } from '../tasks/TaskList';
import { QuickEditMenu } from '../common/QuickEditMenu';
import { ProjectForm } from './ProjectForm';

export const ProjectDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectId: projectIdStr } = useParams<{ projectId: string }>();
  const projectId = parseInt(projectIdStr ?? '0');
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project as IProject;
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (!project) {
      navigate('/projects');
      return;
    }
  }, [projectId]);

  if (!project) {
    return null;
  }

  const handlePriorityChange = async (projectId: number, newPriority: 'low' | 'medium' | 'high') => {
    try {
      await updateProject(projectId, { project_priority: newPriority });
      project.project_priority = newPriority;
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

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
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{project.project_name}</h1>
            <button
              onClick={() => setShowEditForm(true)}
              className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
              title={t('common.edit')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
          <QuickEditMenu
            type="priority"
            currentValue={project.project_priority}
            onSelect={async (value) => {
              await handlePriorityChange(projectId, value as 'low' | 'medium' | 'high');
            }}
            showDropdownIcon={true}
          />
        </div>
        <p className="text-gray-600 mb-4">{project.project_desc}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.project_tags?.map((tag) => (
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
        {project.start_time ? new Date(project.start_time).toLocaleDateString() : '-'} - {project.end_time ? new Date(project.end_time).toLocaleDateString() : '-'}
        </div>
      </div>
      
      {showEditForm && (
        <ProjectForm
          project={project}
          onSubmit={async (newProject) => {
            setShowEditForm(false);
            Object.assign(project, newProject);
          }}
          onCancel={() => {
            setShowEditForm(false);
          }}
        />
      )}

      <TaskList
        projectId={projectId!}
      />
    </div>
  );
};