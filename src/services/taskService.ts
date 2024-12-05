import axiosInstance from './axiosInstance';
import { ITask } from '../types';

export interface TaskFilters {
  task_name?: string;
  task_priority?: string;
  task_status?: string;
  start_time?: string;
  end_time?: string;
  current_page?: number;
  page_size?: number;
}

export const taskService = {
  getTasks: (projectId: number, filters?: TaskFilters) =>
    axiosInstance.get(`/v1/projects/${projectId}/tasks`, {
      params: filters
    }),
    
  createTask: (projectId: number, task: Partial<ITask>) =>
    axiosInstance.post(`/v1/projects/${projectId}/tasks`, task),
    
  updateTask: (projectId: number, taskId: number, task: Partial<ITask>) => {
    task.id = taskId
    return axiosInstance.put(`/v1/projects/${projectId}/tasks`, task)
  },
    
  deleteTask: (projectId: number, taskId: number) =>
    axiosInstance.delete(`/v1/projects/${projectId}/tasks`, {
      data: {
        task_ids: [taskId]
      }
    }),
}; 
