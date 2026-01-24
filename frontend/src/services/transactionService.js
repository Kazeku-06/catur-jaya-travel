import api from './api';

export const transactionService = {
  // Create trip transaction (requires auth)
  createTripTransaction: async (tripId) => {
    const response = await api.post(`/transactions/trip/${tripId}`);
    return response.data;
  },

  // Create travel transaction (requires auth)
  createTravelTransaction: async (travelId) => {
    const response = await api.post(`/transactions/travel/${travelId}`);
    return response.data;
  }
};