import { create } from 'zustand';

const useLoadingStore = create((set, get) => ({
  activeRequests: 0,
  isLoading: false,

  increment: () => {
    const next = get().activeRequests + 1;
    set({ activeRequests: next, isLoading: true });
  },

  decrement: () => {
    const next = Math.max(get().activeRequests - 1, 0);
    set({ activeRequests: next, isLoading: next > 0 });
  },
}));

export default useLoadingStore;
