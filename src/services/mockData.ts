// src/services/mockData.ts
import { IUser, IProject, ITask, ITag } from '../types';

// Mock Tags
export const mockTags: ITag[] = [
  { id: '1', name: 'Frontend', color: '#3B82F6' },
  { id: '2', name: 'Backend', color: '#10B981' },
  { id: '3', name: 'UI/UX', color: '#F59E0B' },
  { id: '4', name: 'Bug', color: '#EF4444' },
  { id: '5', name: 'Feature', color: '#8B5CF6' }
];

// Mock Users
export const mockUsers: IUser[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    phone: '1234567890',
    avatar: 'https://i.pravatar.cc/150?u=john'
  },
  {
    id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    phone: '0987654321',
    avatar: 'https://i.pravatar.cc/150?u=jane'
  }
];

// Mock Projects
export const mockProjects: IProject[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign company website with modern UI/UX',
    tags: [mockTags[2], mockTags[4]],
    priority: 'high',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-04-30'),
    createdBy: '1'
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Develop new mobile app for customers',
    tags: [mockTags[0], mockTags[1]],
    priority: 'medium',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-06-30'),
    createdBy: '1'
  },
  {
    id: '3',
    title: 'Bug Fixes Sprint',
    description: 'Fix reported bugs in production',
    tags: [mockTags[3]],
    priority: 'high',
    startDate: new Date('2024-03-10'),
    endDate: new Date('2024-03-24'),
    createdBy: '2'
  }
];

// Mock Tasks
export const mockTasks: Record<string, ITask[]> = {
  '1': [
    {
      id: '101',
      projectId: '1',
      title: 'Design New Homepage',
      description: 'Create modern homepage design with improved UX',
      tags: [mockTags[2]],
      priority: 'high',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-15'),
      status: 'completed',
      assignee: '2'
    },
    {
      id: '102',
      projectId: '1',
      title: 'Implement New Design',
      description: 'Convert design to responsive HTML/CSS',
      tags: [mockTags[0], mockTags[2]],
      priority: 'medium',
      startDate: new Date('2024-03-16'),
      endDate: new Date('2024-04-15'),
      status: 'in-progress',
      assignee: '1'
    }
  ],
  '2': [
    {
      id: '201',
      projectId: '2',
      title: 'API Development',
      description: 'Develop REST APIs for mobile app',
      tags: [mockTags[1]],
      priority: 'high',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-04-30'),
      status: 'in-progress',
      assignee: '1'
    }
  ],
  '3': [
    {
      id: '301',
      projectId: '3',
      title: 'Fix Login Issues',
      description: 'Resolve reported login bugs',
      tags: [mockTags[3], mockTags[1]],
      priority: 'high',
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-03-17'),
      status: 'completed',
      assignee: '2'
    }
  ]
};

// Mock User Credentials
export const mockCredentials = {
  'john_doe': 'password123',
  'jane_smith': 'password456'
};