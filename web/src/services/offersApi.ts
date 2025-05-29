import axios from 'axios';
import { Offer } from '../types/types';
const API_BASE = "http://localhost:3000/api/offers";

export const offersApi = {
  // Admin gets all offers
  getAllOffers: async () => {
    const response = await axios.get(`${API_BASE}/offers`);
    return response.data;
  },

  // Partner gets their own offers
  getPartnerOffers: async (partnerId: string) => {
    const response = await axios.get(`${API_BASE}/offers`, {
      params: { partnerId }
    });
    return response.data;
  },

  createOffer: async (offerData: Omit<Offer, 'id'>) => {
    const response = await axios.post(`${API_BASE}/offers`, offerData);
    return response.data;
  },

  updateOffer: async (id: string, offerData: Partial<Offer>) => {
    const response = await axios.patch(`${API_BASE}/offers/${id}`, offerData);
    return response.data;
  },

  deleteOffer: async (id: string) => {
    await axios.delete(`${API_BASE}/offers/${id}`);
  }
};