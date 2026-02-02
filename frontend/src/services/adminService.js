import api from '../config/api';

export const adminService = {
  // Trip Management (JSON Only)
  trips: {
    // Get all trips (admin)
    getAll: async (params = {}) => {
      const response = await api.get('/admin/trips', { params });
      return response.data;
    },

    // Get trip detail (admin)
    getById: async (id) => {
      const response = await api.get(`/admin/trips/${id}`);
      return response.data;
    },

    // Create trip (JSON Only - Image Required)
    create: async (tripData) => {
      const response = await api.post('/admin/trips', tripData);
      return response.data;
    },

    // Update trip (JSON Only - Image Optional)
    update: async (id, tripData) => {
      const response = await api.put(`/admin/trips/${id}`, tripData);
      return response.data;
    },

    // Delete trip
    delete: async (id) => {
      const response = await api.delete(`/admin/trips/${id}`);
      return response.data;
    }
  },

  // Travel Management (JSON Only)
  travels: {
    // Get all travels (admin)
    getAll: async (params = {}) => {
      const response = await api.get('/admin/travels', { params });
      return response.data;
    },

    // Get travel detail (admin)
    getById: async (id) => {
      const response = await api.get(`/admin/travels/${id}`);
      return response.data;
    },

    // Create travel (JSON Only - Image Required)
    create: async (travelData) => {
      const response = await api.post('/admin/travels', travelData);
      return response.data;
    },

    // Update travel (JSON Only - Image Optional)
    update: async (id, travelData) => {
      const response = await api.put(`/admin/travels/${id}`, travelData);
      return response.data;
    },

    // Delete travel
    delete: async (id) => {
      const response = await api.delete(`/admin/travels/${id}`);
      return response.data;
    }
  },

  // Transaction Management
  transactions: {
    // Get all transactions (admin)
    getAll: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/transactions?${params}`);
      return response.data;
    },

    // Get transaction detail (admin)
    getById: async (id) => {
      const response = await api.get(`/admin/transactions/${id}`);
      return response.data;
    },

    // Get transaction statistics (admin)
    getStatistics: async () => {
      const response = await api.get('/admin/transactions/statistics');
      return response.data;
    }
  }
};

// Helper functions for image handling in JSON-only format
export const imageHelpers = {
  // Convert file to base64 for JSON upload
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  },

  // Validate image file
  validateImage: (file) => {
    const errors = [];
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Format file harus JPEG, PNG, JPG, atau WEBP');
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('Ukuran file maksimal 5MB');
    }
    
    return errors;
  },

  // Prepare trip data for JSON-only API
  prepareTripData: async (formData, imageFile = null, imageUrl = null) => {
    const data = {
      title: formData.title,
      description: formData.description,
      rundown: formData.rundown || [],
      facilities: formData.facilities || [],
      price: parseFloat(formData.price),
      duration: formData.duration,
      location: formData.location,
      quota: parseInt(formData.quota),
      is_active: formData.is_active !== undefined ? formData.is_active : true
    };

    // Handle image - either file upload or URL
    if (imageFile) {
      // Validate image file
      const errors = imageHelpers.validateImage(imageFile);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }
      
      // Convert to base64
      data.image_base64 = await imageHelpers.fileToBase64(imageFile);
      data.image_name = imageFile.name;
    } else if (imageUrl) {
      data.image_url = imageUrl;
    }

    return data;
  },

  // Prepare travel data for JSON-only API
  prepareTravelData: async (formData, imageFile = null, imageUrl = null) => {
    const data = {
      origin: formData.origin,
      destination: formData.destination,
      vehicle_type: formData.vehicle_type,
      rundown: formData.rundown || [],
      facilities: formData.facilities || [],
      price_per_person: parseFloat(formData.price_per_person),
      is_active: formData.is_active !== undefined ? formData.is_active : true
    };

    // Handle image - either file upload or URL
    if (imageFile) {
      // Validate image file
      const errors = imageHelpers.validateImage(imageFile);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }
      
      // Convert to base64
      data.image_base64 = await imageHelpers.fileToBase64(imageFile);
      data.image_name = imageFile.name;
    } else if (imageUrl) {
      data.image_url = imageUrl;
    }

    return data;
  }
};