import api from './api';

class CategoryService {
  /**
   * Get list of categories from backend
   * Endpoint: GET /categories
   */

  /* async getCategories(params = {}) {
    try {
      // ✅ CALL BACKEND API - No hardcode, pure API call
      const response = await api.get('/categories', { params });

      console.log('✅ Categories loaded from API:', response.data);

      // ✅ VALIDATE RESPONSE STRUCTURE
      if (!response.data) {
        throw new Error('Empty response from categories API');
      }

      // ✅ Handle different response structures
      // Case 1: Response has success flag and data array
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data;
      }

      // Case 2: Response is direct array
      if (Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data
        };
      }

      // ✅ Invalid structure
      throw new Error('Invalid response structure from categories API');

    } catch (error) {
      console.error('❌ Get categories error:', error);
      
      // ✅ IMPROVED ERROR HANDLING WITH SPECIFIC MESSAGES
      if (error.response?.status === 403) {
        const customError = new Error('Access denied. You do not have permission to view categories.');
        customError.status = 403;
        customError.isPermissionError = true;
        throw customError;
      }

      if (error.response?.status === 404) {
        const customError = new Error('Categories endpoint not found. Please check backend configuration.');
        customError.status = 404;
        throw customError;
      }

      if (error.response?.status === 401) {
        const customError = new Error('Authentication required. Please login again.');
        customError.status = 401;
        throw customError;
      }

      if (error.code === 'ECONNREFUSED') {
        const customError = new Error('Cannot connect to backend server. Please ensure backend is running.');
        customError.code = 'ECONNREFUSED';
        throw customError;
      }

      // Re-throw original error for other cases
      throw error;
    }
  } */

  async getCategories(params = {}) {
    try {
      // ✅ CALL BACKEND API
      const response = await api.get('/categories', { params });

      // 🕵️ DEBUGGING (Diletakkan paling atas agar pasti muncul jika API 200)
      console.log('🔍 DATA TYPE:', typeof response?.data);
      console.log('🔍 RAW DATA FROM SERVER:', response?.data);
      console.log('✅ API HIT SUCCESS: /categories');

      // ✅ VALIDATE RESPONSE EXISTENCE
      if (!response?.data) {
        throw new Error('Empty response from categories API');
      }

      // Ambil data mentah (rawItems) dari berbagai kemungkinan struktur
      let rawItems = [];
      if (Array.isArray(response.data)) {
        rawItems = response.data;
      } else if (response.data?.success && Array.isArray(response.data?.data)) {
        rawItems = response.data.data;
      } else if (response.data?.data && Array.isArray(response.data?.data)) {
        rawItems = response.data.data;
      } else if (response.data?.categories && Array.isArray(response.data?.categories)) {
        rawItems = response.data.categories;
      } else {
        // Jika data ada tapi bukan array (misal object tunggal), bungkus jadi array
        if (typeof response.data === 'object' && response.data !== null) {
          rawItems = [response.data];
        } else {
          throw new Error('Invalid response structure from categories API');
        }
      }

      // ✅ NORMALISASI (Case-Sensitive Fix)
      // Memastikan template Vue yang memanggil cat.id dan cat.name tetap jalan 
      // meskipun di server Linux/DB kolomnya jadi ID atau NAME
      const normalizedData = rawItems.map(item => ({
        id: item?.id ?? item?.ID ?? item?.Id ?? null,
        name: item?.name ?? item?.NAME ?? item?.Name ?? 'Unknown'
      }));

      console.log('📊 NORMALIZED DATA READY:', normalizedData);

      // ✅ RETURN DENGAN STRUCTURE YANG DIHARAPKAN FRONTEND
      return {
        success: true,
        data: normalizedData
      };

    } catch (error) {
      console.error('❌ Get categories error:', error);
      
      // ✅ IMPROVED ERROR HANDLING
      if (error.response?.status === 403) {
        const customError = new Error('Access denied. You do not have permission to view categories.');
        customError.status = 403;
        customError.isPermissionError = true;
        throw customError;
      }

      if (error.response?.status === 404) {
        const customError = new Error('Categories endpoint not found. Please check backend configuration.');
        customError.status = 404;
        throw customError;
      }

      if (error.response?.status === 401) {
        const customError = new Error('Authentication required. Please login again.');
        customError.status = 401;
        throw customError;
      }

      if (error.code === 'ECONNREFUSED') {
        const customError = new Error('Cannot connect to backend server. Please ensure backend is running.');
        customError.code = 'ECONNREFUSED';
        throw customError;
      }

      throw error;
    }
  }

  /**
   * Get single category by ID from backend
   * Endpoint: GET /categories/:id
   */
  async getCategoryById(id) {
    try {
      // ✅ VALIDATE INPUT
      if (!id) {
        throw new Error('Category ID is required');
      }

      // ✅ CALL BACKEND API
      const response = await api.get(`/categories/${id}`);

      console.log(`✅ Category ${id} loaded from API:`, response.data);

      // ✅ VALIDATE RESPONSE
      if (!response.data) {
        throw new Error(`No data returned for category ${id}`);
      }

      return response.data;

    } catch (error) {
      console.error(`❌ Get category ${id} error:`, error);
      
      // ✅ SPECIFIC ERROR HANDLING
      if (error.response?.status === 404) {
        const customError = new Error(`Category with ID ${id} not found`);
        customError.status = 404;
        throw customError;
      }

      if (error.response?.status === 403) {
        const customError = new Error('Access denied. You do not have permission to view this category.');
        customError.status = 403;
        throw customError;
      }

      // Re-throw original error
      throw error;
    }
  }

  /**
   * Create new category (Admin only)
   * Endpoint: POST /categories
   */
  async createCategory(data) {
    try {
      // ✅ VALIDATE INPUT
      if (!data.name) {
        throw new Error('Category name is required');
      }

      // ✅ CALL BACKEND API
      const response = await api.post('/categories', data);

      console.log('✅ Category created:', response.data);

      return response.data;

    } catch (error) {
      console.error('❌ Create category error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. Only admins can create categories.');
      }

      if (error.response?.status === 400) {
        const message = error.response?.data?.message || 'Invalid category data';
        throw new Error(message);
      }

      throw error;
    }
  }

  /**
   * Update category (Admin only)
   * Endpoint: PUT /categories/:id
   */
  async updateCategory(id, data) {
    try {
      // ✅ VALIDATE INPUT
      if (!id) {
        throw new Error('Category ID is required');
      }

      // ✅ CALL BACKEND API
      const response = await api.put(`/categories/${id}`, data);

      console.log(`✅ Category ${id} updated:`, response.data);

      return response.data;

    } catch (error) {
      console.error(`❌ Update category ${id} error:`, error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. Only admins can update categories.');
      }

      if (error.response?.status === 404) {
        throw new Error(`Category with ID ${id} not found`);
      }

      throw error;
    }
  }

  /**
   * Delete category (Admin only)
   * Endpoint: DELETE /categories/:id
   */
  async deleteCategory(id) {
    try {
      // ✅ VALIDATE INPUT
      if (!id) {
        throw new Error('Category ID is required');
      }

      // ✅ CALL BACKEND API
      const response = await api.delete(`/categories/${id}`);

      console.log(`✅ Category ${id} deleted:`, response.data);

      return response.data;

    } catch (error) {
      console.error(`❌ Delete category ${id} error:`, error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. Only admins can delete categories.');
      }

      if (error.response?.status === 404) {
        throw new Error(`Category with ID ${id} not found`);
      }

      throw error;
    }
  }
}

export default new CategoryService();