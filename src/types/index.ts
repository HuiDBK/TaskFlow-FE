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
  project_status: 'todo' | 'inProgress' | 'completed';
  start_time: Date;
  end_time: Date;
}

export interface ITask {
  id: number;
  project_id: number;
  task_name: string;
  task_desc: string;
  task_tags: ITag[];
  task_priority: 'low' | 'medium' | 'high';
  start_time: Date;
  end_time: Date;
  task_status: 'todo' | 'inProgress' | 'completed';
}
