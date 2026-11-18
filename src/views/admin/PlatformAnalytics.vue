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
            Platform Access Analytics
          </h1>
          
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Refresh Button -->
          <button
            @click="fetchAllData"
            :disabled="isLoading"
            class="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            
          >
            <span class="material-icons text-sm" :class="{ 'animate-spin': isLoading }">sync</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Custom Date & Preset Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 sm:px-5 py-3.5 rounded-[20px] border border-slate-200 shadow-sm text-xs font-normal text-slate-600" >
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="font-medium text-slate-500">Mulai:</span>
            <input
              type="date"
              v-model="filterStartDate"
              @change="onCustomDateChange"
              class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium text-slate-500">Sampai:</span>
            <input
              type="date"
              v-model="filterEndDate"
              @change="onCustomDateChange"
              class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium outline-none focus:border-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <!-- Preset Filter -->
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <div class="flex bg-slate-100 rounded-xl p-1 gap-1">
            <button
              v-for="preset in datePresets"
              :key="preset.id"
              @click="applyPreset(preset.id)"
              :class="activePreset === preset.id ? 'bg-white shadow text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700 font-normal'"
              class="px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
              
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- ================= STATS SUMMARY CARDS ================= -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Total Logins -->
        <div class="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2.5 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
              <span class="material-icons text-xl">login</span>
            </div>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full text-blue-600 bg-blue-50">
              Total Sesi
            </span>
          </div>
          <div class="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight" >
            {{ summaryData.totalLogins?.toLocaleString('id-ID') || 0 }}
          </div>
          <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1" >
            Total Login Berhasil
          </div>
        </div>

        <!-- Website Logins -->
        <div class="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
              <span class="material-icons text-xl">language</span>
            </div>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full text-indigo-600 bg-indigo-50">
              {{ webPlatform.percentage || 0 }}%
            </span>
          </div>
          <div class="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight" >
            {{ webPlatform.count?.toLocaleString('id-ID') || 0 }}
          </div>
          <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1" >
            Login via Website (Web)
          </div>
        </div>

        <!-- Mobile App Logins -->
        <div class="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2.5 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-100">
              <span class="material-icons text-xl">phone_android</span>
            </div>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50">
              {{ mobilePlatform.percentage || 0 }}%
            </span>
          </div>
          <div class="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight" >
            {{ mobilePlatform.count?.toLocaleString('id-ID') || 0 }}
          </div>
          <div class="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1" >
            Login via Mobile App
          </div>
        </div>
      </div>

      <!-- ================= CHARTS SECTION: DONUT & TOP DEVICES ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        <!-- Donut Chart: Web vs Mobile Breakdown -->
        <div class="lg:col-span-5 bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <h3 class="font-semibold text-slate-800 text-base" >
                Distribusi Platform Akses
              </h3>
              <span class="material-icons text-slate-400 text-lg">pie_chart</span>
            </div>
            <p class="text-slate-500 text-xs font-normal mb-4" >
              Perbandingan proporsi sesi login antara Website dan Aplikasi Mobile.
            </p>
          </div>

          <div v-if="isLoading" class="h-[250px] flex items-center justify-center bg-slate-50/60 rounded-2xl animate-pulse">
            <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Memuat Diagram...</span>
          </div>
          <div v-else-if="summaryData.totalLogins === 0" class="h-[250px] flex flex-col items-center justify-center text-center p-4">
            <span class="material-icons text-slate-300 text-4xl mb-2">donut_large</span>
            <p class="text-xs text-slate-500 font-medium">Belum ada data login pada periode ini</p>
          </div>
          <div v-else class="h-[250px] flex items-center justify-center">
            <apexchart
              type="donut"
              width="100%"
              height="230"
              :options="donutChartOptions"
              :series="donutChartSeries"
            ></apexchart>
          </div>

          <!-- Mini Legend / Stats Bar -->
          <div class="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 mt-2 text-xs" >
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div class="w-3 h-3 rounded-full bg-blue-600 shrink-0"></div>
              <div class="min-w-0">
                <p class="text-slate-500 text-[11px] font-normal truncate">Website (Web)</p>
                <p class="font-semibold text-slate-800 text-xs">{{ webPlatform.count || 0 }} sesi ({{ webPlatform.percentage || 0 }}%)</p>
              </div>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div class="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></div>
              <div class="min-w-0">
                <p class="text-slate-500 text-[11px] font-normal truncate">Mobile App</p>
                <p class="font-semibold text-slate-800 text-xs">{{ mobilePlatform.count || 0 }} sesi ({{ mobilePlatform.percentage || 0 }}%)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Mobile Devices -->
        <div class="lg:col-span-7 bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <h3 class="font-semibold text-slate-800 text-base" >
                Top Perangkat Mobile
              </h3>
              <span class="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full font-semibold">
                Flutter Mobile App
              </span>
            </div>
            <p class="text-slate-500 text-xs font-normal mb-4" >
              Merek dan model smartphone yang paling banyak digunakan oleh pengguna.
            </p>
          </div>

          <div v-if="isLoading" class="space-y-3 py-4 flex-1">
            <div v-for="n in 4" :key="n" class="animate-pulse bg-slate-100 h-10 rounded-xl"></div>
          </div>
          <div v-else-if="!summaryData.topDevices || summaryData.topDevices.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-center">
            <span class="material-icons text-slate-300 text-4xl mb-2">smartphone</span>
            <p class="text-xs text-slate-500 font-medium">Belum ada data perangkat mobile yang tercatat.</p>
            <p class="text-[11px] text-slate-400 mt-1">Data akan muncul ketika user login melalui Flutter Mobile App.</p>
          </div>
          <div v-else class="space-y-2.5 flex-1 overflow-y-auto max-h-[250px] pr-1">
            <div
              v-for="(device, idx) in summaryData.topDevices"
              :key="idx"
              class="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition-all"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                  #{{ idx + 1 }}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs font-semibold text-slate-800" >{{ device.brand }}</span>
                    <span class="text-xs text-slate-600 font-normal truncate">{{ device.model }}</span>
                  </div>
                  <div class="w-28 sm:w-44 bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      class="bg-blue-600 h-full rounded-full transition-all duration-500"
                      :style="{ width: `${Math.min(100, Math.round((device.count / (mobilePlatform.count || 1)) * 100))}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="text-right shrink-0 ml-2">
                <span class="text-xs font-semibold text-slate-800" >
                  {{ device.count }}
                </span>
                <span class="text-[10px] text-slate-400 block">login</span>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span class="material-icons text-sm text-blue-500">info</span>
            <span>Data perangkat didapat dari header autentikasi login aplikasi mobile.</span>
          </div>
        </div>
      </div>

      <!-- ================= TIMESERIES TREND CHART ================= -->
      <div class="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 class="font-semibold text-slate-800 text-base" >
              Tren Platform Akses Waktu Nyata
            </h3>
            <p class="text-slate-500 text-xs font-normal mt-0.5" >
              Pertumbuhan frekuensi sesi login antara Website dan Mobile App dari waktu ke waktu.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Website (Web)
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-100">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Mobile App
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="h-[280px] sm:h-[320px] flex items-center justify-center bg-slate-50/60 rounded-2xl animate-pulse">
          <span class="text-slate-400 text-xs font-semibold uppercase tracking-wider">Memuat Grafik Tren...</span>
        </div>
        <div v-else-if="timeseriesSeries[0].data.length === 0" class="h-[280px] sm:h-[320px] flex flex-col items-center justify-center text-center">
          <span class="material-icons text-slate-300 text-4xl mb-2">show_chart</span>
          <p class="text-xs text-slate-500 font-medium">Tidak ada data tren pada rentang waktu ini</p>
        </div>
        <div v-else class="h-[280px] sm:h-[320px]">
          <apexchart
            type="area"
            height="100%"
            :options="timeseriesChartOptions"
            :series="timeseriesSeries"
          ></apexchart>
        </div>
      </div>

      <!-- ================= USER LIST & MULTI-PLATFORM BREAKDOWN ================= -->
      <div class="bg-white p-5 sm:p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="font-semibold text-slate-800 text-base" >
              Aktivitas & Distribusi Pengguna
            </h3>
            <p class="text-slate-500 text-xs font-normal mt-0.5" >
              Daftar pengguna beserta platform dominan dan riwayat histori sesi login.
            </p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Tab Switcher -->
            <div class="flex bg-slate-100 rounded-xl p-1 gap-1 text-xs" >
              <button
                @click="activeTableTab = 'all'"
                :class="activeTableTab === 'all' ? 'bg-white shadow text-blue-600 font-semibold' : 'text-slate-500'"
                class="px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Semua User
              </button>
              <button
                @click="activeTableTab = 'multi'"
                :class="activeTableTab === 'multi' ? 'bg-white shadow text-amber-600 font-semibold' : 'text-slate-500'"
                class="px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <span class="material-icons text-xs">devices</span>
                Multi-Platform
              </button>
            </div>

            <!-- Platform Filter (Khusus tab Semua User) -->
            <div v-if="activeTableTab === 'all'" class="relative">
              <select
                v-model="userPlatformFilter"
                @change="fetchUsers(1)"
                class="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 font-medium text-slate-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
                
              >
                <option value="">Semua Platform</option>
                <option value="web">Hanya Web</option>
                <option value="mobile_app">Hanya Mobile App</option>
              </select>
              <span class="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
            </div>

            <!-- Search Input -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari nama atau email..."
                class="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-700 outline-none focus:border-blue-500 w-44 sm:w-56 font-normal"
                
              />
              <span class="material-icons absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            </div>
          </div>
        </div>

        <!-- Table Data -->
        <div class="overflow-x-auto rounded-2xl border border-slate-100">
          <table class="w-full text-left text-xs" >
            <thead class="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th class="py-3.5 px-4">Pengguna</th>
                <th class="py-3.5 px-4 text-center">Login Web</th>
                <th class="py-3.5 px-4 text-center">Login Mobile</th>
                <th class="py-3.5 px-4 text-center">Platform Dominan</th>
                <th class="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-normal text-slate-700">
              <tr v-if="usersLoading">
                <td colspan="5" class="py-8 text-center text-slate-400">
                  <div class="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Memuat daftar pengguna dari server...
                </td>
              </tr>
              <tr v-else-if="displayedUsers.length === 0">
                <td colspan="5" class="py-8 text-center text-slate-400">
                  Tidak ada data pengguna ditemukan.
                </td>
              </tr>
              <tr
                v-else
                v-for="user in displayedUsers"
                :key="user.id || user.userId || user.email"
                class="hover:bg-slate-50/80 transition-colors"
              >
                <!-- Nama & Email -->
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-slate-800">{{ user.name || user.fullName || user.username || 'User' }}</div>
                  <div class="text-[11px] text-slate-400">{{ user.email || '-' }}</div>
                </td>

                <!-- Web Login Count -->
                <td class="py-3.5 px-4 text-center">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-semibold border border-blue-100">
                    <span class="material-icons text-[13px]">language</span>
                    {{ user.web?.count ?? user.webLogins ?? 0 }}
                  </span>
                </td>

                <!-- Mobile Login Count -->
                <td class="py-3.5 px-4 text-center">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-semibold border border-emerald-100">
                    <span class="material-icons text-[13px]">phone_android</span>
                    {{ user.mobile_app?.count ?? user.mobileLogins ?? 0 }}
                  </span>
                </td>

                <!-- Dominant Platform Badge -->
                <td class="py-3.5 px-4 text-center">
                  <span
                    v-if="user.dominantPlatform === 'web' || user.dominant === 'web'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Website
                  </span>
                  <span
                    v-else-if="user.dominantPlatform === 'mobile_app' || user.dominant === 'mobile_app'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Mobile App
                  </span>
                  <span
                    v-else
                    class="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100 inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Multi-Platform
                  </span>
                </td>

                <!-- Action: Detail Session Modal -->
                <td class="py-3.5 px-4 text-right">
                  <button
                    @click="openUserHistoryModal(user)"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-600 rounded-xl text-xs font-semibold transition-all active:scale-95 inline-flex items-center gap-1 cursor-pointer border border-slate-200"
                  >
                    <span class="material-icons text-xs">history</span>
                    Riwayat Sesi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination (Tab Semua User) -->
        <div v-if="activeTableTab === 'all' && totalUserPages > 1" class="flex items-center justify-between pt-2 text-xs text-slate-500 font-normal">
          <div>
            Halaman <span class="font-semibold text-slate-700">{{ currentUserPage }}</span> dari <span class="font-semibold text-slate-700">{{ totalUserPages }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="fetchUsers(currentUserPage - 1)"
              :disabled="currentUserPage <= 1"
              class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-medium cursor-pointer"
            >
              Sebelumnya
            </button>
            <button
              @click="fetchUsers(currentUserPage + 1)"
              :disabled="currentUserPage >= totalUserPages"
              class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-medium cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <!-- ================= MODAL: DETAIL HISTORI SESI USER ================= -->
      <transition name="fade">
        <div
          v-if="showUserModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          @click.self="showUserModal = false"
        >
          <div class="bg-white w-full max-w-2xl rounded-[28px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <!-- Modal Header -->
            <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-base">
                  <span class="material-icons">person</span>
                </div>
                <div>
                  <h4 class="font-semibold text-slate-800 text-base" >
                    {{ selectedUser?.name || selectedUser?.fullName || 'Detail Riwayat Sesi' }}
                  </h4>
                  <p class="text-xs text-slate-400">{{ selectedUser?.email || '-' }}</p>
                </div>
              </div>
              <button
                @click="showUserModal = false"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <span class="material-icons text-sm">close</span>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-5 sm:p-6 max-h-[420px] overflow-y-auto space-y-4">
              <!-- Loading -->
              <div v-if="modalLoading" class="py-12 text-center text-slate-400">
                <div class="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                Memuat riwayat sesi dari server...
              </div>

              <!-- Content -->
              <div v-else class="space-y-4">
                <!-- Summary bar -->
                <div v-if="userSessionData?.platformSummary || selectedUser" class="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs" >
                  <div>
                    <span class="text-slate-400 text-[11px] block">Total Sesi Login</span>
                    <span class="font-semibold text-slate-800 text-base">{{ modalUserSummary.total }}</span>
                  </div>
                  <div class="flex gap-4 text-right">
                    <div>
                      <span class="text-slate-400 text-[11px] block">Web</span>
                      <span class="font-semibold text-blue-600">{{ modalUserSummary.web }}</span>
                    </div>
                    <div>
                      <span class="text-slate-400 text-[11px] block">Mobile App</span>
                      <span class="font-semibold text-emerald-600">{{ modalUserSummary.mobile }}</span>
                    </div>
                  </div>
                </div>

                <!-- Sessions List -->
                <div>
                  <h5 class="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2" >
                    Riwayat Sesi Terakhir
                  </h5>
                  <div v-if="!userSessionData?.sessions || userSessionData.sessions.length === 0" class="text-center py-6 text-xs text-slate-400">
                    Belum ada riwayat sesi tercatat untuk user ini.
                  </div>
                  <div v-else class="space-y-2.5">
                    <div
                      v-for="(session, sIdx) in userSessionData.sessions"
                      :key="sIdx"
                      class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all text-xs"
                    
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span
                          :class="session.clientType === 'web' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'"
                          class="px-2.5 py-0.5 rounded-md font-semibold text-[10px] border flex items-center gap-1"
                        >
                          <span class="material-icons text-[12px]">
                            {{ session.clientType === 'web' ? 'language' : 'phone_android' }}
                          </span>
                          {{ session.clientType === 'web' ? 'Website' : 'Mobile App' }}
                        </span>
                        <span class="text-[11px] text-slate-400 font-normal">
                          {{ formatDate(session.createdAt || session.created_at || session.timestamp || session.loginAt || session.date) }}
                        </span>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div>
                          <span class="text-slate-400">IP Address:</span>
                          <span class="font-medium text-slate-700 ml-1">{{ session.ipAddress || session.ip || '-' }}</span>
                        </div>
                        <div>
                          <span class="text-slate-400">OS / Browser:</span>
                          <span class="font-medium text-slate-700 ml-1">{{ session.os || session.userAgent || '-' }}</span>
                        </div>
                        <!-- Device Info if mobile -->
                        <div v-if="session.clientType === 'mobile_app' && (session.device?.brand || session.brand || session.device?.model || session.model)" class="sm:col-span-2 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                          <span class="font-semibold text-slate-800">Perangkat:</span>
                          {{ (session.device?.brand || session.brand || '') }} {{ (session.device?.model || session.model || '') }}
                          <span v-if="session.device?.appVersion || session.appVersion" class="text-slate-400 ml-1">
                            (v{{ session.device?.appVersion || session.appVersion }})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                @click="showUserModal = false"
                class="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer"
                
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';
import analyticsService from '@/services/analyticsService';

const apexchart = VueApexCharts;
const router = useRouter();

// State
const isLoading = ref(false);
const usersLoading = ref(false);
const modalLoading = ref(false);

const filterStartDate = ref('');
const filterEndDate = ref('');
const activePreset = ref('30d');
const granularity = ref('day');

const datePresets = [
  { id: '7d', label: '7 Hari' },
  { id: '30d', label: '30 Hari' },
  { id: 'all', label: 'Semua Waktu' }
];

// Data States
const summaryData = ref({
  totalLogins: 0,
  platforms: [],
  topDevices: []
});

const timeseriesData = ref({
  granularity: 'day',
  series: []
});

const usersList = ref([]);
const multiPlatformUsers = ref([]);
const activeTableTab = ref('all');
const userPlatformFilter = ref('');
const searchQuery = ref('');
const currentUserPage = ref(1);
const totalUserPages = ref(1);

// Modal State
const showUserModal = ref(false);
const selectedUser = ref(null);
const userSessionData = ref(null);

// Computed Helpers
const webPlatform = computed(() => {
  return summaryData.value.platforms?.find(p => p.clientType === 'web') || { count: 0, percentage: 0 };
});

const mobilePlatform = computed(() => {
  return summaryData.value.platforms?.find(p => p.clientType === 'mobile_app') || { count: 0, percentage: 0 };
});

const displayedUsers = computed(() => {
  let list = activeTableTab.value === 'all' ? usersList.value : multiPlatformUsers.value;
  if (!searchQuery.value) return list;
  const q = searchQuery.value.toLowerCase();
  return list.filter(u => {
    const name = (u.name || u.fullName || u.username || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    return name.includes(q) || email.includes(q);
  });
});

const modalUserSummary = computed(() => {
  const summary = userSessionData.value?.platformSummary || {};
  const user = selectedUser.value || {};

  let arrayWeb = null;
  let arrayMobile = null;
  if (Array.isArray(summary)) {
    arrayWeb = summary.find(p => p.clientType === 'web')?.count;
    arrayMobile = summary.find(p => p.clientType === 'mobile_app')?.count;
  } else if (Array.isArray(summary.platforms)) {
    arrayWeb = summary.platforms.find(p => p.clientType === 'web')?.count;
    arrayMobile = summary.platforms.find(p => p.clientType === 'mobile_app')?.count;
  }

  const web = arrayWeb
    ?? summary.web?.count 
    ?? summary.web 
    ?? summary.webCount 
    ?? summary.webLogins 
    ?? user.web?.count 
    ?? user.webLogins 
    ?? (userSessionData.value?.sessions?.filter(s => s.clientType === 'web').length || 0);

  const mobile = arrayMobile
    ?? summary.mobile_app?.count 
    ?? summary.mobile_app 
    ?? summary.mobileCount 
    ?? summary.mobileLogins 
    ?? user.mobile_app?.count 
    ?? user.mobileLogins 
    ?? (userSessionData.value?.sessions?.filter(s => s.clientType === 'mobile_app').length || 0);

  const total = summary.totalLogins 
    ?? summary.total 
    ?? summary.totalSessions 
    ?? (Number(web) + Number(mobile));

  return { total, web, mobile };
});

// Chart Options: Donut
const donutChartSeries = computed(() => {
  return [webPlatform.value.count || 0, mobilePlatform.value.count || 0];
});

const donutChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    
  },
  labels: ['Website (Web)', 'Mobile App'],
  colors: ['#2563EB', '#10B981'],
  legend: { show: false },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${Math.round(val)}%`
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Sesi',
            fontSize: '11px',
            fontWeight: 500,
            color: '#64748B',
            formatter: () => summaryData.value.totalLogins?.toLocaleString('id-ID') || 0
          }
        }
      }
    }
  },
  stroke: { width: 0 }
}));

// Chart Options: Timeseries Area
const timeseriesSeries = computed(() => {
  const dates = timeseriesData.value.series || [];
  return [
    {
      name: 'Website (Web)',
      data: dates.map(d => ({ x: d.date, y: d.web || 0 }))
    },
    {
      name: 'Mobile App',
      data: dates.map(d => ({ x: d.date, y: d.mobile_app || 0 }))
    }
  ];
});

const timeseriesChartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: ['#2563EB', '#10B981'],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2.5 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.05,
      stops: [0, 95, 100]
    }
  },
  xaxis: {
    type: 'category',
    labels: {
      style: { colors: '#94A3B8', fontSize: '11px', fontFamily: 'Poppins, sans-serif' }
    },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: {
    labels: {
      style: { colors: '#94A3B8', fontSize: '11px', fontFamily: 'Poppins, sans-serif' },
      formatter: (val) => Math.round(val)
    }
  },
  grid: {
    borderColor: '#F1F5F9',
    strokeDashArray: 4
  },
  tooltip: {
    theme: 'light',
    style: { fontFamily: 'Poppins, sans-serif' }
  }
}));

// API Fetch Functions
const fetchSummary = async () => {
  try {
    const params = {};
    if (filterStartDate.value) params.startDate = new Date(filterStartDate.value).toISOString();
    if (filterEndDate.value) {
      const end = new Date(filterEndDate.value);
      end.setHours(23, 59, 59, 999);
      params.endDate = end.toISOString();
    }
    const res = await analyticsService.getSummary(params);
    if (res?.data) {
      summaryData.value = res.data;
    }
  } catch (error) {
    console.error("Gagal memuat ringkasan analitik dari server:", error);
  }
};

const fetchTimeseries = async () => {
  try {
    const params = { granularity: granularity.value };
    if (filterStartDate.value) params.startDate = new Date(filterStartDate.value).toISOString();
    if (filterEndDate.value) {
      const end = new Date(filterEndDate.value);
      end.setHours(23, 59, 59, 999);
      params.endDate = end.toISOString();
    }
    const res = await analyticsService.getTimeseries(params);
    if (res?.data) {
      timeseriesData.value = res.data;
    }
  } catch (error) {
    console.error("Gagal memuat tren timeseries dari server:", error);
  }
};

const fetchUsers = async (page = 1) => {
  try {
    usersLoading.value = true;
    currentUserPage.value = page;
    const params = { page, limit: 10 };
    if (userPlatformFilter.value) {
      params.clientType = userPlatformFilter.value;
    }
    const res = await analyticsService.getUsers(params);
    if (res?.data) {
      if (Array.isArray(res.data.users)) {
        usersList.value = res.data.users;
        totalUserPages.value = res.data.pagination?.totalPages || 1;
      } else if (Array.isArray(res.data)) {
        usersList.value = res.data;
      }
    }
  } catch (error) {
    console.error("Gagal memuat daftar pengguna dari server:", error);
  } finally {
    usersLoading.value = false;
  }
};

const fetchMultiPlatformUsers = async () => {
  try {
    const res = await analyticsService.getMultiPlatformUsers();
    if (res?.data) {
      multiPlatformUsers.value = Array.isArray(res.data.users) ? res.data.users : (Array.isArray(res.data) ? res.data : []);
    }
  } catch (error) {
    console.error("Gagal memuat pengguna multi-platform dari server:", error);
  }
};

const fetchAllData = async () => {
  isLoading.value = true;
  await Promise.allSettled([
    fetchSummary(),
    fetchTimeseries(),
    fetchUsers(1),
    fetchMultiPlatformUsers()
  ]);
  isLoading.value = false;
};

// Date Preset Handler
const applyPreset = (presetId) => {
  activePreset.value = presetId;
  const now = new Date();
  
  if (presetId === '7d') {
    const past = new Date();
    past.setDate(now.getDate() - 7);
    filterStartDate.value = past.toISOString().split('T')[0];
    filterEndDate.value = now.toISOString().split('T')[0];
  } else if (presetId === '30d') {
    const past = new Date();
    past.setDate(now.getDate() - 30);
    filterStartDate.value = past.toISOString().split('T')[0];
    filterEndDate.value = now.toISOString().split('T')[0];
  } else {
    filterStartDate.value = '';
    filterEndDate.value = '';
  }
  fetchAllData();
};

const onCustomDateChange = () => {
  activePreset.value = 'custom';
  fetchAllData();
};

const setGranularity = (mode) => {
  granularity.value = mode;
  fetchTimeseries();
};

// Modal Handler
const openUserHistoryModal = async (user) => {
  selectedUser.value = user;
  showUserModal.value = true;
  modalLoading.value = true;
  try {
    const userId = user.id || user.userId || user._id;
    const res = await analyticsService.getUserSessionHistory(userId);
    userSessionData.value = res?.data || null;
  } catch (error) {
    console.error("Gagal memuat histori sesi user dari server:", error);
    userSessionData.value = null;
  } finally {
    modalLoading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};

// On Mounted
onMounted(() => {
  applyPreset('30d');
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
