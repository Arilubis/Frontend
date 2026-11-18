<template>
  <div class="min-h-screen bg-[#F1F5F9] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 font-sans text-slate-900 transition-all duration-300">
    <div class="max-w-[1440px] mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-800 tracking-tight" >Dashboard Admin</h1>
          <p class="text-slate-500 text-sm font-normal mt-0.5" >Welcome back, Admin. Here's what's happening today.</p>
        </div>
        
        <div class="relative flex flex-row items-center gap-3">
          <div
            @click="toggleNotifications"
            class="relative p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer shadow-sm"
          >
            <span class="material-icons text-slate-600">notifications</span>
            <span
              v-if="notifications.length > 0 && !notifSeen"
              class="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white px-0.5"
            >
              {{ notifications.length > 9 ? '9+' : notifications.length }}
            </span>
          </div>
          <!-- Dropdown Notifikasi -->
          <transition name="fade-down">
            <div
              v-if="showNotifications"
              class="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
            >
              <div class="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 class="text-sm font-semibold text-slate-800">Notifikasi Persetujuan</h4>
                <span class="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {{ notifications.length }} pending
                </span>
              </div>
              <div v-if="notifLoading" class="p-6 text-center">
                <div class="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              </div>
              <div v-else-if="notifications.length === 0" class="p-6 text-center">
                <span class="material-icons text-slate-200 text-3xl">notifications_none</span>
                <p class="text-xs text-slate-400 mt-2">No notifications</p>
              </div>
              <div v-else class="max-h-72 overflow-y-auto divide-y divide-slate-50">
                <div
                  v-for="notif in notifications"
                  :key="notif.id"
                  @click="goToDocument(notif.id)"
                  class="flex gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <span class="material-icons text-orange-500 text-sm">description</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[12px] font-semibold text-slate-700 truncate">{{ notif.title }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">
                      Dari: <span class="font-medium text-slate-600">
                        {{ notif.creatorInfo?.fullName || notif.creatorInfo?.name || 'Unknown User' }}
                      </span>
                    </p>
                    <p class="text-[10px] text-slate-400 mt-0.5">
                      Kategori: <span class="font-medium text-slate-500">
                        {{ notif.categoryInfo?.name || '-' }}
                      </span>
                    </p>
                    <p class="text-[10px] text-orange-500 font-medium uppercase mt-0.5">Awaiting Approval</p>
                  </div>
                </div>
              </div>
              <div class="p-3 border-t border-slate-100">
                <button
                  @click="router.push('/arsip'); showNotifications = false"
                  class="w-full text-[11px] font-medium text-blue-600 hover:text-blue-700 py-1.5"
                >
                  Lihat Semua Dokumen →
                </button>
              </div>
            </div>
          </transition>
          <!-- Overlay tutup dropdown -->
          <div v-if="showNotifications" @click="showNotifications = false" class="fixed inset-0 z-40"></div>
          
        </div>
      </div>

      <!-- Filter Bulan -->
      <div class="flex items-center gap-2 mb-4">
        <span class="material-icons text-slate-400 text-[18px]">calendar_month</span>
        <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Periode:</span>
        <div class="flex items-center gap-2">
          <select
            v-model="selectedMonth"
            @change="chartRawDocs = []; loadAdminStats(); loadChartData(true)"
            class="text-[12px] font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer text-slate-700"
          >
            <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
          </select>
          <select
            v-model="selectedYear"
            @change="chartRawDocs = []; loadAdminStats(); loadChartData(true)"
            class="text-[12px] font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm cursor-pointer text-slate-700"
          >
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div v-if="isSyncing" class="col-span-4 text-center py-10">
          <div class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p class="text-sm text-slate-400">Loading statistics...</p>
        </div>

        <div
          v-else
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="bg-white p-4 md:p-5 rounded-[18px] md:rounded-[20px] border border-slate-200 shadow-sm hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between mb-2 md:mb-3">
            <div
              :class="stat.iconBg"
              class="p-2 md:p-2.5 rounded-xl text-white shadow-lg"
            >
              <span class="material-icons text-lg md:text-xl">{{ stat.icon }}</span>
            </div>
            <span class="text-[8px] md:text-[9px] font-normal px-1.5 md:px-2 py-0.5 rounded-md text-black bg-slate-50 truncate max-w-[60px] md:max-w-none">
              {{ selectedMonthLabel }}
            </span>
          </div>
          <div class="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            {{ stat.displayValue }}{{ stat.unit }}
          </div>
          <div class="text-[10px] md:text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-tight">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <!-- Chart -->
        <div class="lg:col-span-7 bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm min-h-[350px]">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 class="font-medium text-slate-700 text-[13px]">Document Flow Analysis</h3>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <div class="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                <button
                  @click="chartViewMode = 'monthly'; loadChartData()"
                  :class="chartViewMode === 'monthly' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'"
                  class="px-3 py-1 rounded-md text-xs font-medium transition-all"
                >Monthly</button>
                <button
                  @click="chartViewMode = 'yearly'; loadChartData()"
                  :class="chartViewMode === 'yearly' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'"
                  class="px-3 py-1 rounded-md text-xs font-medium transition-all"
                >Yearly</button>
              </div>
              <button @click="exportData" class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-normal transition-all border bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-200 cursor-pointer">
                <span class="material-icons text-[14px]">download</span>
                Download Report
              </button>
            </div>
          </div>
          <div v-if="isSyncing" class="h-[250px] flex items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse">
            <span class="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Generating Chart...</span>
          </div>
          <div v-else class="h-[250px]">
            <apexchart
              v-if="chartMounted"
              type="area"
              height="100%"
              :options="chartOptions"
              :series="chartSeries"
            ></apexchart>
          </div>
        </div>

        <!-- System Activities -->
        <div class="lg:col-span-5 bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col">
          <div class="flex flex-col gap-3 mb-4">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-slate-800 text-[14px]" >System Activities</h3>
              <!-- Reset Filters Link/Button -->
              <button
                v-if="filterAction || filterDate || filterStartTime || filterEndTime"
                @click="resetFilters"
                class="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer border border-rose-100 shadow-sm"
              >
                <span class="material-icons text-[14px]">restart_alt</span>
                Reset Filter
              </button>
            </div>

            <!-- Filter Controls -->
            <div class="flex flex-col gap-3 bg-slate-50/70 p-4 rounded-[20px] border border-slate-100">
              <!-- Baris 1: Aktivitas -->
              <div>
                <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Aktivitas</label>
                <div class="relative">
                  <select
                    v-model="filterAction"
                    @change="loadActivities(true)"
                    class="w-full text-[11px] bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold text-slate-700 cursor-pointer appearance-none shadow-sm"
                  >
                    <option value="">Semua Aktivitas</option>
                    <option value="LOGIN">Login</option>
                    <option value="LOGOUT">Logout</option>
                    <option value="APPROVAL_REQUEST_CREATE">Buat Dokumen</option>
                    <option value="APPROVAL_REQUEST_SUBMIT">Submit Dokumen</option>
                    <option value="APPROVAL_REQUEST_APPROVE">Setujui Dokumen</option>
                    <option value="APPROVAL_REQUEST_REJECT">Tolak Dokumen</option>
                    <option value="APPROVAL_REQUEST_REVISION">Revisi Dokumen</option>
                    <option value="USER_CREATE">Tambah User</option>
                    <option value="USER_UPDATE">Edit User</option>
                    <option value="USER_DELETE">Hapus User</option>
                    <option value="CATEGORY_CREATE">Buat Kategori</option>
                  </select>
                  <span class="material-icons absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[16px]">expand_more</span>
                </div>
              </div>

              <!-- Baris 2: Tanggal & Waktu (Dua Kolom Bersisian) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Tanggal -->
                <div>
                  <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    v-model="filterDate"
                    @change="loadActivities(true)"
                    class="w-full text-[11px] bg-white border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold text-slate-700 shadow-sm cursor-pointer"
                  />
                </div>

                <!-- Waktu -->
                <div>
                  <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Waktu (Mulai - Selesai)</label>
                  <div class="flex items-center gap-1.5">
                    <input
                      type="time"
                      v-model="filterStartTime"
                      @change="loadActivities(true)"
                      class="w-full text-[11px] bg-white border border-slate-200 rounded-xl px-2.5 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold text-slate-700 shadow-sm"
                      placeholder="Mulai"
                    />
                    <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">s/d</span>
                    <input
                      type="time"
                      v-model="filterEndTime"
                      @change="loadActivities(true)"
                      class="w-full text-[11px] bg-white border border-slate-200 rounded-xl px-2.5 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-semibold text-slate-700 shadow-sm"
                      placeholder="Selesai"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading skeleton -->
          <div v-if="activitiesLoading" class="space-y-4 flex-1">
            <div v-for="n in 4" :key="n" class="animate-pulse flex gap-4">
              <div class="w-2.5 h-2.5 bg-slate-200 rounded-full mt-1.5 shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 bg-slate-100 rounded w-3/4"></div>
                <div class="h-2 bg-slate-100 rounded w-1/3"></div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="space-y-4 flex-1 overflow-y-auto pr-1 activities-scroll"
            style="max-height: 320px"
          >
            <div
              v-for="act in visibleActivities"
              :key="act.id"
              class="rounded-2xl border border-slate-100 overflow-hidden transition-all"
              :class="selectedActivityId === act.id ? 'shadow-md' : 'shadow-sm'"
            >
              <!-- Header baris — klik untuk toggle -->
              <div
                @click="toggleActivityDetail(act.id)"
                class="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <!-- Dot warna -->
                <div :class="[getActionColor(act.action), 'w-2.5 h-2.5 rounded-full shrink-0 shadow-sm']"></div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-[12px] font-semibold text-slate-700 truncate">{{ act.user }}</p>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span
                      :class="act.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'"
                      class="text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wide"
                    >{{ act.status }}</span>
                    <span class="text-[10px] text-slate-400 truncate">{{ act.action }}</span>
                  </div>
                </div>

                <!-- Chevron -->
                <span
                  class="material-icons text-slate-300 text-[18px] transition-transform shrink-0"
                  :class="selectedActivityId === act.id ? 'rotate-180' : ''"
                >expand_more</span>
              </div>

              <!-- Detail dropdown -->
              <transition name="fade-slide">
                <div
                  v-if="selectedActivityId === act.id && act.detailRows?.length"
                  class="border-t border-slate-100 bg-slate-50 px-4 py-3 space-y-2"
                >
                  <div
                    v-for="(row, i) in act.detailRows"
                    :key="i"
                    class="flex justify-between items-start gap-2"
                  >
                    <span class="text-[10px] text-slate-400 font-medium shrink-0">{{ row.label }}</span>
                    <span class="text-[10px] text-slate-700 font-normal text-right break-all">{{ row.value }}</span>
                  </div>
                  <div class="pt-1.5 border-t border-slate-200 text-[9px] text-slate-400 text-right">
                    {{ act.time }}
                  </div>
                </div>
              </transition>
            </div>

            <div v-if="activities.length === 0 && !activitiesLoading" class="text-center py-12">
              <span class="material-icons text-slate-200 text-4xl mb-2">history</span>
              <p class="text-sm text-slate-400">No activities yet</p>
            </div>
          </div>

          <button
            @click="showAllActivities = !showAllActivities"
            class="w-full mt-4 py-2.5 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-medium uppercase tracking-wider rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
          >
            {{ showAllActivities ? 'Show Less' : 'View All Activities' }}
            <span class="material-icons text-sm transition-transform" :class="showAllActivities ? 'rotate-180' : ''">expand_more</span>
          </button>
        </div>
      </div>

      <!-- ADMIN TOOLS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          @click="handleNav(card)"
          v-for="card in adminTools"
          :key="card.title"
          class="group bg-white p-4 rounded-[20px] border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4"
        >
          <div
            :class="card.color"
            class="p-3 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform"
          >
            <span class="material-icons text-xl">{{ card.icon }}</span>
          </div>
          <div>
            <h4 class="font-medium text-slate-700 text-[13px]">{{ card.title }}</h4>
            <p class="text-[11px] text-slate-400 mt-0.5">{{ card.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showGuideEditor" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div class="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-semibold text-slate-800">Manage User Guide</h3>
            <p class="text-sm text-slate-500 font-normal">Perbarui konten instruksi untuk pengguna</p>
          </div>
          <button @click="showGuideEditor = false" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <span class="material-icons text-slate-400">close</span>
          </button>
        </div>

        <div class="p-8 space-y-6">
          <div>
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Select Guide Page</label>
            <select v-model="selectedGuideSection" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 transition-all">
              <option value="dashboard">Dashboard & Statistics</option>
              <option value="upload">Add Document</option>
              <option value="approver">Approver Hub</option>
              <option value="settings">User Settings</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Guide Content</label>
            <textarea 
              v-model="guideContent[selectedGuideSection]" 
              rows="6" 
              class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium outline-none focus:border-blue-500 transition-all resize-none"
              placeholder="Tulis instruksi di sini...">
            </textarea>
          </div>
        </div>

        <div class="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button @click="saveGuide" class="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
            Save Changes
          </button>
          <button @click="showGuideEditor = false" class="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-semibold text-sm hover:bg-slate-100 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import VueApexCharts from "vue3-apexcharts";
import permohonanService from '@/services/permohonanService.js';
import api from '@/services/api';
import { fetchUserList } from '@/services/user.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const apexchart = VueApexCharts;
const router = useRouter();
const isSyncing = ref(false);

const showNotifications  = ref(false);
const notifLoading       = ref(false);
const selectedDepartment = ref('All Departments');
const selectedPeriod     = ref('Today');
const categories         = ref([]);
const allDocs            = ref([]);
const chartRawDocs       = ref([]);
const notifSeen = ref(localStorage.getItem('notifSeen') === 'true');
const chartMounted = ref(false);
const lastNotifCount = ref(parseInt(localStorage.getItem('notifCount') || '0'));
const notifications = ref([]);

// --- FILTER BULAN ---
const selectedMonth = ref(new Date().getMonth() + 1);  // 1-12
const selectedYear = ref(new Date().getFullYear());

const monthOptions = computed(() => {
  const months = [
    { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
    { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
  ];
  return months;
});

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
});

const selectedMonthLabel = computed(() => {
  const m = monthOptions.value.find(m => m.value === selectedMonth.value);
  return m ? m.label : '';
});


// --- STATE BARU UNTUK MANAGE GUIDE ---
const showGuideEditor = ref(false);
const selectedGuideSection = ref('dashboard');

const guideContent = ref({
  dashboard: "Penjelasan mengenai tampilan utama dan statistik dokumen Anda secara real-time.",
  upload: "Langkah-langkah menambahkan dokumen baru ke dalam sistem dengan drag and drop.",
  approver: "Khusus untuk level Approver untuk melakukan validasi dokumen.",
  settings: "Manajemen profil dan keamanan akun Anda menggunakan enkripsi."
});

// --- CHART DATA (APEXCHARTS) ---
const chartSeries = ref([
  { name: 'Per Bulan', data: [] },
  { name: 'Per Tahun', data: [] }
]);

const chartCategories = ref([]);
const chartViewMode = ref('monthly'); 

const chartOptions = computed(() => ({
  chart: { 
    type: 'area',
    toolbar: { show: false }, 
    zoom: { enabled: false },  
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3, colors: ['#3b82f6'] },
  fill: { 
    type: 'gradient', 
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [20, 100] } 
  },
  xaxis: { 
    categories: chartCategories.value, 
    axisBorder: { show: false },
    labels: { style: { colors: '#1e293b', fontWeight: 400, fontSize: '11px' } }
  },
  yaxis: { 
    show: true,
    labels: { style: { colors: '#1e293b', fontWeight: 400, fontSize: '11px' } } 
  },
  grid: { 
    borderColor: '#e2e8f0',
    strokeDashArray: 3,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } }
  },
  colors: ['#3b82f6'],
  legend: { show: false },
  tooltip: { 
    theme: 'light', 
    x: { show: true },
    y: {
      title: {
        formatter: function () {
          return "Dokumen Upload:";
        }
      }
    }
  }
}));

const renderChartFromDocs = (nonDraft) => {
  const targetYear = selectedYear.value;
  const targetMonth = selectedMonth.value - 1; // 0-based

  if (chartViewMode.value === 'monthly') {
    // 12 bulan terakhir sampai bulan yang dipilih
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyCounts = Array(12).fill(0);
    const labels = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(targetYear, targetMonth - i, 1);
      labels.push(`${monthNames[d.getMonth()]} ${d.getFullYear()}`);
    }

    nonDraft.forEach(doc => {
      const d = new Date(doc.createdAt);
      for (let i = 0; i < 12; i++) {
        const target = new Date(targetYear, targetMonth - (11 - i), 1);
        if (d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth()) {
          monthlyCounts[i]++;
          break;
        }
      }
    });

    chartCategories.value = labels;
    chartSeries.value = [{ name: 'Dokumen Per Bulan', data: monthlyCounts }];

  } else {
    // 5 tahun terakhir sampai tahun yang dipilih
    const currentYear = targetYear;
    const years = [currentYear-4, currentYear-3, currentYear-2, currentYear-1, currentYear];
    const yearlyCounts = Array(5).fill(0);

    nonDraft.forEach(doc => {
      const y = new Date(doc.createdAt).getFullYear();
      const idx = years.indexOf(y);
      if (idx !== -1) yearlyCounts[idx]++;
    });

    chartCategories.value = years.map(String);
    chartSeries.value = [{ name: 'Dokumen Per Tahun', data: yearlyCounts }];
  }
};

const loadChartData = async (forceRefresh = false) => {
  try {
    const targetYear = selectedYear.value;
    const targetMonth = selectedMonth.value;
    let startDate = '';
    let endDate = '';

    if (chartViewMode.value === 'yearly') {
      startDate = `${targetYear - 4}-01-01`;
      endDate = `${targetYear}-12-31`;
    } else {
      // 12 bulan terakhir sampai bulan & tahun yang dipilih
      const startD = new Date(targetYear, targetMonth - 12, 1);
      const startYear = startD.getFullYear();
      const startMonthStr = String(startD.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(targetYear, targetMonth, 0).getDate();
      const endMonthStr = String(targetMonth).padStart(2, '0');

      startDate = `${startYear}-${startMonthStr}-01`;
      endDate = `${targetYear}-${endMonthStr}-${String(lastDay).padStart(2, '0')}`;
    }

    const response = await permohonanService.getPermohonan({
      limit: 500,
      startDate,
      endDate,
      view: 'compact',
    });
    const docs = response.data || [];
    const nonDraft = docs.filter(d => d.status !== 'DRAFT');
    chartRawDocs.value = nonDraft;
    renderChartFromDocs(nonDraft);
  } catch (err) {
    console.error('❌ Load chart data error:', err);
  }
};

watch(chartViewMode, () => {
  loadChartData(false);
});

watch([selectedMonth, selectedYear], () => {
  chartRawDocs.value = [];
  loadAdminStats();
  loadChartData(true);
});

// --- TABLE DATA ---
const recentDocs = ref([]);

// --- STATS DATA (Persis Seperti users.vue) ---
const stats = ref([
  { 
    label: 'Total Dokumen', value: 0, displayValue: 0, unit: '',
    icon: 'description',
    iconBg: 'bg-blue-600',
  },
  { 
    label: 'Total Approval', value: 0, displayValue: 0, unit: '',
    icon: 'check_circle',
    iconBg: 'bg-emerald-500',
  },
  { 
    label: 'Approval Today', value: 0, displayValue: 0, unit: '',
    icon: 'today',
    iconBg: 'bg-rose-500',
  },
  { 
    label: 'Total User', value: 0, displayValue: 0, unit: '',
    icon: 'people',
    iconBg: 'bg-indigo-500',
  }
]);

// --- ADMIN TOOLS DATA ---
const adminTools = ref([
  { title: 'User Management', desc: 'Manage user accounts and access control.', icon: 'manage_accounts', color: 'bg-indigo-600', path: '/admin/users' },
  { title: 'Approval Management', desc: 'Reassign, add, remove, or bypass approvals.', icon: 'assignment_turned_in', color: 'bg-blue-600', path: '/admin/approvals' },
  { title: 'Platform Analytics', desc: 'Monitor Web and Mobile.', icon: 'insights', color: 'bg-blue-600', path: '/admin/analytics' },
  { title: 'Notification & Audit Logs', desc: 'Monitor delivery rates, failed attachments, and broadcast messages.', icon: 'mark_email_read', color: 'bg-blue-600', path: '/admin/logs' },
]);

const animateStats = () => {
  stats.value.forEach(stat => {
    let start = 0;
    const end = stat.value;
    const increment = end / 60;
    const updateCount = () => {
      start += increment;
      if (start < end) {
        stat.displayValue = Math.floor(start);
        requestAnimationFrame(updateCount);
      } else { stat.displayValue = end; }
    };
    updateCount();
  });
};

// ============================================
// ✅ LOAD NOTIFICATIONS (dokumen pending approval)
// ============================================
const loadNotifications = async (isUserTriggered = false) => {
  try {
    notifLoading.value = true;

    const response = await permohonanService.getPermohonan({
      limit: 30,
      status: 'SUBMITTED,IN_REVIEW',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      view: 'compact'
    });

    const allDocs = response.data || [];
    // Langsung assign tanpa filter frontend karena sudah difilter backend
    const filtered = allDocs;

    // ← Bandingkan dengan lastNotifCount dari localStorage, bukan array kosong
    if (!isUserTriggered && filtered.length > lastNotifCount.value) {
      notifSeen.value = false;
      localStorage.setItem('notifSeen', 'false');
    }

    // ← Update count di localStorage setiap load
    lastNotifCount.value = filtered.length;
    localStorage.setItem('notifCount', filtered.length.toString());

    notifications.value = filtered;

  } catch (err) {
    console.error('❌ Load notifications error:', err);
    notifications.value = [];
  } finally {
    notifLoading.value = false;
  }
};


const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    notifSeen.value = true;
    localStorage.setItem('notifSeen', 'true');
    lastNotifCount.value = notifications.value.length;
    localStorage.setItem('notifCount', notifications.value.length.toString());
    loadNotifications(true);
  }
};

const goToDocument = (id) => {
  showNotifications.value = false;
  router.push(`/arsip`);
};

// ============================================
// ✅ LOAD ONLINE USERS (active users dari API)
// ============================================

// ============================================
// ✅ LOAD CATEGORIES untuk filter department
// ============================================
const loadCategories = async () => {
  try {
    const response = await permohonanService.getCategories();
    categories.value = response.data || [];
  } catch (err) {
    console.error('❌ Load categories error:', err);
  }
};

// ============================================
// ✅ COMPUTED — Filter tabel by department + period
// ============================================
const filteredDocs = computed(() => {
  let result = [...allDocs.value];

  if (selectedDepartment.value !== 'All Departments') {
    result = result.filter(doc =>
      doc.category?.toLowerCase() === selectedDepartment.value?.toLowerCase()
    );
  }

  const now = new Date();
  if (selectedPeriod.value === 'Today') {
    result = result.filter(doc => {
      const d = new Date(doc.createdAt);
      return d.toDateString() === now.toDateString();
    });
  } else if (selectedPeriod.value === 'Last 7 Days') {
    const limit = new Date(now);
    limit.setDate(limit.getDate() - 7);
    result = result.filter(doc => new Date(doc.createdAt) >= limit);
  } else if (selectedPeriod.value === 'Last 30 Days') {
    const limit = new Date(now);
    limit.setDate(limit.getDate() - 30);
    result = result.filter(doc => new Date(doc.createdAt) >= limit);
  }
  return result.slice(0, 10);
});

const loadAdminStats = async () => {
  try {
    isSyncing.value = true;

    const targetYear = selectedYear.value;
    const targetMonth = selectedMonth.value;
    const monthStr = String(targetMonth).padStart(2, '0');
    const lastDay = new Date(targetYear, targetMonth, 0).getDate();
    const startDate = `${targetYear}-${monthStr}-01`;
    const endDate = `${targetYear}-${monthStr}-${String(lastDay).padStart(2, '0')}`;

    // ── Fetch statistik bulan yang dipilih & all-time secara paralel ──
    const [statsResponse, monthDocsResponse, monthApprovedResponse] = await Promise.all([
      permohonanService.getStatistics(),
      permohonanService.getPermohonan({
        startDate,
        endDate,
        limit: 1,
        view: 'minimal',
      }),
      permohonanService.getPermohonan({
        startDate,
        endDate,
        status: 'APPROVED',
        limit: 1,
        view: 'minimal',
      }),
    ]);

    const statData = statsResponse?.data || statsResponse || {};

    // 1. Total Dokumen bulan ini (fallback ke all-time jika data kosong)
    const monthTotalDocs = monthDocsResponse?.pagination?.total ?? (statData.totalDocs ?? Math.max(0, (statData.total || 0) - (statData.draft || 0)));

    // 2. Total Approval bulan ini
    const monthTotalApproval = monthApprovedResponse?.pagination?.total ?? (statData.approved || 0);

    // 3. Approval Today (status === 'APPROVED' dan disetujui hari ini)
    const approvalToday = statData.approvalToday || 0;

    // 4. Total User (semua user)
    const totalUsers = statData.totalUsers || 0;

    // ── Update stats ──
    stats.value[0].value = monthTotalDocs;
    stats.value[1].value = monthTotalApproval;
    stats.value[2].value = approvalToday;
    stats.value[3].value = totalUsers;

    // ── Animasi angka naik ──
    animateStats();

    console.log('✅ Admin stats loaded for period:', { startDate, endDate, monthTotalDocs, monthTotalApproval, approvalToday, totalUsers });

  } catch (error) {
    console.error('❌ Load admin stats error:', error);
  } finally {
    isSyncing.value = false;
  }
};

const handleRefresh = async () => {
  isSyncing.value = true;
  try {
    await Promise.all([
      loadAdminStats(),
      loadChartData(true),
      loadActivities(),
    ]);
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Data updated', showConfirmButton: false, timer: 2000 });
  } catch (e) {
    console.error('Refresh error:', e);
  } finally {
    isSyncing.value = false;
  }
};

const handleNav = (card) => {
  if (card.path === 'manage_guide') {
    showGuideEditor.value = true;
  } else if (card.path === '#') {
    Swal.fire({ title: 'Backup?', text: 'Start manual backup?', icon: 'question', showCancelButton: true }).then(res => {
      if (res.isConfirmed) Swal.fire('Success', 'Backup complete', 'success');
    });
  } else {
    router.push(card.path);
  }
};

const saveGuide = () => {
  isSyncing.value = true;
  showGuideEditor.value = false;
  
  setTimeout(() => {
    isSyncing.value = false;
    Swal.fire({
      icon: 'success',
      title: 'Guide Updated!',
      text: `Konten panduan ${selectedGuideSection.value} berhasil diperbarui.`,
      confirmButtonColor: '#2563eb'
    });
  }, 1000);
};

const exportData = () => {
  const docs = chartRawDocs.value || [];
  const today = new Date();
  let filtered = [];
  let filename = "";

  if (chartViewMode.value === "monthly") {
    const currentMonth = selectedMonth.value - 1;
    const currentYear = selectedYear.value;
    filtered = docs.filter((doc) => {
      const docDate = new Date(doc.createdAt);
      return docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear;
    });
    filename = `laporan-dokumen-bulanan-${currentYear}-${String(currentMonth + 1).padStart(2, '0')}.csv`;
  } else if (chartViewMode.value === "yearly") {
    const currentYear = selectedYear.value;
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
    const periodText = chartViewMode.value === "monthly" ? "bulan ini" : "tahun ini";
    Swal.fire({
      icon: "warning",
      title: "Data Kosong",
      text: `Tidak ada data dokumen untuk periode ${periodText}.`,
      confirmButtonColor: "#2563eb"
    });
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
    const category = doc.categoryInfo?.name || doc.categoryName || "-";
    const creator = doc.creatorInfo?.fullName || doc.creatorInfo?.name || doc.creatorName || "-";
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

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Laporan berhasil diunduh",
    showConfirmButton: false,
    timer: 2500
  });

  console.log(`✅ Laporan diunduh (${chartViewMode.value}):`, filtered.length, "dokumen");
};

const activities = ref([]);
const showAllActivities = ref(false);
const activitiesLoading = ref(false);
const selectedActivityId = ref(null);

// --- STATE FILTER AKTIVITAS SISTEM ---
const filterDate = ref('');
const filterStartTime = ref('');
const filterEndTime = ref('');
const filterAction = ref('');

const resetFilters = () => {
  filterDate.value = '';
  filterStartTime.value = '';
  filterEndTime.value = '';
  filterAction.value = '';
  loadActivities(true);
};

const toggleActivityDetail = (id) => {
  selectedActivityId.value = selectedActivityId.value === id ? null : id;
};

const getActionColor = (action = '') => {
  const colorMap = {
    'CREATE':          'bg-blue-500',
    'SUBMIT':          'bg-amber-500',
    'APPROVE':         'bg-emerald-500',
    'REJECT':          'bg-rose-500',
    'REVISION':        'bg-orange-500',
    'UPDATE':          'bg-indigo-500',
    'DELETE':          'bg-red-500',
    'DOWNLOAD':        'bg-teal-500',
    'LOGIN':           'bg-green-500',
    'LOGOUT':          'bg-slate-400',
    'REGISTER':        'bg-indigo-500',
    'UPDATE_PROFILE':  'bg-blue-400',
    'CHANGE_PASSWORD': 'bg-purple-500',
    'DEACTIVATE':      'bg-red-400',
    'ACTIVATE':        'bg-green-400',
  };
  const key = Object.keys(colorMap).find(k => action.toUpperCase().includes(k));
  return colorMap[key] || 'bg-slate-300';
};


const visibleActivities = computed(() =>
  showAllActivities.value ? activities.value : activities.value.slice(0, 5)
);

// ============================================
// ✅ MAPPER — Data langsung dari field API
// ============================================
const mapAuditToActivity = (log) => {
  const userName =
    log.user?.fullName ||
    log.user?.username ||
    log.actor ||
    'Sistem';

  const actionLabel = log.action || 'melakukan aktivitas';

  // Bangun detail baris sesuai data yang ada di log
  const detailRows = [];

  // Data user
  if (log.user?.id)       detailRows.push({ label: 'User ID',   value: log.user.id });
  if (log.user?.email)    detailRows.push({ label: 'Email',     value: log.user.email });
  if (log.user?.username) detailRows.push({ label: 'Username',  value: log.user.username });
  if (log.user?.roles?.length) detailRows.push({ label: 'Roles', value: log.user.roles.join(', ') });

  // Data IBS / details
  if (log.details?.clientName)              detailRows.push({ label: 'Client Name',      value: log.details.clientName });
  if (log.details?.clientId)               detailRows.push({ label: 'Client ID',        value: log.details.clientId });
  if (log.details?.creator?.fullName)       detailRows.push({ label: 'Creator Name',     value: log.details.creator.fullName });
  if (log.details?.creator?.email)          detailRows.push({ label: 'Creator Email',    value: log.details.creator.email });
  if (log.details?.refTransactionNumber?.transactionId)   detailRows.push({ label: 'Transaction ID',   value: log.details.refTransactionNumber.transactionId });
  if (log.details?.refTransactionNumber?.transactionType) detailRows.push({ label: 'Transaction Type', value: log.details.refTransactionNumber.transactionType });

  // Action & Actor selalu tampil
  if (log.action) detailRows.push({ label: 'Action', value: log.action });
  if (log.actor)  detailRows.push({ label: 'Actor',  value: log.actor });

  return {
    id:         log.id || Math.random(),
    user:       userName,
    action:     actionLabel,
    time:       formatTimeAgo(log.createdAt || log.timestamp),
    color:      getActionColor(log.action || ''),
    status:     log.status || 'SUCCESS',
    rawDate:    new Date(log.createdAt || log.timestamp || Date.now()),
    detailRows,
  };
};

// ============================================
// ✅ LOAD ACTIVITIES dari endpoint audit/logs
// ============================================
const loadActivities = async (showSkeleton = true) => {
  try {
    // Hanya tampilkan skeleton loading pada inisialisasi awal atau saat data kosong.
    // Hal ini untuk menghindari efek kedipan/layout shift yang mengganggu saat auto-refresh berkala.
    if (showSkeleton && activities.value.length === 0) {
      activitiesLoading.value = true;
    }

    const params = {
      limit: 100 // Ambil log yang cukup banyak agar filter lokal/backend optimal
    };

    if (filterAction.value) {
      params.action = filterAction.value;
    }

    let targetDate = filterDate.value;
    // Jika tanggal belum dipilih tapi waktu mulai/selesai diisi, default ke hari ini
    if (!targetDate && (filterStartTime.value || filterEndTime.value)) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      targetDate = `${yyyy}-${mm}-${dd}`;
    }

    if (targetDate) {
      let startStr = `${targetDate}T00:00:00`;
      let endStr = `${targetDate}T23:59:59`;

      if (filterStartTime.value) {
        startStr = `${targetDate}T${filterStartTime.value}:00`;
      }
      if (filterEndTime.value) {
        endStr = `${targetDate}T${filterEndTime.value}:59`;
      }

      // Konversi ke format ISO String agar dapat diparsing dengan benar oleh backend
      params.startDate = new Date(startStr).toISOString();
      params.endDate = new Date(endStr).toISOString();
    }

    const response = await api.get('/audit/logs', { params });
    const result = response.data;
    const logs = Array.isArray(result) ? result : (result.data || result.logs || []);

    // Filter action internal yang tidak perlu ditampilkan
    const filtered = logs.filter(log => {
      const action = (log.action || '').toUpperCase();
      return !['AUDIT_LOG_VIEW', 'PROFILE_VIEW'].includes(action);
    });

    activities.value = filtered
      .map(mapAuditToActivity)
      .sort((a, b) => b.rawDate - a.rawDate);

  } catch (err) {
    console.error('❌ Load audit logs error:', err);
    activities.value = [];
  } finally {
    activitiesLoading.value = false;
  }
};

// Helper format waktu relatif
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '-';
  const now  = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60)   return `${diff} detik lalu`;
  if (diff < 3600) return `${Math.floor(diff/60)} menit lalu`;
  if (diff < 86400)return `${Math.floor(diff/3600)} jam lalu`;
  return `${Math.floor(diff/86400)} hari lalu`;
};

let notifInterval = null; 
  onMounted(async () => {
    await nextTick();
    chartMounted.value = true;

    animateStats();
    loadAdminStats();
    loadNotifications();  
    loadCategories();     
    loadChartData();    
    loadActivities();  

    notifInterval = setInterval(() => {
      loadNotifications(false);
      loadActivities(false); 
    }, 30000);
  });                       

  onUnmounted(() => {       
    if (notifInterval) {
      clearInterval(notifInterval);
      notifInterval = null;
    }
  });

</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Fade-slide for dropdowns */
.fade-slide-enter-active { transition: all 0.18s ease-out; }
.fade-slide-leave-active { transition: all 0.12s ease-in; }
.fade-slide-enter-from   { opacity: 0; transform: translateY(-6px); }
.fade-slide-leave-to     { opacity: 0; transform: translateY(-6px); }

/* Fade-down for notification dropdown */
.fade-down-enter-active { transition: all 0.2s ease-out; }
.fade-down-leave-active { transition: all 0.15s ease-in; }
.fade-down-enter-from   { opacity: 0; transform: translateY(-8px); }
.fade-down-leave-to     { opacity: 0; transform: translateY(-8px); }

/* Activities scrollbar */
.activities-scroll::-webkit-scrollbar { width: 4px; }
.activities-scroll::-webkit-scrollbar-track { background: transparent; }
.activities-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
.activities-scroll:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
</style>