import api from './api';

export const bookingService = {
  // Create trip booking
  createTripBooking: async (tripId, bookingData) => {
    const response = await api.post(`/bookings/trip/${tripId}`, bookingData);
    return response.data;
  },

  // Create travel booking
  createTravelBooking: async (travelId, bookingData) => {
    const response = await api.post(`/bookings/travel/${travelId}`, bookingData);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  // Get booking detail
  getBookingDetail: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Upload payment proof
  uploadPaymentProof: async (bookingId, file) => {
    const formData = new FormData();
    formData.append('payment_proof', file);

    const response = await api.post(`/bookings/${bookingId}/payment-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download official ticket
  downloadTicket: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/download-ticket`, {
      responseType: 'blob', // Important for file download
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'tiket-resmi.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  },
};