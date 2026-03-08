import { create } from 'zustand';
import { getMe } from '../services/auth.service';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,

  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true, loading: false });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, loading: false });
  },

  loadUser: async () => {
    const { token, user } = get();
    if (!token) {
      set({ loading: false });
      return;
    }
    if (user) {
      set({ loading: false });
      return;
    }
    try {
      const response = await getMe();
      set({ user: response.data.user, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, loading: false });
    }
  },
}));

export default useAuthStore;
