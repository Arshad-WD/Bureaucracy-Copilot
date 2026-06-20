import { create } from 'zustand';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserProfile {
  age?: number;
  gender?: string;
  state?: string;
  educationLevel?: string;
  institutionType?: string;
  annualIncome?: number;
  category?: string;
  disability?: boolean;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfile: (profileData: UserProfile) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = res.data;
      
      localStorage.setItem('bc_access_token', accessToken);
      localStorage.setItem('bc_refresh_token', refreshToken);

      set({ isAuthenticated: true, error: null });
      await get().getMe();
      await get().loadProfile();
      set({ loading: false });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      set({ loading: false, error: errMsg });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/register', { name, email, password });
      set({ loading: false, error: null });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Registration failed. Check inputs.';
      set({ loading: false, error: errMsg });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore auth failure on logout
    } finally {
      localStorage.removeItem('bc_access_token');
      localStorage.removeItem('bc_refresh_token');
      set({ user: null, profile: null, isAuthenticated: false, loading: false });
    }
  },

  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  loadProfile: async () => {
    try {
      const res = await api.get('/profile');
      set({ profile: res.data });
    } catch {
      set({ profile: null });
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/profile', profileData);
      set({ profile: res.data.data, loading: false, error: null });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update profile.';
      set({ loading: false, error: errMsg });
      return false;
    }
  },
}));
