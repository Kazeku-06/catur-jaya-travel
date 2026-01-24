import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import TripCard from '../components/cards/TripCard';
import SearchForm from '../components/forms/SearchForm';
import Pagination from '../components/navigation/Pagination';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Button from '../components/ui/Button';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import api, { endpoints } from '../config/api';

const Trips = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('price') || '',
    duration: searchParams.get('duration') || '',
    location: searchParams.get('location') || '',
  });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const {
    currentPage,
    totalPages,
    goToPage,
    reset: resetPagination
  } = usePagination({
    totalItems,
    itemsPerPage: 12,
    initialPage: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    fetchTrips();
  }, [currentPage, debouncedSearchQuery, filters, sortBy, sortOrder]);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (filters.category) params.set('category', filters.category);
    if (filters.priceRange) params.set('price', filters.priceRange);
    if (filters.duration) params.set('duration', filters.duration);
    if (filters.location) params.set('location', filters.location);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [debouncedSearchQuery, filters, currentPage, setSearchParams]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 12,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (debouncedSearchQuery) params.search = debouncedSearchQuery;
      if (filters.category) params.category = filters.category;
      if (filters.location) params.location = filters.location;
      if (filters.duration) params.duration = filters.duration;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        if (min) params.min_price = min;
        if (max && max !== '+') params.max_price = max;
      }

      const response = await api.get(endpoints.trips, { params });
      
      setTrips(response.data.data || []);
      setTotalItems(response.data.total || 0);
      
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    setSearchQuery(searchData.query);
    setFilters(searchData.filters);
    resetPagination();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    resetPagination();
  };

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    resetPagination();
  };

  const breadcrumbItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Paket Trip' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nama' },
    { value: 'price', label: 'Harga' },
    { value: 'rating', label: 'Rating' },
    { value: 'created_at', label: 'Terbaru' },
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <Breadcrumb items={breadcrumbItems} />
            
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Paket Trip Wisata
              </h1>
              <p className="text-lg text-gray-600">
                Temukan paket wisata terbaik untuk liburan impian Anda
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SearchForm
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              showFilters={true}
              filters={filters}
              placeholder="Cari paket trip..."
            />
          </motion.div>

          {/* Results Header */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-white rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                Menampilkan {trips.length} dari {totalItems} paket trip
                {debouncedSearchQuery && (
                  <span className="font-medium"> untuk "{debouncedSearchQuery}"</span>
                )}
              </p>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Urutkan:</span>
              <div className="flex space-x-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && (
            <>
              {trips.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {trips.map((trip, index) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <TripCard trip={trip} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Tidak ada paket trip ditemukan
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Coba ubah kata kunci pencarian atau filter yang Anda gunakan
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        category: '',
                        priceRange: '',
                        duration: '',
                        location: '',
                      });
                      resetPagination();
                    }}
                  >
                    Reset Pencarian
                  </Button>
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Trips;