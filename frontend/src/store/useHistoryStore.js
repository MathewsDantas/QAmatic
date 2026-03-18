import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_HISTORY_ITEMS = 50;

const useHistoryStore = create(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        set((state) => ({
          entries: [
            {
              id: entry.id,
              url: entry.url,
              instructions: entry.instructions,
              status: entry.status || 'analyzing',
              createdAt: entry.createdAt || new Date().toISOString(),
              overallScore: null,
              overallStatus: null,
              findingsCount: null,
              summary: null,
            },
            ...state.entries.filter((e) => e.id !== entry.id),
          ].slice(0, MAX_HISTORY_ITEMS),
        }));
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e,
          ),
        }));
      },

      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      getMetrics: () => {
        const entries = get().entries;
        const completed = entries.filter((e) => e.status === 'completed');
        return {
          totalAnalyses: entries.length,
          completedAnalyses: completed.length,
          averageScore:
            completed.length > 0
              ? Math.round(
                  completed.reduce((sum, e) => sum + (e.overallScore || 0), 0) /
                    completed.length,
                )
              : 0,
          totalFindings: completed.reduce(
            (sum, e) => sum + (e.findingsCount || 0),
            0,
          ),
        };
      },
    }),
    {
      name: 'qamatic-history',
    },
  ),
);

export default useHistoryStore;
