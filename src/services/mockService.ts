// src/services/mockService.ts
import { mockUsers, mockProjects, mockTasks, mockCredentials } from './mockData';
import { IProject, ITask, IUser } from '../types';

// Helper function to generate random ID
const generateId = () => Date.now();

// Authentication Services
export const mockAuthService = {
  login: async (username: string, password: string) => {
    return new Promise<{ token: string; user: IUser }>((resolve, reject) => {
      setTimeout(() => {
        if (mockCredentials[username] === password) {
          const user = mockUsers.find(u => u.username === username);
          if (user) {
            resolve({
              token: 'mock-jwt-token',
              user
            });
          }
        }
        reject(new Error('Invalid credentials'));
      }, 500);
    });
  },

  register: async (username: string, password: string, email?: string, phone?: string) => {
    return new Promise<{ token: string; user: IUser }>((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.some(u => u.username === username)) {
          reject(new Error('Username already exists'));
        }
        const newUser: IUser = {
          id: generateId(),
          username,
          email,
          phone,
          avatar: `https://i.pravatar.cc/150?u=${username}`
        };
        mockUsers.push(newUser);
        mockCredentials[username] = password;
        resolve({
          token: 'mock-jwt-token',
          user: newUser
        });
      }, 500);
    });
  },

  githubLogin: async (code: string) => {
    return new Promise<{ token: string; user: IUser }>((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-github-jwt-token',
          user: mockUsers[0] // Using first mock user for GitHub login
        });
      }, 500);
    });
  }
};

// Project Services
export const mockProjectService = {
  getProjects: async () => {
    return new Promise<IProject[]>((resolve) => {
      setTimeout(() => {
        resolve(mockProjects);
      }, 500);
    });
  },

  createProject: async (project: Partial<IProject>) => {
    return new Promise<IProject>((resolve) => {
      setTimeout(() => {
        const newProject: IProject = {
          id: generateId(),
          title: project.title!,
          description: project.description!,
          tags: project.tags || [],
          priority: project.priority || 'medium',
          startDate: new Date(project.startDate!),
          endDate: new Date(project.endDate!),
          createdBy: '1' // Using first mock user as creator
        };
        mockProjects.push(newProject);
        mockTasks[newProject.id] = []; // Initialize empty task array for new project
        resolve(newProject);
      }, 500);
    });
  },

  updateProject: async (id: number, project: Partial<IProject>) => {
    return new Promise<IProject>((resolve, reject) => {
      setTimeout(() => {
        const index = mockProjects.findIndex(p => p.id === id);
        if (index === -1) {
          reject(new Error('Project not found'));
          return;
        }
        mockProjects[index] = { ...mockProjects[index], ...project };
        resolve(mockProjects[index]);
      }, 100);
    });
  },

  deleteProject: async (id: number) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const index = mockProjects.findIndex(p => p.id === id);
        if (index === -1) {
          reject(new Error('Project not found'));
          return;
        }
        mockProjects.splice(index, 1);
        delete mockTasks[id];
        resolve();
      }, 500);
    });
  }
};

// Task Services
export const mockTaskService = {
  getTasks: async (projectId: number) => {
    return new Promise<ITask[]>((resolve) => {
      setTimeout(() => {
        resolve(mockTasks[projectId] || []);
      }, 500);
    });
  },

  createTask: async (projectId: number, task: Partial<ITask>) => {
    return new Promise<ITask>((resolve) => {
      setTimeout(() => {
        const newTask: ITask = {
          id: generateId(),
          projectId,
          title: task.title!,
          description: task.description!,
          tags: task.tags || [],
          priority: task.priority || 'medium',
          startDate: new Date(task.startDate!),
          endDate: new Date(task.endDate!),
          status: task.status || 'todo',
          assignee: task.assignee
        };
        if (!mockTasks[projectId]) {
          mockTasks[projectId] = [];
        }
        mockTasks[projectId].push(newTask);
        resolve(newTask);
      }, 500);
    });
  },

  updateTask: async (projectId: number, taskId: number, task: Partial<ITask>) => {
    return new Promise<ITask>((resolve, reject) => {
      setTimeout(() => {
        const tasks = mockTasks[projectId];
        if (!tasks) {
          reject(new Error('Project not found'));
          return;
        }
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) {
          reject(new Error('Task not found'));
          return;
        }
        tasks[index] = { ...tasks[index], ...task };
        resolve(tasks[index]);
      }, 500);
    });
  },

  deleteTask: async (projectId: number, taskId: number) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const tasks = mockTasks[projectId];
        if (!tasks) {
          reject(new Error('Project not found'));
          return;
        }
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) {
          reject(new Error('Task not found'));
          return;
        }
        tasks.splice(index, 1);
        resolve();
      }, 500);
    });
  }
};