<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminSidebar from "./AdminSidebar.vue";
import UserSidebar from "./UserSidebar.vue";
import HeaderBar from "./HeaderBar.vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isAdmin = computed(() => {
  return authStore.role === "ADMIN";
});

// Reactive state untuk mobile detection & sidebar
const isMobileView = ref(window.innerWidth < 768);
const sidebarOpen = ref(window.innerWidth >= 768);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

// Tutup/buka sidebar otomatis reaktif jika resize
const handleResize = () => {
  isMobileView.value = window.innerWidth < 768;
  if (window.innerWidth >= 768) {
    sidebarOpen.value = true;
  } else {
    sidebarOpen.value = false;
  }
};

const goTo = (path) => router.push(path);
const isActive = (path) => route.path.startsWith(path);

// Menu list untuk bottom navbar reaktif di mobile
const mobileMenus = computed(() => {
  if (isAdmin.value) {
    return [
      { label: "Dashboard", path: "/admin/dashboard", icon: "home",                  key: "sidebar.dashboard" },
      { label: "Users",     path: "/admin/users",     icon: "manage_accounts",        key: "sidebar.users" },
      { label: "Approvals", path: "/admin/approvals", icon: "assignment_turned_in",  key: "sidebar.approvals" },
      { label: "Analytics", path: "/admin/analytics", icon: "insights",              key: "sidebar.analytics" },
      { label: "Settings",  path: "/pengaturan",      icon: "settings",              key: "sidebar.settings" },
    ];
  } else {
    const userRole = (authStore.role || "USER").toUpperCase();
    return [
      { label: "Dashboard", path: "/dashboard",     icon: "home",          roles: ["USER", "APPROVER", "REVIEWER", "ADMIN"], key: "sidebar.dashboard" },
      { label: "Requests",  path: "/view-document",  icon: "description",   roles: ["USER", "APPROVER", "REVIEWER", "ADMIN"], key: "sidebar.requests" },
      { label: "Approvals", path: "/v2-approver",    icon: "difference",    roles: ["USER", "APPROVER", "REVIEWER", "ADMIN"], key: "sidebar.approvals" },
      { label: "Drafts",    path: "/drafts",         icon: "edit_document", roles: ["USER"], key: "sidebar.drafts" },
      { label: "Settings",  path: "/pengaturan",     icon: "settings",      roles: ["USER", "APPROVER", "REVIEWER", "ADMIN"], key: "sidebar.settings" },
    ].filter(menu => menu.roles.includes(userRole));
  }
});

onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<template>
  <div class="flex h-full overflow-hidden relative">

    <!-- ─── BACKDROP (mobile only) ─────────────────────────── -->
    <transition name="fade-backdrop">
      <div
        v-if="sidebarOpen && isMobileView"
        @click="closeSidebar"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
      />
    </transition>

    <!-- ─── SIDEBAR ─────────────────────────────────────────── -->
    <!-- Desktop: static flex column (tidak overlay)            -->
    <!-- Mobile: fixed overlay dari kiri, z-40                  -->
    <transition name="sidebar-slide">
      <div
        v-if="sidebarOpen"
        class="flex-shrink-0
               md:relative md:z-auto
               fixed inset-y-0 left-0 z-40"
      >
        <AdminSidebar v-if="isAdmin" @close="closeSidebar" />
        <UserSidebar v-else @close="closeSidebar" />
      </div>
    </transition>

    <!-- ─── KONTEN KANAN: Header + halaman ───────────────────── -->
    <div class="flex flex-col flex-1 overflow-hidden transition-all duration-300 min-w-0">
      <HeaderBar
        :isSidebarOpen="sidebarOpen"
        @toggleSidebar="toggleSidebar"
      />
      <main id="main-scroll-container" class="flex-1 overflow-y-auto" :class="{ 'pb-16': isMobileView }">
        <slot />
      </main>
    </div>

    <!-- ─── BOTTOM NAVBAR (mobile only) ─────────────────────── -->
    <nav 
      v-if="isMobileView"
      class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#09090b] border-t border-zinc-800/80 text-zinc-400 z-40 flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md"
    >
      <button
        v-for="item in mobileMenus"
        :key="item.path"
        @click="goTo(item.path)"
        class="flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-200 cursor-pointer"
        :class="isActive(item.path) ? 'text-blue-400 font-medium' : 'text-zinc-500 hover:text-zinc-300'"
      >
        <span class="material-icons text-[20px] mb-0.5 select-none">
          {{ item.icon }}
        </span>
        <span class="text-[10px] tracking-wide truncate max-w-[70px] select-none">
          {{ $t(item.key) }}
        </span>
      </button>
    </nav>

  </div>
</template>

<style scoped>
/* Animasi slide sidebar */
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease;
}
.sidebar-slide-enter-from,
.sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.sidebar-slide-enter-to,
.sidebar-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Animasi backdrop */
.fade-backdrop-enter-active,
.fade-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.fade-backdrop-enter-from,
.fade-backdrop-leave-to {
  opacity: 0;
}
</style>