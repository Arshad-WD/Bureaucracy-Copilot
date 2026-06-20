import { create } from 'zustand';
import { api } from '../services/api';

export interface Application {
  id: string;
  scholarshipId: string;
  status: string; // INTERESTED, PREPARING_DOCUMENTS, APPLIED, UNDER_REVIEW, APPROVED, REJECTED
  notes?: string;
  appliedAt: string;
  scholarship: {
    id: string;
    title: string;
    provider: string;
    amount: number;
    deadline?: string;
  };
}

interface TrackerState {
  applications: Application[];
  loading: boolean;
  
  fetchApplications: () => Promise<void>;
  createApplication: (scholarshipId: string, status: string) => Promise<boolean>;
  updateApplicationStatus: (applicationId: string, status: string) => Promise<boolean>;
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
  applications: [],
  loading: false,

  fetchApplications: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/applications');
      set({ applications: res.data.applications, loading: false });
    } catch {
      set({ applications: [], loading: false });
    }
  },

  createApplication: async (scholarshipId, status) => {
    try {
      await api.post('/applications', { scholarshipId, status });
      await get().fetchApplications();
      return true;
    } catch {
      return false;
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    // Optimistic update locally
    const previous = get().applications;
    set({
      applications: previous.map((app) =>
        app.id === applicationId ? { ...app, status } : app
      ),
    });

    try {
      await api.patch(`/applications/${applicationId}`, { status });
      return true;
    } catch {
      // Rollback on fail
      set({ applications: previous });
      return false;
    }
  },
}));
