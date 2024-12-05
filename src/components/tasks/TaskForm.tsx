// src/components/tasks/TaskForm.tsx
import React, { useState } from 'react';
import { createTask, updateTask } from '../../services/api';
import { ITask, ITag } from '../../types';
import { DateInput } from '../common/DateInput';
import { t } from 'i18next';

interface TaskFormProps {
  projectId: number;
  task?: ITask | null;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ projectId, task, onSubmit, onCancel }) => {
  const [task_name, setTaskName] = useState(task?.task_name || '');
  const [task_desc, setTaskDesc] = useState(task?.task_desc || '');
  const [task_priority, setTaskPriority] = useState(task?.task_priority || 'medium');
  const [task_status, setTaskStatus] = useState(task?.task_status || 'todo');
  const [start_time, setStartDate] = useState(
    task?.start_time ? new Date(task.start_time).toISOString().split('T')[0] : ''
  );
  const [end_time, setEndDate] = useState(
    task?.end_time ? new Date(task.end_time).toISOString().split('T')[0] : ''
  );
  const [task_tags, setTaskTags] = useState<ITag[]>(task?.task_tags || []);
  const [newTag, setNewTag] = useState('');
  const [tagColor, setTagColor] = useState('#3B82F6');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      task_name,
      task_desc,
      task_priority,
      task_status,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      task_tags,
    };

    try {
      if (task) {
        await updateTask(projectId, task.id, taskData);
      } else {
        await createTask(projectId, taskData);
      }
      onSubmit();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setTaskTags([...task_tags, { id: Date.now(), name: newTag.trim(), color: tagColor }]);
      setNewTag('');
    }
  };

  const removeTag = (tagId: number) => {
    setTaskTags(task_tags.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block w-full align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h2 className="text-2xl font-bold mb-6">{task ? t('task.editTask') : t('task.newTask')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('task.title')}</label>
                <input
                  type="text"
                  value={task_name}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('task.description')}</label>
                <textarea
                  value={task_desc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('task.priority')}</label>
                  <select
                    value={task_priority}
                    onChange={(e) => setTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="low">{t('common.priority.low')}</option>
                    <option value="medium">{t('common.priority.medium')}</option>
                    <option value="high">{t('common.priority.high')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('task.status')}</label>
                  <select
                    value={task_status}
                    onChange={(e) => setTaskStatus(e.target.value as 'todo' | 'inProgress' | 'completed')}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="todo">{t('common.status.todo')}</option>
                    <option value="inProgress">{t('common.status.inProgress')}</option>
                    <option value="completed">{t('common.status.completed')}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInput
                  label={t('common.startDate')}
                  value={start_time}
                  onChange={setStartDate}
                  required
                />
                <DateInput
                  label={t('common.endDate')}
                  value={end_time}
                  onChange={setEndDate}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('task.tags')}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t('task.addTag')}
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
                    {t('task.addTag')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task_tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 rounded-full text-sm relative group"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      {editingTagId === tag.id ? (
                        <input
                          type="text"
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="w-20 px-1 text-black rounded border-gray-300"
                          onBlur={() => {
                            setTaskTags(task_tags.map(t => 
                              t.id === tag.id ? { ...t, name: editingTagName } : t
                            ));
                            setEditingTagId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setTaskTags(task_tags.map(t => 
                                t.id === tag.id ? { ...t, name: editingTagName } : t
                              ));
                              setEditingTagId(null);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditingTagId(tag.id);
                            setEditingTagName(tag.name);
                          }}
                        >
                          {tag.name}
                        </span>
                      )}
                      <button
                        onClick={() => removeTag(tag.id)}
                        className="absolute -top-1 -right-1 hidden group-hover:block bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  {task ? t('common.save') : t('common.create')}
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
