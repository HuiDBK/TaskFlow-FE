// src/services/auth.ts
import { mockAuthService } from './mockService';
import { setAuthToken, clearAuthToken } from './api';

export const login = async (username: string, password: string) => {
  try {
    const { token, user } = await mockAuthService.login(username, password);
    setAuthToken(token);
    return { token, user };
  } catch (error) {
    throw error;
  }
};

export const register = async (username: string, password: string, email?: string, phone?: string) => {
  try {
    const { token, user } = await mockAuthService.register(username, password, email, phone);
    setAuthToken(token);
    return { token, user };
  } catch (error) {
    throw error;
  }
};

export const githubLogin = () => {
  // In mock environment, we'll simulate the OAuth flow
  const MOCK_CODE = 'mock-github-code';
  return handleGithubCallback(MOCK_CODE);
};

export const handleGithubCallback = async (code: string) => {
  try {
    const { token, user } = await mockAuthService.githubLogin(code);
    setAuthToken(token);
    return { token, user };
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  clearAuthToken();
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
