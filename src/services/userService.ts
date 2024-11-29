import axiosInstance from './axiosInstance';
import { IUser } from '../types';

export const userService = {
  login: (account: string, password: string) => 
    axiosInstance.post('/v1/users/login', { account, password }),
    
  register: (username: string, password: string, email?: string, phone?: string) =>
    axiosInstance.post('/v1/users/register', { username, password, email, phone }),
    
  githubLogin: (code: string) =>
    axiosInstance.post('/v1/users/github/login', { code }),
}; 