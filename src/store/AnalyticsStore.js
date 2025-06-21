import { create } from 'zustand';

export const useAnalyticsStore = create((set) => ({
  file: null,
  status: 'idle',
  stats: null,
  setFile: (file) => set({ file, status: 'ready' }),
  reset: () => set({ file: null, status: 'idle', stats: null }),
  setLoading: () => set({ status: 'loading' }),
  setError: () => set({ status: 'error' }),
  setStats: (stats) => set({ stats, status: 'done' }),
  updateStats: (stats) => set({ stats }),
}));
