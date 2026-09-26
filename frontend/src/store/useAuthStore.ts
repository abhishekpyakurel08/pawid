import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('pawid_token'),
  isAuthenticated: !!localStorage.getItem('pawid_token'),

  setAuth: (user, token) => {
    localStorage.setItem('pawid_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('pawid_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
