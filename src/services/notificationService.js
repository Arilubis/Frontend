import api from './api';

export const notificationService = {
  /**
   * Mengambil semua histori log notifikasi dengan opsi filter & paginasi
   * @param {Object} params - { channel, status, recipient, startDate, endDate, page, limit }
   */
  async getLogs(params = {}) {
    const response = await api.get('/notifications/admin/logs', { params });
    return response.data;
  },

  /**
   * Mengambil log notifikasi yang gagal kirim / bermasalah saja
   * @param {Object} params - { startDate, endDate, page, limit }
   */
  async getFailedLogs(params = {}) {
    const response = await api.get('/notifications/admin/failed', { params });
    return response.data;
  },

  /**
   * Mengambil statistik pengiriman notifikasi (Email, WhatsApp, Delivery rate, 24h)
   * @param {Object} params - { startDate, endDate }
   */
  async getStats(params = {}) {
    const response = await api.get('/notifications/admin/stats', { params });
    return response.data;
  },

  /**
   * Mengambil monitoring kegagalan berkas attachment dari API IBS
   * @param {Object} params - { startDate, endDate, page, limit }
   */
  async getAttachmentFailures(params = {}) {
    const response = await api.get('/notifications/admin/attachment-failures', { params });
    return response.data;
  },

  /**
   * Mengirim pesan broadcast ke pengguna massal
   * @param {Object} payload - { targetType, targetRoles, targetUserIds, channels, title, body, imageUrl }
   */
  async sendBroadcast(payload) {
    const response = await api.post('/notifications/admin/broadcast', payload);
    return response.data;
  }
};

export default notificationService;
