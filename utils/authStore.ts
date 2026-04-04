import { create } from 'zustand';
import storage from './storage';

interface User {
  id: number;
  phone: string;
  role: string | null;
  name: string | null;
  is_profile_complete: boolean;
  avatar?: string;
  rating?: number;
  address?: {
    village?: string;
    street_address?: string;
    pincode?: string;
    district?: string;
    state?: string;
  } | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: async (user, token) => {
    try {
      // Ensure values are strings
      const tokenStr = String(token);
      const userStr = JSON.stringify(user);
      
      await storage.setItem('userToken', tokenStr);
      await storage.setItem('userData', userStr);
      
      set({ user, token: tokenStr, isAuthenticated: true });
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  },

  clearAuth: async () => {
    try {
      await storage.deleteItem('userToken');
      await storage.deleteItem('userData');
      set({ user: null, token: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  loadAuth: async () => {
    try {
      const token = await storage.getItem('userToken');
      const userData = await storage.getItem('userData');
      if (token && userData) {
        set({
          user: JSON.parse(userData),
          token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    }
  },
}));

