import { create } from 'zustand';

export const useHistoryStore = create((set) => ({
  history: JSON.parse(localStorage.getItem('uploadHistory') || '[]'),

  addEntry: (entry) =>
    set((state) => {
      const newHistory = [entry, ...state.history];
      localStorage.setItem('uploadHistory', JSON.stringify(newHistory));
      return { history: newHistory };
    }),

  removeEntry: (id) =>
    set((state) => {
      const newHistory = state.history.filter((entry) => entry.id !== id);
      localStorage.setItem('uploadHistory', JSON.stringify(newHistory));
      return { history: newHistory };
    }),

  clearAll: () => {
    localStorage.removeItem('uploadHistory');
    set({ history: [] });
  },
}));
