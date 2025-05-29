// stores/authStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';
axios.defaults.withCredentials = true;

// Updated AuthUser to include Partner fields and new role values
interface AuthUser {
  _id: string;
  role: 'Admin' | 'User' | 'Partner';
  email: string;
  firstName: string;
  lastName: string;
  isApproved?: boolean;
  businessName?: string;
  description?: string;
  location?: string;
  websiteUrl?: string;
  categories?: string[];
  imageUrl?: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;

  signup: (payload: FormData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<string>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (updateData: Partial<AuthUser> & { currentPassword?: string; newPassword?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (payload: FormData) => {
    set({ isLoading: true, error: null });
    try {
      // Let Axios set multipart headers automatically
      const response = await axios.post(`${API_URL}/signup`, payload);
      const { account } = response.data;
      set({ user: account, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || err.message,
      });
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { account } = response.data;
      set({ user: account, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/verifyEmail`, { code });
      set({ isLoading: false, message: response.data.message });
      return response.data.message;
    } catch (error: any) {
      set({ isLoading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true, error: null });
      const response = await axios.get(`${API_URL}/checkAuth`);
      const account = response.data.account;
      console.log("yessssssss ")
      set({ user: account, isAuthenticated: true, isCheckingAuth: false });
    } catch {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/forgotPassword`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },

  updateProfile: async (updateData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`${API_URL}/profile`, updateData);
      const { account } = response.data;
      set({ user: account, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.response?.data?.message || error.message });
      throw error;
    }
  },
}));
