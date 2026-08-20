import { create } from 'zustand';
import { User } from '../types/index.js';
import { api } from '../lib/axios.js';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('buglens_user') || 'null'),
  token: localStorage.getItem('buglens_token'),
  isAuthenticated: !!localStorage.getItem('buglens_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data.data;
      localStorage.setItem('buglens_token', accessToken);
      localStorage.setItem('buglens_user', JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password, confirmPassword) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/auth/register', { name, email, password, confirmPassword });
      const { user, accessToken } = res.data.data;
      localStorage.setItem('buglens_token', accessToken);
      localStorage.setItem('buglens_user', JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('buglens_token');
      localStorage.removeItem('buglens_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('buglens_token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      const user = res.data.data.user;
      localStorage.setItem('buglens_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } catch {
      localStorage.removeItem('buglens_token');
      localStorage.removeItem('buglens_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user }),
}));
