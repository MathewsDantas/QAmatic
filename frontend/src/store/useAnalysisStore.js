import { create } from 'zustand';

const useAnalysisStore = create((set) => ({
  status: 'idle',
  analysis: null,
  error: null,

  startAnalysis: () => set({ status: 'analyzing', error: null }),

  completeAnalysis: (analysis) =>
    set({ status: 'completed', analysis, error: null }),

  failAnalysis: (error) => set({ status: 'error', error }),

  reset: () => set({ status: 'idle', analysis: null, error: null }),
}));

export default useAnalysisStore;
