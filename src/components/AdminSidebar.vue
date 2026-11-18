<template>
  <div class="sidebar-container w-64 bg-[#09090b] text-zinc-400 min-h-screen flex flex-col border-r border-zinc-800/60 relative">

    <!-- Logo + Close button row -->
    <div class="px-4 pt-5 pb-5 mb-2">
      <div class="flex items-center gap-3 px-2">
        <!-- Logo with glow -->
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
        <!-- Brand text -->
        <div class="flex flex-col flex-1 min-w-0">
          <h1 class="text-white font-semibold tracking-tight text-[15px] leading-none">Authorix</h1>
          <span class="text-[9px] font-medium text-blue-400/70 tracking-[0.25em] uppercase mt-0.5">Admin</span>
        </div>
        <!-- Close button — mobile only -->
        <button
          @click="$emit('close')"
          class="md:hidden flex-shrink-0 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800/60"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Glow divider -->
      <div class="mt-4 mx-2 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3 space-y-6">
      <div v-for="group in menuGroups" :key="group.title">
        <p class="text-[10px] font-medium text-zinc-600 uppercase tracking-[0.2em] mb-2 px-3">
          {{ group.title }}
        </p>
        <div class="space-y-0.5">
          <button
            v-for="item in group.items"
            :key="item.path"
            @click="goTo(item.path)"
            :class="[
              'group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 outline-none',
              isActive(item.path)
                ? 'bg-zinc-800 text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.4)] border border-zinc-700/60'
                : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
            ]"
          >
            <!-- Active bar left -->
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
              class="text-[13px] transition-all duration-200 truncate"
              :class="isActive(item.path) ? 'font-medium text-white' : 'font-normal text-zinc-400 group-hover:text-zinc-200'"
            >
              {{ $t(item.key) !== item.key ? $t(item.key) : item.label }}
            </span>

            <!-- Active dot right -->
            <div
              v-if="isActive(item.path)"
              class="ml-auto h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0 shadow-[0_0_8px_#3b82f6]"
            ></div>
          </button>
        </div>
      </div>
    </nav>

    <!-- Admin Card Bottom -->
    <div class="px-3 pt-3 pb-5">
      <div class="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-3"></div>
      <div class="bg-zinc-900/80 border border-zinc-800/60 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-sm">
        <!-- Avatar -->
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-lg shadow-blue-900/30">
          {{ adminInitial }}
        </div>
        <!-- Info -->
        <div class="flex flex-col min-w-0 flex-1">
          <span class="text-[12px] font-medium text-zinc-100 truncate leading-tight">{{ adminName }}</span>
        </div>
        <!-- Online dot -->
        <div class="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 shadow-[0_0_6px_#10b981] animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import AuthorixLogo from "@/assets/authorix-logo.png";

defineEmits(['close']);

const router = useRouter();
const route  = useRoute();

const userData    = JSON.parse(localStorage.getItem('user') || '{}');
const adminName   = computed(() =>
  userData.full_name || userData.fullName || userData.name || userData.username || "Admin"
);
const adminInitial = computed(() => adminName.value.charAt(0).toUpperCase());

const menuGroups = [
  {
    items: [
      { label: "Dashboard",  path: "/admin/dashboard", icon: "home",                  key: "sidebar.dashboard" },
      { label: "Users",      path: "/admin/users",     icon: "manage_accounts",        key: "sidebar.users" },
      { label: "Approvals",  path: "/admin/approvals", icon: "assignment_turned_in",  key: "sidebar.approvals" },
      { label: "Analytics",  path: "/admin/analytics", icon: "insights",              key: "sidebar.analytics" },
      { label: "Logs",       path: "/admin/logs",      icon: "mark_email_read",        key: "sidebar.logs" },
      { label: "Security",   path: "/admin/security",  icon: "security",               key: "sidebar.security" },
    ]
  }
];

const goTo     = (path) => router.push(path);
const isActive = (path) => route.path.startsWith(path);
</script>

<style scoped>
nav::-webkit-scrollbar { width: 0px; }
</style>