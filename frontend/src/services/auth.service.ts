import { apiRequest } from './api';
import { AuthResponse, LoginPayload, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('pawid_token', data.token);
    }
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const data = await apiRequest<{ user: User }>('/auth/me');
    return data.user;
  },

  logout(): void {
    localStorage.removeItem('pawid_token');
  },

  getToken(): string | null {
    return localStorage.getItem('pawid_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('pawid_token');
  }
};
