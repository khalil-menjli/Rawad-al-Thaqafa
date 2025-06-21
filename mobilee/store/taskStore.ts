import { create } from 'zustand';
import axios from 'axios';
import useAuthStore, { api as authApi } from './useAuthStore';

// Create tasks-specific API instance that inherits auth
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/tasks`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'ReactNative',
    'x-platform': 'mobile',
  },
});

// Use the same interceptor pattern as auth store
api.interceptors.request.use(
  (config) => {
    const authState = useAuthStore.getState();
    const token = authState.token;
    
    console.log('📋 Tasks API Request:', {
      url: config.url,
      method: config.method,
      isAuthenticated: authState.isAuthenticated,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set for tasks API');
    } else {
      console.log('❌ NO TOKEN FOUND - Tasks request will fail');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('📋 Tasks API Response error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      console.log('🚪 401 Unauthorized in tasks - Logging out user');
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

// Types
interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  requiredReservations: number;
  pointToWin: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskStatus {
  required: number;
  done: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

interface TaskWithStatus extends Task {
  status?: TaskStatus;
}

interface TasksStore {
  tasks: TaskWithStatus[];
  loading: boolean;
  error: string | null;
  claimLoading: string | null;
  fetchTasks: () => Promise<void>;
  checkTaskStatus: (taskId: string) => Promise<TaskStatus | null>;
  claimTask: (taskId: string) => Promise<{ success: boolean; pointsAwarded?: number; error?: string }>;
  refreshTaskStatus: (taskId: string) => Promise<void>;
}

export const TasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  claimLoading: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    
    // Check auth state before making request
    const authState = useAuthStore.getState();
    console.log('📋 Pre-request auth check:', {
      isAuthenticated: authState.isAuthenticated,
      hasToken: !!authState.token,
      hasUser: !!authState.user,
      userEmail: authState.user?.email
    });
    
    if (!authState.isAuthenticated || !authState.token) {
      console.log('❌ User not authenticated, cannot fetch tasks');
      set({ 
        loading: false, 
        error: 'Not authenticated. Please log in again.',
        tasks: []
      });
      return;
    }
    
    try {
      console.log('🚀 Starting task fetch...');
      
      // GET /api/tasks
      const response = await api.get('');
      const tasks: Task[] = response.data.data || response.data;
      console.log('✅ Tasks fetched successfully:', tasks.length);

      // Fetch status for each task
      const tasksWithStatus = await Promise.all(
        tasks.map(async (task) => {
          try {
            console.log(`📊 Fetching status for task: ${task._id}`);
            
            // GET /api/tasks/:id/status
            const statusResponse = await api.get(`/${task._id}/status`);
            console.log(`✅ Status for task ${task._id}:`, statusResponse.data);
            
            return { ...task, status: statusResponse.data };
          } catch (statusError: any) {
            console.error(`❌ Error fetching status for task ${task._id}:`, {
              status: statusError.response?.status,
              message: statusError.response?.data?.message || statusError.message
            });
            
            // Return task with default status if status fetch fails
            return { 
              ...task, 
              status: { 
                required: task.requiredReservations || 0, 
                done: 0, 
                isCompleted: false, 
                isClaimed: false 
              } 
            };
          }
        })
      );

      console.log('✅ All tasks processed with status');
      set({ tasks: tasksWithStatus, loading: false });
      
    } catch (error: any) {
      console.error('❌ Error fetching tasks:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url
      });
      
      set({ 
        loading: false, 
        error: error.response?.data?.message || error.message || 'Failed to fetch tasks',
        tasks: []
      });
    }
  },

  checkTaskStatus: async (taskId) => {
    try {
      console.log(`📊 Checking status for task: ${taskId}`);
      const { data } = await api.get(`/${taskId}/status`);
      console.log(`✅ Status result:`, data);
      return data;
    } catch (error: any) {
      console.error('❌ Error checking task status:', error.response?.data || error.message);
      return null;
    }
  },

  claimTask: async (taskId) => {
    set({ claimLoading: taskId });
    try {
      console.log(`🎯 Claiming task: ${taskId}`);
      
      // POST /api/tasks/:id/claim
      const { data } = await api.post(`/${taskId}/claim`);
      console.log('✅ Claim result:', data);

      // Update local state
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t._id === taskId && t.status
            ? { ...t, status: { ...t.status, isClaimed: true } }
            : t
        ),
        claimLoading: null,
      }));

      return { success: true, pointsAwarded: data.pointsAwarded };
    } catch (error: any) {
      console.error('❌ Error claiming task:', error.response?.data || error.message);
      set({ claimLoading: null });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to claim task' 
      };
    }
  },

  refreshTaskStatus: async (taskId) => {
    try {
      console.log(`🔄 Refreshing status for task: ${taskId}`);
      const status = await get().checkTaskStatus(taskId);
      if (status) {
        set((state) => ({
          tasks: state.tasks.map((t) => (t._id === taskId ? { ...t, status } : t)),
        }));
        console.log('✅ Status refreshed successfully');
      }
    } catch (error: any) {
      console.error('❌ Error refreshing task status:', error);
    }
  },
}));