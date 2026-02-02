import api from './api';

export const paymentService = {
  // Get bank account information for manual transfer
  getBankAccounts: () => {
    return {
      bca: {
        bank: 'BCA',
        accountNumber: '1234567890',
        accountName: 'PT Travel Indonesia',
      },
      mandiri: {
        bank: 'Mandiri',
        accountNumber: '0987654321',
        accountName: 'PT Travel Indonesia',
      }
    };
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
};