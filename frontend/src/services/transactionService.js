import api from '../config/api';

export const transactionService = {
  // Create trip booking (updated to use new booking system)
  createTripTransaction: async (tripId, bookingData) => {
    const response = await api.post(`/bookings/trip/${tripId}`, {
      nama_pemesan: bookingData.nama_pemesan,
      nomor_hp: bookingData.nomor_hp,
      tanggal_keberangkatan: bookingData.tanggal_keberangkatan,
      catatan_tambahan: bookingData.catatan_tambahan || ''
    });
    return response.data;
  },

  // Create travel booking (updated to use new booking system)
  createTravelTransaction: async (travelId, bookingData) => {
    const response = await api.post(`/bookings/travel/${travelId}`, {
      nama_pemesan: bookingData.nama_pemesan,
      nomor_hp: bookingData.nomor_hp,
      tanggal_keberangkatan: bookingData.tanggal_keberangkatan,
      passengers: bookingData.passengers,
      catatan_tambahan: bookingData.catatan_tambahan || ''
    });
    return response.data;
  },

  // Get user's bookings (updated to use new booking system)
  getUserBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  // Get booking detail (updated to use new booking system)
  getTransactionDetail: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },
};