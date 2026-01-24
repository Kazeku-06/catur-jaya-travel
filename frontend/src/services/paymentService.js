import api from './api';

export const paymentService = {
  // Get Midtrans configuration
  getMidtransConfig: async () => {
    const response = await api.get('/payments/midtrans');
    return response.data;
  },

  // Load Midtrans Snap script
  loadMidtransScript: () => {
    return new Promise((resolve, reject) => {
      if (window.snap) {
        resolve(window.snap);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
      
      script.onload = () => {
        if (window.snap) {
          resolve(window.snap);
        } else {
          reject(new Error('Midtrans Snap failed to load'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Midtrans script'));
      };
      
      document.head.appendChild(script);
    });
  },

  // Process payment with Midtrans Snap
  processPayment: async (snapToken) => {
    const snap = await paymentService.loadMidtransScript();
    
    return new Promise((resolve, reject) => {
      snap.pay(snapToken, {
        onSuccess: function(result) {
          resolve({ status: 'success', result });
        },
        onPending: function(result) {
          resolve({ status: 'pending', result });
        },
        onError: function(result) {
          reject({ status: 'error', result });
        },
        onClose: function() {
          reject({ status: 'closed', message: 'Payment popup closed' });
        }
      });
    });
  }
};