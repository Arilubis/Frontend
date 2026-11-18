<template>
  <div class="min-h-screen bg-[#F1F5F9] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 font-sans text-slate-900 transition-all duration-300">
  <div class="max-w-[1440px] mx-auto">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
  <div>
    <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">Arsip Dokumen</h1>
    <p class="text-slate-500 text-sm mt-0.5">Kelola dan telusuri seluruh berkas digital Anda.</p>
  </div>
        
        <div class="flex items-center gap-3">
          <button @click="exportReport" class="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-medium uppercase hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-slate-600">
            <span class="material-icons text-sm">file_download</span> Export
          </button>
          <button @click="syncData" class="flex items-center gap-2 bg-[#0f172a] px-5 py-2.5 rounded-xl text-[10px] font-medium uppercase text-white hover:bg-[#0f172a] transition-all shadow-md shadow-blue-200 active:scale-95">
            <span class="material-icons text-sm">refresh</span> Sync Archive
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <div class="lg:col-span-2 space-y-4">
          <div class= "bg-slate-900/80 p-5 rounded-[24px] shadow-lg shadow-blue-100 flex items-center justify-between text-white">
            <div>
              <p class="text-white-100 text-[9px] font-medium uppercase normal-case tracking-wider">Storage Status</p>
              <h3 class="text-xl font-semibold tracking-tight">1.2 GB / 5 GB</h3>
            </div>
            <span class="material-icons opacity-40 text-2xl text-white">cloud_queue</span>
          </div>

          <div class="bg-white p-3 rounded-[20px] border border-slate-200 shadow-sm flex items-center gap-3">
            <div class="flex-1 relative">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input v-model="searchQuery" type="text" placeholder="Search archive..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[12px] focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>

          <div class="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr class="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase text-slate-400 font-medium tracking-widest">
                    <th class="px-6 py-4">Document</th>
                    <th class="px-6 py-4 text-center">Status</th>
                    <th class="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="doc in filteredDocs" :key="doc.id" 
                      @click="selectedDoc = doc"
                      :class="selectedDoc?.id === doc.id ? 'bg-blue-50/50' : ''"
                      class="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td class="px-6 py-3">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <span class="material-icons text-lg">inventory_2</span>
                        </div>
                        <div>
                          <div class="font-medium text-slate-700 leading-tight">{{ doc.title }}</div>
                           <div class="text-[10px] text-slate-400 font-normal uppercase mt-0.5">{{ doc.number }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-3 text-center">
                      <span class="text-[9px] font-medium uppercase px-2 py-0.5 rounded-md" :class="doc.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'">
                        {{ doc.status }}
                      </span>
                    </td>
                    <td class="px-6 py-3 text-right">
                      <span class="material-icons text-slate-300 group-hover:text-blue-500 transition-all">chevron_right</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="lg:sticky lg:top-6">
          <div class="bg-white rounded-[24px] p-5 shadow-sm border border-slate-200 transition-all">
            <h2 class="text-[11px] font-medium uppercase tracking-widest text-slate-900 mb-5 flex items-center gap-2">
              <span class="material-icons text-blue-600 text-lg">visibility</span> Info Detail
            </h2>

            <div v-if="selectedDoc" class="space-y-4">
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p class="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-3">Audit Details</p>
                <div class="space-y-2.5">
                  <div class="flex justify-between text-[12px]">
                    <span class="text-slate-400 font-normal tracking-tight">CATEGORY</span>
                    <span class="text-slate-700 font-medium">{{ selectedDoc.category }}</span>
                  </div>
                  <div class="flex justify-between text-[12px]">
                    <span class="text-slate-400 font-normal tracking-tight">VERSION</span>
                    <span class="text-blue-600 font-medium">V{{ selectedDoc.version }}</span>
                  </div>
                  <div class="flex justify-between text-[12px]">
                    <span class="text-slate-400 font-normal tracking-tight">PROCESSOR</span>
                    <span class="text-slate-700 text-right font-medium">{{ selectedDoc.approverName }}</span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-2">
                <button @click="handleDownload(selectedDoc)" class="flex items-center justify-center gap-2 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-medium uppercase hover:bg-[#2a3f70] transition shadow-md shadow-blue-100">
                  <span class="material-icons text-sm">download</span> Download
                </button>
                <button @click="viewLogs(selectedDoc)" class="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-medium uppercase hover:bg-slate-50 transition">
                  <span class="material-icons text-sm">history</span> History
                </button>
              </div>
            </div>

            <div v-else class="py-12 flex flex-col items-center justify-center text-center">
              <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <span class="material-icons text-slate-200">find_in_page</span>
              </div>
              <p class="text-[10px] font-medium uppercase text-slate-300 tracking-widest leading-relaxed">Select a document<br>to view details</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDocStore } from '@/stores/docStore'
import Swal from 'sweetalert2'

// ✅ DEFINE docStore di sini
const docStore = useDocStore()

const searchQuery = ref('')
const filterCategory = ref('')
const filterDate = ref('')
const selectedDoc = ref(null)

// ✅ LOAD ARCHIVED DOCUMENTS
onMounted(async () => {
  try {
    await docStore.fetchArchivedDocuments()
    
    // Auto select first doc
    if (docStore.archivedDocuments.length > 0) {
      selectedDoc.value = docStore.archivedDocuments[0]
    }
  } catch (error) {
    console.error('Failed to load archived documents:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Gagal memuat arsip dokumen'
    })
  }
})

// ✅ FILTERED DOCS - Sekarang docStore sudah defined
const filteredDocs = computed(() => {
  let docs = docStore.archivedDocuments || []
  
  // Filter by search
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    docs = docs.filter(doc => 
      (doc.title?.toLowerCase() || '').includes(search) || 
      (doc.number?.toLowerCase() || '').includes(search)
    )
  }
  
  // Filter by category
  if (filterCategory.value) {
    docs = docs.filter(doc => doc.category === filterCategory.value)
  }
  
  return docs
})

// ✅ DOWNLOAD FUNCTION
const handleDownload = async (doc) => {
  Swal.fire({
    title: 'Preparing Download',
    html: `Downloading <b>${doc.title}</b>...`,
    timer: 1500,
    timerProgressBar: true,
    didOpen: () => Swal.showLoading(),
  })
  
  try {
    await docStore.downloadDocument(doc.id)
    
    Swal.fire({
      icon: 'success',
      title: 'Download Started',
      text: `File ${doc.number} berhasil didownload`,
      showConfirmButton: false,
      timer: 2000
    })
  } catch (error) {
    console.error('Download failed:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Gagal download dokumen'
    })
  }
}

// ✅ VIEW LOGS FUNCTION
const viewLogs = async (doc) => {
  // Dummy history untuk development
  const dummyHistory = [
    {
      action: 'Document Archived',
      description: 'Document has been archived',
      timestamp: new Date().toISOString(),
      actor: { name: 'Admin' }
    },
    {
      action: 'Final Approval',
      description: 'Approved by manager',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      actor: { name: doc.approverName || 'Manager' }
    },
    {
      action: 'Document Created',
      description: 'Document uploaded to system',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      actor: { name: 'User' }
    }
  ]
  
  try {
    // Coba fetch dari API jika MODE = 'api'
    let history = dummyHistory
    
    // Uncomment ini jika backend sudah ready:
    // const { documentService } = await import('@/services/documentService')
    // const response = await documentService.getDocumentHistory(doc.id)
    // history = response.data
    
    // Build HTML untuk history
    const historyHTML = history.map(h => `
      <div class="flex gap-3 border-l-2 border-blue-500 pl-4 relative mb-4">
        <div class="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500"></div>
        <div>
          <p class="text-sm font-bold">${h.action}</p>
          <p class="text-xs text-slate-500">${h.description}</p>
          <p class="text-xs text-slate-400">${new Date(h.timestamp).toLocaleString('id-ID')}</p>
        </div>
      </div>
    `).join('')
    
    Swal.fire({
      title: 'Document History',
      html: `
        <div class="text-left mt-4">
          <p class="text-xs font-bold text-slate-400 uppercase mb-4">
            Audit Trail for ${doc.number}
          </p>
          <div class="space-y-4 max-h-96 overflow-y-auto">
            ${historyHTML}
          </div>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#2563eb',
      width: '600px'
    })
  } catch (error) {
    console.error('Failed to load history:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Gagal memuat history dokumen'
    })
  }
}

// ✅ SYNC DATA
const syncData = async () => {
  Swal.fire({
    title: 'Syncing...',
    text: 'Menghubungkan ke server...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  })
  
  try {
    await docStore.fetchArchivedDocuments()
    
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Synced!',
        text: 'Data arsip sudah paling baru.',
        timer: 2000,
        showConfirmButton: false
      })
    }, 1000)
  } catch (error) {
    console.error('Sync failed:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Gagal sync data'
    })
  }
}

// ✅ EXPORT REPORT
const exportReport = () => {
  Swal.fire({
    title: 'Export Data',
    text: "Pilih format export:",
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Excel (XLSX)',
    cancelButtonText: 'CSV File',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#3b82f6',
  }).then(async (result) => {
    if (result.isConfirmed || result.dismiss === Swal.DismissReason.cancel) {
      const format = result.isConfirmed ? 'xlsx' : 'csv'
      
      Swal.fire({
        title: 'Generating...',
        text: 'Mohon tunggu...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      })
      
      try {
        // Simulate export delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Jika backend sudah ready, uncomment ini:
        // const response = await docStore.exportReport(format, {
        //   category: filterCategory.value,
        //   search: searchQuery.value
        // })
        // if (response.data.fileUrl) {
        //   window.open(response.data.fileUrl, '_blank')
        // }
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `File ${format.toUpperCase()} berhasil di-generate`,
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Export failed:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Gagal export data'
        })
      }
    }
  })
}

// Helper function untuk file icon
const getFileIcon = (type) => {
  const iconMap = {
    pdf: 'picture_as_pdf',
    xlsx: 'description',
    docx: 'article',
    xls: 'description'
  }
  return iconMap[type] || 'insert_drive_file'
}

// Helper function untuk status circle
const statusCircle = (status) => {
  return status === 'Archived' ? 'bg-slate-400' : 'bg-green-500'
}
</script>