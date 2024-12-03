// src/components/projects/ProjectForm.tsx
import React, { useState } from 'react';
import { createProject, updateProject } from '../../services/api';
import { IProject, ITag } from '../../types';
import { DateInput } from '../common/DateInput';
import { t } from 'i18next';

interface ProjectFormProps {
  project?: IProject | null;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [project_name, setTitle] = useState(project?.project_name || '');
  const [project_desc, setDescription] = useState(project?.project_desc || '');
  const [project_priority, setPriority] = useState(project?.project_priority || 'medium');
  const [start_time, setStartDate] = useState(
    project?.start_time ? new Date(project.start_time).toISOString().split('T')[0] : ''
  );
  const [end_time, setEndDate] = useState(
    project?.end_time ? new Date(project.end_time).toISOString().split('T')[0] : ''
  );
  const [tags, setTags] = useState<ITag[]>(project?.project_tags || []);
  const [newTag, setNewTag] = useState('');
  const [tagColor, setTagColor] = useState('#3B82F6');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      project_name,
      project_desc,
      project_priority,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      project_tags: tags
    };

    try {
      if (project) {
        await updateProject(project.id, projectData);
      } else {
        await createProject(projectData);
      }
      await onSubmit();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, { id: Date.now(), name: newTag.trim(), color: tagColor }]);
      setNewTag('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h2 className="text-2xl font-bold mb-6">{project ? t('project.editProject') : t('project.newProject')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.title')}</label>
                <input
                  type="text"
                  value={project_name}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2 h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.description')}</label>
                <textarea
                  value={project_desc}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.priority')}</label>
                <select
                  value={project_priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">{t('common.priority.low')}</option>
                  <option value="medium">{t('common.priority.medium')}</option>
                  <option value="high">{t('common.priority.high')}</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInput
                  label={t('project.startDate')}
                  value={start_time}
                  onChange={setStartDate}
                  required
                />
                <DateInput
                  label={t('project.endDate')}
                  value={end_time}
                  onChange={setEndDate}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('project.tags')}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t('project.tagName')}
                  />
                  <input
                    type="color"
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                    className="w-10 h-10"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {t('project.addTag')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 rounded-full text-sm"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  {project ? t('common.save') : t('project.newProject')}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};