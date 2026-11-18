<script setup>
import SidebarWrapper from "@/components/SidebarWrapper.vue";
import ImpersonateBanner from "@/components/ImpersonateBanner.vue";
import { useImpersonateStore } from "@/stores/impersonateStore";
import { computed, onMounted } from "vue";

const isDev = computed(() => import.meta.env.VITE_APP_ENV === 'development');
const impersonateStore = useImpersonateStore();

onMounted(async () => {
  // Periksa status impersonate aktif jika user sedang login
  if (localStorage.getItem('user')) {
    await impersonateStore.checkStatus();
  }
});
</script>

<template>
  <!-- Ribbon Development -->
  <div v-if="isDev" class="dev-ribbon">
    <span>DEV MODE</span>
  </div>

  <div class="flex flex-col h-screen overflow-hidden">
    <!-- Banner Impersonate Sticky di paling atas saat sesi aktif -->
    <ImpersonateBanner />

    <!-- Halaman fullpage (Login dll) — tanpa sidebar & header -->
    <div v-if="$route.meta.fullpage" class="flex-1 overflow-auto">
      <router-view />
    </div>

    <!-- Halaman normal — SidebarWrapper sudah include Header di dalamnya -->
    <SidebarWrapper v-else class="flex-1 overflow-hidden">
      <router-view />
    </SidebarWrapper>
  </div>
</template>

<style>
.dev-ribbon {
  position: fixed;
  top: 0;
  right: 0;
  width: 75px;
  height: 75px;
  overflow: hidden;
  z-index: 9999;
  pointer-events: none;
}

.dev-ribbon span {
  position: absolute;
  display: block;
  width: 110px;
  padding: 4px 0;
  background-color: #ef4444;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  color: #fff;
  font: 800 8px/1 'Poppins', sans-serif;
  text-transform: uppercase;
  text-align: center;
  right: -30px;
  top: 15px;
  transform: rotate(45deg);
  letter-spacing: 0.5px;
}

@media (max-width: 767px) {
  .dev-ribbon {
    right: auto;
    left: 0;
  }
  .dev-ribbon span {
    right: auto;
    left: -30px;
    transform: rotate(-45deg);
  }
}
</style>
