import { useState } from 'react';
import { transactionService } from '../services/transactionService';
import { paymentService } from '../services/paymentService';
import { useApp } from '../store/AppContext';
import { useAuth } from '../store/AuthContext';

export const useTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { setError, setSuccessMessage } = useApp();
  const { isAuthenticated } = useAuth();

  // Create trip transaction and process payment
  const createTripTransaction = async (tripId) => {
    if (!isAuthenticated) {
      setError('Please login to make a transaction');
      return;
    }

    try {
      setLoading(true);
      
      // Create transaction
      const transactionResponse = await transactionService.createTripTransaction(tripId);
      const { snap_token } = transactionResponse.data;

      // Process payment with Midtrans
      const paymentResult = await paymentService.processPayment(snap_token);
      
      if (paymentResult.status === 'success') {
        setSuccessMessage('Payment successful! Your trip has been booked.');
        return { success: true, result: paymentResult };
      } else if (paymentResult.status === 'pending') {
        setSuccessMessage('Payment is being processed. Please wait for confirmation.');
        return { success: true, result: paymentResult };
      }
      
    } catch (error) {
      if (error.status === 'closed') {
        setError('Payment was cancelled');
      } else if (error.status === 'error') {
        setError('Payment failed. Please try again.');
      } else {
        setError(error.response?.data?.message || 'Transaction failed');
      }
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Create travel transaction and process payment
  const createTravelTransaction = async (travelId) => {
    if (!isAuthenticated) {
      setError('Please login to make a transaction');
      return;
    }

    try {
      setLoading(true);
      
      // Create transaction
      const transactionResponse = await transactionService.createTravelTransaction(travelId);
      const { snap_token } = transactionResponse.data;

      // Process payment with Midtrans
      const paymentResult = await paymentService.processPayment(snap_token);
      
      if (paymentResult.status === 'success') {
        setSuccessMessage('Payment successful! Your travel has been booked.');
        return { success: true, result: paymentResult };
      } else if (paymentResult.status === 'pending') {
        setSuccessMessage('Payment is being processed. Please wait for confirmation.');
        return { success: true, result: paymentResult };
      }
      
    } catch (error) {
      if (error.status === 'closed') {
        setError('Payment was cancelled');
      } else if (error.status === 'error') {
        setError('Payment failed. Please try again.');
      } else {
        setError(error.response?.data?.message || 'Transaction failed');
      }
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createTripTransaction,
    createTravelTransaction
  };
};