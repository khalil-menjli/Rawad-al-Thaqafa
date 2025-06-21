// store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Create axios instance first
const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json', 
    'User-Agent': 'ReactNative', 
    'x-platform': 'mobile' 
  }
});

// Define your auth store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      setAuth: (user, token) => {
        console.log('🔐 Setting auth:', { user: user?.email, tokenExists: !!token });
        set({
          user,
          token,
          isAuthenticated: true,
          error: null
        });
      },

      clearAuth: () => {
        console.log('🚪 Clearing auth');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      signup: async (userData, imageUri = null) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          const signupData = { ...userData, role: 'user', platform: 'mobile' };
          Object.keys(signupData).forEach(key => {
            const val = signupData[key];
            if (val !== null && val !== undefined) {
              formData.append(key, val);
            }
          });
          if (imageUri) {
            formData.append('image', { uri: imageUri, type: 'image/jpeg', name: 'profile.jpg' });
          }
          
          const response = await api.post('/auth/signup', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          const { account, token, success, message } = response.data;
          if (!success) throw new Error(message || 'Signup failed');
          
          // Use setAuth to properly set the state
          get().setAuth(account, token);
          set({ isLoading: false });
          
          return response.data;
        } catch (err) {
          const msg = err.response?.data?.message || err.message;
          set({ error: msg, isLoading: false, isAuthenticated: false });
          throw new Error(msg);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log('🔑 Attempting login for:', email);
          
          const response = await api.post('/auth/login', { 
            email, 
            password, 
            platform: 'mobile' 
          });
          
          const { account, token, success, message } = response.data;
          console.log('📱 Login response:', { success, hasToken: !!token, hasAccount: !!account });
          
          if (!success) throw new Error(message || 'Login failed');
          
          // Use setAuth to properly set the state
          get().setAuth(account, token);
          set({ isLoading: false });
          
          console.log('✅ Login successful, token stored');
          return response.data;
        } catch (err) {
          const msg = err.response?.data?.message || err.message;
          console.log('❌ Login failed:', msg);
          set({ error: msg, isLoading: false, isAuthenticated: false });
          throw new Error(msg);
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/auth/logout');
        } catch (err) {
          console.warn('Logout API failed:', err.message);
        } finally {
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/verify-email', { code });
          if (!response.data.success) throw new Error(response.data.message || 'Verify email failed');
          
          const current = get().user;
          if (current) {
            set({ user: { ...current, isApproved: true }, isLoading: false });
          }
          return response.data;
        } catch (err) {
          const msg = err.response?.data?.message || err.message;
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/forgot-password', { email, platform: 'mobile' });
          set({ isLoading: false });
          return res.data;
        } catch (err) {
          const msg = err.response?.data?.message || err.message;
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post(`/auth/reset-password/${token}`, { password });
          set({ isLoading: false });
          return res.data;
        } catch (err) {
          const msg = err.response?.data?.message || err.message;
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      checkAuth: async () => {
        const currentState = get();
        const tk = currentState.token;
        console.log("🔍 Checking auth - token exists:", !!tk);
        
        if (!tk) {
          console.log("❌ No token found, setting unauthenticated");
          set({ isAuthenticated: false, user: null });
          return false;
        }
        
        set({ isLoading: true });
        try {
          const res = await api.get('/auth/checkAuth');
          if (!res.data.success) throw new Error('Auth check failed');
          
          console.log("✅ Auth check successful");
          set({ 
            user: res.data.account, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          });
          return true;
        } catch (error) {
          console.log("❌ Auth check failed:", error.message);
          get().clearAuth();
          set({ isLoading: false });
          return false;
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.put('/auth/update-profile', data);
          if (!res.data.success) throw new Error(res.data.message);
          set({ user: res.data.account, isLoading: false });
          return res.data;
        } catch (err) {
          const msg = err.response?.data?.message || err.message;
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      refreshUser: () => get().checkAuth(),
      getCurrentUser: () => get().user,
      isUserAuthenticated: () => get().isAuthenticated
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Set up interceptors AFTER the store is created
api.interceptors.request.use((config) => {
  // Get token from store at request time
  const token = useAuthStore.getState().token;
  
  console.log('📡 Request interceptor:', {
    url: config.url,
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    console.log('📡 Response error:', {
      status: err.response?.status,
      message: err.response?.data?.message
    });
    
    if (err.response?.status === 401) {
      console.log('🚪 401 received, logging out');
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(err);
  }
);

export { api };
export default useAuthStore;