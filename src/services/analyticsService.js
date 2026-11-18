import api from './api';

export const analyticsService = {
  /**
   * Mengambil ringkasan platform akses (Web vs Mobile App, Top Devices, Persentase)
   * @param {Object} params - { startDate, endDate }
   */
  async getSummary(params = {}) {
    const response = await api.get('/audit/client-type/summary', { params });
    return response.data;
  },

  /**
   * Mengambil tren platform akses harian atau mingguan
   * @param {Object} params - { startDate, endDate, granularity: 'day' | 'week' }
   */
  async getTimeseries(params = {}) {
    const response = await api.get('/audit/client-type/timeseries', { params });
    return response.data;
  },

  /**
   * Mengambil daftar user per platform akses
   * @param {Object} params - { clientType: 'web' | 'mobile_app', page: number, limit: number }
   */
  async getUsers(params = {}) {
    const response = await api.get('/audit/client-type/users', { params });
    return response.data;
  },

  /**
   * Mengambil histori sesi login untuk satu user tertentu
   * @param {string|number} userId
   */
  async getUserSessionHistory(userId) {
    const response = await api.get(`/audit/client-type/users/${userId}`);
    return response.data;
  },

  /**
   * Mengambil daftar user multi-platform (login dari Web dan Mobile App)
   */
  async getMultiPlatformUsers() {
    const response = await api.get('/audit/client-type/multi-platform');
    return response.data;
  }
};

export default analyticsService;
