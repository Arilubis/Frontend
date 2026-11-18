<template>
  <div
    class="min-h-screen bg-[#F1F5F9] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 font-sans text-slate-900 transition-all duration-300"
  >
    <div class="max-w-[1440px] mx-auto">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3"
      >
        <div>
          <h1 class="text-2xl font-semibold text-slate-800 tracking-tight" >
            <span v-if="loading">{{ $t('common.loading') }}</span>
            <span v-else-if="userData">{{ $t('dashboard.hello') }}, {{ userData.name || userData.username }}! 👋</span>
            <span v-else>{{ $t('dashboard.hello') }}, User! 👋</span>
          </h1>
          <p class="text-slate-500 text-sm font-normal mt-0.5" >
            {{ $t('dashboard.manageMonitor') }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <!-- ── ROLE SWITCHER DROPDOWN (only shown for multi-role users) ── -->
          <div
            v-if="hasMultipleRoles"
            class="relative"
            v-click-outside="closeRoleDropdown"
          >
            <!-- Trigger button -->
            <div class="flex items-center gap-2">
              <span
                class="text-[11px] font-bold text-slate-500 whitespace-nowrap"
                >{{ $t('sidebar.viewAs') }}</span
              >
              <button
                @click="toggleRoleDropdown"
                class="flex items-center gap-2 px-1.5 pr-3 py-1.5 bg-white rounded-[14px] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer border-2"
                :class="{
                  'border-blue-400 bg-blue-50': activeRoleTab === 'requester',
                  'border-emerald-400 bg-emerald-50':
                    activeRoleTab === 'approver',
                  'border-amber-400 bg-amber-50': activeRoleTab === 'reviewer',
                  'border-slate-200 bg-white': !activeRoleTab,
                }"
              >
                <!-- Icon bubble -->
                <div
                  class="w-[28px] h-[28px] rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="{
                    'bg-blue-100': activeRoleTab === 'requester',
                    'bg-emerald-100': activeRoleTab === 'approver',
                    'bg-amber-100': activeRoleTab === 'reviewer',
                    'bg-slate-100': !activeRoleTab,
                  }"
                >
                  <span
                    class="material-icons text-[16px]"
                    :class="currentRoleIconColor"
                    >{{ currentRoleIcon }}</span
                  >
                </div>

                <!-- Label -->
                <span
                  class="text-[12px] font-bold min-w-[68px] text-left"
                  :class="currentRoleLabelColor"
                >
                  {{ currentRoleLabel }}
                </span>

                <!-- Chevron -->
                <span
                  class="material-icons text-[16px] transition-transform duration-200"
                  :class="[
                    currentRoleIconColor,
                    { 'rotate-180': roleDropdownOpen },
                  ]"
                  >expand_more</span
                >
              </button>
            </div>

            <!-- Dropdown menu -->
            <transition name="fade-slide">
              <div
                v-if="roleDropdownOpen"
                class="absolute right-0 top-full mt-2 w-[220px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <!-- Header label -->
                <div class="px-4 py-2.5 border-b border-slate-100">
                  <p
                    class="text-[9px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    {{ $t('dashboard.viewDashboardAs') }}
                  </p>
                </div>

                <!-- Role items -->
                <div class="py-1.5">
                  <button
                    v-if="isRequester"
                    @click="selectRole('requester')"
                    :class="[
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all group',
                      activeRoleTab === 'requester'
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-slate-50 text-slate-700',
                    ]"
                  >
                    <div
                      :class="[
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                        activeRoleTab === 'requester'
                          ? 'bg-blue-100'
                          : 'bg-slate-100 group-hover:bg-slate-200',
                      ]"
                    >
                      <span
                        :class="[
                          'material-icons text-[17px]',
                          activeRoleTab === 'requester'
                            ? 'text-blue-600'
                            : 'text-slate-500',
                        ]"
                        >person</span
                      >
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[12px] font-semibold leading-tight">
                        Requester
                      </p>
                      <p class="text-[10px] text-slate-400 mt-0.5">
                        My submitted documents
                      </p>
                    </div>
                    <span
                      v-if="activeRoleTab === 'requester'"
                      class="material-icons text-blue-500 text-[16px] flex-shrink-0"
                      >check_circle</span
                    >
                  </button>

                  <button
                    v-if="isApprover"
                    @click="selectRole('approver')"
                    :class="[
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all group',
                      activeRoleTab === 'approver'
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-slate-50 text-slate-700',
                    ]"
                  >
                    <div
                      :class="[
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                        activeRoleTab === 'approver'
                          ? 'bg-blue-100'
                          : 'bg-slate-100 group-hover:bg-slate-200',
                      ]"
                    >
                      <span
                        :class="[
                          'material-icons text-[17px]',
                          activeRoleTab === 'approver'
                            ? 'text-blue-600'
                            : 'text-slate-500',
                        ]"
                        >how_to_reg</span
                      >
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[12px] font-semibold leading-tight">
                        Approver
                      </p>
                      <p class="text-[10px] text-slate-400 mt-0.5">
                        Documents awaiting approval
                      </p>
                    </div>
                    <span
                      v-if="activeRoleTab === 'approver'"
                      class="material-icons text-blue-500 text-[16px] flex-shrink-0"
                      >check_circle</span
                    >
                  </button>

                  <button
                    v-if="isReviewer"
                    @click="selectRole('reviewer')"
                    :class="[
                      'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all group',
                      activeRoleTab === 'reviewer'
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-slate-50 text-slate-700',
                    ]"
                  >
                    <div
                      :class="[
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                        activeRoleTab === 'reviewer'
                          ? 'bg-blue-100'
                          : 'bg-slate-100 group-hover:bg-slate-200',
                      ]"
                    >
                      <span
                        :class="[
                          'material-icons text-[17px]',
                          activeRoleTab === 'reviewer'
                            ? 'text-blue-600'
                            : 'text-slate-500',
                        ]"
                        >rate_review</span
                      >
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[12px] font-semibold leading-tight">
                        Reviewer
                      </p>
                      <p class="text-[10px] text-slate-400 mt-0.5">
                        Documents in review queue
                      </p>
                    </div>
                    <span
                      v-if="activeRoleTab === 'reviewer'"
                      class="material-icons text-blue-500 text-[16px] flex-shrink-0"
                      >check_circle</span
                    >
                  </button>
                </div>
              </div>
            </transition>
          </div>
          <!-- ── END ROLE SWITCHER ── -->

          <!-- Notification bell -->
          <div class="relative" v-click-outside="closeNotif">
            <button
              @click.stop="toggleNotif"
              class="relative p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-sm active:scale-95"
            >
              <span class="material-icons text-slate-600">notifications_none</span>
              <span
                v-if="notifNewCount > 0"
                class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white"
              >
                {{ notifNewCount > 99 ? "99+" : notifNewCount }}
              </span>
            </button>

            <!-- Notif Dropdown -->
            <transition name="fade-slide">
              <div
                v-if="notifOpen"
                class="absolute right-0 top-full mt-2 w-[320px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <!-- Header -->
                <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p class="text-[13px] font-bold text-slate-700">Notifikasi</p>
                  <span
                    v-if="notifNewCount > 0"
                    class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                  >
                    {{ notifNewCount }} baru
                  </span>
                </div>

                <!-- Loading -->
                <div v-if="notifLoading" class="px-4 py-8 text-center">
                  <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p class="text-xs text-slate-400">Memuat notifikasi...</p>
                </div>

                <!-- Empty -->
                <div v-else-if="notifications.length === 0" class="px-4 py-8 text-center">
                  <span class="material-icons text-slate-200 text-4xl block mb-2">notifications_none</span>
                  <p class="text-sm text-slate-400 font-medium">Tidak ada notifikasi</p>
                </div>

                <!-- List -->
                <div v-else class="overflow-y-auto max-h-[320px]">
                  <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    @click="navigateToNotif(notif.id)"
                    class="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-all"
                    :class="{ 'bg-blue-50/40': !seenNotifIds.includes(notif.id) }"
                  >
                    <div class="flex items-start gap-3">
                      <div class="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        :class="{
                          'bg-amber-400': notif.status === 'SUBMITTED',
                          'bg-blue-400': notif.status === 'IN_REVIEW',
                          'bg-rose-400': notif.status === 'REVISION',
                          'bg-emerald-400': notif.status === 'APPROVED',
                        }"
                      ></div>
                      <div class="flex-1 min-w-0">
                        <p class="text-[12px] font-semibold text-slate-700 truncate">{{ notif.title }}</p>
                        <span :class="getNotifStatusClass(notif.status)" class="text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          {{ notif.statusLabel }}
                        </span>
                        <p class="text-[10px] text-slate-400 mt-1">{{ formatNotifTime(notif.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-4 py-2.5 border-t border-slate-100">
                  <button
                    @click="goToAllDocuments"
                    class="w-full text-center text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors py-1"
                  >
                    Lihat Semua Dokumen →
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <button
            v-if="canCreatePermohonan"
            @click="goToAddDocument"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span class="material-icons text-sm">add</span> {{ $t('dashboard.addRequest') }}
          </button>
        </div>
      </div>

      <!-- ============================================
           SEARCH + FILTER BAR
           ============================================ -->
      <div class="flex flex-wrap gap-3 mb-6">
        <div
          class="flex-1 min-w-[200px] relative"
          v-click-outside="closeSearch"
        >
          <span
            class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
            >search</span
          >
          <input
            v-model="searchQuery"
            @input="handleSearch"
            @focus="showResults = searchQuery.length > 0"
            type="text"
            placeholder="Search for your documents..."
            class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[12px] font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <div v-if="isSearching" class="absolute right-3 top-2.5">
            <div
              class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            ></div>
          </div>

          <transition name="fade-slide">
            <div
              v-if="showResults && searchQuery.length > 0"
              class="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto"
            >
              <div v-if="searchResults.length > 0">
                <div class="px-4 py-2 border-b border-slate-100">
                  <p
                    class="text-[9px] font-black uppercase text-slate-400 tracking-wider"
                  >
                    {{ searchResults.length }} Dokumen ditemukan
                  </p>
                </div>
                <div
                  v-for="doc in searchResults"
                  :key="doc.id"
                  @click="navigateToDetail(doc.id)"
                  class="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-all border-b border-slate-50 last:border-0 group"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <span class="material-icons text-blue-400 text-[18px]"
                        >insert_drive_file</span
                      >
                      <div class="min-w-0">
                        <p
                          class="text-[13px] font-bold text-slate-800 truncate group-hover:text-blue-600"
                        >
                          {{ doc.title }}
                        </p>
                        <p class="text-[10px] text-slate-400 font-medium">
                          {{ doc.categoryName }} • {{ doc.creatorName }}
                        </p>
                      </div>
                    </div>
                    <span
                      :class="getStatusClass(doc.status)"
                      class="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase shrink-0"
                    >
                      {{ doc.status }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else-if="!isSearching" class="px-4 py-8 text-center">
                <span class="material-icons text-slate-300 text-3xl block mb-2"
                  >search_off</span
                >
                <p class="text-sm font-bold text-slate-400">
                  Dokumen tidak ditemukan
                </p>
              </div>
              <div v-else class="px-4 py-8 text-center">
                <div
                  class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"
                ></div>
                <p class="text-xs text-slate-400 font-bold">Mencari...</p>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- ============================================
           STATISTICS CARDS
           ============================================ -->

      <!-- Filter Bulan -->
      <div class="flex items-center gap-2 mb-4">
        <span class="material-icons text-slate-400 text-[18px]">calendar_month</span>
        <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Periode:</span>
        <div class="flex items-center gap-2">
          <select
            v-model="selectedMonth"
            @change="onMonthFilterChange"
            class="text-[12px] font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer text-slate-700"
          >
            <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
          <select
            v-model="selectedYear"
            @change="onMonthFilterChange"
            class="text-[12px] font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer text-slate-700"
          >
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div v-if="statsLoading" class="col-span-4 text-center py-10">
          <div
            class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"
          ></div>
          <p class="text-sm text-slate-400">Loading statistics...</p>
        </div>

        <div
          v-else
          v-for="stat in activeStats"
          :key="stat.title"
          @click="handleStatCardClick(stat)"
          class="bg-white p-4 md:p-5 rounded-[18px] md:rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div v-if="isSyncing" class="animate-pulse flex flex-col gap-3">
            <div class="h-8 w-8 md:h-10 md:w-10 bg-slate-100 rounded-xl"></div>
            <div class="h-7 w-14 bg-slate-100 rounded-md"></div>
            <div class="h-3 w-12 bg-slate-100 rounded-md"></div>
          </div>
          <div v-else>
            <div class="flex items-center justify-between mb-2 md:mb-3">
              <div
                :class="stat.bgColor"
                class="p-2 md:p-2.5 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform"
              >
                <span class="material-icons text-lg md:text-xl">{{ stat.icon }}</span>
              </div>
              <span class="text-[8px] md:text-[9px] font-normal px-1.5 md:px-2 py-0.5 rounded-md text-black bg-slate-50 truncate max-w-[60px] md:max-w-none">
                {{ selectedMonthLabel }} {{ selectedYear }}
              </span>
            </div>
            <div class="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
              {{ stat.value }}
            </div>
            <div class="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-tight">
              {{ stat.title }}
            </div>
            <div class="text-[10px] font-semibold text-blue-600 group-hover:text-blue-800 transition-colors mt-3 flex items-center gap-0.5">
              <span>{{ $t('dashboard.stats.viewDetails') }}</span>
              <span class="material-icons text-[12px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================
           CHART & ACTIVITY SECTION
           ============================================ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Chart -->
        <div
          class="lg:col-span-2 bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm min-h-[350px]"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h3 class="font-medium text-slate-700 text-[13px]">
              {{ $t('dashboard.charts.uploadStats') }}
            </h3>
            <div class="flex items-center gap-2 flex-wrap">
              <select
                v-model="chartFilter"
                @change="updateChartData(chartFilter)"
                class="text-[10px] font-normal bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              >
                <option value="month">{{ $t('dashboard.charts.month') }}</option>
                <option value="year">{{ $t('dashboard.charts.year') }}</option>
              </select>
              <button
                @click="exportReport"
                class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-normal transition-all border bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200 cursor-pointer"
              >
                <span class="material-icons text-[14px]">download</span>
                {{ $t('dashboard.charts.downloadReport') }}
              </button>
            </div>
          </div>

          <div
            v-if="isSyncing"
            class="h-[250px] flex items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse"
          >
            <span
              class="text-slate-400 text-[11px] font-bold uppercase tracking-widest"
              >Sinkronisasi...</span
            >
          </div>
          <div v-else class="h-[250px]">
            <apexchart
              type="area"
              height="100%"
              :options="chartOptions"
              :series="chartSeries"
            ></apexchart>
          </div>
        </div>

        <!-- Activity Logs -->
        <div
          class="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col"
        >
          <h3 class="font-medium text-slate-700 text-[13px] mb-5">
            {{ $t('dashboard.activities.title') }}
          </h3>

          <div v-if="activitiesLoading" class="text-center py-12 flex-1">
            <div
              class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            ></div>
            <p class="text-xs text-slate-400">{{ $t('dashboard.activities.loading') }}</p>
          </div>

          <div
            v-else-if="activities.length === 0"
            class="text-center py-12 flex-1"
          >
            <span class="material-icons text-slate-200 text-4xl mb-2"
              >history</span
            >
            <p class="text-sm text-slate-400">{{ $t('dashboard.activities.noActivities') }}</p>
          </div>

          <div
            v-else
            class="space-y-4 flex-1 overflow-y-auto pr-1 activities-scroll"
            style="max-height: 320px"
          >
            <div
              v-for="log in activities"
              :key="log.id"
              class="flex gap-4 relative group"
            >
              <div
                :class="getActivityColor(log.status)"
                class="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-sm"
              ></div>
              <div
                class="pb-3 border-b border-slate-100 w-full group-last:border-0"
              >
                <p class="text-[11.5px] font-normal text-slate-600 leading-relaxed">
                  {{ log.userName }}
                  <span
                    class="text-blue-500 font-normal hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                    @click="navigateToDoc(log.id)"
                    >{{ log.docTitle }}</span
                  >
                  <span class="text-slate-400 font-normal"> {{ log.action }}</span>
                </p>
                <p class="text-[10px] text-slate-400 font-normal mt-1 tracking-wide">
                  {{ formatActivityTime(log.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================
           USER TOOLS SECTION
           ============================================ -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="tool in userTools"
          :key="tool.title"
          @click="handleToolClick(tool)"
          class="group bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4"
        >
          <div
            :class="tool.color"
            class="p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform"
          >
            <span class="material-icons text-xl">{{ tool.icon }}</span>
          </div>
          <div>
            <h4 class="font-medium text-slate-700 text-[13px]">
              {{ tool.title }}
            </h4>
            <p class="text-[11px] text-slate-400 mt-0.5">{{ tool.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { getCurrentUser } from "@/services/user.js";
import permohonanService from "@/services/permohonanService.js";

export default {
  name: "Dashboard",

  components: {
    apexchart: VueApexCharts,
  },

  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target)))
            binding.value();
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },

  data() {
    return {
      roleDropdownOpen: false,
      userData: null,
      loading: false,
      isSyncing: false,

      searchQuery: "",
      searchResults: [],
      showResults: false,
      isSearching: false,
      searchTimeout: null,
      filterStatus: "",
      searchRequestId: 0,
      searchController: null,

      statsLoading: false,
      stats: [],

      activitiesLoading: false,
      activities: [],
      activitiesPage: 1,
      hasMoreActivities: true,
      loadingMore: false,

      notifOpen: false,
      notifications: [],
      notifCount: 0,
      notifLoading: false,
      notifNewCount: 0,
      seenNotifIds: [],          
      notifPollingInterval: null, 

      chartRawDocs: [],
      chartPeriod: "month",

      activeRoleTab: "",
      userRoles: [],

      allDocuments: [],
      myCreatedDocuments: [],
      myApprovalDocuments: [],
      myReviewDocuments: [],

      chartFilter: "month",
      selectedMonth: new Date().getMonth() + 1,  // 1-12
      selectedYear: new Date().getFullYear(),
      chartSeries: [{ name: "Dokumen Masuk", data: [] }],

      // ✅ PERBAIKAN: chartOptions tanpa arrow function di data()
      // arrow function dipindah ke computed agar tidak error
      chartOptions: {
        chart: {
          type: "area",
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3, colors: ["#3b82f6"] },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.05,
            stops: [20, 100],
          },
        },
        // ✅ UBAH: xaxis tampilkan label, hapus axisBorder: { show: false }
        xaxis: {
          categories: [],
          labels: {
            rotate: 0,
            style: {
              fontSize: "11px",
              colors: "#1e293b",
              fontWeight: 400,
            },
          },
        },
        // ✅ UBAH: yaxis tampilkan angka seperti gambar 4
        yaxis: {
          show: true,
          labels: {
            style: {
              fontSize: "11px",
              colors: "#1e293b",
              fontWeight: 400,
            },
          },
        },
        // ✅ UBAH: grid tampilkan garis horizontal seperti gambar 4
        grid: {
          borderColor: "#e2e8f0",
          strokeDashArray: 3,
          xaxis: { lines: { show: false } },
          yaxis: { lines: { show: true } },
        },
        colors: ["#3b82f6"],
        // ✅ UBAH: tooltip — formatter dipindah ke methods bukan arrow function di data()
        tooltip: {
          theme: "light",
          x: { show: true },
          y: {
            title: {
              formatter: function () {
                return "Dokumen Upload:";
              },
            },
          },
        },
      },

      myDocuments: [],

      userTools: [
        {
          title: "User Guide",
          desc: "How to use the system.",
          icon: "menu_book",
          color: "bg-slate-800",
          route: "UserGuide",
        },
        {
          title: "My Profile",
          desc: "Update your information and password.",
          icon: "person",
          color: "bg-slate-800",
          route: "MyAccount",
        },
      ],
    };
  },

  computed: {
    dateRange() {
      const monthStr = String(this.selectedMonth).padStart(2, "0");
      const lastDay = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
      return {
        startDate: `${this.selectedYear}-${monthStr}-01`,
        endDate: `${this.selectedYear}-${monthStr}-${String(lastDay).padStart(2, "0")}`,
      };
    },
    monthOptions() {
      return [
        { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
        { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
        { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
        { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
        { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
        { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
      ];
    },
    yearOptions() {
      const y = new Date().getFullYear();
      return [y - 2, y - 1, y, y + 1];
    },
    selectedMonthLabel() {
      const m = this.monthOptions.find(m => m.value === this.selectedMonth);
      return m ? m.label : '';
    },
    currentRoleLabel() {
      const map = {
        requester: this.$t('sidebar.requester'),
        approver: this.$t('sidebar.approver'),
        reviewer: this.$t('sidebar.reviewer'),
      };
      return map[this.activeRoleTab] || "Select Role";
    },

    currentRoleIcon() {
      const map = {
        requester: "person",
        approver: "how_to_reg",
        reviewer: "rate_review",
      };
      return map[this.activeRoleTab] || "manage_accounts";
    },
    currentUserId() {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.id || user.userId || null;
      } catch {
        return null;
      }
    },

    currentRoleColorDot() {
      const map = {
        requester: "bg-blue-500",
        approver: "bg-emerald-500",
        reviewer: "bg-amber-500",
      };
      return map[this.activeRoleTab] || "bg-slate-400";
    },

    currentRoleIconColor() {
      const map = {
        requester: "text-blue-500",
        approver: "text-emerald-500",
        reviewer: "text-amber-500",
      };
      return map[this.activeRoleTab] || "text-slate-400";
    },

    currentRoleLabelColor() {
      const map = {
        requester: "text-blue-600",
        approver: "text-emerald-600",
        reviewer: "text-amber-600",
      };
      return map[this.activeRoleTab] || "text-slate-700";
    },

    canCreatePermohonan() {
      if (!this.userData) return false;
      const roles = (Array.isArray(this.userData.roles) ? this.userData.roles : []).map(r => r.toUpperCase());
      return roles.includes("USER") || roles.includes("REQUESTER");
    },

    hasMultipleRoles() {
      return this.userRoles.length >= 2;
    },

    isRequester() {
      return this.userRoles.includes("USER");
    },

    isApprover() {
      return this.userRoles.includes("APPROVER");
    },

    isReviewer() {
      return this.userRoles.includes("REVIEWER");
    },

    // Stats yang ditampilkan sesuai tab/role aktif
    activeStats() {
      const role = this.hasMultipleRoles
        ? this.activeRoleTab
        : this.isRequester
        ? "requester"
        : this.isApprover
        ? "approver"
        : "reviewer";

      // ─── REQUESTER: hanya dokumen yang dia buat sendiri ───
      if (role === "requester") {
        const docs = this.myCreatedDocuments || [];
        return [
          {
            title: this.$t('dashboard.stats.submitted'),
            status: "SUBMITTED",
            value: docs.filter((d) => d.status === "SUBMITTED").length,
            displayValue: 0,
            unit: "",
            icon: "upload_file",
            bgColor: "bg-sky-500",
          },
          {
            title: this.$t('dashboard.stats.revision'),
            status: "REVISION",
            value: docs.filter((d) => d.status === "REVISION").length,
            displayValue: 0,
            unit: "",
            icon: "rate_review",
            bgColor: "bg-amber-500",
          },
          {
            title: this.$t('dashboard.stats.approved'),
            status: "APPROVED",
            value: docs.filter((d) => d.status === "APPROVED").length,
            displayValue: 0,
            unit: "",
            icon: "verified",
            bgColor: "bg-emerald-600",
          },
          {
            title: this.$t('dashboard.stats.rejected'),
            status: "REJECTED",
            value: docs.filter((d) => d.status === "REJECTED").length,
            displayValue: 0,
            unit: "",
            icon: "cancel",
            bgColor: "bg-red-600",
          },
        ];
      }

      // ─── APPROVER: dokumen masuk ke antrian approval dia ───
      if (role === "approver") {
        const docs = this.myApprovalDocuments || [];
        return [
          {
            title: this.$t('dashboard.stats.pending'),
            status: "PENDING",
            value: docs.filter((d) => d.status === "SUBMITTED").length,
            displayValue: 0,
            unit: "",
            icon: "pending_actions",
            bgColor: "bg-amber-500",
          },
          {
            title: this.$t('dashboard.stats.inReview'),
            status: "IN_REVIEW",
            value: docs.filter((d) => d.status === "IN_REVIEW").length,
            displayValue: 0,
            unit: "",
            icon: "hourglass_empty",
            bgColor: "bg-orange-500",
          },
          {
            title: this.$t('dashboard.stats.approved'),
            status: "APPROVED",
            value: docs.filter((d) => d.status === "APPROVED").length,
            displayValue: 0,
            unit: "",
            icon: "verified",
            bgColor: "bg-emerald-600",
          },
          {
            title: this.$t('dashboard.stats.rejected'),
            status: "REJECTED",
            value: docs.filter((d) => d.status === "REJECTED").length,
            displayValue: 0,
            unit: "",
            icon: "cancel",
            bgColor: "bg-red-600",
          },
        ];
      }

      // ─── REVIEWER: dokumen masuk ke antrian review dia ───
      if (role === "reviewer") {
        const docs = this.myReviewDocuments || [];
        return [
          {
            title: this.$t('dashboard.stats.pending'),
            status: "PENDING",
            value: docs.filter((d) => d.status === "SUBMITTED").length,
            displayValue: 0,
            unit: "",
            icon: "pending_actions",
            bgColor: "bg-amber-500",
          },
          {
            title: this.$t('dashboard.stats.inReview'),
            status: "IN_REVIEW",
            value: docs.filter((d) => d.status === "IN_REVIEW").length,
            displayValue: 0,
            unit: "",
            icon: "hourglass_empty",
            bgColor: "bg-orange-500",
          },
          {
            title: this.$t('dashboard.stats.approved'),
            status: "APPROVED",
            value: docs.filter((d) => d.status === "APPROVED").length,
            displayValue: 0,
            unit: "",
            icon: "verified",
            bgColor: "bg-emerald-600",
          },
          {
            title: this.$t('dashboard.stats.rejected'),
            status: "REJECTED",
            value: docs.filter((d) => d.status === "REJECTED").length,
            displayValue: 0,
            unit: "",
            icon: "cancel",
            bgColor: "bg-red-600",
          },
        ];
      }

      return this.stats;
    },
  },

  methods: {

    async fetchAllDocuments(baseParams = {}) {
      const { startDate, endDate } = this.dateRange;
      const response = await permohonanService.getMyApproval({
        ...baseParams,
        limit: 200,
        startDate,
        endDate,
        view: "compact",
      });
      return response.data || [];
    },

    deduplicateDocuments(docs) {
      const docMap = new Map();
      docs.forEach((doc) => {
        const rootKey = doc.parentId || doc.id;
        if (!docMap.has(rootKey)) {
          docMap.set(rootKey, doc);
        } else {
          const existing = docMap.get(rootKey);
          const existingRev = existing.rev || 0;
          const currentRev = doc.rev || 0;
          if (currentRev > existingRev) {
            docMap.set(rootKey, doc);
          } else if (currentRev === existingRev) {
            if (new Date(doc.createdAt || 0) > new Date(existing.createdAt || 0)) {
              docMap.set(rootKey, doc);
            }
          }
        }
      });
      return Array.from(docMap.values());
    },

    toggleRoleDropdown() {
      this.roleDropdownOpen = !this.roleDropdownOpen;
    },

    closeRoleDropdown() {
      this.roleDropdownOpen = false;
    },

    selectRole(role) {
      this.activeRoleTab = role;
      this.roleDropdownOpen = false;
    },
    goToAddDocument() {
      this.$router.push({ name: "AddDocument" });
    },

    goToViewDocuments() {
      this.$router.push({ name: "ViewDocument" });
    },

    goToApproverHub() {
      this.$router.push({ name: "ApproverV2" });
    },

    handleToolClick(tool) {
      if (tool.route) {
        this.$router.push({ name: tool.route }).catch((err) => {
          console.error("Gagal navigasi:", err);
        });
      }
    },

    exportReport() {
      const docs = this.chartRawDocs || [];
      const today = new Date();
      let filtered = [];
      let filename = "";

      if (this.chartFilter === "month") {
        const currentMonth = this.selectedMonth - 1;
        const currentYear = this.selectedYear;
        filtered = docs.filter((doc) => {
          const docDate = new Date(doc.createdAt);
          return docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear;
        });
        filename = `laporan-dokumen-bulanan-${currentYear}-${String(currentMonth + 1).padStart(2, '0')}.csv`;
      } else if (this.chartFilter === "year") {
        const currentYear = this.selectedYear;
        filtered = docs.filter((doc) => {
          const docDate = new Date(doc.createdAt);
          return docDate.getFullYear() === currentYear;
        });
        filename = `laporan-dokumen-tahunan-${currentYear}.csv`;
      } else {
        filtered = docs;
        filename = `laporan-dokumen-${today.toISOString().slice(0, 10)}.csv`;
      }

      if (filtered.length === 0) {
        const periodText = this.chartFilter === "month" ? "bulan ini" : "tahun ini";
        alert(`Tidak ada data dokumen untuk periode ${periodText}.`);
        return;
      }

      // Buat CSV dengan kolom data lengkap
      const headers = [
        "No",
        "Judul Dokumen",
        "Deskripsi",
        "Kategori",
        "Pembuat",
        "Versi/Revisi",
        "Status",
        "Tanggal Upload"
      ];

      const rows = filtered.map((doc, i) => {
        const no = i + 1;
        const title = doc.title || doc.name || "Tanpa Judul";
        const description = doc.description || "-";
        const category = doc.categoryName || (doc.category && doc.category.name) || "-";
        const creator = doc.creatorName || (doc.creator && (doc.creator.fullName || doc.creator.name)) || "-";
        const revision = doc.rev !== undefined ? `Rev ${doc.rev}` : "Rev 0";
        const status = doc.status || "-";
        const date = doc.createdAt
          ? new Date(doc.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })
          : "-";

        return [
          no,
          `"${title.replace(/"/g, '""')}"`,
          `"${description.replace(/"/g, '""')}"`,
          `"${category.replace(/"/g, '""')}"`,
          `"${creator.replace(/"/g, '""')}"`,
          `"${revision.replace(/"/g, '""')}"`,
          `"${status.replace(/"/g, '""')}"`,
          `"${date.replace(/"/g, '""')}"`
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\n");

      // Menambahkan UTF-8 BOM agar Excel membukanya dengan encoding yang benar dan kolom terpisah otomatis
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      console.log(`✅ Laporan diunduh (${this.chartFilter}):`, filtered.length, "dokumen");
    },

    async onMonthFilterChange() {
      this.allDocuments = [];
      this.statsLoading = true;
      try {
        const rawDocs = await this.fetchAllDocuments({ sortBy: 'createdAt', sortOrder: 'desc' });
        const allDocs = this.deduplicateDocuments(rawDocs);
        this.allDocuments = allDocs;
        await Promise.all([
          this.loadDashboardStats(allDocs),
          this.loadChartData(this.chartFilter, allDocs),
          this.loadActivityLogs(1, allDocs),
          this.loadNotifications(allDocs),
          this.loadMyDocuments(),
        ]);
      } catch (err) {
        console.error("❌ onMonthFilterChange error:", err);
      } finally {
        this.statsLoading = false;
      }
    },

    async toggleNotif() {
      this.notifOpen = !this.notifOpen;
      if (this.notifOpen) {
        this.markAllNotifAsSeen();
      }
    },

    closeNotif() {
      this.notifOpen = false;
      this.markAllNotifAsSeen();
    },

    async loadNotifications(docs = null) {
      try {
        this.notifLoading = true;
        const myId = this.currentUserId;

        // ✅ PERBAIKAN: Gunakan docs yang dipassing atau this.allDocuments (Single Fetch Cache)
        let allDocs = docs || this.allDocuments;
        if (!allDocs || allDocs.length === 0) {
          const rawDocs = await this.fetchAllDocuments({
            sortBy: "createdAt",
            sortOrder: "desc",
          });
          allDocs = this.deduplicateDocuments(rawDocs);
          this.allDocuments = allDocs;
        }

        // ✅ PERBAIKAN: Tentukan notif berdasarkan role user
        let relevantDocs = [];

        if (this.isRequester && !this.isApprover && !this.isReviewer) {
          // Pure requester: notif untuk dokumen MILIK DIA yang statusnya berubah
          relevantDocs = allDocs.filter(
            (d) =>
              String(d.createdBy) === String(myId) &&
              ["IN_REVIEW", "APPROVED", "REVISION", "REJECTED"].includes(d.status)
          );
        } else {
          // Approver / Reviewer: notif untuk dokumen yang MENUNGGU AKSI mereka
          relevantDocs = allDocs.filter((d) =>
            ["SUBMITTED", "IN_REVIEW", "REVISION"].includes(d.status)
          );
        }

        const statusLabelMap = {
          SUBMITTED: "Menunggu Review",
          IN_REVIEW: "Sedang Direview",
          REVISION: "Perlu Revisi",
          APPROVED: "Disetujui",
          REJECTED: "Ditolak",
        };

        this.notifications = relevantDocs.map((d) => ({
          id: d.id,
          title: d.title || "Tanpa Judul",
          status: d.status,
          statusLabel: statusLabelMap[d.status] || d.status,
          createdAt: d.updatedAt || d.createdAt,
        }));

        this.notifCount = this.notifications.length;

        // ✅ Hitung badge unread
        this.seenNotifIds = this.getSeenNotifIds();
        this.notifNewCount = this.notifications.filter(
          (n) => !this.seenNotifIds.includes(n.id)
        ).length;
      } catch (err) {
        console.error("❌ Notif error:", err);
      } finally {
        this.notifLoading = false;
      }
    },

    getSeenNotifIds() {
      try {
        return JSON.parse(localStorage.getItem("seen_notif_ids") || "[]");
      } catch {
        return [];
      }
    },

    // ✅ TAMBAH: Simpan semua ID notif saat ini sebagai "sudah dilihat"
    markAllNotifAsSeen() {
      try {
        const currentIds = this.notifications.map((n) => n.id);
        const seenIds = this.getSeenNotifIds();
        const merged = [...new Set([...seenIds, ...currentIds])];
        localStorage.setItem("seen_notif_ids", JSON.stringify(merged));
        this.notifNewCount = 0;
      } catch (err) {
        console.error("❌ Save seen notif error:", err);
      }
    },

    navigateToNotif(docId) {
      this.closeNotif();
      this.$router.push({ name: "ViewDocumentDetail", params: { id: docId } });
    },

    goToAllDocuments() {
      this.closeNotif();
      this.$router.push({ name: "ViewDocument" });
    },

    getNotifStatusClass(status) {
      const map = {
        SUBMITTED: "bg-amber-50 text-amber-600",
        IN_REVIEW: "bg-blue-50 text-blue-600",
        REVISION: "bg-rose-50 text-rose-600",
        APPROVED: "bg-emerald-50 text-emerald-600",
        REJECTED: "bg-red-50 text-red-600",
      };
      return map[status] || "bg-slate-100 text-slate-500";
    },

    formatNotifTime(dateString) {
      if (!dateString) return "";
      const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
      if (diff < 60) return "Baru saja";
      if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
      return `${Math.floor(diff / 86400)} hari lalu`;
    },

    handleSearch() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);

      if (!this.searchQuery.trim()) {
        this.searchResults = [];
        this.showResults = false;
        this.isSearching = false;

        // ✅ Cancel request yang sedang berjalan jika ada
        if (this.searchController) {
          this.searchController.abort();
          this.searchController = null;
        }
        return;
      }

      this.showResults = true;
      this.isSearching = true;
      this.searchTimeout = setTimeout(() => this.performSearch(), 300);
    },

    async performSearch() {
      if (!this.searchQuery.trim()) {
        this.isSearching = false;
        return;
      }

      // ✅ Cancel request sebelumnya jika masih berjalan
      if (this.searchController) {
        this.searchController.abort();
      }

      // ✅ Buat request ID unik untuk request ini
      this.searchRequestId += 1;
      const currentRequestId = this.searchRequestId;

      // ✅ Buat AbortController baru
      this.searchController = new AbortController();

      // ✅ Timeout otomatis 10 detik — paksa stop loading jika API hang
      const timeoutId = setTimeout(() => {
        if (this.searchController) {
          this.searchController.abort();
        }
      }, 10000);

      try {
        this.isSearching = true;

        const response = await permohonanService.searchPermohonan(
          this.searchQuery,
          { signal: this.searchController?.signal }
        );

        // ✅ Abaikan hasil jika sudah ada request lebih baru
        if (currentRequestId !== this.searchRequestId) {
          console.log("⚠️ Search result dibatalkan, ada request lebih baru");
          return;
        }

        const results = response.data || [];
        this.searchResults = results.map((doc) => ({
          id: doc.id,
          title: doc.title,
          status: doc.status,
          categoryName: doc.categoryName || doc.category?.name || "No Category",
          creatorName: doc.creatorName || doc.creator?.fullName || "Unknown",
        }));
      } catch (err) {
        // ✅ Jika dibatalkan (AbortError), jangan tampilkan error
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
          console.log("⚠️ Search request dibatalkan");
          return;
        }
        console.error("❌ Search error:", err);
        this.searchResults = [];
      } finally {
        clearTimeout(timeoutId);

        if (currentRequestId === this.searchRequestId) {
          this.isSearching = false;
          this.searchController = null;
        }
      }
    },

    navigateToDetail(docId) {
      this.showResults = false;
      this.searchQuery = "";
      this.searchResults = [];
      this.$router.push({ name: "ViewDocumentDetail", params: { id: docId } });
    },

    closeSearch() {
      this.showResults = false;
      this.isSearching = false;

      if (this.searchController) {
        this.searchController.abort();
        this.searchController = null;
      }
    },

    getStatusClass(status) {
      const map = {
        DRAFT: "bg-slate-100 text-slate-500",
        SUBMITTED: "bg-amber-50 text-amber-600",
        IN_REVIEW: "bg-blue-50 text-blue-600",
        APPROVED: "bg-emerald-50 text-emerald-600",
        REVISION: "bg-rose-50 text-rose-600",
        REJECTED: "bg-red-50 text-red-600",
      };
      return map[status] || "bg-slate-100 text-slate-500";
    },

    animateStats() {
      this.stats.forEach((stat) => {
        let start = 0;
        const end = stat.value;
        const update = () => {
          start += end / 50;
          if (start < end) {
            stat.displayValue = parseFloat(start.toFixed(1));
            requestAnimationFrame(update);
          } else {
            stat.displayValue = end;
          }
        };
        update();
      });
    },

    refreshData() {
      this.isSyncing = true;
      setTimeout(() => {
        this.isSyncing = false;
        this.animateStats();
      }, 1000);
    },

    handleStatCardClick(stat) {
      const role = this.hasMultipleRoles
        ? this.activeRoleTab
        : this.isRequester
        ? "requester"
        : this.isApprover
        ? "approver"
        : "reviewer";

      const statusKey = stat.status; // E.g. "SUBMITTED", "REVISION", "APPROVED", "REJECTED", "PENDING", "IN_REVIEW"

      if (role === "requester") {
        const mappedStatus = statusKey;
        const docs = (this.myCreatedDocuments || []).filter((d) => d.status === mappedStatus);

        if (docs.length === 1) {
          this.$router.push({
            name: "ViewDocumentDetail",
            params: { id: docs[0].id }
          });
        } else {
          this.$router.push({
            name: "ViewDocument",
            query: { status: mappedStatus }
          });
        }
      } else {
        let docList = [];
        let statusFilter = "ALL";

        if (statusKey === "PENDING") {
          statusFilter = "PENDING";
          docList = (role === "approver" ? this.myApprovalDocuments : this.myReviewDocuments)
            .filter((d) => d.status === "SUBMITTED");
        } else if (statusKey === "IN_REVIEW") {
          statusFilter = "IN_REVIEW";
          docList = (role === "approver" ? this.myApprovalDocuments : this.myReviewDocuments)
            .filter((d) => d.status === "IN_REVIEW");
        } else if (statusKey === "APPROVED") {
          statusFilter = "APPROVED";
          docList = (role === "approver" ? this.myApprovalDocuments : this.myReviewDocuments)
            .filter((d) => d.status === "APPROVED");
        } else if (statusKey === "REJECTED") {
          statusFilter = "REJECTED";
          docList = (role === "approver" ? this.myApprovalDocuments : this.myReviewDocuments)
            .filter((d) => d.status === "REJECTED");
        }

        if (docList.length === 1) {
          this.$router.push({
            name: "ApproverV2",
            query: { id: docList[0].id, status: statusFilter }
          });
        } else {
          this.$router.push({
            name: "ApproverV2",
            query: { status: statusFilter }
          });
        }
      }
    },

    async loadDashboardStats(passedDocs = null) {
      try {
        this.statsLoading = true;

        // ✅ Gunakan docs yang dipassing atau this.allDocuments (Single Fetch Cache)
        let allDocs = passedDocs || this.allDocuments;
        if (!allDocs || allDocs.length === 0) {
          const rawDocs = await this.fetchAllDocuments({
            sortBy: "createdAt",
            sortOrder: "desc",
          });
          allDocs = this.deduplicateDocuments(rawDocs);
          this.allDocuments = allDocs;
        }

        const myId = this.currentUserId;

        // ✅ Requester: dokumen yang DIA BUAT SENDIRI (exclude DRAFT agar konsisten)
        this.myCreatedDocuments = allDocs.filter(
          (doc) =>
            String(doc.createdBy) === String(myId) &&
            !["DRAFT", "CANCELLED"].includes(doc.status)
        );

        // ✅ HELPER: cek apakah user ini adalah Final Authorization Reviewer di dokumen tsb
        const isUserFinalReviewer = (doc) => {
          if (!doc.reviewers || doc.reviewers.length === 0) return false;
          return doc.reviewers.some((r) => {
            // Handle: array of objects { id, userId } atau array of plain ID strings/numbers
            if (typeof r === "object" && r !== null) {
              return (
                String(r.id) === String(myId) ||
                String(r.userId) === String(myId)
              );
            }
            return String(r) === String(myId);
          });
        };

        // ✅ APPROVER: dokumen yang masuk ke antrian approval dia
        // PENTING: exclude dokumen di mana user adalah Final Authorization reviewer
        this.myApprovalDocuments = allDocs.filter((doc) => {
          if (String(doc.createdBy) === String(myId)) return false;
          if (!doc.approvalLevels) return false;

          // Jika user adalah Final Authorization reviewer di dokumen ini → JANGAN masuk approver card
          if (isUserFinalReviewer(doc)) return false;

          return doc.approvalLevels.some((level) => {
            const isApprovalLevel =
              !level.type ||
              level.type === "APPROVAL" ||
              level.type === "APPROVE";
            if (!isApprovalLevel) return false;
            return level.approvers?.some((app) => {
              const idMatch =
                String(app.id) === String(myId) ||
                String(app.userId) === String(myId);
              const roleMatch =
                !app.role || app.role === "APPROVER" || app.role === "APPROVAL";
              return idMatch && roleMatch;
            });
          });
        });

        // ✅ REVIEWER: dokumen yang masuk ke review dia
        // Cek DUA sumber:
        // 1. approvalLevels dengan type REVIEW/REVIEWER (alur review bertahap)
        // 2. doc.reviewers[] — Final Authorization yang dipilih di AddDocument
        this.myReviewDocuments = allDocs.filter((doc) => {
          if (String(doc.createdBy) === String(myId)) return false;

          // Sumber 1: Final Authorization reviewer
          if (isUserFinalReviewer(doc)) return true;

          // Sumber 2: approvalLevels bertipe REVIEW
          if (!doc.approvalLevels) return false;
          return doc.approvalLevels.some((level) => {
            const isReviewLevel =
              level.type === "REVIEW" || level.type === "REVIEWER";
            if (!isReviewLevel) return false;
            return level.approvers?.some((app) => {
              return (
                String(app.id) === String(myId) ||
                String(app.userId) === String(myId)
              );
            });
          });
        });

        // Stats fallback (untuk role tunggal)
        const myDocs = this.myCreatedDocuments;
        const totalDocuments = myDocs.filter(
          (doc) => doc.status !== "DRAFT"
        ).length;
        const submittedDocs = myDocs.filter(
          (doc) => doc.status === "SUBMITTED"
        ).length;
        const inReviewDocs = myDocs.filter(
          (doc) => doc.status === "IN_REVIEW"
        ).length;
        const approvedDocs = myDocs.filter(
          (doc) => doc.status === "APPROVED"
        ).length;
        const revisionDocs = myDocs.filter(
          (doc) => doc.status === "REVISION"
        ).length;
        const rejectedDocs = myDocs.filter(
          (doc) => doc.status === "REJECTED"
        ).length;

        this.stats = [
          {
            title: "My Documents",
            value: totalDocuments,
            displayValue: 0,
            unit: "",
            icon: "folder_shared",
            bgColor: "bg-blue-600",
          },
          {
            title: "Submitted",
            value: submittedDocs,
            displayValue: 0,
            unit: "",
            icon: "upload_file",
            bgColor: "bg-sky-500",
          },
          {
            title: "In Review",
            value: inReviewDocs,
            displayValue: 0,
            unit: "",
            icon: "hourglass_empty",
            bgColor: "bg-orange-500",
          },
          {
            title: "Approved",
            value: approvedDocs,
            displayValue: 0,
            unit: "",
            icon: "verified",
            bgColor: "bg-emerald-600",
          },
          {
            title: "Revision",
            value: revisionDocs,
            displayValue: 0,
            unit: "",
            icon: "edit_note",
            bgColor: "bg-rose-500",
          },
          {
            title: "Rejected",
            value: rejectedDocs,
            displayValue: 0,
            unit: "",
            icon: "cancel",
            bgColor: "bg-red-600",
          },
        ];

        this.animateStats();
      } catch (error) {
        console.error("❌ Load stats error:", error);
        this.myCreatedDocuments = [];
        this.myApprovalDocuments = [];
        this.myReviewDocuments = [];
        this.stats = [
          {
            title: "My Documents",
            value: 0,
            displayValue: 0,
            unit: "",
            icon: "folder_shared",
            bgColor: "bg-blue-600",
          },
          {
            title: "Submitted",
            value: 0,
            displayValue: 0,
            unit: "",
            icon: "upload_file",
            bgColor: "bg-sky-500",
          },
          {
            title: "In Review",
            value: 0,
            displayValue: 0,
            unit: "",
            icon: "hourglass_empty",
            bgColor: "bg-orange-500",
          },
          {
            title: "Approved",
            value: 0,
            displayValue: 0,
            unit: "",
            icon: "verified",
            bgColor: "bg-emerald-600",
          },
          {
            title: "Revision",
            value: 0,
            displayValue: 0,
            unit: "",
            icon: "edit_note",
            bgColor: "bg-rose-500",
          },
          {
            title: "Rejected",
            value: 0,
            displayValue: 0,
            unit: "",
            icon: "cancel",
            bgColor: "bg-red-600",
          },
        ];
      } finally {
        this.statsLoading = false;
      }
    },

    async loadChartData(period = "month", docs = null) {
      try {
        // ✅ Gunakan docs yang dipassing atau this.allDocuments (Single Fetch Cache)
        let documents = docs || this.allDocuments;
        if (!documents || documents.length === 0) {
          const rawDocs = await this.fetchAllDocuments({
            sortBy: "createdAt",
            sortOrder: "desc",
          });
          documents = this.deduplicateDocuments(rawDocs);
          this.allDocuments = documents;
        }

        const myId = this.currentUserId;
        const validDocs = documents.filter((doc) => {
          if (doc.status === "DRAFT") return false;
          // Jika user adalah requester, hanya hitung dokumen yang dia buat
          if (this.isRequester && !this.isApprover && !this.isReviewer) {
            return String(doc.createdBy) === String(myId);
          }
          return true;
        });

        console.log("📊 validDocs after filter:", validDocs.length, "| myId:", myId);

        let labels = [];
        let values = [];
        const today = new Date();

        if (period === "month") {
          labels = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          values = new Array(7).fill(0);

          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();

          validDocs.forEach((doc) => {
            const docDate = new Date(doc.createdAt);
            if (
              docDate.getMonth() === currentMonth &&
              docDate.getFullYear() === currentYear
            ) {
              const dayOfWeek = docDate.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
              const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0 ... Sun=6
              values[index]++;
            }
          });
        } else if (period === "year") {
          // ✅ FIX: index 0=Jan, 1=Feb, 2=Mar, 3=Apr, 4=Mei dst
          labels = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
          values = new Array(12).fill(0);
          const currentYear = today.getFullYear();

          validDocs.forEach((doc) => {
            const docDate = new Date(doc.createdAt);
            if (docDate.getFullYear() === currentYear) {
              values[docDate.getMonth()]++; // getMonth() sudah 0-based, pas dengan labels
            }
          });

          console.log("📊 Values per bulan:", labels.map((l, i) => `${l}: ${values[i]}`));
        }

        // ✅ Simpan rawDocs untuk keperluan export
        this.chartRawDocs = validDocs;
        this.chartPeriod = period;

        this.chartSeries = [{ name: "Dokumen Masuk", data: values }];
        this.chartOptions = Object.assign({}, this.chartOptions, {
          xaxis: {
            categories: labels,
            labels: {
              style: { fontSize: "11px", colors: "#1e293b", fontWeight: 400 },
            },
          },
        });

        console.log(
          "✅ Chart loaded for period:",
          period,
          "| total docs:",
          validDocs.length
        );
      } catch (error) {
        console.error("❌ Load chart error:", error);
        this.chartSeries = [{ name: "Dokumen Masuk", data: [] }];
      }
    },

    async updateChartData(filter) {
      this.chartFilter = filter;
      await this.loadChartData(filter);
    },

    async loadActivityLogs(page = 1, docs = null) {
      try {
        if (page === 1) {
          this.activitiesLoading = true;
        } else {
          this.loadingMore = true;
        }

        // ✅ Gunakan docs yang dipassing atau this.allDocuments (Single Fetch Cache)
        let allDocuments = docs || this.allDocuments;
        if (!allDocuments || allDocuments.length === 0) {
          const rawDocs = await this.fetchAllDocuments({
            sortBy: "updatedAt",
            sortOrder: "desc",
          });
          allDocuments = this.deduplicateDocuments(rawDocs);
          this.allDocuments = allDocuments;
        }

        // ✅ Filter hanya 1 bulan terakhir
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const documents = allDocuments.filter((doc) => {
          const docDate = new Date(doc.updatedAt || doc.createdAt);
          return docDate >= oneMonthAgo;
        });

        // ✅ Map status dokumen → teks aktivitas yang informatif
        const statusTextMap = {
          SUBMITTED: "telah disubmit ke sistem",
          IN_REVIEW: "sedang dalam proses review",
          APPROVED: "telah disetujui",
          REVISION: "memerlukan revisi",
          REJECTED: "ditolak oleh sistem",
          DRAFT: "disimpan sebagai draft",
        };

        const mapped = documents.map((doc, index) => ({
          id: doc.id || index,
          userName: "Dokumen",
          docTitle: `"${doc.title || doc.name || "Tanpa Judul"}"`,
          action: statusTextMap[doc.status] || doc.status || "diperbarui",
          status: doc.status || "DRAFT",
          createdAt: doc.updatedAt || doc.createdAt || new Date().toISOString(),
        }));

        if (page === 1) {
          this.activities = mapped;
        } else {
          this.activities = [...this.activities, ...mapped];
        }

        this.activitiesPage = page;
        // ✅ Kalau data yang datang < limit, berarti tidak ada halaman berikutnya
        this.hasMoreActivities = false;

        console.log("✅ Activities loaded from real data:", mapped.length);
      } catch (error) {
        console.error("❌ Load activities error:", error);
        this.activities = [];
        this.hasMoreActivities = false;
      } finally {
        this.activitiesLoading = false;
        this.loadingMore = false;
      }
    },

    async loadMyDocuments() {
      try {
        const { startDate, endDate } = this.dateRange;
        const response = await permohonanService.getMyApproval({
          page: 1,
          limit: 10,
          startDate,
          endDate,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          view: 'compact',
        });

        const documents = response.data || [];

        const statusColorMap = {
          APPROVED: "bg-green-100 text-green-600",
          SUBMITTED: "bg-amber-100 text-amber-600",
          PENDING: "bg-amber-100 text-amber-600",
          IN_REVIEW: "bg-blue-100 text-blue-600",
          REJECTED: "bg-red-100 text-red-600",
          REVISION: "bg-yellow-100 text-yellow-600",
          DRAFT: "bg-slate-100 text-slate-500",
        };

        const statusLabelMap = {
          SUBMITTED: "PENDING",
          IN_REVIEW: "IN REVIEW",
          APPROVED: "APPROVED",
          REJECTED: "REJECTED",
          REVISION: "REVISION",
          DRAFT: "DRAFT",
        };

        this.myDocuments = documents.map((doc) => ({
          id: doc.id,
          name: doc.title || doc.name || "Tanpa Judul",
          status: statusLabelMap[doc.status] || doc.status || "DRAFT", // ✅ SUBMITTED → PENDING
          statusColor:
            statusColorMap[doc.status] || "bg-slate-100 text-slate-500",
          date: doc.createdAt
            ? new Date(doc.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-",
        }));

        console.log("✅ My documents loaded:", this.myDocuments.length);
      } catch (error) {
        console.error("❌ Load my documents error:", error);
        this.myDocuments = [];
      }
    },

    loadMoreLogs() {
      if (!this.hasMoreActivities || this.loadingMore) return;
      this.loadActivityLogs(this.activitiesPage + 1);
    },

    navigateToDoc(docId) {
      this.$router.push({
        name: "ViewDocumentDetail",
        params: { id: docId },
      });
    },

    getActivityColor(status) {
      const colorMap = {
        APPROVED: "bg-green-500",
        SUBMITTED: "bg-blue-500",
        IN_REVIEW: "bg-orange-400",
        REVISION: "bg-amber-500",
        REJECTED: "bg-red-500",
        DRAFT: "bg-slate-400",
      };
      return colorMap[status] || "bg-slate-400";
    },

    formatActivityTime(dateString) {
      if (!dateString) return "Unknown time";
      const now = new Date();
      const activityDate = new Date(dateString);
      const diffMs = now - activityDate;
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      if (diffSec < 60) return "Baru saja";
      if (diffMin < 60) return `${diffMin} menit yang lalu`;
      if (diffHour < 24) return `${diffHour} jam yang lalu`;
      if (diffDay < 7) return `${diffDay} hari yang lalu`;
      return activityDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },

    async loadUserData() {
      try {
        this.loading = true;
        this.userData = await getCurrentUser();
        this.loading = false;
        console.log("✅ User data loaded:", this.userData);

        this.userRoles = Array.isArray(this.userData?.roles)
          ? this.userData.roles
          : [];
        if (this.userRoles.includes("USER")) {
          this.activeRoleTab = "requester";
        } else if (this.userRoles.includes("APPROVER")) {
          this.activeRoleTab = "approver";
        } else if (this.userRoles.includes("REVIEWER")) {
          this.activeRoleTab = "reviewer";
        }

        const roles = Array.isArray(this.userData.roles)
          ? this.userData.roles
          : [];
        // 1. Fetch seluruh dokumen HANYA 1 KALI saat halaman dimuat (Single Fetch)
        const rawDocs = await this.fetchAllDocuments({
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        const allDocs = this.deduplicateDocuments(rawDocs);
        this.allDocuments = allDocs;

        // 2. Olah data secara paralel dari cache yang sama (Tanpa request API berulang)
        await Promise.all([
          this.loadDashboardStats(allDocs),
          this.loadChartData(this.chartFilter, allDocs),
          this.loadActivityLogs(1, allDocs),
          this.loadNotifications(allDocs),
          this.loadMyDocuments(), // tetap limit: 5 untuk tabel dokumen saya
        ]);
      } catch (err) {
        console.error("❌ Failed to load user data:", err);
        this.$router.push("/login");
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.loadUserData();
    this.animateStats();
  
    this.notifPollingInterval = setInterval(() => {
      this.loadNotifications();
    }, 30000);
  },

  

  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.searchController) {
      this.searchController.abort();
      this.searchController = null;
    }
    // ✅ TAMBAH: Hentikan polling saat komponen di-destroy
    if (this.notifPollingInterval) {
      clearInterval(this.notifPollingInterval);
    }
  },
};
</script>

<style scoped>

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.activities-scroll::-webkit-scrollbar {
  width: 4px;
}
.activities-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.activities-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.activities-scroll::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Stat number responsive */
.stat-number {
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1;
}

@media (max-width: 640px) {
  .stat-number {
    font-size: 1.5rem; /* 24px */
  }
}
</style>
