import api from './api';

/**
 * Service untuk mengelola fitur User Impersonation (Admin)
 * Base endpoint: /auth/impersonate
 */
class ImpersonateService {
  /**
   * Memulai sesi impersonate target user
   * @param {string} targetUserId - ID user yang akan diimpersonate
   * @param {object} options - { mode: 'READ_ONLY' | 'FULL_ACCESS', adminPassword?: string }
   */
  async startImpersonate(targetUserId, { mode = 'READ_ONLY', adminPassword = null } = {}) {
    try {
      const payload = {
        targetUserId,
        mode,
        ...(adminPassword ? { adminPassword } : {})
      };

      const response = await api.post(`/auth/impersonate/start/${targetUserId}`, payload);
      return response.data;
    } catch (error) {
      console.error('❌ Start impersonate error:', error);
      throw error;
    }
  }

  /**
   * Menghentikan sesi impersonate dan menghapus cookie impersonateToken
   */
  async stopImpersonate() {
    try {
      const response = await api.post('/auth/impersonate/stop');
      return response.data;
    } catch (error) {
      console.error('❌ Stop impersonate error:', error);
      throw error;
    }
  }

  /**
   * Cek status impersonate aktif saat ini (berguna saat reload / re-init)
   */
  async getStatus() {
    try {
      const response = await api.get('/auth/impersonate/status');
      return response.data;
    } catch (error) {
      console.error('❌ Get impersonate status error:', error);
      throw error;
    }
  }

  /**
   * Mengambil daftar sesi impersonate aktif (khusus ADMIN untuk monitoring)
   */
  async getSessions() {
    try {
      const response = await api.get('/auth/impersonate/sessions');
      return response.data;
    } catch (error) {
      console.error('❌ Get impersonate sessions error:', error);
      throw error;
    }
  }
}

export default new ImpersonateService();

