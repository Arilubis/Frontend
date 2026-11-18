
import api from './api';

class PermohonanService {
 
  async getPermohonan(params = {}) {
    try {
      const response = await api.get('/approval-request', {
        params: {
          include: 'attachments',
          ...params
        }
      });

      
      
      if (!response.data) {
        throw new Error('Empty response from permohonan API');
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch permohonan');
      }


      // ✅ Return format yang sesuai dengan API
      return {
        success: response.data.success,
        data: response.data.data || [],
        pagination: response.data.pagination || {}
      };

    } catch (error) {
      if (error.response?.status !== 403) {
        console.error('❌ Get permohonan error:', error);
      }
      throw error;
    }
  }

  async getPermohonanById(id) {
    try {
      const response = await api.get(`/approval-request/${id}`, {
        params: {
          include: 'attachments'
        }
      });


      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch document');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Get permohonan by ID error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Dokumen tidak ditemukan');
      }

      throw error;
    }
  }

  async searchPermohonan(query) {
    try {
      let allDocs = [];
      try {
        const myApprovalResponse = await this.getMyApproval({ limit: 100 });
        allDocs = [...allDocs, ...(myApprovalResponse.data || [])];
      } catch (e) {
        console.warn('⚠️ Could not fetch my approval:', e.message);
      }
      
      
      const uniqueDocs = Array.from(
        new Map(allDocs.map(doc => [doc.id, doc])).values()
      );
      
      
      if (!query || query.trim().length === 0) {
        return {
          success: true,
          data: uniqueDocs,
          pagination: {}
        };
      }
      
      const searchLower = query.toLowerCase().trim();
      
      const filtered = uniqueDocs.filter(doc => {
        const title = (doc.title || '').toLowerCase();
        const description = (doc.description || '').toLowerCase();
        const categoryName = (
          doc.categoryName || 
          doc.category?.name || 
          doc.categoryInfo?.name || 
          ''
        ).toLowerCase();
        const creatorName = (
          doc.creatorName || 
          doc.creator?.name || 
          doc.creator?.fullName || 
          doc.creator?.username ||
          doc.creatorInfo?.name ||
          doc.creatorInfo?.fullName ||
          ''
        ).toLowerCase();
        const status = (doc.status || '').toLowerCase();
        
        return (
          title.startsWith(searchLower) ||
          description.startsWith(searchLower) ||
          categoryName.startsWith(searchLower) ||
          creatorName.startsWith(searchLower) ||
          status.startsWith(searchLower)
        );
      });
    
    
      return {
        success: true,
        data: filtered,
        pagination: {}
      };
      
    } catch (error) {
      console.error('❌ Search permohonan local error:', error);
      
      return {
        success: false,
        data: [],
        pagination: {}
      };
    }
  }

  async createPermohonan(data) { // ✏️ parameter ganti dari formData ke data
    try {
      // ✏️ UBAH: Kirim JSON biasa, bukan multipart
      // File sudah ada di Objx, backend hanya terima object_ids
      const response = await api.post('/approval-request', data, {
        headers: {
          'Content-Type': 'application/json' // ➕ JSON, bukan multipart
        }
      });

      console.log('✅ Create permohonan response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to create document');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Create permohonan error:', error);
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Data tidak valid');
      }
      throw error;
    }
  }

  async createDraft(data) { // ✏️ hapus parameter files
    try {
      // ✏️ UBAH: Kirim JSON langsung, attachments sudah berisi object_ids dari Objx
      // Format data.attachments: [{ objectId, filename, size, hash }]
      const response = await api.post("/approval-request/draft", data, {
        headers: { "Content-Type": "application/json" } // ➕ JSON bukan multipart
      });

      console.log("✅ Draft created:", response.data);
      return response.data;

    } catch (error) {
      console.error("❌ Create draft error:", error);
      console.error("❌ Error details:", error.response?.data);
      throw error;
    }
  }

  async requestAttachmentUpload(approvalRequestId, fileInfo) {
    try {
      const response = await api.post(
        `/approval-request/${approvalRequestId}/attachments/request-upload`,
        {
          fileName: fileInfo.name,
          fileSize: fileInfo.size,
          mimeType: fileInfo.type || 'application/octet-stream',
          checksum: fileInfo.checksum
        },
        {
          headers:{'Content-Type': 'application/json'}
        }
      );
      return response.data;
    } catch (error) {
      console.error('Request attachment upload error:', error);
      throw error;
    }
  }

  async confirmAttachmentUpload(approvalRequestId, attachmentInfo) {
    try {
      const response = await api.post(
        `/approval-request/${approvalRequestId}/attachments/confirm-upload`,
        {
          objectId: attachmentInfo.objectId,
          fileName: attachmentInfo.fileName,
          fileSize: attachmentInfo.fileSize,
          mimeType: attachmentInfo.mimeType,
          hash:     attachmentInfo.hash,
          path:     attachmentInfo.path
        }
      );
      console.log('Confirm upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Confirm attachment upload error:', error);
      console.error('❌ Error detail:', JSON.stringify(error.response?.data));
      console.error('❌ Status:', error.response?.status);
      throw error;
    }
  }


  async updateStatus(id, status) {
    try {
 
      const response = await api.put(`/approval-request/${id}/status`, { status });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to update status');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Update status error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      if (error.response?.status === 404) {
        throw new Error('Dokumen tidak ditemukan');
      }

      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengubah status dokumen ini');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Status tidak valid');
      }

      throw error;
    }
  }

  async updatePermohonan(id, data) {
    try {
      // ✅ TAMBAH: Support FormData untuk file upload
      const config = {};
      
      if (data instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
      }
      
      const response = await api.put(`/approval-request/${id}`, data, config);

      console.log('✅ Update permohonan response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to update document');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Update permohonan error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Dokumen tidak ditemukan');
      }

      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengubah dokumen ini');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Data tidak valid');
      }

      throw error;
    }
  }

 
  async deletePermohonan(id) {
    try {
      const response = await api.delete(`/approval-request/${id}`);

      console.log('✅ Delete permohonan response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to delete document');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Delete permohonan error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Dokumen tidak ditemukan');
      }

      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk menghapus dokumen ini');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Dokumen tidak dapat dihapus');
      }

      throw error;
    }
  }


  async submitPermohonan(id) {
    try {
      const response = await api.post(`/approval-request/${id}/submit`);

      console.log('✅ Submit permohonan response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to submit document');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Submit permohonan error:', error);
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Dokumen tidak dapat disubmit');
      }

      throw error;
    }
  }

  
 async respondToApproval(id, action, notes = '') {
    try {
      const response = await api.post(`/approval-request/${id}/response`, {
        action,
        notes
      });

      console.log('✅ Respond to approval response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to process approval');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Respond to approval error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk approve/reject dokumen ini');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Approval tidak dapat diproses');
      }

      throw error;
    }
  }

  async requestRevision(id, notes = '') {
    try {
      
      const response = await api.post(`/approval-request/${id}/response`, {
        action: 'REVISION',
        notes
      });
      
      console.log('✅ Request revision response:', response.data);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to request revision');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Request revision error:', error);
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk meminta revisi dokumen ini');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Revisi tidak dapat diproses');
      }

      throw error;
    }
  }

  async submitDisposisi(approvalRequestId, data) {
    try {
      // ✅ Guard: pastikan ID tidak kosong sebelum hit API
      if (!approvalRequestId) {
        throw new Error('ID dokumen tidak valid untuk disposisi');
      }

      console.log('📤 Disposisi request:', {
        url: `/approval-request/${approvalRequestId}/disposisi`,
        body: { approverId: data.approverId, substituteId: data.substituteId, reason: data.reason }
      });

      const response = await api.post(
        `/approval-request/${approvalRequestId}/disposisi`,
        {
          approverId: data.approverId,
          substituteId: data.substituteId,
          reason: data.reason
        }
      );

      console.log('✅ Disposisi response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Gagal melakukan disposisi');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Disposisi error:', error);
      console.error('❌ Response detail:', error.response?.data);
      console.error('❌ Status:', error.response?.status);

      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mendisposisi dokumen ini');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Data disposisi tidak valid');
      }
      if (error.response?.status === 404) {
        throw new Error(
          `Endpoint tidak ditemukan. Pastikan backend mendukung: ` +
          `POST /approval-request/${approvalRequestId}/disposisi`
        );
      }

      throw error;
    }
  }

  async cancelPermohonan(id, reason = '') {
    try {
      const response = await api.post(`/approval-request/${id}/cancel`, { reason });

      console.log('✅ Cancel permohonan response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to cancel document');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Cancel permohonan error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk membatalkan dokumen ini');
      }

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Dokumen tidak dapat dibatalkan');
      }

      throw error;
    }
  }

  async getApprovalPending(params = {}) {
  try {
    const response = await api.get('/approval-request/approval-pending', { params });

    if (!response.data || !response.data.success) {
      throw new Error(response.data?.message || 'Failed to fetch approval pending');
    }

    return {
      success: response.data.success,
      data: response.data.data || [],
      pagination: response.data.pagination || {}
    };

  } catch (error) {
    if (error.response?.status !== 403) {
      console.error('❌ Get approval pending error:', error);
    }
    throw error;
  }
}

  async getMyApproval(params = {}) {
    try {
      const response = await api.get('/approval-request/my-approval', {
        params: {
          ...params,
          include: 'attachments'
        }
      });
      

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch my approvals');
      }

      return {
        success: response.data.success,
        data: response.data.data || [],
        pagination: response.data.pagination || {}
      };

    } catch (error) {
      if (error.response?.status !== 403) {
        console.error('❌ Get my approval error:', error);
        console.error('❌ Error response:', error.response?.data);
        console.error('❌ Request params:', params);
      }
      throw error;
    }
  }

  async getStatistics() {
    try {
      const response = await api.get('/approval-request/statistics');
      return response.data;
    } catch (error) {
      console.error('❌ Get statistics failed:', error);
      throw error;
    }
  }
  
  async getAttachments(id) {
    try {
      const response = await api.get(`/approval-request/${id}/attachments`);
      return response.data;
    } catch (error) {
      console.error('❌ Get attachments failed:', error);
      throw error;
    }
  }

 
  async downloadAttachment(permohonanId, attachmentId) {
    try {
      const metaRes = await api.get(
        `/approval-request/${permohonanId}/attachments/${attachmentId}/download`
      );
      const downloadUrl = metaRes.data?.data?.url || metaRes.data?.url;
      if (!downloadUrl) throw new Error('URL download tidak ditemukan');

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return downloadUrl;
    } catch (error) {
      console.error('❌ Download attachment failed:', error);
      throw error;
    }
  }

  async previewAttachment(permohonanId, attachmentId) {
    try {
      const metaRes = await api.get(
        `/approval-request/${permohonanId}/attachments/${attachmentId}/download`
      );
      return metaRes.data?.data?.url || metaRes.data?.url;
    } catch (error) {
      console.error('❌ Preview attachment failed:', error);
      throw error;
    }
  }

  async getCategories(params = {}) {
    try {
      const response = await api.get('/categories', { params });


      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch categories');
      }

      if (!Array.isArray(response.data.data)) {
        throw new Error('Invalid data format: expected array');
      }


      return response.data;

    } catch (error) {
      console.error('❌ Get categories error:', error);
      throw error;
    }
  }

  /**
   * Get approvers list
   * Endpoint: GET /users/approvers
   */
  async getApprovers(params = {}) {
    try {
      const response = await api.get('/users/approvers', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get approvers failed:', error);
      throw error;
    }
  }


  async getReviewers(params = {}) {
    try {
      const response = await api.get('/users/reviewers', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get reviewers failed:', error);
      throw error;
    }
  }


  async getApprovalHistory(id) {
    try {
      const response = await api.get(`/approval-request/${id}/history`);

      console.log('✅ Get approval history response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch approval history');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Get approval history error:', error);
      throw error;
    }
  }


  async uploadAttachment(id, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/approval-request/${id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Upload attachment response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to upload attachment');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Upload attachment error:', error);
      
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'File tidak valid');
      }

      throw error;
    }
  }


  async deleteAttachment(id, attachmentId) {
    try {
      const response = await api.delete(`/approval-request/${id}/attachments/${attachmentId}`);

      console.log('✅ Delete attachment response:', response.data);

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to delete attachment');
      }

      return response.data;

    } catch (error) {
      console.error('❌ Delete attachment error:', error);
      throw error;
    }
  }


  async getPermohonanArray(params = {}) {
    const response = await this.getPermohonan(params);
    return response.data || [];
  }

  
  async getCategoriesArray(params = {}) {
    const response = await this.getCategories(params);
    return response.data || [];
  }

  async getCategoriesArray(params = {}) {
    const response = await this.getCategories(params);
    return response.data || [];
  }

  async downloadAllAttachmentsAsZip(approvalRequestId) {
    try {
      const response = await api.get(
        `/approval-request/${approvalRequestId}/attachments/download-all`,
        { responseType: 'blob' }
      );
      return response.data; // Blob ZIP
    } catch (error) {
      console.error('❌ Download all attachments ZIP error:', error);
      if (error.response?.status === 404) {
        throw new Error('Dokumen atau file tidak ditemukan');
      }
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengunduh file ini');
      }
      throw new Error(
        error.response?.data?.message || 'Gagal mengunduh semua file'
      );
    }
  }

  async getNotificationPreference() {
    try {
      const response = await api.get('/notifications/preference');
      return response.data?.data || response.data || {};
    } catch (error) {
      console.error('❌ Get notification preference error:', error);
      throw error;
    }
  }

  async updateNotificationPreference(payload) {
    try {
      const response = await api.patch('/notifications/preference', payload);
      return response.data;
    } catch (error) {
      console.error('❌ Update notification preference error:', error);
      throw error;
    }
  }

  async getTakeovers(params = {}) {
    try {
      const response = await api.get('/approval-request/takeovers', { params });
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to fetch takeovers');
      }
      return {
        success: response.data.success,
        data: response.data.data || [],
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      if (error.response?.status !== 403) {
        console.error('❌ Get takeovers error:', error);
      }
      throw error;
    }
  }

  async takeover(id, reason) {
    try {
      const response = await api.post(`/approval-request/${id}/takeover`, { reason });
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to takeover approval request');
      }
      return response.data;
    } catch (error) {
      console.error('❌ Takeover error:', error);
      throw error;
    }
  }

  async releaseTakeover(id) {
    try {
      const response = await api.delete(`/approval-request/${id}/takeover`);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to release takeover');
      }
      return response.data;
    } catch (error) {
      console.error('❌ Release takeover error:', error);
      throw error;
    }
  }

  async adminReassignApprover(id, data) {
    try {
      const response = await api.post(`/approval-requests/${id}/admin/reassign`, data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        const response = await api.post(`/approval-request/${id}/admin/reassign`, data);
        return response.data;
      }
      throw error;
    }
  }

  async adminModifyApprovers(id, data) {
    try {
      const response = await api.post(`/approval-requests/${id}/admin/approvers`, data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        const response = await api.post(`/approval-request/${id}/admin/approvers`, data);
        return response.data;
      }
      throw error;
    }
  }

  async adminBypassLevel(id, data) {
    try {
      const response = await api.post(`/approval-requests/${id}/admin/bypass-level`, data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        const response = await api.post(`/approval-request/${id}/admin/bypass-level`, data);
        return response.data;
      }
      throw error;
    }
  }
}

export default new PermohonanService();
