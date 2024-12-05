import axiosInstance from './axiosInstance';
import { IProject } from '../types';

export interface ProjectFilters {
  project_name?: string;
  project_priority?: string;
  project_status?: string;
  start_time?: string;
  end_time?: string;
  current_page?: number;
  page_size?: number;
}

export const projectService = {
  getProjects: (filters?: ProjectFilters) => 
    axiosInstance.get('/v1/projects', { 
      params: filters 
    }),
    
  createProject: (project: Partial<IProject>) =>
    axiosInstance.post('/v1/projects', project),
    
  updateProject: (id: number, project: Partial<IProject>) =>
    axiosInstance.put(`/v1/projects/${id}`, project),
    
  deleteProject: (project_ids: number[]) =>
    axiosInstance.delete(`/v1/projects`, { data: { project_ids } }),
}; 
