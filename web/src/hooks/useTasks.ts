import axios from "axios";
import { Task, TaskInput } from "../types/types";
import { create } from "zustand";

const API = "http://localhost:3000/api/tasks";

interface TasksStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  createTask: (data: TaskInput) => Promise<void>;
  updateTask: (id: string, data: TaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get<{ data: Task[] }>(API);
      set({ tasks: data.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createTask: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post<{ data: Task }>(API, payload);
      set(state => ({ tasks: [data.data, ...state.tasks], loading: false }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateTask: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put<{ data: Task }>(`${API}/${id}`, payload);
      set(state => ({
        tasks: state.tasks.map(t => t._id === id ? data.data : t),
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API}/${id}`);
      set(state => ({
        tasks: state.tasks.filter(t => t._id !== id),
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }
}));
