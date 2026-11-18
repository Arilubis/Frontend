import api from './api';

class ApproverService {

  async getApprovers(params = {}) {
    try {
      const response = await api.get('/users/approvers', { params });

      console.log('✅ Approvers API Response:', response.data);
      
      if (!response.data) {
        throw new Error('Empty response from approvers API');
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch approvers');
      }

      if (!Array.isArray(response.data.data)) {
        throw new Error('Invalid data format: expected array');
      }

      console.log(`✅ Loaded ${response.data.data.length} approvers`);
      
      return response.data;

    } catch (error) {
      console.error('❌ Get approvers error:', error);
      
      if (error.response?.status === 403) {
        const customError = new Error('Akses ditolak. Anda tidak memiliki izin.');
        customError.status = 403;
        throw customError;
      }

      if (error.response?.status === 401) {
        const customError = new Error('Autentikasi diperlukan. Silakan login kembali.');
        customError.status = 401;
        throw customError;
      }

      throw error;
    }
  }

 
  async getReviewers(params = {}) {
    try {
      const response = await api.get('/users/reviewers', { params });

      console.log('✅ Reviewers API Response:', response.data);
      
      if (!response.data) {
        throw new Error('Empty response from reviewers API');
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch reviewers');
      }

      if (!Array.isArray(response.data.data)) {
        throw new Error('Invalid data format: expected array');
      }

      console.log(`✅ Loaded ${response.data.data.length} reviewers`);
      
      return response.data;

    } catch (error) {
      console.error('❌ Get reviewers error:', error);
      
      if (error.response?.status === 403) {
        const customError = new Error('Akses ditolak. Anda tidak memiliki izin.');
        customError.status = 403;
        throw customError;
      }

      if (error.response?.status === 401) {
        const customError = new Error('Autentikasi diperlukan. Silakan login kembali.');
        customError.status = 401;
        throw customError;
      }

      throw error;
    }
  }

  async getApproversArray(params = {}) {
    const response = await this.getApprovers(params);
    return response.data || [];
  }

 
  async getReviewersArray(params = {}) {
    const response = await this.getReviewers(params);
    return response.data || [];
  }
}

export default new ApproverService();