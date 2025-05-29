import { create } from "zustand";
import { Partner, User } from "../types/types";
import axios from "axios";

const API_URL = 'http://localhost:3000/api/users';

export interface UsersStore {
    usersApproved: User[];
    usersNotApproved: User[];
    users:User[];
    partnersNotApproved: Partner[];
    partnersApproved: Partner[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
  
    fetchUsersNotApproved: () => Promise<void>;
    fetchUsersApproved: () => Promise<void>;
    fetchPartnersApproved: () => Promise<void>;
    fetchPartnersNotApproved: () => Promise<void>;
  
    deleteUser: (id: string) => Promise<void>;
    deletePartner: (id: string) => Promise<void>;
  
    getUserByID: (id: string) => Promise<User | null>;
  
    approveUser: (id: string) => Promise<void>;
    approvePartner: (id: string) => Promise<void>;

    getAllUsers:() => Promise<void>;
  }
  
export const useUserStore = create<UsersStore>((set, get) => ({
    usersApproved: [],
    usersNotApproved: [],
    partnersNotApproved: [],
    partnersApproved: [],
    users:[],
    currentUser: null,
    loading: false,
    error: null,
    
    fetchUsersNotApproved: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axios.get(`${API_URL}/usersIsNotApproved`);
            // Handle the response structure from your controller
            if (response.data.success) {
                set({ loading: false, usersNotApproved: response.data.users });
            } else {
                throw new Error(response.data.message || 'Failed to fetch unapproved users');
            }
        } catch (error) {
            set({ 
                loading: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch unapproved users' 
            });
        }
    },
    
    fetchUsersApproved: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axios.get(`${API_URL}/usersIsApproved`);
            if (response.data.success) {
                set({ loading: false, usersApproved: response.data.users });
            } else {
                throw new Error(response.data.message || 'Failed to fetch approved users');
            }
        } catch (error) {
            set({ 
                loading: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch approved users' 
            });
        }
    },
    
    fetchPartnersApproved: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axios.get(`${API_URL}/partnersIsApproved`);
            if (response.data.success) {
                set({ loading: false, partnersApproved: response.data.partners });
            } else {
                throw new Error(response.data.message || 'Failed to fetch approved partners');
            }
        } catch (error) {
            set({ 
                loading: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch approved partners' 
            });
        }
    },
    
    fetchPartnersNotApproved: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axios.get(`${API_URL}/partnersIsNotApproved`);
            if (response.data.success) {
                set({ loading: false, partnersNotApproved: response.data.partners });
            } else {
                throw new Error(response.data.message || 'Failed to fetch unapproved partners');
            }
        } catch (error) {
            set({ 
                loading: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch unapproved partners' 
            });
        }
    },
    getAllUsers: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axios.get(`${API_URL}/Users`);
            if (response.data.success) {
                set({ loading: false, users: response.data.users });
            } else {
                throw new Error(response.data.message || 'Failed to fetch unapproved partners');
            }
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch unapproved partners'
            });
        }
    },
    
    deleteUser: async (id) => {
        try {
            set({ loading: true, error: null });
            console.log(id);
            
            const response = await axios.delete(`${API_URL}/user/${id}`);
            
            // Update all arrays by removing the entity with the given _id
            const { usersApproved, usersNotApproved,  } = get();
            set({
                loading: false,
                usersApproved: usersApproved.filter(user => user._id !== id),
                usersNotApproved: usersNotApproved.filter(user => user._id !== id),
            });
            
            return response.data;
        } catch (error) {
            set({ 
                loading: false, 
                error: error instanceof Error ? error.message : 'Failed to delete user' 
            });
            return null;
        }
    },
    
    deletePartner: async (id) => {
        try {
            set({ loading: true, error: null });
            console.log(id);
            
            const response = await axios.delete(`${API_URL}/partner/${id}`);
            
            if (response.data) {
                // Update arrays, safely checking for _id property
                const { partnersApproved, partnersNotApproved } = get();
                set({
                    loading: false,
                    partnersApproved: partnersApproved.filter(partner => partner && partner._id !== id),
                    partnersNotApproved: partnersNotApproved.filter(partner => partner && partner._id !== id)
                });
                
                return response.data;
            } else {
                throw new Error('No response data received');
            }
        } catch (error) {
            set({ 
                loading: false, 
                error: error instanceof Error ? error.message : 'Failed to delete partner' 
            });
            return null;
        }
    },
    
    getUserByID: async (id: string) => {
        try {
            set({ loading: true, error: null });
            const response = await axios.get(`${API_URL}/${id}`);
            if (response.data.success) {
                const user = response.data.user;
                set({ loading: false, currentUser: user });
                return user;
            } else {
                throw new Error(response.data.message || 'Failed to fetch user');
            }
        } catch (error) {
            set({ 
                loading: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch user' 
            });
            return null;
        }
    },
    approveUser: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const { data } = await axios.patch(`${API_URL}/users/${id}`);
          if (!data.success) throw new Error(data.message);
    
          // remove from unapproved, add to approved
          const { usersApproved, usersNotApproved } = get();
          const moved = usersNotApproved.find(u => u._id === id);
          set({
            loading: false,
            usersNotApproved: usersNotApproved.filter(u => u._id !== id),
            usersApproved: moved ? [...usersApproved, moved] : usersApproved
          });
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : 'Approve user failed'
          });
        }
      },
    
      approvePartner: async (id: string) => {
        try {
          set({ loading: true, error: null });
          const { data } = await axios.patch(`${API_URL}/partner/${id}`);
          if (!data.success) throw new Error(data.message);
    
          const { partnersApproved, partnersNotApproved } = get();
          const moved = partnersNotApproved.find(p => p._id === id);
          set({
            loading: false,
            partnersNotApproved: partnersNotApproved.filter(p => p._id !== id),
            partnersApproved: moved ? [...partnersApproved, moved] : partnersApproved
          });
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : 'Approve partner failed'
          });
        }
      },
}));