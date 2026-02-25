import api from './api';

export const paymentService = {
  // Get bank account information for manual transfer
  getBankAccounts: () => {
    return {
      bca: {
        bank: 'BCA',
        accountNumber: '0620708682',
        accountName: 'Deriawan',
      },
      mandiri: {
        bank: 'Mandiri',
        accountNumber: '1480005349959 ',
        accountName: 'Deriawan',
      }
    };
  },

  // Upload payment proof
  uploadPaymentProof: async (bookingId, file, bankName = null) => {
    const formData = new FormData();
    formData.append('payment_proof', file);
    if (bankName) {
      formData.append('bank_name', bankName);
    }

    const response = await api.post(`/bookings/${bookingId}/payment-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};