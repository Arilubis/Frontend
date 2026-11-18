import api from '@/api'

export const documentService = {
  

  async createDocument(formData) {
    try {
      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Create document error:', error)
      throw error
    }
  },


  async getDocuments(params = {}) {
    try {
      const response = await api.get('/documents', { params })
      return response.data
    } catch (error) {
      console.error('Get documents error:', error)
      throw error
    }
  },

 
  async getDocumentDetail(id) {
    try {
      const response = await api.get(`/documents/${id}`)
      return response.data
    } catch (error) {
      console.error('Get document detail error:', error)
      throw error
    }
  },

  /**
   * 4. APPROVE DOCUMENT
   * Approve dokumen di level saat ini
   */
  async approveDocument(id, notes = '') {
    try {
      const response = await api.patch(`/documents/${id}/approve`, { notes })
      return response.data
    } catch (error) {
      console.error('Approve document error:', error)
      throw error
    }
  },

  /**
   * 5. REJECT DOCUMENT
   * Reject dokumen dengan alasan
   */
  async rejectDocument(id, reason) {
    try {
      const response = await api.patch(`/documents/${id}/reject`, { reason })
      return response.data
    } catch (error) {
      console.error('Reject document error:', error)
      throw error
    }
  },

  /**
   * 6. BULK APPROVE
   * Approve multiple dokumen sekaligus
   */
  async bulkApprove(documentIds, notes = '') {
    try {
      const response = await api.post('/documents/bulk-approve', {
        documentIds,
        notes
      })
      return response.data
    } catch (error) {
      console.error('Bulk approve error:', error)
      throw error
    }
  },

  /**
   * 7. GET ARCHIVED DOCUMENTS
   * Ambil dokumen yang sudah archived
   */
  async getArchivedDocuments(params = {}) {
    try {
      const response = await api.get('/documents/archive', { params })
      return response.data
    } catch (error) {
      console.error('Get archived documents error:', error)
      throw error
    }
  },

  /**
   * 8. DOWNLOAD DOCUMENT
   * Download file dokumen
   */
  async downloadDocument(id) {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from header atau default
      const contentDisposition = response.headers['content-disposition']
      let filename = 'document.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) filename = filenameMatch[1]
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return { success: true, filename }
    } catch (error) {
      console.error('Download document error:', error)
      throw error
    }
  },

  /**
   * 9. MARK AS REVIEWED
   * Tandai dokumen sudah dibaca
   */
  async markAsReviewed(id) {
    try {
      const response = await api.patch(`/documents/${id}/mark-reviewed`)
      return response.data
    } catch (error) {
      console.error('Mark as reviewed error:', error)
      throw error
    }
  },

  /**
   * 10. GET DOCUMENT HISTORY
   * Ambil audit trail dokumen
   */
  async getDocumentHistory(id) {
    try {
      const response = await api.get(`/documents/${id}/history`)
      return response.data
    } catch (error) {
      console.error('Get document history error:', error)
      throw error
    }
  },

  /**
   * 11. EXPORT REPORT
   * Export dokumen ke Excel/CSV
   */
  async exportReport(format = 'xlsx', filters = {}) {
    try {
      const response = await api.post('/documents/export', {
        format,
        filters
      })
      return response.data
    } catch (error) {
      console.error('Export report error:', error)
      throw error
    }
  }
}