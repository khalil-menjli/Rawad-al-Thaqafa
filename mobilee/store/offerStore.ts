// src/stores/useOffersStore.ts

import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './useAuthStore';
import { Offer } from '@/types/type.t';

const OFFERS_API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/offers`;

// Create a dedicated axios instance for offers
const offersApi = axios.create({
  baseURL: OFFERS_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'ReactNative',
    'x-platform': 'mobile',
  },
});

// Request interceptor: inject Bearer token from auth store
offersApi.interceptors.request.use(
  (config) => {
    const { token, isAuthenticated } = useAuthStore.getState();
    console.log('📋 Offers API Request:', {
      url: config.url,
      method: config.method,
      isAuthenticated,
      tokenPreview: token ? `${token.substring(0, 20)}…` : 'No token'
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Authorization header set for offers API');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 by clearing auth
offersApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    console.log('📋 Offers API Response Error:', { status, url: error.config?.url });
    if (status === 401) {
      console.log('🚪 401 Unauthorized in offers – Logging out user');
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

// Types
interface Reservation {
  _id: string;
  offerId: string;
  userId: string;
  createdAt: string;
  offer?: Offer;
}

interface ReservationStatus {
  hasReservation: boolean;
  userPoints: number;
  offerPoints: number;
  canReserve: boolean;
  reservationId?: string;
}

interface OffersStore {
  offers: Offer[];
  reservations: Reservation[];
  loading: boolean;
  error: string | null;

  fetchOffers: () => Promise<void>;
  fetchOffersByPartner: (id: string) => Promise<void>;
  getOfferById: (id: string) => Promise<Offer | undefined>;

  createOffer: (offerData: FormData) => Promise<Offer | undefined>;
  updateOffer: (id: string, offerData: FormData) => Promise<Offer | undefined>;
  deleteOffer: (id: string) => Promise<boolean>;

  getOffersByPartnerId: (partnerId: string) => Promise<void>;

  // NEW: Check reservation status with points validation
  checkReservationStatus: (offerId: string) => Promise<ReservationStatus | undefined>;
  
  createReservation: (offerId: string) => Promise<Reservation | undefined>;
  getMyReservations: () => Promise<void>;
}

export const OffersStore = create<OffersStore>((set, get) => ({
  offers: [],
  reservations: [],
  loading: false,
  error: null,

  fetchOffersByPartner: async (id) => {
    set({ loading: true, error: null });
    try {
      const resp = await offersApi.get(`/getOffersByUserId/${id}`);
      set({ offers: resp.data.data, loading: false });
    } catch (err: any) {
      console.error('❌ fetchOffersByPartner error:', err);
      set({ loading: false, error: err.message });
    }
  },

  fetchOffers: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await offersApi.get('/getOffers');
      set({ offers: resp.data.data || resp.data, loading: false });
    } catch (err: any) {
      console.error('❌ fetchOffers error:', err);
      set({ loading: false, error: err.message });
    }
  },

  getOfferById: async (id) => {
    const existing = get().offers.find(o => o._id === id);
    if (existing) return existing;

    set({ loading: true, error: null });
    try {
      const resp = await offersApi.get(`/${id}`);
      const offer: Offer = resp.data.data;
      set(state => ({
        offers: state.offers.some(o => o._id === id)
          ? state.offers
          : [...state.offers, offer],
        loading: false
      }));
      return offer;
    } catch (err: any) {
      console.error('❌ getOfferById error:', err);
      set({ loading: false, error: err.message });
      return undefined;
    }
  },

  createOffer: async (offerData) => {
    set({ loading: true, error: null });
    try {
      const resp = await offersApi.post('/createOffer', offerData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newOffer: Offer = resp.data.newOffer;
      set(state => ({ offers: [...state.offers, newOffer], loading: false }));
      return newOffer;
    } catch (err: any) {
      console.error('❌ createOffer error:', err);
      set({ loading: false, error: err.response?.data?.message || err.message });
      return undefined;
    }
  },

  updateOffer: async (id, offerData) => {
    set({ loading: true, error: null });
    try {
      const resp = await offersApi.put(`/edit/${id}`, offerData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updated: Offer = resp.data.data;
      set(state => ({
        offers: state.offers.map(o => (o._id === id ? updated : o)),
        loading: false
      }));
      return updated;
    } catch (err: any) {
      console.error('❌ updateOffer error:', err);
      set({ loading: false, error: err.response?.data?.message || err.message });
      return undefined;
    }
  },

  deleteOffer: async (id) => {
    set({ loading: true, error: null });
    try {
      await offersApi.delete(`/delete/${id}`);
      set(state => ({
        offers: state.offers.filter(o => o._id !== id),
        loading: false
      }));
      return true;
    } catch (err: any) {
      console.error('❌ deleteOffer error:', err);
      set({ loading: false, error: err.response?.data?.message || err.message });
      return false;
    }
  },

  getOffersByPartnerId: async (partnerId) => {
    set({ loading: true, error: null });
    try {
      const resp = await offersApi.get(`/partner/${partnerId}`);
      set({ offers: resp.data.data || resp.data, loading: false });
    } catch (err: any) {
      console.error('❌ getOffersByPartnerId error:', err);
      set({ loading: false, error: err.response?.data?.message || err.message });
    }
  },

  // NEW: Check reservation status and points
  checkReservationStatus: async (offerId) => {
    set({ loading: true, error: null });
    try {
      const resp = await offersApi.get(`/res/status/${offerId}`);
      set({ loading: false });
      return resp.data as ReservationStatus;
    } catch (err: any) {
      console.error('❌ checkReservationStatus error:', err);
      set({ loading: false, error: err.response?.data?.message || err.message });
      return undefined;
    }
  },

  createReservation: async (offerId) => {
    set({ loading: true, error: null });
    try {
      const resp = await offersApi.post(`/res/${offerId}`);
      const reservation: Reservation = resp.data.data;
      set(state => ({
        reservations: [...state.reservations, reservation],
        loading: false
      }));
      return reservation;
    } catch (err: any) {
      console.error('❌ createReservation error:', err);
      const errorMessage = err.response?.data?.message || err.message;
      set({ loading: false, error: errorMessage });
      
      // Throw error with detailed message for UI handling
      throw new Error(errorMessage);
    }
  },

  getMyReservations: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await offersApi.get('/res/my');
      set({ reservations: resp.data.data || resp.data, loading: false });
    } catch (err: any) {
      console.error('❌ getMyReservations error:', err);
      set({ loading: false, error: err.response?.data?.message || err.message });
    }
  },
}));