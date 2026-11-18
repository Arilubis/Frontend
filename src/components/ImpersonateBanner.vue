<template>
  <transition name="banner-slide">
    <div
      v-if="impersonateStore.isImpersonating"
      class="w-full z-[999] shadow-md flex-shrink-0 transition-all duration-300 font-[Poppins,sans-serif]"
      :class="bannerBgClass"
    >
      <div class="max-w-[1440px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white">
        
        <!-- Sisi Kiri: Mode Badge & Target User Info -->
        <div class="flex items-center gap-2.5 min-w-0">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="isFullAccess ? 'bg-white/15 border border-white/20' : 'bg-white/10 border border-white/15'"
          >
            <span class="material-icons text-lg" :class="isFullAccess ? 'text-white' : 'text-sky-200'">{{ modeIcon }}</span>
          </div>

          <div class="flex flex-wrap items-center gap-2 min-w-0">
            <!-- Mode Badge -->
            <span
              class="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border flex-shrink-0 shadow-sm"
              :class="modeBadgeClass"
            >
              {{ modeBadgeText }}
            </span>

            <!-- Pesan Utama -->
            <p class="text-xs font-normal truncate text-white">
              Anda sedang {{ isFullAccess ? 'bertindak' : 'melihat sistem' }} sebagai
              <strong class="font-semibold underline decoration-white/50 text-white">
                {{ targetDisplayName }}
              </strong>
              <span class="opacity-85 text-[11px] ml-1 text-blue-100">({{ targetRoleLabel }})</span>
            </p>

            <!-- Keterangan Keamanan / Mode -->
            <span
              class="hidden xl:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border flex-shrink-0"
              :class="isFullAccess ? 'bg-blue-950/40 text-blue-100 border-blue-400/30' : 'bg-slate-950/40 text-sky-100 border-sky-400/30'"
            >
              <span class="material-icons text-[12px]">{{ securityIcon }}</span>
              <span>{{ securityNote }}</span>
            </span>
          </div>
        </div>

        <!-- Sisi Kanan: Live Countdown Timer & Tombol Stop -->
        <div class="flex items-center gap-2.5 flex-shrink-0 ml-auto">
          <!-- Countdown Timer -->
          <div
            class="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium tracking-wider shadow-inner"
            :class="isFullAccess ? 'bg-blue-950/40 border-blue-300/30 text-white' : 'bg-slate-950/40 border-sky-300/30 text-sky-100'"
            title="Sisa waktu sesi impersonate aktif"
          >
            <span class="w-2 h-2 rounded-full animate-ping" :class="isFullAccess ? 'bg-blue-200' : 'bg-sky-200'"></span>
            <span class="material-icons text-[14px] opacity-80">timer</span>
            <span>{{ impersonateStore.formattedRemainingTime }}</span>
          </div>

          <!-- Tombol Hentikan Impersonate -->
          <button
            @click="handleStopImpersonate"
            :disabled="impersonateStore.isEnding"
            class="flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 active:scale-95 font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
            title="Akhiri sesi impersonate dan kembali ke Administrator"
          >
            <div
              v-if="impersonateStore.isEnding"
              class="w-3.5 h-3.5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"
            ></div>
            <span v-else class="material-icons text-sm text-blue-700">exit_to_app</span>
            <span>Keluar dari Mode Ini</span>
          </button>
        </div>

      </div>
    </div>
  </transition>

  <!-- Modal Konfirmasi Hentikan Impersonate (Native Authorix Style) -->
  <teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showConfirmModal"
        @click.self="showConfirmModal = false"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-[Poppins,sans-serif]"
      >
        <transition
          enter-active-class="transition duration-200 ease-out transform"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in transform"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="showConfirmModal"
            class="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] overflow-hidden border border-slate-100"
          >
            <!-- Icon + Title -->
            <div class="flex flex-col items-center px-8 pt-8 pb-4 text-center">
              <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 shadow-sm">
                <span class="material-icons text-blue-600 text-3xl">logout</span>
              </div>
              <h3 class="text-[20px] font-semibold text-slate-900 mb-1">
                Hentikan Impersonate?
              </h3>
              <p class="text-[13px] text-slate-500 leading-relaxed px-4">
                Anda akan keluar dari akun <strong class="text-slate-800 font-semibold">{{ targetDisplayName }}</strong> dan kembali sebagai <strong class="text-slate-800 font-semibold">Administrator</strong>.
              </p>
            </div>

            <!-- Info Card -->
            <div class="mx-6 mb-5 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-600 text-[18px]">verified_user</span>
              </div>
              <p class="text-[12px] text-slate-600 leading-snug">
                Sesi impersonate Anda akan diakhiri dan dicatat ke dalam audit log keamanan.
              </p>
            </div>

            <!-- Footer Buttons -->
            <div class="h-px bg-slate-100"></div>
            <div class="flex gap-3 px-6 py-4 bg-slate-50/50">
              <button
                type="button"
                @click="showConfirmModal = false"
                :disabled="impersonateStore.isEnding"
                class="flex-1 py-3 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                @click="confirmStop"
                :disabled="impersonateStore.isEnding"
                class="flex-[1.4] py-3 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/25 disabled:opacity-60 cursor-pointer"
              >
                <div
                  v-if="impersonateStore.isEnding"
                  class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
                <span v-else class="material-icons text-sm">exit_to_app</span>
                <span>{{ impersonateStore.isEnding ? 'Mengakhiri...' : 'Ya, Keluar' }}</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useImpersonateStore } from '@/stores/impersonateStore';

const impersonateStore = useImpersonateStore();
const showConfirmModal = ref(false);

const isFullAccess = computed(() => impersonateStore.mode === 'FULL_ACCESS');

const bannerBgClass = computed(() => {
  return isFullAccess.value
    ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 border-b border-blue-800'
    : 'bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 border-b border-slate-700';
});

const modeIcon = computed(() => {
  return isFullAccess.value ? 'supervised_user_circle' : 'visibility';
});

const modeBadgeText = computed(() => {
  return isFullAccess.value ? 'Akses Penuh' : 'Baca Saja';
});

const modeBadgeClass = computed(() => {
  return isFullAccess.value
    ? 'bg-blue-950/60 text-blue-100 border-blue-400/40'
    : 'bg-sky-950/60 text-sky-200 border-sky-400/30';
});

const securityIcon = computed(() => {
  return isFullAccess.value ? 'verified_user' : 'lock';
});

const securityNote = computed(() => {
  return isFullAccess.value
    ? 'Aksi tercatat di audit trail admin'
    : 'Semua perubahan data diblokir';
});

const targetDisplayName = computed(() => {
  const user = impersonateStore.targetUser;
  return user?.fullName || user?.name || user?.username || 'User';
});

const targetRoleLabel = computed(() => {
  const user = impersonateStore.targetUser;
  if (!user) return 'User';
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles.join(', ');
  }
  return user.role || 'USER';
});

const handleStopImpersonate = () => {
  showConfirmModal.value = true;
};

const confirmStop = async () => {
  try {
    await impersonateStore.stop({ redirect: true });
    showConfirmModal.value = false;
  } catch (err) {
    console.error('Gagal mengakhiri impersonate:', err);
  }
};
</script>

<style scoped>
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.banner-slide-enter-from,
.banner-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.banner-slide-enter-to,
.banner-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>

