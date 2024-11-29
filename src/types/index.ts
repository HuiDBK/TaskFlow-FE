// src/types/index.ts
export interface IUser {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ITag {
  id: number;
  name: string;
  color: string;
}

export interface IProject {
  id: number;
  project_name: string;
  project_desc: string;
  project_tags: ITag[];
  project_priority: 'low' | 'medium' | 'high';
  project_status: 'todo' | 'in-progress' | 'completed';
  start_time: Date;
  end_time: Date;
}

export interface ITask {
  id: number;
  projectId: number;
  title: string;
  description: string;
  tags: ITag[];
  priority: 'low' | 'medium' | 'high';
  startDate: Date;
  endDate: Date;
  status: 'todo' | 'in-progress' | 'completed';
  assignee?: string;
}