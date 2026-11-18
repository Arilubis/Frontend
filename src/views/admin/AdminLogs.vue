<template>
  <div class="min-h-screen bg-[#F1F5F9] px-3 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-4 font-sans text-slate-900 transition-all duration-300">
    <div class="max-w-[1440px] mx-auto space-y-5">
      
      <!-- ================= HEADER SECTION ================= -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-[24px] border border-slate-200 shadow-sm">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2 flex-wrap">
            <button
              @click="router.push('/admin/dashboard')"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95 cursor-pointer"
            >
              <span class="material-icons text-sm">arrow_back</span>
              Dashboard Admin
            </button>
          </div>

          <h1 class="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-800 tracking-tight" >
            Notification & Audit Logs
          </h1>
        </div>

        <!-- Action Refresh -->
        <div class="flex items-center gap-2">
          <button
            @click="refreshCurrentTab"
            :disabled="isLoading"
            class="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span class="material-icons text-sm" :class="{ 'animate-spin': isLoading }">sync</span>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      <!-- ================= TABS NAVIGATION ================= -->
      <div class="bg-white p-1.5 sm:p-2 rounded-[20px] border border-slate-200 shadow-sm flex flex-wrap gap-1.5">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="activeTab === tab.id ? 'bg-blue-600 text-white shadow-md shadow-blue-100 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
        >
          <span class="material-icons text-[18px]">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.badge !== undefined && tab.badge > 0"
            :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600 border border-red-100'"
            class="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- ================= TAB 1: OVERVIEW & STATS ================= -->
      <div v-if="activeTab === 'stats'" class="space-y-5">
        
        <!-- Filter Bar Tanggal -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 sm:px-5 py-3.5 rounded-[20px] border border-slate-200 shadow-sm text-xs font-normal text-slate-600" >
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="font-medium text-slate-500">Mulai:</span>
              <input
                type="date"
                v-model="statsDateStart"
                @change="fetchStats"
                class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="font-medium text-slate-500">Sampai:</span>
              <input
                type="date"
                v-model="statsDateEnd"
                @change="fetchStats"
                class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div class="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              v-for="preset in datePresets"
              :key="preset.id"
              @click="applyStatsPreset(preset.id)"
              :class="activeStatsPreset === preset.id ? 'bg-blue-50 text-blue-600 border-blue-200 font-semibold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-medium'"
              class="px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>

        <!-- Stats Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Overall Delivery Rate -->
          <div class="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-3">
              <div class="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                <span class="material-icons text-xl">all_inbox</span>
              </div>
              <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full text-blue-700 bg-blue-50 border border-blue-100">
                Delivery Rate: {{ statsData.stats?.overall?.deliveryRate ?? 0 }}%
              </span>
            </div>
            <div class="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight" >
              {{ (statsData.stats?.overall?.total ?? 0).toLocaleString('id-ID') }}
            </div>
            <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1" >
              Total Notifikasi Dikirim
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
              <span class="text-emerald-600 flex items-center gap-1">
                <span class="material-icons text-xs">check_circle</span>
                Terkirim: {{ (statsData.stats?.overall?.delivered ?? 0).toLocaleString('id-ID') }}
              </span>
              <span class="text-rose-500 flex items-center gap-1">
                <span class="material-icons text-xs">cancel</span>
                Gagal: {{ (statsData.stats?.overall?.failed ?? 0).toLocaleString('id-ID') }}
              </span>
            </div>
          </div>

          <!-- WhatsApp Channel -->
          <div class="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-3">
              <div class="p-2.5 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-100">
                <span class="material-icons text-xl">chat</span>
              </div>
              <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-100">
                Success Rate: {{ statsData.stats?.whatsapp?.deliveryRate ?? 0 }}%
              </span>
            </div>
            <div class="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight" >
              {{ (statsData.stats?.whatsapp?.total ?? 0).toLocaleString('id-ID') }}
            </div>
            <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1" >
              WhatsApp Notifications
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
              <span class="text-emerald-600">Sukses: {{ statsData.stats?.whatsapp?.sent ?? 0 }}</span>
              <span class="text-rose-500">Gagal: {{ statsData.stats?.whatsapp?.failed ?? 0 }}</span>
              <span class="text-slate-400">Skipped: {{ statsData.stats?.whatsapp?.skipped ?? 0 }}</span>
            </div>
          </div>

          <!-- Email Channel -->
          <div class="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div class="flex items-center justify-between mb-3">
              <div class="p-2.5 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-100">
                <span class="material-icons text-xl">email</span>
              </div>
              <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full text-blue-700 bg-blue-50 border border-blue-100">
                Success Rate: {{ statsData.stats?.email?.deliveryRate ?? 0 }}%
              </span>
            </div>
            <div class="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight" >
              {{ (statsData.stats?.email?.total ?? 0).toLocaleString('id-ID') }}
            </div>
            <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1" >
              Email Notifications
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
              <span class="text-emerald-600">Sukses: {{ statsData.stats?.email?.sent ?? 0 }}</span>
              <span class="text-rose-500">Gagal: {{ statsData.stats?.email?.failed ?? 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Aktivitas 24 Jam Terakhir Card -->
        <div class="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200 shadow-sm">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <span class="material-icons text-lg">history_toggle_off</span>
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-semibold text-slate-800" >
                Aktivitas Notifikasi 24 Jam Terakhir
              </h3>
              <p class="text-xs text-slate-500 font-normal">Pemantauan volume pengiriman realtime hari ini</p>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">WA Sent</p>
              <p class="text-lg font-semibold text-emerald-600 mt-1">{{ statsData.last24h?.waSent ?? 0 }}</p>
            </div>
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">WA Failed</p>
              <p class="text-lg font-semibold text-rose-500 mt-1">{{ statsData.last24h?.waFailed ?? 0 }}</p>
            </div>
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">WA Skipped</p>
              <p class="text-lg font-semibold text-slate-500 mt-1">{{ statsData.last24h?.waSkipped ?? 0 }}</p>
            </div>
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Sent</p>
              <p class="text-lg font-semibold text-blue-600 mt-1">{{ statsData.last24h?.emailSent ?? 0 }}</p>
            </div>
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Email Failed</p>
              <p class="text-lg font-semibold text-rose-500 mt-1">{{ statsData.last24h?.emailFailed ?? 0 }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- ================= TAB 2: NOTIFICATION LOGS ================= -->
      <div v-else-if="activeTab === 'logs'" class="space-y-4">
        
        <!-- Filters Card -->
        <div class="bg-white p-4 sm:p-5 rounded-[20px] border border-slate-200 shadow-sm space-y-3">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            <!-- Search Recipient -->
            <div class="relative flex-1">
              <span class="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                v-model="logsFilter.recipient"
                @keyup.enter="fetchLogs(1)"
                type="text"
                placeholder="Cari berdasarkan email atau nomor telepon..."
                class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                
              />
            </div>

            <!-- Filters Group -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- Channel Selector -->
              <select
                v-model="logsFilter.channel"
                @change="fetchLogs(1)"
                class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium outline-none focus:border-blue-500 cursor-pointer"
                
              >
                <option value="">Semua Channel</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
              </select>

              <!-- Status Selector -->
              <select
                v-model="logsFilter.status"
                @change="fetchLogs(1)"
                class="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium outline-none focus:border-blue-500 cursor-pointer"
                
              >
                <option value="">Semua Status</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="WARNING">Warning</option>
              </select>

              <!-- Failed Only Toggle Button -->
              <button
                @click="toggleFailedOnly"
                :class="isFailedOnly ? 'bg-rose-50 border-rose-200 text-rose-600 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600 font-medium'"
                class="px-3 py-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                
              >
                <span class="material-icons text-sm" :class="isFailedOnly ? 'text-rose-500' : 'text-slate-400'">error_outline</span>
                <span>Hanya yang Gagal</span>
              </button>

              <!-- Reset Filters -->
              <button
                @click="resetLogsFilter"
                class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer"
                
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" >
                  <th class="py-3.5 px-4 sm:px-6">Channel & Event</th>
                  <th class="py-3.5 px-4">Penerima</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-4">Waktu</th>
                  <th class="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700 font-medium" >
                <!-- Loading State -->
                <tr v-if="isLoading">
                  <td colspan="5" class="py-12 text-center text-slate-400 font-normal">
                    <div class="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                    <p>Memuat log notifikasi...</p>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="logs.length === 0">
                  <td colspan="5" class="py-12 text-center text-slate-400 font-normal">
                    <span class="material-icons text-3xl text-slate-300 mb-1">inbox</span>
                    <p>Tidak ada log notifikasi yang ditemukan.</p>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-3 px-4 sm:px-6">
                    <div class="flex items-center gap-2.5">
                      <div
                        :class="log.details?.channel === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'"
                        class="w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0"
                      >
                        <span class="material-icons text-sm">{{ log.details?.channel === 'WHATSAPP' ? 'chat' : 'email' }}</span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-slate-800 truncate">{{ log.details?.event || log.action }}</p>
                        <p class="text-[10px] text-slate-400 font-normal">{{ log.details?.channel || 'UNKNOWN' }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="py-3 px-4">
                    <p class="font-semibold text-slate-800">{{ log.details?.recipientName || '—' }}</p>
                    <p class="text-[11px] text-slate-500 font-normal">{{ log.details?.recipient || log.actor || '—' }}</p>
                  </td>

                  <td class="py-3 px-4">
                    <span
                      :class="{
                        'bg-emerald-50 text-emerald-700 border-emerald-200': log.status === 'SUCCESS',
                        'bg-rose-50 text-rose-700 border-rose-200': log.status === 'FAILED',
                        'bg-amber-50 text-amber-700 border-amber-200': log.status === 'WARNING'
                      }"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="{
                        'bg-emerald-500': log.status === 'SUCCESS',
                        'bg-rose-500': log.status === 'FAILED',
                        'bg-amber-500': log.status === 'WARNING'
                      }"></span>
                      {{ log.status }}
                    </span>
                  </td>

                  <td class="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap font-normal">
                    {{ formatDate(log.createdAt) }}
                  </td>

                  <td class="py-3 px-4 sm:px-6 text-right">
                    <button
                      @click="selectedLogDetail = log"
                      class="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer active:scale-95"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="px-4 sm:px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-normal">
            <div>
              Menampilkan {{ logs.length }} dari {{ pagination.total || 0 }} data (Halaman {{ pagination.page }} dari {{ pagination.totalPages || 1 }})
            </div>
            <div class="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                @click="fetchLogs(pagination.page - 1)"
                :disabled="pagination.page <= 1 || isLoading"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Sebelumnya
              </button>
              <span class="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                {{ pagination.page }}
              </span>
              <button
                @click="fetchLogs(pagination.page + 1)"
                :disabled="pagination.page >= pagination.totalPages || isLoading"
                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ================= TAB 3: IBS ATTACHMENT FAILURES ================= -->
      <div v-else-if="activeTab === 'attachment-failures'" class="space-y-4">
        
        <!-- Info Alert Card -->
        <div class="bg-amber-50 border border-amber-200 rounded-[20px] p-4 sm:p-5 flex items-start gap-3">
          <span class="material-icons text-amber-600 text-xl flex-shrink-0 mt-0.5">warning_amber</span>
          <div class="text-xs text-amber-800 space-y-1" >
            <p class="font-semibold text-sm">Monitoring Kegagalan Berkas Lampiran IBS</p>
            <p class="font-normal text-amber-700">
              Bagian ini mendeteksi pengajuan Approval Request yang berhasil dibuat oleh API IBS, namun berkas attachment-nya corrupt, kosong (0 KB), atau gagal diunggah ke server DMS.
            </p>
          </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-400 uppercase tracking-wider" >
                  <th class="py-3.5 px-4 sm:px-6">No. Referensi / Transaksi</th>
                  <th class="py-3.5 px-4">Approval Request ID</th>
                  <th class="py-3.5 px-4">Ringkasan Berkas</th>
                  <th class="py-3.5 px-4">Status & Pesan</th>
                  <th class="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs text-slate-700 font-medium" >
                <!-- Loading State -->
                <tr v-if="isLoading">
                  <td colspan="5" class="py-12 text-center text-slate-400 font-normal">
                    <div class="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                    <p>Memuat data kegagalan berkas IBS...</p>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="attachmentFailures.length === 0">
                  <td colspan="5" class="py-12 text-center text-slate-400 font-normal">
                    <span class="material-icons text-3xl text-emerald-400 mb-1">verified</span>
                    <p class="text-emerald-700 font-semibold">Semua attachment IBS dalam kondisi baik.</p>
                    <p class="text-xs text-slate-400 mt-0.5">Tidak ditemukan berkas yang corrupt atau kosong.</p>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr v-for="(item, idx) in attachmentFailures" :key="idx" class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-3 px-4 sm:px-6">
                    <p class="font-semibold text-slate-800">
                      {{ item.details?.refTransactionNumber || '—' }}
                    </p>
                    <p class="text-[10px] text-slate-400 font-normal">{{ item.action }}</p>
                  </td>

                  <td class="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {{ item.approvalRequestId || item.resourceId || '—' }}
                  </td>

                  <td class="py-3 px-4">
                    <div class="flex items-center gap-1.5 flex-wrap text-[11px]">
                      <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        Total: {{ item.details?.attachmentSummary?.totalRequested ?? '?' }}
                      </span>
                      <span class="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 font-semibold border border-rose-100">
                        Gagal: {{ item.details?.attachmentSummary?.totalFailed ?? '?' }}
                      </span>
                    </div>
                  </td>

                  <td class="py-3 px-4 max-w-xs">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {{ item.status }}
                    </span>
                    <p class="text-[11px] text-slate-500 font-normal truncate mt-1">
                      {{ item.details?.message || 'Gagal memproses attachment' }}
                    </p>
                  </td>

                  <td class="py-3 px-4 sm:px-6 text-right">
                    <button
                      @click="selectedAttachmentFailure = item"
                      class="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all cursor-pointer active:scale-95"
                    >
                      Lihat Berkas Gagal
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ================= TAB 4: BROADCAST NOTIFICATION ================= -->
      <div v-else-if="activeTab === 'broadcast'" class="space-y-4">
        
        <div class="bg-white p-5 sm:p-7 rounded-[24px] border border-slate-200 shadow-sm max-w-3xl space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <h3 class="text-base sm:text-lg font-semibold text-slate-800" >
              Kirim Broadcast Massal
            </h3>
            <p class="text-xs text-slate-500 font-normal mt-0.5">
              Kirim pesan pengumuman atau notifikasi penting ke pengguna melalui WhatsApp dan Push Notification.
            </p>
          </div>

          <!-- Target Selection -->
          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-700 block" >
              Target Penerima *
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                :class="broadcastForm.targetType === 'all' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-700 font-medium'"
                class="flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all"
              >
                <input type="radio" v-model="broadcastForm.targetType" value="all" class="text-blue-600" />
                <span>Semua Pengguna (All)</span>
              </label>

              <label
                :class="broadcastForm.targetType === 'role' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-700 font-medium'"
                class="flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all"
              >
                <input type="radio" v-model="broadcastForm.targetType" value="role" class="text-blue-600" />
                <span>Berdasarkan Role</span>
              </label>

              <label
                :class="broadcastForm.targetType === 'specific' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-700 font-medium'"
                class="flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all"
              >
                <input type="radio" v-model="broadcastForm.targetType" value="specific" class="text-blue-600" />
                <span>Pengguna Tertentu</span>
              </label>
            </div>

            <!-- Target Roles Checkboxes -->
            <div v-if="broadcastForm.targetType === 'role'" class="pt-2 flex flex-wrap gap-2">
              <label
                v-for="role in availableRoles"
                :key="role"
                :class="broadcastForm.targetRoles.includes(role) ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600 font-medium'"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all"
              >
                <input type="checkbox" :value="role" v-model="broadcastForm.targetRoles" class="text-blue-600 rounded" />
                <span>{{ role }}</span>
              </label>
            </div>

            <!-- Target Specific User IDs -->
            <div v-if="broadcastForm.targetType === 'specific'" class="pt-2">
              <input
                v-model="specificUsersInput"
                type="text"
                placeholder="Masukkan User ID (pisahkan dengan koma, cth: id1, id2)"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <!-- Channel Selection -->
          <div class="space-y-2">
            <label class="text-xs font-semibold text-slate-700 block" >
              Saluran Pengiriman (Channels) *
            </label>
            <div class="flex flex-wrap gap-3">
              <label
                :class="broadcastForm.channels.includes('whatsapp') ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-700 font-medium'"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs cursor-pointer transition-all"
              >
                <input type="checkbox" value="whatsapp" v-model="broadcastForm.channels" class="text-emerald-600 rounded" />
                <span class="material-icons text-sm text-emerald-600">chat</span>
                <span>WhatsApp</span>
              </label>

              <label
                :class="broadcastForm.channels.includes('push') ? 'border-blue-300 bg-blue-50 text-blue-800 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-700 font-medium'"
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs cursor-pointer transition-all"
              >
                <input type="checkbox" value="push" v-model="broadcastForm.channels" class="text-blue-600 rounded" />
                <span class="material-icons text-sm text-blue-600">notifications</span>
                <span>Push Notification</span>
              </label>
            </div>
          </div>

          <!-- Title Input -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-slate-700" >
                Judul Notifikasi (Title) *
              </label>
              <span class="text-[10px] text-slate-400 font-medium">{{ broadcastForm.title.length }} / 200</span>
            </div>
            <input
              v-model="broadcastForm.title"
              maxlength="200"
              type="text"
              placeholder="Contoh: Jadwal Pemeliharaan Sistem Authorix"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white font-medium transition-all"
            />
          </div>

          <!-- Body Input -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-slate-700" >
                Isi Pesan (Body) *
              </label>
              <span class="text-[10px] text-slate-400 font-medium">{{ broadcastForm.body.length }} / 2000</span>
            </div>
            <textarea
              v-model="broadcastForm.body"
              maxlength="2000"
              rows="4"
              placeholder="Tuliskan pesan lengkap yang akan dibaca oleh penerima..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white font-medium resize-none transition-all"
            ></textarea>
          </div>

          <!-- Image URL (Optional) -->
          <div class="space-y-1.5">
            <label class="text-xs font-semibold text-slate-700 block" >
              URL Gambar / Banner <span class="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              v-model="broadcastForm.imageUrl"
              type="url"
              placeholder="https://example.com/banner-pengumuman.jpg"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
            />
            <div v-if="broadcastForm.imageUrl" class="pt-2">
              <img
                :src="broadcastForm.imageUrl"
                alt="Preview Banner"
                class="max-h-36 rounded-xl border border-slate-200 object-cover"
                @error="broadcastForm.imageUrl = ''"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
              @click="confirmSendBroadcast"
              :disabled="!canSubmitBroadcast || isSendingBroadcast"
              class="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all active:scale-95 cursor-pointer"
            
            >
              <span class="material-icons text-sm" :class="{ 'animate-spin': isSendingBroadcast }">
                {{ isSendingBroadcast ? 'sync' : 'send' }}
              </span>
              <span>{{ isSendingBroadcast ? 'Mengirim Broadcast...' : 'Kirim Broadcast Sekarang' }}</span>
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- ================= MODAL DETAIL LOG ================= -->
    <div
      v-if="selectedLogDetail"
      @click.self="selectedLogDetail = null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <span class="material-icons text-base">receipt_long</span>
            </div>
            <h3 class="text-sm sm:text-base font-semibold text-slate-800" >
              Detail Notifikasi Log
            </h3>
          </div>
          <button
            @click="selectedLogDetail = null"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <span class="material-icons text-base">close</span>
          </button>
        </div>

        <div class="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs" >
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-slate-50 rounded-xl">
              <p class="text-[10px] font-semibold text-slate-400 uppercase">ID Log</p>
              <p class="font-mono text-slate-700 truncate mt-0.5">{{ selectedLogDetail.id }}</p>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <p class="text-[10px] font-semibold text-slate-400 uppercase">Status</p>
              <p class="font-semibold mt-0.5" :class="selectedLogDetail.status === 'SUCCESS' ? 'text-emerald-600' : 'text-rose-600'">
                {{ selectedLogDetail.status }}
              </p>
            </div>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl space-y-2">
            <div>
              <p class="text-[10px] font-semibold text-slate-400 uppercase">Event / Action</p>
              <p class="font-semibold text-slate-800">{{ selectedLogDetail.details?.event || selectedLogDetail.action }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-slate-400 uppercase">Penerima</p>
              <p class="font-medium text-slate-700">
                {{ selectedLogDetail.details?.recipientName || '—' }} ({{ selectedLogDetail.details?.recipient || selectedLogDetail.actor }})
              </p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-slate-400 uppercase">Channel</p>
              <p class="font-medium text-slate-700">{{ selectedLogDetail.details?.channel || '—' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-slate-400 uppercase">Waktu Log</p>
              <p class="font-medium text-slate-700">{{ formatDate(selectedLogDetail.createdAt) }}</p>
            </div>
          </div>

          <!-- Error Details if failed -->
          <div v-if="selectedLogDetail.details?.error" class="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
            <p class="text-[10px] font-semibold text-rose-600 uppercase">Pesan Kesalahan (Error)</p>
            <p class="text-rose-700 font-mono text-[11px] break-words">{{ selectedLogDetail.details.error }}</p>
          </div>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            @click="selectedLogDetail = null"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL DETAIL BERKAS GAGAL IBS ================= -->
    <div
      v-if="selectedAttachmentFailure"
      @click.self="selectedAttachmentFailure = null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <span class="material-icons text-base">attachment</span>
            </div>
            <h3 class="text-sm sm:text-base font-semibold text-slate-800" >
              Berkas Attachment IBS Bermasalah
            </h3>
          </div>
          <button
            @click="selectedAttachmentFailure = null"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <span class="material-icons text-base">close</span>
          </button>
        </div>

        <div class="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs" >
          <div class="p-3 bg-slate-50 rounded-xl space-y-1">
            <p class="text-[10px] font-semibold text-slate-400 uppercase">Ref. Transaksi</p>
            <p class="font-semibold text-slate-800">{{ selectedAttachmentFailure.details?.refTransactionNumber || '—' }}</p>
            <p class="text-[11px] text-slate-500 font-normal mt-1">
              {{ selectedAttachmentFailure.details?.message }}
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold text-slate-700 mb-2">Daftar Berkas Gagal / Corrupt:</p>
            <div class="space-y-2">
              <div
                v-for="(f, i) in (selectedAttachmentFailure.details?.failedFiles || [])"
                :key="i"
                class="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1"
              >
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-rose-800 flex items-center gap-1.5">
                    <span class="material-icons text-sm">insert_drive_file</span>
                    {{ f.fileName }}
                  </span>
                  <span v-if="f.code" class="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-semibold">
                    {{ f.code }}
                  </span>
                </div>
                <p class="text-[11px] text-rose-600 font-normal">Alasan: {{ f.reason || 'Tidak ada keterangan spesifik' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            @click="selectedAttachmentFailure = null"
            class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- ================= MODAL HASIL BROADCAST ================= -->
    <div
      v-if="broadcastResult"
      @click.self="broadcastResult = null"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div class="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <span class="material-icons text-2xl">done_all</span>
        </div>
        <div>
          <h3 class="text-base font-semibold text-slate-800" >
            Broadcast Berhasil Dikirim!
          </h3>
          <p class="text-xs text-slate-500 font-normal mt-1">
            {{ broadcastResult.message || 'Pesan berhasil diproses ke antrean penerima.' }}
          </p>
        </div>

        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-left text-xs space-y-1.5" >
          <div class="flex justify-between">
            <span class="text-slate-500">Total Penerima:</span>
            <span class="font-semibold text-slate-800">{{ broadcastResult.data?.recipientCount ?? 0 }} User</span>
          </div>
          <div v-if="broadcastResult.data?.results?.whatsapp" class="flex justify-between border-t border-slate-100 pt-1">
            <span class="text-slate-500">WhatsApp:</span>
            <span class="font-medium text-emerald-600">
              {{ broadcastResult.data.results.whatsapp.sent }} sent, 
              {{ broadcastResult.data.results.whatsapp.failed }} failed
              <span v-if="broadcastResult.data.results.whatsapp.skipped">({{ broadcastResult.data.results.whatsapp.skipped }} skipped)</span>
            </span>
          </div>
          <div v-if="broadcastResult.data?.results?.push" class="flex justify-between border-t border-slate-100 pt-1">
            <span class="text-slate-500">Push Notification:</span>
            <span class="font-medium text-blue-600">
              {{ broadcastResult.data.results.push.sent }} sent, 
              {{ broadcastResult.data.results.push.failed }} failed
            </span>
          </div>
        </div>

        <button
          @click="broadcastResult = null"
          class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all active:scale-95 cursor-pointer"
        >
          Selesai
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { notificationService } from '@/services/notificationService';
import Swal from 'sweetalert2';

const router = useRouter();

// Navigation Tabs
const tabs = ref([
  { id: 'stats', label: 'Statistik & Ringkasan', icon: 'insights' },
  { id: 'logs', label: 'Riwayat Notifikasi', icon: 'list_alt' },
  { id: 'attachment-failures', label: 'Lampiran IBS Gagal', icon: 'attachment', badge: 0 },
  { id: 'broadcast', label: 'Kirim Broadcast', icon: 'campaign' }
]);

const activeTab = ref('stats');
const isLoading = ref(false);

// Date Presets
const datePresets = [
  { id: 'today', label: 'Hari Ini' },
  { id: '7d', label: '7 Hari' },
  { id: '30d', label: '30 Hari' },
  { id: 'all', label: 'Semua' }
];
const activeStatsPreset = ref('30d');

// --- STATS STATE ---
const statsDateStart = ref('');
const statsDateEnd = ref('');
const statsData = ref({
  stats: {
    email: { sent: 0, failed: 0, total: 0, deliveryRate: 0 },
    whatsapp: { sent: 0, failed: 0, skipped: 0, total: 0, deliveryRate: 0 },
    overall: { total: 0, delivered: 0, failed: 0, deliveryRate: 0 }
  },
  last24h: { emailSent: 0, emailFailed: 0, waSent: 0, waFailed: 0, waSkipped: 0 }
});

// --- LOGS STATE ---
const logs = ref([]);
const isFailedOnly = ref(false);
const logsFilter = ref({
  channel: '',
  status: '',
  recipient: '',
  startDate: '',
  endDate: ''
});
const pagination = ref({ page: 1, limit: 25, total: 0, totalPages: 1 });
const selectedLogDetail = ref(null);

// --- ATTACHMENT FAILURES STATE ---
const attachmentFailures = ref([]);
const selectedAttachmentFailure = ref(null);

// --- BROADCAST STATE ---
const availableRoles = ['APPROVER', 'USER', 'ADMIN', 'REVIEWER'];
const broadcastForm = ref({
  targetType: 'all',
  targetRoles: ['APPROVER', 'USER'],
  channels: ['whatsapp', 'push'],
  title: '',
  body: '',
  imageUrl: ''
});
const specificUsersInput = ref('');
const isSendingBroadcast = ref(false);
const broadcastResult = ref(null);

const canSubmitBroadcast = computed(() => {
  if (!broadcastForm.value.title.trim()) return false;
  if (!broadcastForm.value.body.trim()) return false;
  if (broadcastForm.value.channels.length === 0) return false;
  if (broadcastForm.value.targetType === 'role' && broadcastForm.value.targetRoles.length === 0) return false;
  if (broadcastForm.value.targetType === 'specific' && !specificUsersInput.value.trim()) return false;
  return true;
});

// --- FORMAT DATE HELPER ---
const formatDate = (isoString) => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
};

// --- STATS METHODS ---
const applyStatsPreset = (presetId) => {
  activeStatsPreset.value = presetId;
  const now = new Date();
  if (presetId === 'today') {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    statsDateStart.value = start.toISOString().split('T')[0];
    statsDateEnd.value = now.toISOString().split('T')[0];
  } else if (presetId === '7d') {
    const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    statsDateStart.value = start.toISOString().split('T')[0];
    statsDateEnd.value = now.toISOString().split('T')[0];
  } else if (presetId === '30d') {
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    statsDateStart.value = start.toISOString().split('T')[0];
    statsDateEnd.value = now.toISOString().split('T')[0];
  } else {
    statsDateStart.value = '';
    statsDateEnd.value = '';
  }
  fetchStats();
};

const fetchStats = async () => {
  try {
    isLoading.value = true;
    const params = {};
    if (statsDateStart.value) params.startDate = new Date(statsDateStart.value).toISOString();
    if (statsDateEnd.value) {
      const end = new Date(statsDateEnd.value);
      end.setHours(23, 59, 59, 999);
      params.endDate = end.toISOString();
    }
    const res = await notificationService.getStats(params);
    if (res && res.data) {
      statsData.value = res.data;
    }
  } catch (error) {
    console.error('Error fetching notification stats:', error);
  } finally {
    isLoading.value = false;
  }
};

// --- LOGS METHODS ---
const fetchLogs = async (page = 1) => {
  try {
    isLoading.value = true;
    pagination.value.page = page;

    if (isFailedOnly.value) {
      const res = await notificationService.getFailedLogs({
        page: pagination.value.page,
        limit: pagination.value.limit,
        startDate: logsFilter.value.startDate || undefined,
        endDate: logsFilter.value.endDate || undefined
      });
      logs.value = res.data || [];
      if (res.pagination) pagination.value = res.pagination;
    } else {
      const params = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        channel: logsFilter.value.channel || undefined,
        status: logsFilter.value.status || undefined,
        recipient: logsFilter.value.recipient.trim() || undefined,
        startDate: logsFilter.value.startDate || undefined,
        endDate: logsFilter.value.endDate || undefined
      };
      const res = await notificationService.getLogs(params);
      logs.value = res.data || [];
      if (res.pagination) pagination.value = res.pagination;
    }
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    logs.value = [];
  } finally {
    isLoading.value = false;
  }
};

const toggleFailedOnly = () => {
  isFailedOnly.value = !isFailedOnly.value;
  fetchLogs(1);
};

const resetLogsFilter = () => {
  logsFilter.value = {
    channel: '',
    status: '',
    recipient: '',
    startDate: '',
    endDate: ''
  };
  isFailedOnly.value = false;
  fetchLogs(1);
};

// --- ATTACHMENT FAILURES METHODS ---
const fetchAttachmentFailures = async () => {
  try {
    isLoading.value = true;
    const res = await notificationService.getAttachmentFailures();
    attachmentFailures.value = res.data || [];
    // Update badge on tab
    const tabItem = tabs.value.find(t => t.id === 'attachment-failures');
    if (tabItem) tabItem.badge = attachmentFailures.value.length;
  } catch (error) {
    console.error('Error fetching attachment failures:', error);
    attachmentFailures.value = [];
  } finally {
    isLoading.value = false;
  }
};

// --- BROADCAST METHODS ---
const confirmSendBroadcast = async () => {
  const result = await Swal.fire({
    title: 'Kirim Broadcast Sekarang?',
    text: `Pesan akan dikirim ke ${broadcastForm.value.targetType === 'all' ? 'SEMUA pengguna' : 'target yang dipilih'} via ${broadcastForm.value.channels.join(' & ')}.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563EB',
    cancelButtonColor: '#64748B',
    confirmButtonText: 'Ya, Kirim Sekarang',
    cancelButtonText: 'Batal'
  });

  if (!result.isConfirmed) return;

  try {
    isSendingBroadcast.value = true;
    const payload = {
      targetType: broadcastForm.value.targetType,
      channels: broadcastForm.value.channels,
      title: broadcastForm.value.title.trim(),
      body: broadcastForm.value.body.trim()
    };

    if (broadcastForm.value.targetType === 'role') {
      payload.targetRoles = broadcastForm.value.targetRoles;
    } else if (broadcastForm.value.targetType === 'specific') {
      payload.targetUserIds = specificUsersInput.value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }

    if (broadcastForm.value.imageUrl?.trim()) {
      payload.imageUrl = broadcastForm.value.imageUrl.trim();
    }

    const res = await notificationService.sendBroadcast(payload);
    broadcastResult.value = res;

    // Reset form fields
    broadcastForm.value.title = '';
    broadcastForm.value.body = '';
    broadcastForm.value.imageUrl = '';
    specificUsersInput.value = '';

    // Refresh stats
    fetchStats();
  } catch (error) {
    console.error('Error sending broadcast:', error);
    Swal.fire({
      title: 'Gagal Mengirim Broadcast',
      text: error.response?.data?.message || error.message || 'Terjadi kesalahan saat memproses pengiriman broadcast.',
      icon: 'error',
      confirmButtonColor: '#2563EB'
    });
  } finally {
    isSendingBroadcast.value = false;
  }
};

// --- REFRESH CURRENT TAB ---
const refreshCurrentTab = () => {
  if (activeTab.value === 'stats') fetchStats();
  else if (activeTab.value === 'logs') fetchLogs(pagination.value.page);
  else if (activeTab.value === 'attachment-failures') fetchAttachmentFailures();
};

onMounted(() => {
  applyStatsPreset('30d');
  fetchLogs(1);
  fetchAttachmentFailures();
});
</script>

<style scoped>
/* Scrollbar halus */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
