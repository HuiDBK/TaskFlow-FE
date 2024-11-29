import axiosInstance from './axiosInstance';
import { ITask } from '../types';

export const taskService = {
  getTasks: (projectId: number) =>
    axiosInstance.get(`/projects/${projectId}/tasks`),
    
  createTask: (projectId: number, task: Partial<ITask>) =>
    axiosInstance.post(`/projects/${projectId}/tasks`, task),
    
  updateTask: (projectId: number, taskId: number, task: Partial<ITask>) =>
    axiosInstance.put(`/projects/${projectId}/tasks/${taskId}`, task),
    
  deleteTask: (projectId: number, taskId: number) =>
    axiosInstance.delete(`/projects/${projectId}/tasks/${taskId}`),
}; 