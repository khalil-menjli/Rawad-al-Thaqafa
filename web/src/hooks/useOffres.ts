import { create } from 'zustand';
import axios from 'axios';
import { Offer } from '../types/types';

const API_URL = 'http://localhost:3000/api/offers'; 

axios.defaults.withCredentials = true;

interface OffersStore {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  fetchOffers: () => Promise<void>;
  fetchOffersByPartner: (id:string) =>Promise<void>
  fetchOffersByOwner: (id:string) =>Promise<void>
  createOffer: (offer: Omit<Offer, '_id' | 'views' | 'createdBy'>) => Promise<void>;
  updateOffer: (id: string, offer: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  getOfferById: (id: string) => Promise<Offer | undefined>;
}

export const useOffersStore = create<OffersStore>((set, get) => ({
  offers: [],
  loading: false,
  error: null,
  fetchOffersByPartner: async (id) => {
    try {
      set({loading: true , error:null});
      const response =  await axios.get(`${API_URL}/getOffersByUserId/${id}`);
      console.log("response.data", response.data);
      console.log("response.data.data", response.data.data);
      
      set({
        offers : response.data.data,
        loading: false 
      })
    } catch (error) {
      console.log("poblem", error);

    }
  },
  fetchOffers: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/getOffers`);
      console.log("API response:", response.data);

      set({
        offers : response.data.data || response.data,
        loading: false 
      })
      
      ;
      
       } catch (error) {
      console.error('Error fetching offers:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch offers'
      });
    }
  },
  
  // Rest of the methods remain the same as before
  createOffer: async (offer) => {
    try {
      set({ loading: true, error: null });
      const formData = new FormData();
      Object.entries(offer).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) formData.append('filename', value);
          else formData.append(key, String(value));
        }
      });

      const { data } = await axios.post<{ data: Offer }>(
        `${API_URL}/createOffer`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      set(state => ({ offers: [...state.offers, data.data], loading: false }));
    } catch (error) {
      console.error('Error creating offer:', error);
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed to create offer' });
    }
  },
  // hooks/useOffres.ts
updateOffer: async (id, offerUpdate) => {
  try {
    set({ loading: true, error: null });

    const formData = new FormData();

    // 1) If there’s a new File, send it as 'filename' (matches upload.single('filename'))
    if (offerUpdate.imageFile instanceof File) {
      formData.append('filename', offerUpdate.imageFile);
    }

    // 2) Append all *other* fields except imageFile
    Object.entries(offerUpdate).forEach(([key, val]) => {
      if (key === 'imageFile' || val == null) return;
      // _id, title, description, price, etc.
      formData.append(key, String(val));
    });

    // 3) Fire the request
    const { data } = await axios.put<{ data: Offer }>(
      `${API_URL}/edit/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // 4) Swap the updated offer into your local state
    set(state => ({
      offers: state.offers.map(o => o._id === id ? data.data : o),
      loading: false
    }));
  } catch (error) {
    console.error('Error updating offer:', error);
    set({
      loading: false,
      error: error instanceof Error ? error.message : 'Failed to update offer'
    });
  }
},

  
  deleteOffer: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API_URL}/delete/${id}`);
      
      // Remove the offer from the state with null check
      set(state => ({
        offers: Array.isArray(state.offers) 
          ? state.offers.filter(offer => offer._id !== id)
          : [],
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting offer:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete offer'
      });
    }
  },
  
  getOfferById: async (id) => {
    try {
      // First check if we already have this offer in our state
      const existingOffer = Array.isArray(get().offers) 
        ? get().offers.find(offer => offer._id === id)
        : undefined;
        
      if (existingOffer) return existingOffer;
      
      // If not, fetch it from the API
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/${id}`);
      
      // Process the response
      const offer = response.data;
      
      // Add this offer to our state if it's not already there
      set(state => ({
        offers: Array.isArray(state.offers)
          ? (state.offers.some(o => o._id === id) ? state.offers : [...state.offers, offer])
          : [offer],
        loading: false
      }));
      
      return offer;
    } catch (error) {
      console.error('Error fetching offer by ID:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch offer'
      });
      return undefined;
    }
  },
  fetchOffersByOwner: async (partnerId: string) => {
    set({ offers: [], loading: true, error: null });
    try {
      // match whatever route you chose:
      const  response  = await axios.get(
        `${API_URL}/partner/${partnerId}`
      );
      set({ offers: response.data.data, loading: false });
    } catch (err: unknown | any) {
      set({ error: err.message || "Failed to load offers", loading: false });
    }
  },
  
}));