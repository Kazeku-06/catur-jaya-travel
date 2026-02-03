import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
import Input from '../ui/Input';
import Button from '../ui/Button';

const SearchForm = ({ 
  onSearch, 
  placeholder = "Cari destinasi, paket wisata...",
  showFilters = false,
  filters = {},
  onFilterChange,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: '',
    priceRange: '',
    duration: '',
    location: '',
    ...filters
  });

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      query: searchQuery,
      filters: localFilters
    });
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: '',
      duration: '',
      location: '',
    };
    setLocalFilters(clearedFilters);
    setSearchQuery('');
    onFilterChange?.(clearedFilters);
    onSearch({ query: '', filters: clearedFilters });
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 min-w-0">
            <Input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            <Button type="submit" variant="primary" className="flex-shrink-0">
              Cari
            </Button>
            
            {showFilters && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex-shrink-0"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                }
              >
                <span className="hidden sm:inline">Filter</span>
                <span className="sm:hidden">
                  {showAdvancedFilters ? 'Tutup' : 'Filter'}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && showAdvancedFilters && (
          <motion.div
            className="pt-4 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kategori
                </label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Semua Kategori</option>
                  <option value="wisata-alam">Wisata Alam</option>
                  <option value="wisata-budaya">Wisata Budaya</option>
                  <option value="wisata-kuliner">Wisata Kuliner</option>
                  <option value="wisata-religi">Wisata Religi</option>
                  <option value="wisata-petualangan">Wisata Petualangan</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rentang Harga
                </label>
                <select
                  value={localFilters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Semua Harga</option>
                  <option value="0-500000">Di bawah Rp 500.000</option>
                  <option value="500000-1000000">Rp 500.000 - Rp 1.000.000</option>
                  <option value="1000000-2000000">Rp 1.000.000 - Rp 2.000.000</option>
                  <option value="2000000-5000000">Rp 2.000.000 - Rp 5.000.000</option>
                  <option value="5000000+">Di atas Rp 5.000.000</option>
                </select>
              </div>

              {/* Duration Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Durasi
                </label>
                <select
                  value={localFilters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Semua Durasi</option>
                  <option value="1">1 Hari</option>
                  <option value="2-3">2-3 Hari</option>
                  <option value="4-7">4-7 Hari</option>
                  <option value="7+">Lebih dari 7 Hari</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Lokasi
                </label>
                <select
                  value={localFilters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="">Semua Lokasi</option>
                  <option value="jakarta">Jakarta</option>
                  <option value="bandung">Bandung</option>
                  <option value="yogyakarta">Yogyakarta</option>
                  <option value="surabaya">Surabaya</option>
                  <option value="bali">Bali</option>
                  <option value="lombok">Lombok</option>
                  <option value="malang">Malang</option>
                  <option value="semarang">Semarang</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Clear Filters */}
        {showFilters && (Object.values(localFilters).some(value => value !== '') || searchQuery) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-600">
              {Object.values(localFilters).filter(value => value !== '').length > 0 && (
                <span>
                  {Object.values(localFilters).filter(value => value !== '').length} filter aktif
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Semua Filter
            </Button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default SearchForm;