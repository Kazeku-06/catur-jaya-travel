import api, { endpoints } from '../config/api';

export const transactionService = {
  // Create trip transaction (requires auth)
  createTripTransaction: async (tripId, bookingData) => {
    const response = await api.post(endpoints.createTripTransaction(tripId), {
      participants: bookingData.participants,
      departure_date: bookingData.departure_date,
      special_requests: bookingData.special_requests || '',
      contact_phone: bookingData.contact_phone || '',
      emergency_contact: bookingData.emergency_contact || ''
    });
    return response.data;
  },

  // Create travel transaction (requires auth)
  createTravelTransaction: async (travelId, bookingData) => {
    const response = await api.post(endpoints.createTravelTransaction(travelId), {
      passengers: bookingData.passengers,
      departure_date: bookingData.departure_date,
      pickup_location: bookingData.pickup_location || '',
      destination_address: bookingData.destination_address || '',
      contact_phone: bookingData.contact_phone || '',
      special_requests: bookingData.special_requests || ''
    });
    return response.data;
  },

  // Get user's bookings/transactions (requires auth)
  getUserBookings: async () => {
    const response = await api.get('/transactions/my-bookings');
    return response.data;
  },

  // Get specific transaction detail (requires auth)
  getTransactionDetail: async (transactionId) => {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  }
};