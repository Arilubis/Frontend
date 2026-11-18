<template>
  <div class="min-h-screen bg-[#F8FAFC] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 font-[Poppins,sans-serif] text-slate-900 selection:bg-blue-100">
    <div class="max-w-[1440px] mx-auto">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">Manajemen Persetujuan</h1>
          <p class="text-slate-500 text-[13px] font-normal">Mengelola, mengalihkan, melewati, dan mengubah permintaan persetujuan aktif (khusus peran ADMIN).</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button @click="loadData" class="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95 transition-all cursor-pointer">
            <span class="material-icons text-sm">refresh</span> Refresh
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <!-- Left Panel: Active Documents List -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Search & Filter Card -->
          <div class="bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm space-y-3">
            <div class="relative">
              <span class="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Cari permohonan aktif..." 
                class="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-[12px] focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
              />
            </div>
            
            <div class="flex gap-2">
              <select 
                v-model="statusFilter" 
                class="w-full px-3 py-2 bg-slate-50 border-none rounded-xl text-[12px] text-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Semua Status Aktif</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="REVISION">Revision</option>
              </select>
            </div>
          </div>

          <!-- Document List Card -->
          <div class="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permohonan Aktif</span>
              <span class="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {{ filteredDocs.length }} dokumen
              </span>
            </div>

            <div v-if="loadingDocs" class="py-12 text-center">
              <div class="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p class="text-xs text-slate-400">Memuat permohonan aktif...</p>
            </div>

            <div v-else-if="filteredDocs.length === 0" class="py-12 text-center">
              <span class="material-icons text-slate-200 text-4xl mb-2">find_in_page</span>
              <p class="text-xs text-slate-400">Tidak ada permohonan persetujuan aktif yang ditemukan</p>
            </div>

            <div v-else class="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
              <div 
                v-for="doc in filteredDocs" 
                :key="doc.id" 
                @click="selectDocument(doc)"
                :class="[
                  selectedDoc?.id === doc.id ? 'bg-blue-50/50 border-l-4 border-blue-500' : 'hover:bg-slate-50/50'
                ]"
                class="p-4 cursor-pointer transition-all flex flex-col gap-1.5"
              >
                <div class="flex items-start justify-between gap-2">
                  <span class="font-medium text-slate-800 text-[13px] line-clamp-1 leading-tight group-hover:text-blue-600">
                    {{ doc.title }}
                  </span>
                  <span 
                    :class="statusBadgeClass(doc.status)" 
                    class="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-md shrink-0"
                  >
                    {{ doc.status }}
                  </span>
                </div>
                <div class="flex justify-between items-center text-[10px] text-slate-400">
                  <span>{{ doc.number || 'Tidak ada nomor dokumen' }}</span>
                  <span>{{ formatDate(doc.createdAt) }}</span>
                </div>
                <div class="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <span class="material-icons text-[12px] text-slate-400">person</span>
                  <span class="truncate">Pembuat: {{ getCreatorName(doc) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Document detail and level control -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
            <div v-if="selectedDoc" class="space-y-6">
              
              <!-- Document Details Area -->
              <div class="border-b border-slate-100 pb-4">
                <div class="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <h2 class="text-lg font-semibold text-slate-900 tracking-tight">{{ selectedDoc.title }}</h2>
                  <div class="flex gap-2">
                    <span :class="statusBadgeClass(selectedDoc.status)" class="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider">
                      {{ selectedDoc.status }}
                    </span>
                  </div>
                </div>
                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-h-[320px] overflow-y-auto custom-scrollbar document-content text-[12px] text-slate-700 mb-4">
                  <div v-html="selectedDoc.description || 'Tidak ada deskripsi yang disediakan.'"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px]">
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2">
                      <span class="text-slate-400 font-normal">Diajukan Oleh:</span>
                      <span class="text-slate-700 font-medium">{{ getCreatorName(selectedDoc) }}</span>
                    </div>
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2">
                      <span class="text-slate-400 font-normal">Tanggal Pengajuan:</span>
                      <span class="text-slate-700 font-medium">{{ formatDate(selectedDoc.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Approval Levels Control Section -->
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <span class="material-icons text-blue-600 text-sm">settings_suggest</span> Tingkat Alur Kerja Persetujuan
                </h3>

                <div v-if="loadingDetail" class="py-12 text-center">
                  <div class="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p class="text-xs text-slate-400">Memuat rincian...</p>
                </div>

                <div v-else class="space-y-5">
                  <div 
                    v-for="level in selectedDoc.approvalLevels" 
                    :key="level.level" 
                    class="bg-white border rounded-2xl shadow-sm transition-all"
                    :class="[
                      isLevelActive(level) ? 'border-blue-300 ring-2 ring-blue-50' : 'border-slate-200'
                    ]"
                  >
                    <!-- Level Header -->
                    <div class="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 rounded-t-2xl">
                      <div class="flex items-center gap-2.5">
                        <span 
                          :class="[
                            isLevelActive(level) ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                          ]"
                          class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        >
                          {{ level.level }}
                        </span>
                        <div>
                          <h4 class="text-xs font-semibold text-slate-800">Persetujuan Level {{ level.level }}</h4>
                          <p class="text-[9px] text-slate-400">Approver yang dibutuhkan: {{ level.requiredApprovers || 'Semua' }}</p>
                        </div>
                      </div>

                      <!-- Level Actions -->
                      <div class="flex items-center gap-2">
                        <button 
                          v-if="!isLevelCompleted(level)"
                          @click="openAddModal(level)"
                          class="flex items-center gap-1 py-1 px-2.5 border border-blue-200 bg-blue-50/30 hover:bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-lg active:scale-95 transition-all cursor-pointer"
                        >
                          <span class="material-icons text-xs">person_add</span> Add Approver
                        </button>
                        <button 
                          v-if="!isLevelCompleted(level)"
                          @click="openBypassModal(level)"
                          class="flex items-center gap-1 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                        >
                          <span class="material-icons text-xs">skip_next</span> Bypass Level
                        </button>
                        <button 
                          v-if="!isLevelCompleted(level)"
                          @click="openBypassApprovedModal(level)"
                          class="flex items-center gap-1 py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                        >
                          <span class="material-icons text-xs">check_circle</span> Bypass Approved
                        </button>
                        <span 
                          v-else 
                          class="text-[9px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1"
                        >
                          <span class="material-icons text-[10px]">check_circle</span> Selesai
                        </span>
                      </div>
                    </div>

                    <!-- Level Approvers List -->
                    <div class="p-4 divide-y divide-slate-100">
                      <div v-if="!level.approvers || level.approvers.length === 0" class="py-3 text-center text-xs text-slate-400">
                        Tidak ada approver yang ditugaskan pada level ini
                      </div>
                      
                      <div 
                        v-else 
                        v-for="app in level.approvers" 
                        :key="app.id"
                        class="py-3 flex flex-wrap items-center justify-between gap-3 first:pt-0 last:pb-0"
                      >
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <span class="material-icons text-sm">person</span>
                          </div>
                          <div>
                            <div class="text-[12px] font-semibold text-slate-800">{{ app.fullName || app.name || 'Unknown' }}</div>
                            <div class="text-[9px] text-slate-400">{{ app.email || app.username }}</div>
                          </div>
                        </div>

                        <!-- Status & Action controls -->
                        <div class="flex items-center gap-3">
                          <span 
                            :class="approverStatusClass(app.status)"
                            class="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-md"
                          >
                            {{ app.status }}
                          </span>
                          
                          <!-- Reassign & Remove controls for pending approvers, or first/last level -->
                          <div v-if="(app.status === 'PENDING' && !isLevelCompleted(level)) || isFirstOrLastLevel(level)" class="flex gap-1.5">
                            <button 
                              @click="openReassignModal(level, app)"
                              class="p-1 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded text-blue-600 transition-all cursor-pointer"
                              title="Reassign Approver"
                            >
                              <span class="material-icons text-sm">swap_horiz</span>
                            </button>
                            <button 
                              @click="openRemoveModal(level, app)"
                              class="p-1 hover:bg-red-50 border border-transparent hover:border-red-100 rounded text-red-600 transition-all cursor-pointer"
                              title="Remove Approver"
                            >
                              <span class="material-icons text-sm">close</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Empty Selection State -->
            <div v-else class="py-24 flex flex-col items-center justify-center text-center">
              <div class="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-500">
                <span class="material-icons text-3xl">assignment_turned_in</span>
              </div>
              <h3 class="text-sm font-semibold text-slate-800 mb-1">Pilih Permohonan</h3>
              <p class="text-xs text-slate-400 max-w-sm">Pilih dokumen permohonan aktif dari panel sebelah kiri untuk mengelola alur kerja persetujuan dan mengubah approver.</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Modals Section -->
    
    <!-- 1. REASSIGN MODAL -->
    <Transition name="modal-fade">
      <div v-if="modals.reassign.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal('reassign')"></div>
        
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Reassign Approver</h3>
            <button @click="closeModal('reassign')" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Form Area -->
          <div class="p-6 overflow-y-auto space-y-4 flex-1">
            <!-- Step 1: Input -->
            <div v-if="!modals.reassign.confirming" class="space-y-4">
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tingkat Level</label>
                  <div class="px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 font-semibold">
                    Level {{ modals.reassign.level }}
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Approver Saat Ini</label>
                  <div class="px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 font-medium truncate">
                    {{ modals.reassign.targetApprover?.fullName || modals.reassign.targetApprover?.name }}
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Approver Baru</label>
                <select 
                  v-model="modals.reassign.newApproverId" 
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
                >
                  <option value="">Pilih approver baru...</option>
                  <option 
                    v-for="user in filteredAvailableApprovers(modals.reassign.targetApprover?.id)" 
                    :key="user.id" 
                    :value="user.id"
                  >
                    {{ user.fullName || user.name }} ({{ user.username }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Metode</label>
                <div class="grid grid-cols-2 gap-3">
                  <label 
                    class="border rounded-xl p-3 flex flex-col gap-1 cursor-pointer transition-all hover:bg-slate-50/50"
                    :class="[
                      modals.reassign.mode === 'REPLACE' ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500' : 'border-slate-200'
                    ]"
                  >
                    <div class="flex items-center gap-2">
                      <input type="radio" value="REPLACE" v-model="modals.reassign.mode" class="text-blue-600 focus:ring-blue-500">
                      <span class="text-xs font-semibold text-slate-800">REPLACE</span>
                    </div>
                    <span class="text-[9px] text-slate-400 leading-tight">Gantikan posisi approver lama secara langsung di level ini.</span>
                  </label>
                  
                  <label 
                    class="border rounded-xl p-3 flex flex-col gap-1 cursor-pointer transition-all hover:bg-slate-50/50"
                    :class="[
                      modals.reassign.mode === 'TRANSFER' ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-500' : 'border-slate-200'
                    ]"
                  >
                    <div class="flex items-center gap-2">
                      <input type="radio" value="TRANSFER" v-model="modals.reassign.mode" class="text-blue-600 focus:ring-blue-500">
                      <span class="text-xs font-semibold text-slate-800">TRANSFER</span>
                    </div>
                    <span class="text-[9px] text-slate-400 leading-tight">Pindahkan hak persetujuan kepada approver baru.</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Alasan Pengalihan</label>
                <textarea 
                  v-model="modals.reassign.reason" 
                  rows="3" 
                  placeholder="Jelaskan alasan pengalihan approver ini..." 
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 placeholder:text-slate-400 font-normal transition-all duration-200 resize-none shadow-inner bg-slate-50/30 focus:bg-white"
                ></textarea>
                <div class="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                  <span class="flex items-center gap-0.5">
                    <span class="material-icons text-[11px] text-slate-300">info</span>
                    <span>Minimal 10 karakter</span>
                  </span>
                  <span class="font-medium" :class="modals.reassign.reason.length >= 10 ? 'text-emerald-600' : 'text-slate-400'">
                    {{ modals.reassign.reason.length }}/200
                  </span>
                </div>
              </div>
            </div>

            <!-- Step 2: Confirm popup -->
            <div v-else class="flex flex-col items-center py-4 text-center">
              <div class="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 text-blue-600">
                <span class="material-icons text-2xl">help_outline</span>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-2">Apakah yakin ingin mengganti approver?</h4>
              
              <div class="w-full text-left bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs space-y-2 mt-2">
                <div class="flex justify-between">
                  <span class="text-slate-400">Approver Lama:</span>
                  <span class="text-slate-700 font-semibold">{{ modals.reassign.targetApprover?.fullName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Approver Baru:</span>
                  <span class="text-slate-700 font-semibold">{{ getApproverNameById(modals.reassign.newApproverId) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Metode:</span>
                  <span class="text-blue-600 font-bold">{{ modals.reassign.mode }}</span>
                </div>
                <div class="border-t pt-2 mt-2">
                  <span class="text-slate-400 block mb-1">Alasan:</span>
                  <span class="text-slate-600 italic block leading-relaxed">"{{ modals.reassign.reason }}"</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button 
              v-if="!modals.reassign.confirming"
              @click="closeModal('reassign')" 
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              v-else
              @click="modals.reassign.confirming = false" 
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Kembali
            </button>

            <button 
              v-if="!modals.reassign.confirming"
              @click="submitReassignForm" 
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              Langkah Selanjutnya
            </button>
            <button 
              v-else
              @click="executeReassign" 
              :disabled="submittingAction"
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <div v-if="submittingAction" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span v-else>Konfirmasi Pengalihan</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. ADD APPROVER MODAL -->
    <Transition name="modal-fade">
      <div v-if="modals.add.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal('add')"></div>
        
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Add Approver</h3>
            <button @click="closeModal('add')" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Form Area -->
          <div class="p-6 overflow-y-auto space-y-4 flex-1">
            <div v-if="!modals.add.confirming" class="space-y-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tingkat Level Tujuan</label>
                <select 
                  v-model="modals.add.level" 
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700 cursor-pointer"
                >
                  <option 
                    v-for="lvl in selectedDoc?.approvalLevels" 
                    :key="lvl.level" 
                    :value="lvl.level"
                  >
                    Level {{ lvl.level }} (Aktif)
                  </option>
                  <option :value="nextNewLevel">
                    Level {{ nextNewLevel }} (Buat Level Baru)
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Pilih Approver</label>
                <select 
                  v-model="modals.add.approverId" 
                  class="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
                >
                  <option value="">Pilih approver yang ingin ditambahkan...</option>
                  <option 
                    v-for="user in filteredAddApprovers(modals.add.level)" 
                    :key="user.id" 
                    :value="user.id"
                  >
                    {{ user.fullName || user.name }} ({{ user.username }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Alasan</label>
                <textarea 
                  v-model="modals.add.reason" 
                  rows="3" 
                  placeholder="Jelaskan alasan menambahkan approver ini..." 
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 placeholder:text-slate-400 font-normal transition-all duration-200 resize-none shadow-inner bg-slate-50/30 focus:bg-white"
                ></textarea>
                <div class="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                  <span class="flex items-center gap-0.5">
                    <span class="material-icons text-[11px] text-slate-300">info</span>
                    <span>Minimal 10 karakter</span>
                  </span>
                  <span class="font-medium" :class="modals.add.reason.length >= 10 ? 'text-emerald-600' : 'text-slate-400'">
                    {{ modals.add.reason.length }}/200
                  </span>
                </div>
              </div>
            </div>

            <!-- Step 2: Confirm -->
            <div v-else class="flex flex-col items-center py-4 text-center">
              <div class="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 text-blue-600">
                <span class="material-icons text-2xl">help_outline</span>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-2">Apakah yakin ingin menambahkan approver baru?</h4>
              
              <div class="w-full text-left bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs space-y-2 mt-2">
                <div class="flex justify-between">
                  <span class="text-slate-400">Tingkat Level:</span>
                  <span class="text-slate-700 font-semibold">Level {{ modals.add.level }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Approver Baru:</span>
                  <span class="text-slate-700 font-semibold">{{ getApproverNameById(modals.add.approverId) }}</span>
                </div>
                <div class="border-t pt-2 mt-2">
                  <span class="text-slate-400 block mb-1">Alasan:</span>
                  <span class="text-slate-600 italic block leading-relaxed">"{{ modals.add.reason }}"</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button 
              v-if="!modals.add.confirming"
              @click="closeModal('add')" 
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              v-else
              @click="modals.add.confirming = false" 
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Kembali
            </button>

            <button 
              v-if="!modals.add.confirming"
              @click="submitAddForm" 
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              Langkah Selanjutnya
            </button>
            <button 
              v-else
              @click="executeAdd" 
              :disabled="submittingAction"
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <div v-if="submittingAction" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span v-else>Konfirmasi Penambahan</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 3. REMOVE APPROVER MODAL -->
    <Transition name="modal-fade">
      <div v-if="modals.remove.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal('remove')"></div>
        
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide text-red-600">Remove Approver</h3>
            <button @click="closeModal('remove')" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Form Area -->
          <div class="p-6 overflow-y-auto space-y-4 flex-1">
            <div v-if="!modals.remove.confirming" class="space-y-4">
              <div class="bg-red-50 text-red-700 p-3 rounded-xl text-xs border border-red-100 flex items-start gap-2">
                <span class="material-icons text-sm mt-0.5">warning</span>
                <span>Membatalkan approver dari level ini akan mencatat pembatalan ke audit log.</span>
              </div>

              <div class="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tingkat Level</label>
                  <div class="px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 font-semibold">
                    Level {{ modals.remove.level }}
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Approver Terarah</label>
                  <div class="px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 font-medium truncate">
                    {{ modals.remove.targetApprover?.fullName || modals.remove.targetApprover?.name }}
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Alasan Penghapusan</label>
                <textarea 
                  v-model="modals.remove.reason" 
                  rows="3" 
                  placeholder="Jelaskan alasan menghapus approver ini..." 
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 placeholder:text-slate-400 font-normal transition-all duration-200 resize-none shadow-inner bg-slate-50/30 focus:bg-white"
                ></textarea>
                <div class="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                  <span class="flex items-center gap-0.5">
                    <span class="material-icons text-[11px] text-slate-300">info</span>
                    <span>Minimal 10 karakter</span>
                  </span>
                  <span class="font-medium" :class="modals.remove.reason.length >= 10 ? 'text-emerald-600' : 'text-slate-400'">
                    {{ modals.remove.reason.length }}/200
                  </span>
                </div>
              </div>
            </div>

            <!-- Step 2: Confirm -->
            <div v-else class="flex flex-col items-center py-4 text-center">
              <div class="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4 text-red-600">
                <span class="material-icons text-2xl">warning</span>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">Apakah yakin ingin menghapus approver ini?</h4>
              <p class="text-[11px] text-slate-400 mb-4">Tindakan ini akan tercatat pada log riwayat audit.</p>
              
              <div class="w-full text-left bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-400">Tingkat Level:</span>
                  <span class="text-slate-700 font-semibold">Level {{ modals.remove.level }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Nama Approver:</span>
                  <span class="text-slate-700 font-semibold">{{ modals.remove.targetApprover?.fullName }}</span>
                </div>
                <div class="border-t pt-2 mt-2">
                  <span class="text-slate-400 block mb-1">Alasan:</span>
                  <span class="text-slate-600 italic block leading-relaxed">"{{ modals.remove.reason }}"</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button 
              v-if="!modals.remove.confirming"
              @click="closeModal('remove')" 
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              v-else
              @click="modals.remove.confirming = false" 
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Kembali
            </button>

            <button 
              v-if="!modals.remove.confirming"
              @click="submitRemoveForm" 
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              Langkah Selanjutnya
            </button>
            <button 
              v-else
              @click="executeRemove" 
              :disabled="submittingAction"
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <div v-if="submittingAction" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span v-else>Konfirmasi Penghapusan</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 4. BYPASS LEVEL MODAL -->
    <Transition name="modal-fade">
      <div v-if="modals.bypass.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeModal('bypass')"></div>
        
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-sm font-bold uppercase tracking-wide text-blue-600">
              {{ modals.bypass.action === 'APPROVED' ? 'Bypass Approved' : 'Bypass Level' }}
            </h3>
            <button @click="closeModal('bypass')" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Form Area -->
          <div class="p-6 overflow-y-auto space-y-4 flex-1">
            <div v-if="!modals.bypass.confirming" class="space-y-4">
              <div class="bg-blue-50 text-blue-700 border border-blue-100 p-3.5 rounded-xl text-xs flex items-start gap-2">
                <span class="material-icons text-sm mt-0.5">info</span>
                <span v-if="modals.bypass.action === 'APPROVED'">Bypass Approved akan menyetujui semua persetujuan pada level ini dan menandai level ini selesai sebagai disetujui.</span>
                <span v-else>Bypass akan melewati semua persetujuan pada level ini dan langsung menandai level ini selesai.</span>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Tingkat Level Terarah</label>
                <div class="px-3 py-2 bg-slate-50 border rounded-xl text-slate-700 font-semibold text-xs">
                  Level {{ modals.bypass.level }} Approval
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Alasan Bypass</label>
                <textarea 
                  v-model="modals.bypass.reason" 
                  rows="3" 
                  placeholder="Jelaskan alasan melewati level persetujuan ini..." 
                  class="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 placeholder:text-slate-400 font-normal transition-all duration-200 resize-none shadow-inner bg-slate-50/30 focus:bg-white"
                ></textarea>
                <div class="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                  <span class="flex items-center gap-0.5">
                    <span class="material-icons text-[11px] text-slate-300">info</span>
                    <span>Minimal 20 karakter</span>
                  </span>
                  <span class="font-medium" :class="modals.bypass.reason.length >= 20 ? 'text-emerald-600' : 'text-slate-400'">
                    {{ modals.bypass.reason.length }}/200
                  </span>
                </div>
              </div>
            </div>

            <!-- Step 2: Confirm -->
            <div v-else class="flex flex-col items-center py-4 text-center">
              <div class="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 text-blue-600">
                <span class="material-icons text-2xl">help_outline</span>
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-2">
                Apakah yakin ingin melakukan {{ modals.bypass.action === 'APPROVED' ? 'Bypass Approved' : 'Bypass Level' }} ini?
              </h4>
              
              <div class="w-full text-left bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs space-y-2 mt-2">
                <div class="flex justify-between">
                  <span class="text-slate-400">Level Terlewati:</span>
                  <span class="text-slate-700 font-semibold">Level {{ modals.bypass.level }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Tindakan:</span>
                  <span class="font-semibold text-blue-600">
                    {{ modals.bypass.action === 'APPROVED' ? 'Bypass Approved' : 'Bypass Level (Skip)' }}
                  </span>
                </div>
                <div class="border-t pt-2 mt-2">
                  <span class="text-slate-400 block mb-1">Alasan:</span>
                  <span class="text-slate-600 italic block leading-relaxed">"{{ modals.bypass.reason }}"</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button 
              v-if="!modals.bypass.confirming"
              @click="closeModal('bypass')" 
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button 
              v-else
              @click="modals.bypass.confirming = false" 
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Kembali
            </button>

            <button 
              v-if="!modals.bypass.confirming"
              @click="submitBypassForm" 
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              Langkah Selanjutnya
            </button>
            <button 
              v-else
              @click="executeBypass" 
              :disabled="submittingAction"
              class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <div v-if="submittingAction" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span v-else>Konfirmasi Bypass</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import permohonanService from '@/services/permohonanService';
import Swal from 'sweetalert2';

// Helper to extract creator name
const getCreatorName = (doc) => {
  if (!doc) return 'Unknown';
  return (
    doc.creatorInfo?.fullName || 
    doc.creatorInfo?.name || 
    doc.createdByInfo?.fullName || 
    doc.createdByInfo?.name || 
    doc.creator?.fullName || 
    doc.creator?.name || 
    doc.creatorName || 
    doc.createdByName || 
    doc.creator?.username || 
    'Unknown'
  );
};

// State Management
const documents = ref([]);
const selectedDoc = ref(null);
const availableApprovers = ref([]);
const history = ref([]);

const searchQuery = ref('');
const statusFilter = ref('');

const loadingDocs = ref(false);
const loadingDetail = ref(false);
const loadingHistory = ref(false);
const submittingAction = ref(false);

// Modals State
const modals = ref({
  reassign: {
    show: false,
    level: 1,
    targetApprover: null,
    newApproverId: '',
    mode: 'REPLACE',
    reason: '',
    confirming: false
  },
  add: {
    show: false,
    level: 1,
    approverId: '',
    reason: '',
    confirming: false
  },
  remove: {
    show: false,
    level: 1,
    targetApprover: null,
    reason: '',
    confirming: false
  },
  bypass: {
    show: false,
    level: 1,
    reason: '',
    confirming: false,
    action: 'SKIPPED'
  }
});

// Lifecycle load
const loadData = async () => {
  try {
    loadingDocs.value = true;
    // ✅ Mengambil hanya dokumen aktif langsung dari backend dengan view compact (sangat cepat)
    const response = await permohonanService.getPermohonan({
      status: 'SUBMITTED,IN_REVIEW,REVISION',
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      view: 'compact'
    });
    const docs = response.data || [];
    documents.value = docs;
    
    // Auto select first document or refresh the currently selected one
    if (documents.value.length > 0) {
      if (selectedDoc.value) {
        const found = documents.value.find(d => d.id === selectedDoc.value.id);
        if (found) {
          await selectDocument(found);
        } else {
          await selectDocument(documents.value[0]);
        }
      } else {
        await selectDocument(documents.value[0]);
      }
    } else {
      selectedDoc.value = null;
    }
  } catch (err) {
    console.error('Failed to load documents:', err);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Gagal memuat daftar dokumen persetujuan'
    });
  } finally {
    loadingDocs.value = false;
  }
};

const loadApproversList = async () => {
  try {
    const res = await permohonanService.getApprovers({ limit: 500 });
    availableApprovers.value = res.data || [];
  } catch (err) {
    console.error('Failed to load approvers:', err);
  }
};

onMounted(async () => {
  await Promise.all([loadData(), loadApproversList()]);
});

// Computed Properties
const filteredDocs = computed(() => {
  let docs = documents.value || [];
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    docs = docs.filter(d => 
      (d.title || '').toLowerCase().includes(query) || 
      (d.number || '').toLowerCase().includes(query)
    );
  }
  
  if (statusFilter.value) {
    docs = docs.filter(d => d.status === statusFilter.value);
  }
  
  return docs;
});

const nextNewLevel = computed(() => {
  if (!selectedDoc.value || !selectedDoc.value.approvalLevels) return 1;
  const levels = selectedDoc.value.approvalLevels.map(l => l.level);
  if (levels.length === 0) return 1;
  return Math.max(...levels) + 1;
});

// Document Selection
const selectDocument = async (doc) => {
  try {
    loadingDetail.value = true;
    const res = await permohonanService.getPermohonanById(doc.id);
    selectedDoc.value = res.data;
  } catch (err) {
    console.error('Failed to fetch details:', err);
    selectedDoc.value = doc; // fallback to basic data
  } finally {
    loadingDetail.value = false;
  }
};

const fetchHistory = async () => {
  // Safe stub - history not used in template
  history.value = [];
};

// Level checks
const isLevelActive = (level) => {
  if (!selectedDoc.value) return false;
  return level.level === selectedDoc.value.currentLevel;
};

const isLevelCompleted = (level) => {
  if (!level.approvers || level.approvers.length === 0) return false;
  return level.approvers.every(app => ['APPROVED', 'REJECTED', 'SKIPPED'].includes(app.status));
};

// Modal open/close helpers
const openReassignModal = (level, approver) => {
  modals.value.reassign = {
    show: true,
    level: level.level,
    targetApprover: approver,
    newApproverId: '',
    mode: 'REPLACE',
    reason: '',
    confirming: false
  };
};

const openAddModal = (level) => {
  modals.value.add = {
    show: true,
    level: level.level,
    approverId: '',
    reason: '',
    confirming: false
  };
};

const openRemoveModal = (level, approver) => {
  modals.value.remove = {
    show: true,
    level: level.level,
    targetApprover: approver,
    reason: '',
    confirming: false
  };
};

const openBypassModal = (level) => {
  modals.value.bypass = {
    show: true,
    level: level.level,
    reason: '',
    confirming: false,
    action: 'SKIPPED'
  };
};

const openBypassApprovedModal = (level) => {
  modals.value.bypass = {
    show: true,
    level: level.level,
    reason: '',
    confirming: false,
    action: 'APPROVED'
  };
};

const closeModal = (type) => {
  if (modals.value[type]) {
    modals.value[type].show = false;
    modals.value[type].confirming = false;
  }
};

// Form validations & confirmations
const submitReassignForm = () => {
  const form = modals.value.reassign;
  if (!form.newApproverId) {
    return showSwalWarning('Approver Baru wajib dipilih');
  }
  if (form.newApproverId === form.targetApprover.id) {
    return showSwalWarning('Approver Baru tidak boleh sama dengan Approver Lama');
  }
  if (!form.reason || form.reason.trim().length < 10) {
    return showSwalWarning('Keterangan/alasan wajib diisi (minimal 10 karakter)');
  }
  form.confirming = true;
};

const submitAddForm = () => {
  const form = modals.value.add;
  if (!form.approverId) {
    return showSwalWarning('Approver wajib dipilih');
  }
  if (!form.reason || form.reason.trim().length < 10) {
    return showSwalWarning('Keterangan/alasan wajib diisi (minimal 10 karakter)');
  }
  form.confirming = true;
};

const submitRemoveForm = () => {
  const form = modals.value.remove;
  if (!form.reason || form.reason.trim().length < 10) {
    return showSwalWarning('Keterangan/alasan wajib diisi (minimal 10 karakter)');
  }
  form.confirming = true;
};

const submitBypassForm = () => {
  const form = modals.value.bypass;
  if (!form.reason || form.reason.trim().length < 20) {
    return showSwalWarning('Keterangan/alasan bypass wajib diisi (minimal 20 karakter)');
  }
  form.confirming = true;
};

// Execution / API Handlers
const executeReassign = async () => {
  const form = modals.value.reassign;
  try {
    submittingAction.value = true;
    await permohonanService.adminReassignApprover(selectedDoc.value.id, {
      level: form.level,
      targetApproverId: form.targetApprover.id,
      newApproverId: form.newApproverId,
      mode: form.mode,
      reason: form.reason.trim()
    });
    
    showSwalSuccess('Approver berhasil diganti');
    closeModal('reassign');
    await loadData();
  } catch (err) {
    handleApiError(err);
  } finally {
    submittingAction.value = false;
  }
};

const executeAdd = async () => {
  const form = modals.value.add;
  try {
    submittingAction.value = true;
    await permohonanService.adminModifyApprovers(selectedDoc.value.id, {
      action: 'ADD',
      level: form.level,
      approverId: form.approverId,
      reason: form.reason.trim()
    });
    
    showSwalSuccess('Approver baru berhasil ditambahkan');
    closeModal('add');
    await loadData();
  } catch (err) {
    handleApiError(err);
  } finally {
    submittingAction.value = false;
  }
};

const executeRemove = async () => {
  const form = modals.value.remove;
  try {
    submittingAction.value = true;
    await permohonanService.adminModifyApprovers(selectedDoc.value.id, {
      action: 'REMOVE',
      level: form.level,
      approverId: form.targetApprover.id,
      reason: form.reason.trim()
    });
    
    showSwalSuccess('Approver berhasil dihapus');
    closeModal('remove');
    await loadData();
  } catch (err) {
    handleApiError(err);
  } finally {
    submittingAction.value = false;
  }
};

const executeBypass = async () => {
  const form = modals.value.bypass;
  try {
    submittingAction.value = true;
    await permohonanService.adminBypassLevel(selectedDoc.value.id, {
      level: form.level,
      reason: form.reason.trim(),
      action: form.action
    });
    
    showSwalSuccess(
      form.action === 'APPROVED' 
        ? 'Bypass Approved berhasil dilakukan' 
        : 'Level approval berhasil dilewati'
    );
    closeModal('bypass');
    await loadData();
  } catch (err) {
    handleApiError(err);
  } finally {
    submittingAction.value = false;
  }
};

// UI Helpers
const filteredAvailableApprovers = (excludeId) => {
  return availableApprovers.value.filter(u => u.id !== excludeId);
};

const filteredAddApprovers = () => {
  if (!selectedDoc.value) return availableApprovers.value;
  const existingIds = [];
  if (selectedDoc.value.approvalLevels) {
    selectedDoc.value.approvalLevels.forEach(levelObj => {
      (levelObj.approvers || []).forEach(a => {
        if (a.id) existingIds.push(a.id);
      });
    });
  }
  return availableApprovers.value.filter(u => !existingIds.includes(u.id));
};

const isFirstOrLastLevel = (level) => {
  if (!selectedDoc.value || !selectedDoc.value.approvalLevels) return false;
  const levels = selectedDoc.value.approvalLevels.map(l => l.level);
  if (levels.length === 0) return false;
  const maxLevel = Math.max(...levels);
  return level.level === 1 || level.level === maxLevel;
};

const getApproverNameById = (id) => {
  const found = availableApprovers.value.find(u => u.id === id);
  return found ? found.fullName || found.name : 'Unknown';
};

const showSwalWarning = (msg) => {
  Swal.fire({
    icon: 'warning',
    title: 'Perhatian',
    text: msg,
    confirmButtonColor: '#2563eb'
  });
};

const showSwalSuccess = (msg) => {
  Swal.fire({
    icon: 'success',
    title: 'Sukses',
    text: msg,
    confirmButtonColor: '#2563eb',
    timer: 2000,
    showConfirmButton: false
  });
};

const handleApiError = (err) => {
  console.error('API Error:', err);
  const errMsg = err.response?.data?.message || err.message || 'Gagal memproses aksi';
  Swal.fire({
    icon: 'error',
    title: 'Gagal',
    text: errMsg,
    confirmButtonColor: '#2563eb'
  });
};

const statusBadgeClass = (status) => {
  const statusClasses = {
    'SUBMITTED': 'bg-blue-50 text-blue-600 border border-blue-100',
    'IN_REVIEW': 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    'REVISION': 'bg-amber-50 text-amber-600 border border-amber-100',
    'APPROVED': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    'REJECTED': 'bg-red-50 text-red-600 border border-red-100',
    'CANCELLED': 'bg-slate-100 text-slate-500 border border-slate-200'
  };
  return statusClasses[status] || 'bg-slate-100 text-slate-600 border border-slate-200';
};

const approverStatusClass = (status) => {
  const statusClasses = {
    'PENDING': 'bg-slate-100 text-slate-600 border border-slate-200',
    'APPROVED': 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    'REJECTED': 'bg-red-50 text-red-600 border border-red-100',
    'SKIPPED': 'bg-blue-50 text-blue-600 border border-blue-100'
  };
  return statusClasses[status] || 'bg-slate-100 text-slate-600 border border-slate-200';
};

const logColorClass = (action) => {
  if (action?.includes('REASSIGN')) return 'bg-blue-500';
  if (action?.includes('ADD')) return 'bg-indigo-500';
  if (action?.includes('REMOVE')) return 'bg-red-500';
  if (action?.includes('BYPASS')) return 'bg-amber-500';
  return 'bg-slate-300';
};

const formatActionName = (action) => {
  if (!action) return 'SYSTEM ACTION';
  return action.replace(/_/g, ' ').toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '-';
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Custom HTML styling within document previews */
.document-content :deep(h1), 
.document-content :deep(h2), 
.document-content :deep(h3),
.document-content :deep(h4) {
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #0f172a;
}
.document-content :deep(h1) { font-size: 1.5rem; }
.document-content :deep(h2) { font-size: 1.25rem; }
.document-content :deep(h3) { font-size: 1.1rem; }

.document-content :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.document-content :deep(ul) {
  list-style-type: disc !important;
  padding-left: 1.5rem !important;
  margin-bottom: 0.75rem !important;
}

.document-content :deep(ol) {
  list-style-type: decimal !important;
  padding-left: 1.5rem !important;
  margin-bottom: 0.75rem !important;
}

.document-content :deep(li) {
  margin-bottom: 0.25rem;
  display: list-item !important;
}

.document-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 11px;
}

.document-content :deep(th), 
.document-content :deep(td) {
  border: 1px solid #e2e8f0;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.document-content :deep(th) {
  background-color: #f8fafc;
  font-weight: 600;
}

.document-content :deep(strong), 
.document-content :deep(b) {
  font-weight: 600;
  color: #0f172a;
}
</style>
