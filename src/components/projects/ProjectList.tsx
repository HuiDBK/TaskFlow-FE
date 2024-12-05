// src/components/projects/ProjectList.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProjects, deleteProject, updateProject } from '../../services/api';
import { IProject } from '../../types';
import { ProjectForm } from './ProjectForm';
import { EnhancedPagination } from '../common/EnhancedPagination';
import { LayoutControl, LayoutType } from '../common/LayoutControl';
import { SearchFilterAdvanced } from '../common/SearchFilterAdvanced';
import { QuickEditMenu } from '../common/QuickEditMenu';
import { ProjectFilters } from '../../services/projectService';

const ITEMS_PER_PAGE = 6;

export const ProjectList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<LayoutType>('3x2');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startTimeFilter, setStartTimeFilter] = useState('');
  const [endTimeFilter, setEndTimeFilter] = useState('');

  useEffect(() => {
    const shouldLoadProjects = () => {
      if (searchTerm || priorityFilter || statusFilter) return true;
      if (startTimeFilter && endTimeFilter) return true;
      if (!searchTerm && !priorityFilter && !statusFilter && !startTimeFilter && !endTimeFilter) return true;
      return false;
    };

    if (shouldLoadProjects()) {
      loadProjects();
    }
  }, [searchTerm, priorityFilter, statusFilter, startTimeFilter, endTimeFilter, currentPage]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: ProjectFilters = {};
      if (searchTerm) filters.project_name = searchTerm;
      if (priorityFilter) filters.project_priority = priorityFilter;
      if (statusFilter) filters.project_status = statusFilter;
      if (startTimeFilter && endTimeFilter) {
        filters.start_time = startTimeFilter;
        filters.end_time = endTimeFilter;
      };
      filters.current_page = currentPage;
      filters.page_size = ITEMS_PER_PAGE;

      const {total, projects} = await getProjects(filters);
      setProjects(projects || []);
      setTotal(total);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError(t('project.loadError'));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (projectId: number, newPriority: 'low' | 'medium' | 'high') => {
    try {
      await updateProject(projectId, { project_priority: newPriority });
      await loadProjects();
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleStatusChange = async (projectId: number, newStatus: 'todo' | 'inProgress' | 'completed') => {
    try {
      await updateProject(projectId, { project_status: newStatus });
      await loadProjects();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };  

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      setError(t('project.deleteError'));
    }
  };

  const handleProjectClick = (project: IProject) => {
    navigate(`/projects/${project.id}`, { state: { project } });
  };

  const getLayoutClass = (layout: LayoutType) => {
    switch (layout) {
      case '1x6': return 'grid-cols-1';
      case '2x3': return 'grid-cols-1 md:grid-cols-2';
      case '3x2': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Get all unique tags from projects
  // const allTags = Array.from(new Set(projects.flatMap(project => project.project_tags)));

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleReset = () => {
    setSearchTerm('');
    setPriorityFilter('');
    setStartTimeFilter('');
    setEndTimeFilter('');
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md">
        <strong className="font-bold">{t('common.error')}: </strong>
        <span className="block sm:inline">{error}</span>
        <button 
          onClick={loadProjects}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{t('common.projects')}</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/gantt')}
            className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 
                     transition-colors duration-200 flex items-center space-x-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{t('common.ganttView')}</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 
                     transition-colors duration-200 flex items-center space-x-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{t('project.newProject')}</span>
          </button>
        </div>
      </div>

      <SearchFilterAdvanced
        onSearch={setSearchTerm}
        onFilterPriority={setPriorityFilter}
        onFilterStatus={setStatusFilter}
        onFilterDate={(start, end) => {
          setStartTimeFilter(start);
          setEndTimeFilter(end);
        }}
        onReset={handleReset}
        searchTerm={searchTerm}
        priorityFilter={priorityFilter}
        statusFilter={statusFilter}
        startTimeFilter={startTimeFilter}
        endTimeFilter={endTimeFilter}
      />

      <div className="flex justify-end mb-2 mt-2">
        <LayoutControl currentLayout={layout} onLayoutChange={setLayout} />
      </div>

      {showForm && (
        <ProjectForm
          project={selectedProject}
          onSubmit={async () => {
            setShowForm(false);
            setSelectedProject(null);
            await loadProjects();
          }}
          onCancel={() => {
            setShowForm(false);
            setSelectedProject(null);
          }}
        />
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">{t('project.noProjects')}</h3>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('project.createFirst')}
          </button>
        </div>
      ) : (
        <>
          <div className={`grid ${getLayoutClass(layout)} gap-6`}>
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
                          transform hover:-translate-y-1 cursor-pointer overflow-hidden relative"
                onClick={() => handleProjectClick(project)}
              >
                <div className="absolute -left-1.5 -top-0.5">
                  <QuickEditMenu
                    type="status"
                    currentValue={project.project_status}
                    onSelect={(value) => {
                      handleStatusChange(project.id, value as "todo" | "inProgress" | "completed");
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    showDropdownIcon={false}
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mt-2 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{project.project_name}</h3>
                    <QuickEditMenu
                      type="priority"
                      currentValue={project.project_priority}
                      onSelect={(value) => {
                        handlePriorityChange(project.id, value as "low" | "medium" | "high");
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡到父级div
                      }}
                      showDropdownIcon={true} // 显示下拉图标
                      />
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.project_desc}</p>
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
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {project.start_time ? new Date(project.start_time).toLocaleDateString() : '-'} - {project.end_time ? new Date(project.end_time).toLocaleDateString() : '-'}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                          setShowForm(true);
                        }}
                        className="text-blue-500 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                        title={t('common.edit')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                        title={t('common.delete')}
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
    </div>
  );
};