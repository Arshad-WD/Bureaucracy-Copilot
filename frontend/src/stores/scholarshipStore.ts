import { create } from 'zustand';
import { api } from '../services/api';

export interface Scholarship {
  id: string;
  title: string;
  description: string;
  provider: string;
  amount: number;
  deadline?: string;
  applicationUrl?: string;
  status: string;
  documents: { id: string; documentName: string; mandatory: boolean }[];
  rules: { id: string; ruleJson: any }[];
}

export interface MatchResult {
  scholarshipId: string;
  title: string;
  score: number;
  reasons: string[];
}

interface ScholarshipState {
  scholarships: Scholarship[];
  saved: Scholarship[];
  recommendations: MatchResult[];
  current: Scholarship | null;
  loading: boolean;
  total: number;
  
  fetchScholarships: (filters?: { page?: number; limit?: number; state?: string; education?: string }) => Promise<void>;
  fetchSaved: () => Promise<void>;
  fetchRecommendations: () => Promise<void>;
  fetchDetails: (id: string) => Promise<void>;
  searchScholarships: (keyword: string, state?: string) => Promise<void>;
  saveScholarship: (scholarshipId: string) => Promise<boolean>;
  unsaveScholarship: (scholarshipId: string) => Promise<boolean>;
}

export const useScholarshipStore = create<ScholarshipState>((set, get) => ({
  scholarships: [],
  saved: [],
  recommendations: [],
  current: null,
  loading: false,
  total: 0,

  fetchScholarships: async (filters) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.state) params.append('state', filters.state);
      if (filters?.education) params.append('education', filters.education);

      const res = await api.get(`/scholarships?${params.toString()}`);
      set({ scholarships: res.data.data, total: res.data.total, loading: false });
    } catch {
      set({ scholarships: [], total: 0, loading: false });
    }
  },

  fetchSaved: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/saved-scholarships');
      set({ saved: res.data.data, loading: false });
    } catch {
      set({ saved: [], loading: false });
    }
  },

  fetchRecommendations: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/eligibility/recommendations');
      set({ recommendations: res.data.matches, loading: false });
    } catch {
      set({ recommendations: [], loading: false });
    }
  },

  fetchDetails: async (id) => {
    set({ loading: true, current: null });
    try {
      const res = await api.get(`/scholarships/${id}`);
      set({ current: res.data, loading: false });
    } catch {
      set({ current: null, loading: false });
    }
  },

  searchScholarships: async (keyword, state) => {
    set({ loading: true });
    try {
      const res = await api.post('/scholarships/search', { keyword, state });
      set({ scholarships: res.data.results, loading: false });
    } catch {
      set({ scholarships: [], loading: false });
    }
  },

  saveScholarship: async (scholarshipId) => {
    try {
      await api.post('/saved-scholarships', { scholarshipId });
      await get().fetchSaved();
      return true;
    } catch {
      return false;
    }
  },

  unsaveScholarship: async (scholarshipId) => {
    try {
      await api.delete(`/saved-scholarships/${scholarshipId}`);
      await get().fetchSaved();
      return true;
    } catch {
      return false;
    }
  },
}));
