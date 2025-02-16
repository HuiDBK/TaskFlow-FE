// src/services/api.ts
import { IProject, ITask, IUser } from '../types';
import { userService } from './userService';
import { ProjectFilters, projectService } from './projectService';
import { TaskFilters, taskService } from './taskService';
import Cookies from 'js-cookie';

// Authentication APIs
export const authAPI = {
  login: async (account: string, password: string) => {
    const response = await userService.login(account, password);
    const { token } = response.data;
    if (token) {
      setAuthToken(token);
    }
    return response.data;
  },
  register: async (username: string, password: string, email?: string, phone?: string) => {
    const response = await userService.register(username, password, email, phone);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },
  githubLogin: async () => {
    const query = new URLSearchParams({
      client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
      scope: 'user:email',
    })
    const redirect_uri = `${import.meta.env.VITE_GITHUB_AUTH_URL}?${query.toString()}`;
    window.location.href = redirect_uri;
  },
};

// Project APIs
export const getProjects = async (filters?: ProjectFilters) => {
  const response = await projectService.getProjects(filters);
  const {total, data_list} = response.data
  return {total, projects: data_list}
};

export const createProject = (project: Partial<IProject>) => 
  projectService.createProject(project);

export const updateProject = async (id: number, project: Partial<IProject>) => {
  return await projectService.updateProject(id, project);
}

export const deleteProject = (id: number) => 
  projectService.deleteProject([id]);

// Task APIs
export const getTasks = async (filters?: TaskFilters) => {
  const response = await taskService.getTasks(filters);
  const {total, data_list} = response.data
  return {total, tasks: data_list};
};

export const createTask = (projectId: number, task: Partial<ITask>) => 
  taskService.createTask(projectId, task);

export const updateTask = (projectId: number, taskId: number, task: Partial<ITask>) => 
  taskService.updateTask(projectId, taskId, task);

export const deleteTask = (projectId: number, taskId: number) => 
  taskService.deleteTask(projectId, taskId);

// Token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token') || Cookies.get('oauth_token');
  if (!token) return null;
  
  try {
    // 解析JWT token的payload部分（第二部分）
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    
    // 将payload转换为IUser对象
    const user: IUser = {
      id: payload.id,
      username: payload.username,
    };
    
    return user;
  } catch (error) {
    console.error('Token解析失败:', error);
    return null;
  }
};

export const getUserToken = () => {
  return localStorage.getItem('token');
};

// Mock data is now handled by mockService, 
// so we don't need actual API configuration or axios instance
[
    {
        "command_name": "Terminal.run_command",
        "args": {
            "cmd": "pnpm run build"
        }
    }
]
