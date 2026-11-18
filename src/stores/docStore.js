import { defineStore } from 'pinia'

// ⚙️ MODE CONFIGURATION
// Set ini ke 'api' kalau backend sudah ready
// Set ke 'dummy' untuk development tanpa backend
const MODE = 'dummy' // 'dummy' atau 'api'

// Import service hanya jika MODE = 'api'
let documentService = null
if (MODE === 'api') {
  try {
    documentService = require('@/services/documentService').documentService
  } catch (error) {
    console.warn('documentService not found, falling back to dummy mode')
  }
}

export const useDocStore = defineStore('docStore', {
  state: () => ({
    // Documents list
    documents: [
      { 
        id: 1, 
        number: 'DOC-2025-001',
        title: 'Pengadaan Laptop IT Medan', 
        sender: 'Adra Ichsan', 
        uploader: 'Adra Ichsan',
        category: 'Gaji Masuk',
        status: 'In Progress', 
        amount: '52.000.000', 
        priority: 'High',
        note: 'Unit dibutuhkan segera untuk onboarding karyawan baru.',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isReviewed: false,
        history: [
          { step: 'Verifikasi Admin', status: 'completed', desc: 'Dokumen valid' },
          { step: 'Persetujuan Manager', status: 'current', desc: 'Menunggu review manager' },
          { step: 'Final Finance Check', status: 'pending', desc: 'Belum diproses' }
        ],
        createdAt: '2025-01-02T10:30:00Z',
        updatedAt: '2025-01-02T11:45:00Z'
      },
      { 
        id: 2, 
        number: 'DOC-2025-002',
        title: 'Revisi Kontrak Vendor A', 
        sender: 'Budi Santoso', 
        uploader: 'Budi Santoso',
        category: 'Surat Izin',
        status: 'Completed', 
        amount: '12.500.000', 
        priority: 'Medium',
        note: 'Perubahan pasal 4 mengenai termin pembayaran.',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isReviewed: true,
        history: [
          { step: 'Verifikasi Admin', status: 'completed', desc: 'Selesai' },
          { step: 'Persetujuan Manager', status: 'completed', desc: 'Disetujui' },
          { step: 'Final Finance Check', status: 'completed', desc: 'Dana Cair' }
        ],
        createdAt: '2025-01-01T09:00:00Z',
        updatedAt: '2025-01-01T15:30:00Z'
      },
      { 
        id: 3, 
        number: 'DOC-2025-003',
        title: 'Izin Perjalanan Dinas Surabaya', 
        sender: 'Adra Ichsan', 
        uploader: 'Adra Ichsan',
        category: 'Surat Izin',
        status: 'In Progress', 
        amount: '3.500.000', 
        priority: 'Low',
        note: 'Kunjungan lapangan ke cabang Surabaya selama 3 hari.',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isReviewed: false,
        history: [
          { step: 'Verifikasi Admin', status: 'current', desc: 'Menunggu tanda tangan HRD' },
          { step: 'Persetujuan Manager', status: 'pending', desc: 'Belum dimulai' },
          { step: 'Final Finance Check', status: 'pending', desc: 'Belum dimulai' }
        ],
        createdAt: '2025-01-02T08:15:00Z',
        updatedAt: '2025-01-02T08:15:00Z'
      }
    ],
    
    // Current document detail
    currentDocument: null,
    
    // Archived documents
    archivedDocuments: [],
    
    // Loading state
    loading: false,
    
    // Error state
    error: null,
    
    // Pagination (untuk API mode)
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalDocuments: 0,
      limit: 10
    }
  }),

  getters: {
    // Total pending documents
    totalPending: (state) => state.documents.filter(d => d.status === 'In Progress').length,
    
    // Total approved documents
    totalApproved: (state) => state.documents.filter(d => d.status === 'Completed').length,
    
    // Total rejected documents
    totalRejected: (state) => state.documents.filter(d => d.status === 'Rejected').length,

    // Urgent documents (High Priority + In Progress)
    urgentDocs: (state) => state.documents.filter(d => d.priority === 'High' && d.status === 'In Progress'),
    
    // Get documents by status
    documentsByStatus: (state) => (status) => {
      return state.documents.filter(doc => doc.status === status)
    },

    // Get pending count
    pendingCount: (state) => {
      return state.documents.filter(doc => doc.status === 'Pending' || doc.status === 'In Progress').length
    },

    // Get in progress count
    inProgressCount: (state) => {
      return state.documents.filter(doc => doc.status === 'In Progress').length
    }
  },

  actions: {
    /**
     * ========================================
     * DUMMY MODE ACTIONS (Development)
     * ========================================
     */
    
    // Update document status (Dummy mode)
    updateStatusDummy(id, newStatus, reason = '') {
      const doc = this.documents.find(d => d.id == id)
      if (doc) {
        doc.status = newStatus
        doc.updatedAt = new Date().toISOString()
        
        // Update history timeline
        if (newStatus === 'Completed') {
          doc.history[1].status = 'completed'
          doc.history[1].desc = 'Disetujui'
          if (doc.history[2]) {
            doc.history[2].status = 'current'
          }
        } else if (newStatus === 'Rejected') {
          doc.history[1].status = 'rejected'
          doc.history[1].desc = `Ditolak: ${reason}`
        }
      }
    },
    
    // Mark as reviewed (Dummy mode)
    markAsReviewedDummy(id) {
      const doc = this.documents.find(d => d.id == id)
      if (doc) {
        doc.isReviewed = true
      }
    },
    
    // Create document (Dummy mode)
    createDocumentDummy(formData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newDoc = {
            id: this.documents.length + 1,
            number: `DOC-2025-${String(this.documents.length + 1).padStart(3, '0')}`,
            title: formData.get('title') || formData.title,
            category: formData.get('category') || formData.category,
            description: formData.get('description') || formData.description,
            sender: 'Current User',
            uploader: 'Current User',
            status: 'Pending',
            amount: 'Rp 0',
            priority: 'Medium',
            note: formData.get('description') || formData.description || 'No description',
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            isReviewed: false,
            history: [
              { step: 'Document Created', status: 'completed', desc: 'Dokumen dibuat' },
              { step: 'Verifikasi Admin', status: 'current', desc: 'Menunggu verifikasi' },
              { step: 'Persetujuan Manager', status: 'pending', desc: 'Belum dimulai' }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          this.documents.unshift(newDoc)
          
          resolve({
            status: 201,
            message: 'Document created successfully (dummy)',
            data: newDoc
          })
        }, 1000)
      })
    },

    /**
     * ========================================
     * API MODE ACTIONS (Production)
     * ========================================
     */
    
    // Fetch documents from API
    async fetchDocumentsAPI(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await documentService.getDocuments(params)
        
        this.documents = response.data.documents
        this.pagination = response.data.pagination
        
        return response
      } catch (error) {
        this.error = error.message
        console.error('Fetch documents error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Fetch document detail from API
    async fetchDocumentDetailAPI(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await documentService.getDocumentDetail(id)
        this.currentDocument = response.data
        return response
      } catch (error) {
        this.error = error.message
        console.error('Fetch document detail error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Create document via API
    async createDocumentAPI(formData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await documentService.createDocument(formData)
        
        // Add to documents list
        this.documents.unshift(response.data)
        
        return response
      } catch (error) {
        this.error = error.message
        console.error('Create document error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Approve document via API
    async approveDocumentAPI(id, notes) {
      this.loading = true
      this.error = null
      
      try {
        const response = await documentService.approveDocument(id, notes)
        
        // Update document in list
        const index = this.documents.findIndex(doc => doc.id === id)
        if (index !== -1) {
          this.documents[index] = {
            ...this.documents[index],
            ...response.data
          }
        }
        
        // Update current document if viewing
        if (this.currentDocument?.id === id) {
          this.currentDocument = {
            ...this.currentDocument,
            ...response.data
          }
        }
        
        return response
      } catch (error) {
        this.error = error.message
        console.error('Approve document error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Reject document via API
    async rejectDocumentAPI(id, reason) {
      this.loading = true
      this.error = null
      
      try {
        const response = await documentService.rejectDocument(id, reason)
        
        // Update document in list
        const index = this.documents.findIndex(doc => doc.id === id)
        if (index !== -1) {
          this.documents[index] = {
            ...this.documents[index],
            ...response.data
          }
        }
        
        return response
      } catch (error) {
        this.error = error.message
        console.error('Reject document error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Bulk approve via API
    async bulkApproveAPI(documentIds, notes) {
      this.loading = true
      this.error = null
      
      try {
        const response = await documentService.bulkApprove(documentIds, notes)
        
        // Update documents in list
        documentIds.forEach(id => {
          const index = this.documents.findIndex(doc => doc.id === id)
          if (index !== -1) {
            this.documents[index].status = 'Completed'
            this.documents[index].updatedAt = new Date().toISOString()
          }
        })
        
        return response
      } catch (error) {
        this.error = error.message
        console.error('Bulk approve error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Mark as reviewed via API
    async markAsReviewedAPI(id) {
      try {
        await documentService.markAsReviewed(id)
        
        // Update local state
        const index = this.documents.findIndex(doc => doc.id === id)
        if (index !== -1) {
          this.documents[index].isReviewed = true
        }
      } catch (error) {
        console.error('Mark as reviewed error:', error)
      }
    },

    /**
     * ========================================
     * SMART ACTIONS (Auto switch based on MODE)
     * ========================================
     */
    
    // Smart wrapper - auto switch between dummy and API
    async fetchDocuments(params = {}) {
      if (MODE === 'api' && documentService) {
        return await this.fetchDocumentsAPI(params)
      } else {
        // Dummy mode - just return current state
        return {
          status: 200,
          data: {
            documents: this.documents,
            pagination: this.pagination
          }
        }
      }
    },
    
    async fetchDocumentDetail(id) {
      if (MODE === 'api' && documentService) {
        return await this.fetchDocumentDetailAPI(id)
      } else {
        // Dummy mode
        const doc = this.documents.find(d => d.id == id)
        this.currentDocument = doc
        return {
          status: 200,
          data: doc
        }
      }
    },
    
    async createDocument(formData) {
      if (MODE === 'api' && documentService) {
        return await this.createDocumentAPI(formData)
      } else {
        return await this.createDocumentDummy(formData)
      }
    },
    
    async approveDocument(id, notes) {
      if (MODE === 'api' && documentService) {
        return await this.approveDocumentAPI(id, notes)
      } else {
        // Dummy mode
        this.updateStatusDummy(id, 'Completed')
        return {
          status: 200,
          message: 'Document approved (dummy)',
          data: { id, status: 'Completed' }
        }
      }
    },
    
    async rejectDocument(id, reason) {
      if (MODE === 'api' && documentService) {
        return await this.rejectDocumentAPI(id, reason)
      } else {
        // Dummy mode
        this.updateStatusDummy(id, 'Rejected', reason)
        return {
          status: 200,
          message: 'Document rejected (dummy)',
          data: { id, status: 'Rejected', reason }
        }
      }
    },
    
    async bulkApprove(documentIds, notes) {
      if (MODE === 'api' && documentService) {
        return await this.bulkApproveAPI(documentIds, notes)
      } else {
        // Dummy mode
        documentIds.forEach(id => {
          this.updateStatusDummy(id, 'Completed')
        })
        return {
          status: 200,
          message: 'Documents approved (dummy)',
          data: { successCount: documentIds.length }
        }
      }
    },
    
    async markAsReviewed(id) {
      if (MODE === 'api' && documentService) {
        return await this.markAsReviewedAPI(id)
      } else {
        this.markAsReviewedDummy(id)
      }
    },
    
    // Legacy action (backward compatibility)
    updateStatus(id, newStatus, reason = '') {
      this.updateStatusDummy(id, newStatus, reason)
    },
    
    // Download document
    async downloadDocument(id) {
      if (MODE === 'api' && documentService) {
        try {
          await documentService.downloadDocument(id)
        } catch (error) {
          this.error = error.message
          throw error
        }
      } else {
        // Dummy mode - open PDF in new tab
        const doc = this.documents.find(d => d.id == id)
        if (doc && doc.pdfUrl) {
          window.open(doc.pdfUrl, '_blank')
        }
      }
    },
    
    // Fetch archived documents
    async fetchArchivedDocuments(params = {}) {
      if (MODE === 'api' && documentService) {
        this.loading = true
        try {
          const response = await documentService.getArchivedDocuments(params)
          this.archivedDocuments = response.data.documents
          return response
        } catch (error) {
          this.error = error.message
          throw error
        } finally {
          this.loading = false
        }
      } else {
        // Dummy mode - filter completed documents
        this.archivedDocuments = this.documents.filter(d => d.status === 'Completed')
        return {
          status: 200,
          data: {
            documents: this.archivedDocuments
          }
        }
      }
    }
  }
})