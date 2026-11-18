<template>
  <div class="sidebar-container w-64 bg-[#09090b] text-zinc-400 min-h-screen flex flex-col border-r border-zinc-800/60 relative">

    <!-- Logo Authorix + Tombol Close di baris yang sama -->
    <div class="px-4 pt-5 pb-5 mb-2">
      <div class="flex items-center gap-3 px-2">
        <!-- Logo container dengan glow effect -->
        <div class="relative flex-shrink-0">
          <div class="absolute inset-0 bg-blue-500/30 blur-lg rounded-xl"></div>
          <div class="relative h-10 w-10 rounded-xl flex items-center justify-center
                bg-gradient-to-br from-zinc-800 to-zinc-900
                ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/20 p-1.5">
            <img :src="AuthorixLogo"
                alt="Authorix"
                class="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(96,165,250,0.7)]" />
          </div>
        </div>
        <!-- Teks brand -->
        <div class="flex flex-col flex-1 min-w-0">
          <h1 class="text-white font-semibold tracking-tight text-[15px] leading-none">
            Authorix
          </h1>
          <span class="text-[9px] font-medium text-blue-400/70 tracking-[0.25em] uppercase mt-0.5">System</span>
        </div>
        <!-- Tombol Close — hanya di mobile, sejajar dengan logo -->
        <button
          @click="$emit('close')"
          class="md:hidden flex-shrink-0 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800/60"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Divider glow -->
      <div class="mt-4 mx-2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-0.5 overflow-y-auto px-3">
      <div v-for="item in filteredMenus" :key="item.path">
        <button
          @click="goTo(item.path)"
          :class="[
            'group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 outline-none',
            isActive(item.path)
              ? 'bg-zinc-800 text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.4)] border border-zinc-700/60'
              : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
          ]"
        >
          <!-- Active indicator bar kiri -->
          <div
            v-if="isActive(item.path)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"
          ></div>

          <span
            class="material-icons text-[20px] flex-shrink-0 transition-colors duration-200"
            :class="isActive(item.path) ? 'text-blue-400' : 'text-zinc-600 group-hover:text-zinc-300'"
          >
            {{ item.icon }}
          </span>

          <span
            class="text-[13px] font-normal transition-all duration-200 truncate"
            :class="isActive(item.path) ? 'font-medium text-white' : 'text-zinc-400 group-hover:text-zinc-200'"
          >
            {{ $t(item.key) }}
          </span>

          <!-- Dot aktif kanan -->
          <div
            v-if="isActive(item.path)"
            class="ml-auto h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0 shadow-[0_0_8px_#3b82f6]"
          ></div>
        </button>
      </div>
    </nav>

    <!-- User Card Bottom -->
    <div class="px-3 pt-3 pb-5">
      <div class="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-3"></div>
      <div class="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-sm">
        <!-- Avatar -->
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg shadow-blue-900/30">
          {{ userName.charAt(0).toUpperCase() }}
        </div>
        <!-- Info -->
        <div class="flex flex-col min-w-0 flex-1">
          <span class="text-[12px] font-medium text-zinc-100 truncate leading-tight">{{ userName }}</span>
          <span class="text-[10px] text-zinc-500 font-normal tracking-wide uppercase mt-0.5">{{ userRole }}</span>
        </div>
        <!-- Online dot -->
        <div class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 shadow-[0_0_6px_#10b981] animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const emit = defineEmits(['close']);
import { useRouter, useRoute } from "vue-router";
import AuthorixLogo from "@/assets/authorix-logo.png";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const userData = JSON.parse(localStorage.getItem('user') || '{}');
const roles = userData.roles || [];
const userRole = computed(() => {
  return (authStore.role || "USER").toUpperCase();
});

const userName = ref(
  userData.full_name ||
  userData.fullName ||
  userData.nama_lengkap ||
  userData.name ||
  userData.username ||
  "User"
);

const menus = [
  { label: "Dashboard",     path: "/dashboard",     icon: "home",          roles: ["USER", "APPROVER", "REVIEWER", "ADMIN"], key: "sidebar.dashboard" },
  { label: "Requests",      path: "/view-document",  icon: "description",   roles: ["USER", "APPROVER", "REVIEWER", "ADMIN"], key: "sidebar.requests" },
  { label: "Approvals",     path: "/v2-approver",    icon: "difference",    roles: ["USER", "APPROVER", "REVIEWER", "ADMIN"], key: "sidebar.approvals" },
  { label: "Drafts",        path: "/drafts",          icon: "edit_document", roles: ["USER"], key: "sidebar.drafts" },
  { label: "Settings",      path: "/pengaturan",     icon: "settings",      roles: ["USER", "APPROVER", "REVIEWER", "ADMIN"], key: "sidebar.settings" },
];

const filteredMenus = computed(() => {
  return menus.filter(menu => menu.roles.includes(userRole.value));
});

const goTo = (path) => router.push(path);
const isActive = (path) => route.path.startsWith(path);
</script>

<style scoped>
/* Sembunyikan scrollbar agar bersih */
nav::-webkit-scrollbar { width: 0px; }
</style>