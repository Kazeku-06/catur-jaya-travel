import { useState, useEffect } from 'react';
import { catalogService } from '../services/catalogService';
import { useApp } from '../store/AppContext';

export const useCatalog = () => {
  const [trips, setTrips] = useState([]);
  const [travels, setTravels] = useState([]);
  const [carterMobiles, setCarterMobiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setError } = useApp();

  // Fetch all trips
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await catalogService.getTrips();
      setTrips(response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all travels
  const fetchTravels = async () => {
    try {
      setLoading(true);
      const response = await catalogService.getTravels();
      setTravels(response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch travels');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all carter mobiles
  const fetchCarterMobiles = async () => {
    try {
      setLoading(true);
      const response = await catalogService.getCarterMobiles();
      setCarterMobiles(response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch carter mobiles');
    } finally {
      setLoading(false);
    }
  };

  // Fetch trip detail
  const fetchTripDetail = async (id) => {
    try {
      setLoading(true);
      const response = await catalogService.getTripDetail(id);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch trip detail');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch travel detail
  const fetchTravelDetail = async (id) => {
    try {
      setLoading(true);
      const response = await catalogService.getTravelDetail(id);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch travel detail');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch carter mobile detail
  const fetchCarterMobileDetail = async (id) => {
    try {
      setLoading(true);
      const response = await catalogService.getCarterMobileDetail(id);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch carter mobile detail');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    travels,
    carterMobiles,
    loading,
    fetchTrips,
    fetchTravels,
    fetchCarterMobiles,
    fetchTripDetail,
    fetchTravelDetail,
    fetchCarterMobileDetail
  };
};