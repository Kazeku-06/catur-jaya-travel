import api from './api';

export const paymentService = {
  // Get Midtrans configuration
  getMidtransConfig: async () => {
    const response = await api.get('/payments/midtrans');
    return response.data;
  },

  // Load Midtrans Snap script
  loadMidtransScript: (clientKey) => {
    return new Promise((resolve, reject) => {
      if (typeof window.snap !== 'undefined' && window.snap.pay) {
        console.log('[Midtrans] Snap already loaded');
        resolve(window.snap);
        return;
      }

      const scriptId = 'midtrans-script';
      let script = document.getElementById(scriptId);

      if (script) {
        console.log('[Midtrans] Script already exists, waiting for load...');
        resolve(window.snap); // This might be risky if still loading, but simplified for now.
        return;
      }

      const midtransClientKey = clientKey || import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
      if (!midtransClientKey) {
        reject(new Error('Midtrans Client Key is missing'));
        return;
      }

      console.log('[Midtrans] Loading script with key:', midtransClientKey.substring(0, 5) + '...');

      script = document.createElement('script');
      script.id = scriptId;
      // TODO: Determine URL based on environment. For now default to sandbox.
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', midtransClientKey);

      script.onload = () => {
        console.log('[Midtrans] Script loaded successfully');
        if (window.snap) {
          resolve(window.snap);
        } else {
          reject(new Error('Midtrans Snap failed to initialize'));
        }
      };

      script.onerror = (e) => {
        console.error('[Midtrans] Script failed to load', e);
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
        onSuccess: function (result) {
          resolve({ status: 'success', result });
        },
        onPending: function (result) {
          resolve({ status: 'pending', result });
        },
        onError: function (result) {
          reject({ status: 'error', result });
        },
        onClose: function () {
          reject({ status: 'closed', message: 'Payment popup closed' });
        }
      });
    });
  }
};