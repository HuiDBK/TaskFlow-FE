import axiosInstance from './axiosInstance';
import { IUser } from '../types';

export const userService = {
  login: (account: string, password: string) => 
    axiosInstance.post('/v1/users/login', { account, password }),
    
  register: (username: string, password: string, email?: string, phone?: string) => {
    const payload = {
      username,
      password,
      ...(email?.trim() && { email }),
      ...(phone?.trim() && { phone })
    };
    return axiosInstance.post('/v1/users/register', payload);
  },
    
  githubLogin: (code: string) =>
    axiosInstance.post('/v1/users/github/login', { code }),
}; 