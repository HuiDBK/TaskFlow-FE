import axiosInstance from './axiosInstance';
import { IProject } from '../types';

export const projectService = {
  getProjects: () => 
    axiosInstance.get('/v1/projects'),
    
  createProject: (project: Partial<IProject>) =>
    axiosInstance.post('/v1/projects', project),
    
  updateProject: (project: Partial<IProject>) =>
    axiosInstance.put(`/v1/projects`, project),
    
  deleteProject: (project_ids: number[]) =>
    axiosInstance.delete(`/v1/projects`, { data: { project_ids } }),
}; 
