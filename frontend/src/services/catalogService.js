import api from './api';

export const catalogService = {
  // Get all trips (public)
  getTrips: async () => {
    const response = await api.get('/trips');
    return response.data;
  },

  // Get trip detail (public)
  getTripDetail: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  // Get all travels (public)
  getTravels: async () => {
    const response = await api.get('/travels');
    return response.data;
  },

  // Get travel detail (public)
  getTravelDetail: async (id) => {
    const response = await api.get(`/travels/${id}`);
    return response.data;
  }
};