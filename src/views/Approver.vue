<template> 
  <div class="min-h-screen md:h-screen bg-[#F1F5F9] overflow-hidden p-3 md:p-5 font-sans">
    <div class="max-w-[1600px] mx-auto h-full flex flex-col gap-3 md:gap-4">
      
      <header class="flex flex-wrap justify-between items-center bg-white px-4 md:px-6 py-3 rounded-[20px] md:rounded-[24px] shadow-sm border border-slate-200/60 gap-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 md:w-10 md:h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <span class="material-icons text-white text-lg md:text-xl">fact_check</span>
          </div>
          <div>
            <h1 class="text-lg md:text-xl font-semibold text-slate-900 tracking-tight leading-none">Workspace<span class="text-blue-600">.</span></h1>
            <p class="text-[9px] md:text-[10px] text-slate-400 font-normal uppercase tracking-widest mt-0.5">Manager Approval System</p>
          </div>
        </div>

        <div class="flex items-center gap-2 md:gap-3 ml-auto">
          <Transition name="fade">
            <button v-if="selectedDocs.length > 0 && !currentDoc" @click="handleBulkApprove" 
              class="bg-emerald-500 text-white px-3 md:px-5 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
              Approve ({{ selectedDocs.length }})
            </button>
          </Transition>
          <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <div class="text-right hidden sm:block">
            <p class="text-[10px] font-medium text-slate-900">{{ currentUserName }}</p>
            <p class="text-[9px] text-slate-400 font-normal">{{ currentUserRole }}</p>
          </div>
        </div>
      </header>

      <!-- List panel: full width di mobile, 1/4 di lg -->
      <div class="flex-1 flex flex-col md:flex-row gap-3 md:gap-4 min-h-0 overflow-hidden">
        <div :class="currentDoc ? 'hidden lg:flex w-1/4' : 'w-full md:w-1/2 lg:w-1/2'" class="flex flex-col gap-3 transition-all duration-500">
          <div class="bg-white/50 backdrop-blur-sm rounded-[24px] p-4 flex-1 flex flex-col min-h-0 border border-white shadow-inner">
            <h3 class="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Document Queue</h3>
            
            <div class="flex-1 overflow-y-auto pr-2 space-y-2 custom-scroll">
              <div v-for="doc in documents" :key="doc.id" 
                @click="goToDetail(doc.id)"
                :class="[
                  docId == doc.id ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'bg-white hover:shadow-md',
                  'group p-4 rounded-2xl border border-slate-200/60 flex items-center justify-between cursor-pointer transition-all'
                ]">
                
                <div class="flex items-center gap-4">
                  <input type="checkbox" :value="doc.id" v-model="selectedDocs" 
                    @click.stop
                    :disabled="!doc.canApprove"
                    class="w-5 h-5 rounded-lg border-slate-200 text-emerald-500 focus:ring-emerald-500 disabled:opacity-20" />
                  <div>
                    <h4 class="text-[13px] font-semibold text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">{{ doc.title }}</h4>
                    <p class="text-[9px] text-slate-400 font-normal uppercase mt-1 tracking-widest">{{ doc.sender }} • {{ doc.amount }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="doc.isReviewed" class="material-icons text-emerald-500 text-sm">visibility</span>
                  <span :class="doc.status === 'Completed' ? 'text-emerald-500' : 'text-slate-300'" class="material-icons text-sm">check_circle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentDoc" class="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 animate-slide-in">
          <div class="flex-[1.5] bg-slate-800 rounded-[32px] p-2 shadow-2xl relative border-[4px] border-white overflow-hidden">
            <div class="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                v-if="currentDoc.filePreviewUrl"
                @click="openInNewTab(currentDoc.filePreviewUrl)" 
                title="Buka di Tab Baru (Google Chrome)"
                class="bg-white/10 backdrop-blur-md hover:bg-white px-3 py-2 rounded-xl text-white hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-medium"
              >
                <span class="material-icons text-sm">open_in_new</span>
                <span class="hidden sm:inline">Buka di Tab Baru</span>
              </button>
              <button @click="handleDownloadFile" class="bg-white/10 backdrop-blur-md hover:bg-white p-2 rounded-xl text-white hover:text-slate-900 transition-all">
                <span class="material-icons text-sm">download</span>
              </button>
              <button @click="closeModal" class="bg-white/10 backdrop-blur-md hover:bg-red-500 p-2 rounded-xl text-white transition-all">
                <span class="material-icons text-sm">close</span>
              </button>
            </div>

          <!-- ✅ PERBAIKAN: Preview untuk berbagai kondisi dengan TEMPLATE -->
          <template v-if="!currentDoc.hasAttachment">
            <div class="w-full h-full flex items-center justify-center bg-slate-50 rounded-[24px]">
              <div class="text-center">
                <span class="material-icons text-slate-300 text-6xl mb-4">description</span>
                <p class="text-sm text-slate-400 font-normal">Tidak ada file attachment</p>
                <p class="text-xs text-slate-300 mt-2">Dokumen ini tidak memiliki file lampiran</p>
              </div>
            </div>
          </template>

          <!-- Loading State -->
          <template v-else-if="fileLoading">
            <div class="w-full h-full flex items-center justify-center bg-slate-50 rounded-[24px]">
              <div class="text-center">
                <div class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-sm text-slate-500 font-normal">Loading file...</p>
                <p class="text-xs text-slate-400 mt-2">{{ currentDoc.primaryAttachment?.displayName }}</p>
              </div>
            </div>
          </template>

          <!-- Preview untuk IMAGE -->
          <template v-else-if="currentDoc.primaryAttachment?.fileType === 'image'">
            <div class="w-full h-full flex items-center justify-center bg-slate-50 rounded-[24px] p-4">
              <img :src="currentDoc.filePreviewUrl" 
                  :alt="currentDoc.primaryAttachment.displayName"
                  class="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
            </div>
          </template>

          <!-- Preview untuk PDF (Canvas render via PDF.js, bebas dari CSP framing) -->
          <template v-else-if="currentDoc.primaryAttachment?.fileType === 'pdf' && currentDoc.filePreviewUrl">
            <div ref="pdfMobileContainer" class="w-full h-full overflow-y-auto bg-slate-800 flex flex-col items-center p-4 gap-4 rounded-[24px] scroll-smooth">
              <!-- Canvas pages will be rendered here via PDF.js -->
            </div>
          </template>

          <!-- ✅ WORD PREVIEW - DENGAN MAMMOTH.JS -->
          <template v-else-if="['word', 'document'].includes(currentDoc.primaryAttachment?.fileType)">
            <!-- Preview HTML dari Word (jika berhasil di-convert) -->
            <div v-if="wordPreviewHtml" 
                class="w-full h-full bg-white rounded-[24px] overflow-hidden">
              
              <!-- Header Info -->
              <div class="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 flex items-center justify-between shadow-md">
                <div class="flex items-center gap-3">
                  <span class="material-icons text-white text-xl">description</span>
                  <div>
                    <p class="text-white font-medium text-sm">{{ currentDoc.primaryAttachment?.displayName }}</p>
                    <p class="text-white/70 text-xs">{{ currentDoc.primaryAttachment?.fileSizeFormatted }} • Preview Mode</p>
                  </div>
                </div>
                <button @click="handleDownloadFile" 
                        class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2">
                  <span class="material-icons text-sm">download</span>
                  Download
                </button>
              </div>
              
              <!-- Word Content Preview -->
              <div class="h-[calc(100%-60px)] overflow-y-auto p-8 custom-scroll">
                <div class="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg p-12 border border-slate-100">
                  <div 
                    v-html="wordPreviewHtml" 
                    class="word-preview-content prose prose-slate max-w-none"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Error State (jika gagal convert) -->
            <div v-else-if="wordPreviewError" 
                class="w-full h-full flex items-center justify-center bg-slate-50 rounded-[24px] p-8">
              <div class="text-center max-w-md">
                <div class="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-red-500 text-5xl">error_outline</span>
                </div>
                <p class="text-sm text-slate-700 font-medium mb-2">{{ wordPreviewError }}</p>
                <p class="text-xs text-slate-400 mb-6">Silakan download file untuk melihat kontennya</p>
                <button @click="handleDownloadFile" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 mx-auto shadow-lg">
                  <span class="material-icons text-sm">download</span>
                  Download File
                </button>
              </div>
            </div>

            <!-- Loading State (sedang convert) -->
            <div v-else class="w-full h-full flex items-center justify-center bg-slate-50 rounded-[24px]">
              <div class="text-center">
                <div class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-sm text-slate-500 font-normal">Converting Word document...</p>
              </div>
            </div>
          </template>

          <!-- Fallback untuk file type lain -->
          <template v-else>
            <div class="w-full h-full flex items-center justify-center bg-slate-50 rounded-[24px] p-8">
              <div class="text-center max-w-md">
                <div class="w-24 h-24 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span class="material-icons text-slate-400 text-5xl">insert_drive_file</span>
                </div>
                <p class="text-sm text-slate-700 font-medium mb-2">{{ currentDoc.primaryAttachment?.displayName }}</p>
                <p class="text-xs text-slate-400 mb-1">{{ currentDoc.primaryAttachment?.fileSizeFormatted }}</p>
                <p class="text-[10px] text-slate-400 mb-6 italic">File preview not supported</p>
                <button @click="handleDownloadFile" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 mx-auto shadow-lg">
                  <span class="material-icons text-sm">download</span>
                  Download File
                </button>
              </div>
            </div>
          </template>
          </div>
          
          <div class="flex-1 bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-xl flex flex-col justify-between overflow-y-auto custom-scroll">
            <div class="space-y-6">
              <div>
                <span class="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-medium uppercase tracking-widest">ID #{{ currentDoc.number }}</span>
                <h2 class="text-xl font-semibold text-slate-900 mt-4 leading-tight tracking-tight">{{ currentDoc.title }}</h2>
                <div class="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 text-[12px] leading-relaxed">
                  "{{ currentDoc.note || 'No description provided.' }}"
                </div>
              </div>

              <!-- ✅ TAMBAH: Info attachments -->
              <div v-if="currentDoc.attachments?.length > 0" class="space-y-2">
                <h4 class="text-[9px] font-medium text-slate-400 uppercase tracking-[0.2em]">Attachments ({{ currentDoc.attachments.length }})</h4>
                <div v-for="att in currentDoc.attachments" :key="att.id" 
                     class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span class="material-icons text-slate-400 text-sm">
                    {{ getFileIcon(att.fileType) }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-medium text-slate-900 truncate">{{ att.displayName }}</p>
                    <p class="text-[9px] text-slate-400">{{ att.fileSizeFormatted }}</p>
                  </div>
                  <button @click="downloadAttachment(att)" 
                          class="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                    <span class="material-icons text-blue-600 text-sm">download</span>
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p class="text-[8px] text-slate-400 font-medium uppercase tracking-widest">Nominal</p>
                  <p class="text-sm font-semibold text-slate-900">{{ currentDoc.amount }}</p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p class="text-[8px] text-slate-400 font-medium uppercase tracking-widest">Priority</p>
                  <p class="text-sm font-semibold text-red-500 uppercase">HIGH</p>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="text-[9px] font-medium text-slate-400 uppercase tracking-[0.2em]">Verification Flow</h4>
                <div v-for="(step, i) in timeline" :key="i" class="flex gap-3 items-start">
                  <div :class="step.completed ? 'bg-emerald-500' : step.active ? 'bg-blue-600 animate-pulse' : 'bg-slate-200'" 
                      class="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"></div>
                  <div class="flex-1 -mt-1">
                    <p class="text-[10px] font-medium uppercase text-slate-800 tracking-wide">{{ step.title }}</p>
                    <p class="text-[9px] text-slate-400 italic mb-2">{{ step.status }}</p>

                    <div v-if="step.approvers && step.approvers.length > 0" class="space-y-1 mt-2">
                      <div v-for="(approver, aIdx) in step.approvers" :key="aIdx" 
                          class="flex items-center gap-2 text-[8px] bg-slate-50 rounded-lg px-2 py-1">
                        <span class="material-icons text-[10px]" 
                              :class="approver.status === 'APPROVED' ? 'text-emerald-500' : 
                                      approver.status === 'REJECTED' ? 'text-red-500' : 'text-slate-400'">
                          {{ approver.status === 'APPROVED' ? 'check_circle' : 
                            approver.status === 'REJECTED' ? 'cancel' : 'pending' }}
                        </span>
                        <span class="font-medium text-slate-700">{{ approver.fullName || approver.name }}</span>
                        <span v-if="approver.status === 'APPROVED'" class="ml-auto text-emerald-600 font-semibold">✓</span>
                        <span v-else-if="approver.status === 'REJECTED'" class="ml-auto text-red-600 font-semibold">✗</span>
                        <span v-else class="ml-auto text-blue-600 font-medium">⏳</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentDoc" class="mt-8 pt-6 border-t border-slate-100">
              <div v-if="canCurrentDocApprove" class="grid grid-cols-3 gap-2">
                <button @click="handleApprove" class="bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                  APPROVE
                </button>
                <button @click="handleRevision" class="bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all active:scale-95">
                  REVISION
                </button>
                <button @click="handleReject" class="border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 py-4 rounded-2xl font-semibold text-[10px] uppercase tracking-widest transition-all">
                  REJECT
                </button>
              </div>
              <div v-else class="text-center py-4">
                <p class="text-xs text-slate-400 italic">
                  {{ documents.find(d => d.id === currentDoc.id)?.isCurrentLevel 
                    ? 'Menunggu approver lain di level ini' 
                    : 'Dokumen belum sampai ke level Anda' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center bg-white/40 rounded-[32px] border-2 border-dashed border-slate-200">
          <span class="material-icons text-5xl text-slate-200 mb-4">analytics</span>
          <p class="text-[10px] font-medium text-slate-400 uppercase tracking-widest text-center">Select a document<br>from the list to review</p>
        </div>
      </div>

      <!-- Success Popup -->
      <Transition name="fade">
        <div v-if="isSuccess || isRejectSuccess" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div class="bg-white rounded-[32px] p-8 shadow-2xl max-w-md w-full text-center border-t-8" :class="isSuccess ? 'border-emerald-500' : 'border-red-500'">
            <span class="material-icons text-5xl mb-4" :class="isSuccess ? 'text-emerald-500' : 'text-red-500'">
              {{ isSuccess ? 'verified' : 'error' }}
            </span>
            <h2 class="text-xl font-semibold text-slate-900 mb-2">
              {{ isSuccess ? 'Approval Success!' : 'Rejected!' }}
            </h2>
            <div v-if="isSuccess" class="bg-emerald-50 rounded-2xl p-4 mb-6 text-left">
              <div class="space-y-2">
                <div class="flex items-start gap-2">
                  <span class="material-icons text-emerald-600 text-sm">person</span>
                  <div class="flex-1">
                    <p class="text-[9px] text-emerald-600 font-medium uppercase">Approved By</p>
                    <p class="text-sm font-semibold text-slate-900">{{ approvalDetails.approverName }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <span class="material-icons text-emerald-600 text-sm">description</span>
                  <div class="flex-1">
                    <p class="text-[9px] text-emerald-600 font-medium uppercase">Document</p>
                    <p class="text-sm font-medium text-slate-700">{{ approvalDetails.documentTitle }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <span class="material-icons text-emerald-600 text-sm">layers</span>
                  <div class="flex-1">
                    <p class="text-[9px] text-emerald-600 font-medium uppercase">Level</p>
                    <p class="text-sm font-medium text-slate-700">Level {{ approvalDetails.level }}</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <span class="material-icons text-emerald-600 text-sm">schedule</span>
                  <div class="flex-1">
                    <p class="text-[9px] text-emerald-600 font-medium uppercase">Time</p>
                    <p class="text-sm font-medium text-slate-700">{{ formatDate(approvalDetails.timestamp) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <button @click="closeModal" class="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
              OK, BACK TO WORK
            </button>
          </div>
        </div>
      </Transition>

      <!-- Error Popup -->
      <Transition name="modal-fade">
        <div v-if="isError" 
            @click.self="isError = false"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4" 
            style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);">
          <div class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700">
              <button @click="isError = false" 
                      class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors">
                <span class="material-icons text-2xl">close</span>
              </button>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span class="material-icons text-white text-4xl">error</span>
                </div>
                <div>
                  <h2 class="text-2xl font-semibold text-white tracking-tight">
                    Access Denied!
                  </h2>
                  <p class="text-white/80 text-sm font-medium mt-1">
                    Failed to load document
                  </p>
                </div>
              </div>
            </div>
            <div class="p-8">
              <div class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100">
                <div class="flex items-start gap-3">
                  <span class="material-icons text-blue-600 text-2xl flex-shrink-0">warning</span>
                  <div>
                    <p class="text-sm font-medium text-slate-900 mb-2">{{ errorMessage }}</p>
                    <p class="text-xs text-slate-600">
                      Anda tidak memiliki izin untuk mengakses dokumen ini. 
                      Silakan hubungi administrator jika ini adalah kesalahan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
              <button @click="isError = false" 
                      class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                <span class="material-icons text-sm">close</span>
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Confirmation Approve Popup -->
      <Transition name="modal-fade">
        <div v-if="showConfirmApprove" 
            @click.self="showConfirmApprove = false"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4" 
            style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);">
          <div class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700">  
              <button @click="showConfirmApprove = false" 
                      class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors">
                <span class="material-icons text-2xl">close</span>
              </button>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span class="material-icons text-white text-4xl">help_outline</span>
                </div>
                <div>
                  <h2 class="text-2xl font-semibold text-white tracking-tight">
                    Confirm Approval
                  </h2>
                  <p class="text-white/80 text-sm font-medium mt-1">
                    Are you sure?
                  </p>
                </div>
              </div>
            </div>
            <div class="p-8">
              <div class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100">
                <p class="text-sm font-medium text-slate-900 mb-3">Approve dokumen ini?</p>
                <div class="space-y-2 text-xs text-slate-600">
                  <div class="flex items-center gap-2">
                    <span class="material-icons text-blue-600 text-sm">description</span>
                    <span class="font-medium">{{ pendingApprovalDoc?.title }}</span>
                  </div>
                  <p class="pl-6">
                    Setelah di-approve, dokumen akan dilanjutkan ke tahap berikutnya dalam alur persetujuan.
                  </p>
                </div>
              </div>
            </div>
            <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex gap-3 justify-end">
              <button @click="showConfirmApprove = false" 
                      class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium text-sm uppercase tracking-wide transition-all">
                Cancel
              </button>
              <button @click="confirmApproval" 
                      class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                <span class="material-icons text-sm">check_circle</span>
                OK
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!--CONFIRMATION REVISION POPUP -->
      <Transition name="modal-fade">
        <div v-if="showConfirmRevision" 
            @click.self="showConfirmRevision = false"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4" 
            style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);">
          <div class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            <!-- Header -->
            <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-amber-500 to-amber-600">
              <button @click="showConfirmRevision = false" 
                      class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors">
                <span class="material-icons text-2xl">close</span>
              </button>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span class="material-icons text-white text-4xl">edit_note</span>
                </div>
                <div>
                  <h2 class="text-2xl font-semibold text-white tracking-tight">
                    Request Revision
                  </h2>
                  <p class="text-white/80 text-sm font-medium mt-1">
                    Require changes
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Body -->
            <div class="p-8">
              <div class="mb-4">
                <label class="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 block mb-3">
                  Revision Notes *
                </label>
                <textarea v-model="revisionNotes" 
                          rows="4"
                          placeholder="Jelaskan apa yang perlu direvisi..."
                          class="w-full px-4 py-3 rounded-2xl text-sm font-medium bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:ring-0 outline-none resize-none transition-colors"
                          required></textarea>
              </div>
              
              <div class="bg-amber-50 rounded-2xl p-5 border-2 border-amber-100">
                <div class="flex items-start gap-3">
                  <span class="material-icons text-amber-600 text-2xl flex-shrink-0">info</span>
                  <div>
                    <p class="text-sm font-medium text-slate-900 mb-2">
                      Dokumen: {{ pendingRevisionDoc?.title }}
                    </p>
                    <p class="text-xs text-slate-600">
                      Dokumen akan dikembalikan ke creator untuk direvisi sesuai catatan Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex gap-3 justify-end">
              <button @click="showConfirmRevision = false" 
                      class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium text-sm uppercase tracking-wide transition-all">
                Cancel
              </button>
              <button @click="confirmRevision" 
                      :disabled="!revisionNotes.trim()"
                      class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-amber-100 disabled:opacity-50">
                <span class="material-icons text-sm">send</span>
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import permohonanService from '@/services/permohonanService';
import { useAuthStore } from '@/stores/authStore';
import api from "@/services/api";
import mammoth from 'mammoth';

// Mobile responsiveness and PDF.js state
const pdfMobileContainer = ref(null);
const isMobile = ref(false);

const updateMobileState = () => {
  isMobile.value =
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
};

let pdfjsPromise = null;
const loadPdfJs = () => {
  if (!pdfjsPromise) {
    pdfjsPromise = new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js";
        resolve(window.pdfjsLib);
      };
      script.onerror = (err) => {
        pdfjsPromise = null;
        reject(err);
      };
      document.head.appendChild(script);
    });
  }
  return pdfjsPromise;
};

const renderPdfMobile = async (url) => {
  try {
    const pdfjs = await loadPdfJs();
    const targetUrl = (import.meta.env.DEV && typeof url === 'string')
      ? url.replace(/^https?:\/\/[^\/]+/, '/objx-storage')
      : url;
    const loadingTask = pdfjs.getDocument(targetUrl);
    const pdf = await loadingTask.promise;
    
    if (pdfMobileContainer.value) {
      pdfMobileContainer.value.innerHTML = "";
    }
    
    const containerWidth = pdfMobileContainer.value
      ? pdfMobileContainer.value.clientWidth
      : window.innerWidth;
    
    const maxPageWidth = 900;
    const targetWidth = Math.min(Math.max(containerWidth - 32, 200), maxPageWidth);
    
    // Tingkatkan ketajaman dengan Device Pixel Ratio monitor (minimal 1.5x, max 2.5x)
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.5);
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const unscaledViewport = page.getViewport({ scale: 1 });
      
      const baseScale = targetWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale: baseScale * dpr });
      
      const canvas = document.createElement("canvas");
      canvas.className = "rounded-xl shadow-xl bg-white block mb-4 border border-slate-700/20";
      const context = canvas.getContext("2d");
      
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(targetWidth)}px`;
      canvas.style.height = `${Math.floor(unscaledViewport.height * baseScale)}px`;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;
      if (pdfMobileContainer.value) {
        pdfMobileContainer.value.appendChild(canvas);
      }
    }
  } catch (err) {
    console.error("PDF render error in Approver.vue:", err);
  }
};

const openInNewTab = (url) => {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

// ============================================================
// CONSTANTS & CONFIG
// ============================================================
const API_BASE_URL = 'http://localhost:3000/';

// ============================================================
// ROUTER & STORE
// ============================================================
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// ============================================================
// STATE MANAGEMENT
// ============================================================
const documents = ref([]);
const selectedDocs = ref([]);
const currentDocument = ref(null);
const loading = ref(false);
const fileLoading = ref(false);

// State untuk Word preview
const wordPreviewHtml = ref('');
const wordPreviewError = ref('');

// Success/Error States
const isSuccess = ref(false); 
const isRejectSuccess = ref(false);
const isError = ref(false); 
const errorMessage = ref('');
const showConfirmApprove = ref(false); 
const pendingApprovalDoc = ref(null); 
const approvalDetails = ref({
  approverName: '',
  documentTitle: '',
  level: 0,
  timestamp: null
});

// Blob URL tracking untuk cleanup
const activeBlobUrls = ref(new Set());

// State untuk revision
const showConfirmRevision = ref(false);
const pendingRevisionDoc = ref(null);
const revisionNotes = ref('');

// ============================================================
// COMPUTED PROPERTIES
// ============================================================
const docId = computed(() => route.query.id);

const currentDoc = computed(() => {
  if (!docId.value) return null;
  return documents.value.find(d => d.id === docId.value);
});

const canCurrentDocApprove = computed(() => {
  if (!currentDoc.value) return false;
  const doc = documents.value.find(d => d.id === currentDoc.value.id);
  return doc?.canApprove || false;
});

const currentUserName = computed(() => {
  const user = authStore.user;
  
  console.log('👤 Current user data:', {
    fullName: user?.fullName,
    name: user?.name,
    username: user?.username,
    email: user?.email
  });
  
  // Priority: fullName > name > username > email > 'User'
  return user?.fullName || 
         user?.name || 
         user?.username || 
         user?.email?.split('@')[0] || 
         'User';
});

const currentUserRole = computed(() => {
  const roles = authStore.user?.roles || [];
  if (roles.includes('ADMIN')) return 'Admin';
  if (roles.includes('APPROVER')) return 'Approver';
  return 'User';
});

const timeline = computed(() => {
  if (!currentDoc.value) return [];
  
  const doc = documents.value.find(d => d.id === currentDoc.value.id);
  if (!doc || !doc.approvalLevels) return [];
  
  const steps = [];
  
  doc.approvalLevels.forEach((level) => {
    const allApproved = level.approvers?.every(app => app.status === 'APPROVED');
    const hasRejected = level.approvers?.some(app => app.status === 'REJECTED');
    const hasPending = level.approvers?.some(app => app.status === 'PENDING');
    
    steps.push({
      title: `Level ${level.level} - ${level.type}`,
      status: allApproved ? 'Completed' : hasRejected ? 'Rejected' : hasPending ? 'In Progress' : 'Waiting',
      completed: allApproved,
      active: doc.currentLevel === level.level && hasPending,
      approvers: level.approvers || []
    });
  });
  
  return steps;
});

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const mapStatusToDisplay = (status) => {
  const statusMap = {
    'DRAFT': 'Draft',
    'REVIEW': 'In Review',
    'SUBMITTED': 'Submitted',
    'IN_REVIEW': 'In Progress',
    'APPROVED': 'Completed',
    'REJECTED': 'Rejected',
    'CANCELLED': 'Cancelled'
  };
  return statusMap[status] || status;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

const getFileIcon = (fileType) => {
  const iconMap = {
    'pdf': 'picture_as_pdf',
    'image': 'image',
    'document': 'description',
    'spreadsheet': 'table_chart',
    'video': 'videocam',
    'audio': 'audiotrack'
  };
  return iconMap[fileType] || 'insert_drive_file';
};

// ✅ PERBAIKAN: Determine primary attachment (PDF > image > first file)
const determinePrimaryAttachment = (attachments) => {
  if (!attachments || attachments.length === 0) return null;
  
  console.log('🔍 Determining primary attachment from:', attachments.map(a => ({
    name: a.displayName,
    type: a.fileType,
    mimeType: a.mimeType
  })));

  
  // Prioritas 1: PDF
  const pdfFile = attachments.find(att => att.fileType === 'pdf');
  if (pdfFile) {
    console.log('✅ Primary: PDF -', pdfFile.displayName);
    return pdfFile;
  }
  
  // Prioritas 2: Image
  const imageFile = attachments.find(att => att.fileType === 'image');
  if (imageFile) {
    console.log('✅ Primary: Image -', imageFile.displayName);
    return imageFile;
  }
  
  // Prioritas 3: File pertama (termasuk Word)
  console.log('✅ Primary: First file -', attachments[0].displayName, '(Type:', attachments[0].fileType + ')');
  return attachments[0];
};

const isPreviewableFile = (fileType) => {
    return ['pdf', 'image'].includes(fileType);
  };

  // ✅ TAMBAH: Helper untuk get file type label
  const getFileTypeLabel = (fileType) => {
    const labels = {
      'word': 'Microsoft Word Document',
      'document': 'Document File',
      'pdf': 'PDF Document',
      'image': 'Image File',
      'spreadsheet': 'Spreadsheet File'
    };
    return labels[fileType] || 'File';
  };


// ✅ PERBAIKAN: Fetch file dengan Word preview support
const fetchFileAsBlob = async (attachmentId, fileType) => {
  try {
    console.log('🔄 Fetching attachment:', attachmentId, 'Type:', fileType);

    const response = await api.get(
      `/attachments/${attachmentId}/preview`,
      {
        responseType: "blob"
      }
    );

    // ✅ TAMBAH: Jika Word document, convert ke HTML preview
    if (['word', 'document'].includes(fileType)) {
      try {
        console.log('📄 Converting Word to HTML preview...');
        
        // Convert blob to ArrayBuffer
        const arrayBuffer = await response.data.arrayBuffer();
        
        // Convert dengan Mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer });
        
        wordPreviewHtml.value = result.value;
        wordPreviewError.value = '';
        
        console.log('✅ Word preview generated successfully');
        console.log('⚠️ Conversion messages:', result.messages);
        
        return null; // Tidak perlu blob URL untuk Word
        
      } catch (convertError) {
        console.error('❌ Word conversion error:', convertError);
        wordPreviewError.value = 'Gagal memuat preview Word document';
        wordPreviewHtml.value = '';
      }
    }

    // ✅ Untuk PDF/Image, tetap pakai blob URL
    const blobUrl = URL.createObjectURL(response.data);
    activeBlobUrls.value.add(blobUrl);

    console.log('✅ Blob URL created:', blobUrl);
    return blobUrl;

  } catch (error) {
    console.error('❌ Fetch file error:', error);
    throw error;
  }
};

// ✅ PERBAIKAN: Cleanup blob URLs
const cleanupBlobUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
    activeBlobUrls.value.delete(url);
    console.log('🧹 Cleaned up blob URL');
  }
};

const cleanupAllBlobUrls = () => {
  activeBlobUrls.value.forEach(url => {
    URL.revokeObjectURL(url);
  });
  activeBlobUrls.value.clear();
  console.log('🧹 All blob URLs cleaned up');
};

// ============================================================
// DATA FETCHING
// ============================================================
const loadDocuments = async () => {
  try {
        loading.value = true;
        
        const response = await permohonanService.getApprovalPending();
        const userId = authStore.user?.id;
        
        // ✅ TAMBAH: Filter DRAFT dan REVISION lama
        let allDocs = response.data || [];
        
        // Step 1: Filter dokumen sendiri
        allDocs = allDocs.filter(doc => doc.createdBy !== userId);
        
        // Step 2: Filter DRAFT (tidak ditampilkan di Approver)
        allDocs = allDocs.filter(doc => doc.status !== 'DRAFT');
        
        // Step 3: Filter REVISION lama yang sudah punya revision lebih baru
        const filteredDocs = allDocs.filter(doc => {
          // Jika bukan REVISION, tampilkan
          if (doc.status !== 'REVISION') return true;
          
          // Jika REVISION, cek apakah ada revision lebih baru
          const rootId = doc.parentId || doc.id;
          const currentRev = doc.rev || 0;
          
          // Cari dokumen lain dengan parentId sama dan rev lebih tinggi
          const hasNewerRevision = allDocs.some(otherDoc => {
            const otherRootId = otherDoc.parentId || otherDoc.id;
            const otherRev = otherDoc.rev || 0;
            
            // Ada revision lebih baru dari root yang sama
            return otherRootId === rootId && 
                  otherRev > currentRev &&
                  otherDoc.id !== doc.id;
          });
          
          // Jika ada revision lebih baru, SKIP dokumen REVISION lama ini
          return !hasNewerRevision;
        });
        
        console.log('✅ Approver documents loaded:', {
          total: response.data.length,
          afterFilter: filteredDocs.length,
          filtered: response.data.length - filteredDocs.length
        });
        
        documents.value = filteredDocs
          .map(doc => {
        // ✅ PERBAIKAN: Parse attachments dari response JSON
        const attachments = (doc.attachments || []).map(att => ({
          id: att.id,
          fileName: att.fileName,
          displayName: att.displayName,
          fileSize: att.fileSize,
          fileSizeFormatted: att.fileSizeFormatted,
          mimeType: att.mimeType,
          fileType: att.fileType,
          downloadUrl: att.downloadUrl,
          viewUrl: att.viewUrl,
          createdAt: att.createdAt
        }));
        
        const primaryAttachment = determinePrimaryAttachment(attachments);
        
        console.log(`📄 Document "${doc.title}":`, {
          totalAttachments: attachments.length,
          primaryFile: primaryAttachment?.displayName || 'None',
          fileType: primaryAttachment?.fileType || 'N/A'
        });
        
        return {
          id: doc.id,
          title: doc.title,
          sender: doc.creatorInfo?.fullName || 'Unknown',
          amount: doc.categoryInfo?.name || 'N/A',
          status: mapStatusToDisplay(doc.status),
          isReviewed: false,
          number: doc.id.substring(0, 8).toUpperCase(),
          note: doc.description,
          
          // ✅ Attachment handling
          attachments: attachments,
          primaryAttachment: primaryAttachment,
          hasAttachment: attachments.length > 0,
          attachmentCount: attachments.length,
          filePreviewUrl: null, // Akan diisi saat dokumen dibuka
          
          // Approval metadata
          canApprove: doc._metadata?.canApprove || false,
          userLevel: doc._metadata?.userLevel,
          userStatus: doc._metadata?.userStatus,
          isCurrentLevel: doc._metadata?.isCurrentLevel || false,
          createdBy: doc.createdBy,
          approvalLevels: doc.approvalLevels || []
        };
      });
    
    console.log('✅ Loaded documents:', documents.value.length);
    
  } catch (error) {
    console.error('❌ Load documents error:', error);
    if (error.response?.status !== 403) {
      errorMessage.value = error.response?.data?.message || error.message;
      isError.value = true;
    }
    documents.value = [];
  } finally {
    loading.value = false;
  }
};

// ============================================================
// DOCUMENT NAVIGATION
// ============================================================
const goToDetail = async (id) => {
  router.push({ query: { id: id } });
  
  try {
    fileLoading.value = true;
    
    const doc = documents.value.find(d => d.id === id);
    
    if (!doc) {
      errorMessage.value = 'Dokumen tidak ditemukan';
      isError.value = true;
      return;
    }
    
    // ✅ Fetch file preview jika ada primary attachment
    if (doc.primaryAttachment) {
      try {
        const metaRes = await api.get(
          `/approval-request/${doc.id}/attachments/${doc.primaryAttachment.id}/download`
        );
        const downloadUrl = metaRes.data?.data?.url || metaRes.data?.url;
        doc.filePreviewUrl = downloadUrl;
        console.log('✅ File preview loaded');
      } catch (fileError) {
        console.error('❌ Fetch file error:', fileError);
        errorMessage.value = 'Gagal memuat file: ' + fileError.message;
        isError.value = true;
        return;
      }
    }
    
    // ✅ Fetch full document details from API
    try {
      const response = await permohonanService.getPermohonanById(id);
      currentDocument.value = {
        ...response.data,
        filePreviewUrl: doc.filePreviewUrl,
        primaryAttachment: doc.primaryAttachment,
        attachments: response.data.attachments || doc.attachments
      };
      
      if (response.data.approvalLevels) {
        doc.approvalLevels = response.data.approvalLevels;
      }
      
    } catch (apiError) {
      console.warn('⚠️ Could not fetch full document details:', apiError.message);
      currentDocument.value = doc;
    }
    
    doc.isReviewed = true;
    
  } catch (error) {
    console.error('❌ Load document detail error:', error);
    if (error.response?.status !== 403) {
      errorMessage.value = error.message || 'Gagal memuat detail dokumen';
      isError.value = true;
    }
    router.push({ query: {} }); // kembali ke list jika 403
  } finally {
    fileLoading.value = false;
  }
};

// ============================================================
// FILE OPERATIONS
// ============================================================
const handleDownloadFile = async () => {
  if (!currentDoc.value?.primaryAttachment) {
    errorMessage.value = 'File tidak tersedia untuk diunduh';
    isError.value = true;
    return;
  }
  
  await downloadAttachment(currentDoc.value.primaryAttachment);
};

const downloadAttachment = async (attachment) => {
  try {
    console.log("⬇️ Downloading:", attachment);

    let downloadUrl = attachment.downloadUrl;
    if (!downloadUrl || !downloadUrl.startsWith("http")) {
      const docId = currentDoc.value?.id;
      const res = await api.get(
        `/approval-request/${docId}/attachments/${attachment.id}/download`
      );
      downloadUrl = res.data?.data?.url || res.data?.url;
    }

    if (!downloadUrl) throw new Error("URL unduhan file tidak ditemukan");

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = attachment.fileName || attachment.displayName || "file";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();

    console.log("✅ File downloaded");

  } catch (error) {
    console.error("❌ Download failed:", error);
    errorMessage.value = "Gagal mengunduh file: " + error.message;
    isError.value = true;
  }
};
    

// ============================================================
// APPROVAL ACTIONS
// ============================================================
const handleApprove = () => {
  if (!currentDocument.value) return;
  
  const doc = documents.value.find(d => d.id === currentDocument.value.id);
  if (!doc?.canApprove) {
    errorMessage.value = 'Anda tidak bisa approve dokumen ini pada level saat ini';
    isError.value = true;
    return;
  }
  
  pendingApprovalDoc.value = currentDocument.value;
  showConfirmApprove.value = true;
};

const confirmApproval = async () => {
  if (!pendingApprovalDoc.value) return;
  
  try {
    showConfirmApprove.value = false;
    
    await permohonanService.respondToApproval(
      pendingApprovalDoc.value.id,
      'APPROVED',
      'Approved via dashboard'
    );
    
    const doc = documents.value.find(d => d.id === pendingApprovalDoc.value.id);
    approvalDetails.value = {
      approverName: currentUserName.value,
      documentTitle: pendingApprovalDoc.value.title,
      level: doc?.userLevel || doc?.currentLevel,
      timestamp: new Date()
    };
    
    isSuccess.value = true;
    
    setTimeout(async () => {
      await loadDocuments();
      closeModal();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Approve failed:', error);
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  } finally {
    pendingApprovalDoc.value = null;
  }
};

const handleReject = async () => {
  if (!currentDocument.value) return;
  
  const doc = documents.value.find(d => d.id === currentDocument.value.id);
  if (!doc?.canApprove) {
    errorMessage.value = 'Anda tidak bisa reject dokumen ini pada level saat ini';
    isError.value = true;
    return;
  }
  
  const reason = prompt('Alasan reject:');
  if (!reason) return;
  
  try {
    await permohonanService.respondToApproval(
      currentDocument.value.id,
      'REJECTED',
      reason
    );
    
    isRejectSuccess.value = true;
    
    setTimeout(async () => {
      await loadDocuments();
      closeModal();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Reject failed:', error);
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  }
};

// Handle revision
const handleRevision = () => {
  if (!currentDocument.value) return;
  
  const doc = documents.value.find(d => d.id === currentDocument.value.id);
  if (!doc?.canApprove) {
    errorMessage.value = 'Anda tidak bisa meminta revisi dokumen ini pada level saat ini';
    isError.value = true;
    return;
  }
  
  pendingRevisionDoc.value = currentDocument.value;
  revisionNotes.value = '';
  showConfirmRevision.value = true;
};

// Confirm revision
const confirmRevision = async () => {
  if (!pendingRevisionDoc.value || !revisionNotes.value.trim()) return;
  
  try {
    showConfirmRevision.value = false;
    
    
    await permohonanService.requestRevision(
      pendingRevisionDoc.value.id,
      revisionNotes.value.trim()
    );
    
    alert('✅ Revision request sent successfully!\n\nDokumen telah dikembalikan ke creator untuk revisi.');
    
    setTimeout(async () => {
      await loadDocuments();
      closeModal();
    }, 1500);
    
  } catch (error) {
    console.error('❌ Request revision failed:', error);
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  } finally {
    pendingRevisionDoc.value = null;
    revisionNotes.value = '';
  }
};

const handleBulkApprove = async () => {
  if (selectedDocs.value.length === 0) {
    errorMessage.value = 'Pilih dokumen terlebih dahulu';
    isError.value = true;
    return;
  }
  
  if (!confirm(`Approve ${selectedDocs.value.length} dokumen sekaligus?`)) return;
  
  try {
    for (const docId of selectedDocs.value) {
      await permohonanService.respondToApproval(
        docId,
        'APPROVED',
        'Bulk approved'
      );
    }
    
    alert(`✅ ${selectedDocs.value.length} dokumen berhasil di-approve`);
    selectedDocs.value = [];
    await loadDocuments();
    
  } catch (error) {
    console.error('❌ Bulk approve failed:', error);
    errorMessage.value = 'Gagal bulk approve: ' + error.message;
    isError.value = true;
  }
};

// ============================================================
// MODAL MANAGEMENT
// ============================================================
const closeModal = () => {
  // Cleanup blob URL
  if (currentDocument.value?.filePreviewUrl) {
    cleanupBlobUrl(currentDocument.value.filePreviewUrl);
  }
  
  // ✅ TAMBAH: Reset Word preview
  wordPreviewHtml.value = '';
  wordPreviewError.value = '';
  
  currentDocument.value = null;
  router.push({ query: {} });
  isSuccess.value = false;
  isRejectSuccess.value = false;
};

// ============================================================
// LIFECYCLE HOOKS
// ============================================================
watch(currentDoc, async (newDoc) => {
  if (newDoc && newDoc.primaryAttachment?.fileType === 'pdf' && newDoc.filePreviewUrl) {
    await nextTick();
    await renderPdfMobile(newDoc.filePreviewUrl);
  }
}, { immediate: true });

onMounted(async () => {
  updateMobileState();
  window.addEventListener("resize", updateMobileState);

  console.log('🔄 Checking user authentication...');
  
  if (!authStore.user || !authStore.user.id) {
    console.warn('⚠️ User not authenticated, redirecting to login...');
    router.push('/login');
    return;
  }
  
  console.log('✅ User authenticated:', {
    id: authStore.user.id,
    fullName: authStore.user.fullName,
    roles: authStore.user.roles
  });
  
  await loadDocuments();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateMobileState);
  // Cleanup semua blob URLs saat component destroyed
  cleanupAllBlobUrls();
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }

.animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  border: 1px solid #CBD5E1;
  display: grid;
  place-content: center;
}
input[type="checkbox"]:checked { background-color: #10b981; border-color: #10b981; }
input[type="checkbox"]:checked::after {
  content: "check"; font-family: 'Material Icons'; font-size: 14px; color: white;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* ✅ TAMBAH: Styling untuk Word preview content */
.word-preview-content {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #1e293b;
}

.word-preview-content p {
  margin-bottom: 1em;
}

.word-preview-content h1 {
  font-size: 2em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: #0f172a;
}

.word-preview-content h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: #1e293b;
}

.word-preview-content h3 {
  font-size: 1.25em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  color: #334155;
}

.word-preview-content strong {
  font-weight: 700;
}

.word-preview-content em {
  font-style: italic;
}

.word-preview-content ul,
.word-preview-content ol {
  margin-left: 2em;
  margin-bottom: 1em;
}

.word-preview-content ul {
  list-style-type: disc;
}

.word-preview-content ol {
  list-style-type: decimal;
}

.word-preview-content li {
  margin-bottom: 0.5em;
}

.word-preview-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.word-preview-content table td,
.word-preview-content table th {
  border: 1px solid #cbd5e1;
  padding: 0.5em;
}

.word-preview-content table th {
  background-color: #f1f5f9;
  font-weight: bold;
}

.word-preview-content a {
  color: #2563eb;
  text-decoration: underline;
}

.word-preview-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em 0;
}

/* Prose styling untuk better typography */
.prose {
  max-width: 65ch;
}

.prose-slate {
  --tw-prose-body: #334155;
  --tw-prose-headings: #0f172a;
  --tw-prose-links: #2563eb;
  --tw-prose-bold: #1e293b;
}
</style>