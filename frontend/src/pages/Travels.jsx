import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import TravelCard from '../components/cards/TravelCard';
import SearchForm from '../components/forms/SearchForm';
import Pagination from '../components/navigation/Pagination';
import Breadcrumb from '../components/navigation/Breadcrumb';
import Button from '../components/ui/Button';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import api, { endpoints } from '../config/api';

const Travels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [travels, setTravels] = useState([]);
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
    fetchTravels();
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

  const fetchTravels = async () => {
    try {
      setLoading(true);
      
      const response = await api.get(endpoints.travels);
      
      // Backend response: { message: "...", data: [...] }
      const travelsData = response.data.data || [];
      
      // Filter di frontend karena backend mungkin belum support filtering
      let filteredTravels = travelsData;
      
      if (debouncedSearchQuery) {
        filteredTravels = filteredTravels.filter(travel => 
          travel.origin?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          travel.destination?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          travel.vehicle_type?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }
      
      if (filters.location) {
        filteredTravels = filteredTravels.filter(travel => 
          travel.origin?.toLowerCase().includes(filters.location.toLowerCase()) ||
          travel.destination?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        filteredTravels = filteredTravels.filter(travel => {
          const price = parseFloat(travel.price_per_person);
          if (min && max && max !== '+') {
            return price >= parseFloat(min) && price <= parseFloat(max);
          } else if (min) {
            return price >= parseFloat(min);
          }
          return true;
        });
      }
      
      // Sorting di frontend
      if (sortBy === 'price') {
        filteredTravels.sort((a, b) => {
          const priceA = parseFloat(a.price_per_person);
          const priceB = parseFloat(b.price_per_person);
          return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
      } else if (sortBy === 'name') {
        filteredTravels.sort((a, b) => {
          const nameA = `${a.origin} - ${a.destination}`;
          const nameB = `${b.origin} - ${b.destination}`;
          return sortOrder === 'asc' 
            ? nameA.localeCompare(nameB) 
            : nameB.localeCompare(nameA);
        });
      }
      
      // Pagination di frontend
      const itemsPerPage = 12;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedTravels = filteredTravels.slice(startIndex, endIndex);
      
      setTravels(paginatedTravels);
      setTotalItems(filteredTravels.length);
      
    } catch (error) {
      console.error('Error fetching travels:', error);
      setTravels([]);
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
    { label: 'Travel Antar Kota' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nama' },
    { value: 'price', label: 'Harga' },
    { value: 'departure_date', label: 'Tanggal Keberangkatan' },
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
                Travel Antar Kota
              </h1>
              <p className="text-lg text-gray-600">
                Perjalanan nyaman dan aman ke berbagai kota di Indonesia
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
              placeholder="Cari rute travel..."
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
                Menampilkan {travels.length} dari {totalItems} rute travel
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
              {travels.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {travels.map((travel, index) => (
                    <motion.div
                      key={travel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <TravelCard travel={travel} />
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Tidak ada rute travel ditemukan
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

export default Travels;