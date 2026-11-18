<template>
  <div
    v-if="show"
    @click.self="handleClose"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md font-[Poppins,sans-serif]"
    style="background: rgba(15, 23, 42, 0.4);"
  >
    <div
      class="bg-white rounded-[32px] border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] w-full max-w-lg overflow-hidden flex flex-col"
    >
      <!-- Modal Header -->
      <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style="background: #3d4f63; box-shadow: 0 4px 14px rgba(61, 79, 99, 0.30);"
          >
            <span class="material-icons text-white text-2xl">switch_account</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold tracking-tight text-slate-900 leading-none">
              Impersonate User
            </h2>
            <p class="text-slate-400 text-[10px] font-normal uppercase tracking-wider mt-1.5 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: #3d4f63;"></span>
              Target: <strong class="text-slate-700">{{ user?.username || user?.email }}</strong>
            </p>
          </div>
        </div>

        <button
          @click="handleClose"
          class="w-8 h-8 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <span class="material-icons text-lg">close</span>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-8 space-y-6 overflow-y-auto max-h-[75vh] custom-scrollbar">
        
        <!-- Target User Card Summary -->
        <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-4">
          <div class="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-base flex-shrink-0">
            {{ userInitial }}
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-sm font-semibold text-slate-900 truncate">
              {{ user?.fullName || user?.name || user?.username }}
            </h4>
            <p class="text-[11px] text-slate-400 truncate">{{ user?.email }}</p>
          </div>
          <div class="flex-shrink-0">
            <span class="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase border border-slate-200 bg-white text-slate-700">
              {{ roleLabel }}
            </span>
          </div>
        </div>

        <!-- Mode Selection Header -->
        <div>
          <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Pilih Mode Akses
          </label>

          <div class="space-y-3">
            <!-- Mode 1: READ_ONLY -->
            <label
              class="relative flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer"
              :class="[
                selectedMode === 'READ_ONLY'
                  ? 'border-amber-500 bg-amber-50/30 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              ]"
            >
              <div class="pt-0.5">
                <input
                  type="radio"
                  name="impersonateMode"
                  value="READ_ONLY"
                  v-model="selectedMode"
                  class="w-4 h-4 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <div class="flex items-center gap-1.5">
                    <span class="material-icons text-amber-500 text-base">visibility</span>
                    <span class="text-xs font-semibold text-slate-900">Mode Baca Saja (READ_ONLY)</span>
                  </div>
                  <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Default • 1 Jam
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Hanya melihat dashboard & data user tanpa izin mutasi atau kirim approval. Sangat aman untuk troubleshooting visual.
                </p>
              </div>
            </label>

            <!-- Mode 2: FULL_ACCESS -->
            <label
              class="relative flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer"
              :class="[
                selectedMode === 'FULL_ACCESS'
                  ? 'border-rose-500 bg-rose-50/30 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200'
              ]"
            >
              <div class="pt-0.5">
                <input
                  type="radio"
                  name="impersonateMode"
                  value="FULL_ACCESS"
                  v-model="selectedMode"
                  class="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <div class="flex items-center gap-1.5">
                    <span class="material-icons text-rose-600 text-base">supervised_user_circle</span>
                    <span class="text-xs font-semibold text-slate-900">Mode Akses Penuh (FULL_ACCESS)</span>
                  </div>
                  <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    Sensitif • 15 Menit
                  </span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Dapat bertindak atas nama user (approval, submit dokumen, komentar). Setiap aksi dicatat dalam audit trail dengan identitas Admin.
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Password Admin Input (Hanya jika FULL_ACCESS dipilih) -->
        <transition name="fade-expand">
          <div v-if="selectedMode === 'FULL_ACCESS'" class="space-y-2 pt-2">
            <div class="flex items-center justify-between">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Password Administrator Anda <span class="text-rose-500">*</span>
              </label>
            </div>

            <div class="relative">
              <span class="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">lock</span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="adminPassword"
                placeholder="Masukkan password admin Anda..."
                class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                @keyup.enter="handleSubmit"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span class="material-icons text-base">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>

            <p class="text-[10px] text-slate-400">
              Konfirmasi password diperlukan untuk menjamin otorisasi akses penuh ke akun user.
            </p>
          </div>
        </transition>

        <!-- Security Disclaimer Note -->
        <div class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80 flex items-start gap-2.5 text-blue-900">
          <span class="material-icons text-blue-500 text-base mt-0.5">security</span>
          <p class="text-[11px] leading-relaxed text-blue-800">
            <strong>Proteksi Keamanan:</strong> Tindakan destruktif seperti mengubah password akun, menghapus user, dan pengaturan 2FA diblokir secara permanen di semua mode impersonate.
          </p>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-8 py-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 flex-shrink-0">
        <button
          type="button"
          @click="handleClose"
          :disabled="loading"
          class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="button"
          @click="handleSubmit"
          :disabled="loading"
          class="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] hover:bg-[#3a4556] text-white rounded-xl text-xs font-semibold shadow-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <div v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span v-else class="material-icons text-sm">login</span>
          <span>{{ loading ? 'Memulai...' : 'Mulai Impersonate' }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useImpersonateStore } from '@/stores/impersonateStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'success']);

const router = useRouter();
const impersonateStore = useImpersonateStore();

const selectedMode = ref('READ_ONLY');
const adminPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);

watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedMode.value = 'READ_ONLY';
    adminPassword.value = '';
    showPassword.value = false;
    loading.value = false;
  }
});

const userInitial = computed(() => {
  const name = props.user?.fullName || props.user?.name || props.user?.username || '?';
  return name.charAt(0).toUpperCase();
});

const roleLabel = computed(() => {
  if (!props.user) return 'USER';
  if (Array.isArray(props.user.roles) && props.user.roles.length > 0) {
    return props.user.roles.join(', ');
  }
  return props.user.role || 'USER';
});

const handleClose = () => {
  if (loading.value) return;
  emit('close');
};

const mapBackendError = (err) => {
  const errData = err.response?.data;
  const errors = errData?.errors;
  const code = Array.isArray(errors) && errors.length > 0 ? errors[0]?.code : null;

  switch (code) {
    case 'SELF_IMPERSONATE':
      return 'Anda tidak dapat mengimpersonate akun Anda sendiri.';
    case 'TARGET_IS_ADMIN':
      return 'Target user adalah ADMIN dan tidak dapat diimpersonate.';
    case 'PASSWORD_REQUIRED':
      return 'Password admin wajib diisi untuk mode Akses Penuh (FULL_ACCESS).';
    case 'INVALID_PASSWORD':
      return 'Password admin salah. Silakan periksa kembali password Anda.';
    case 'ACCOUNT_INACTIVE':
      return 'Akun target tidak aktif.';
    default:
      return errData?.message || err.message || 'Gagal memulai mode impersonate.';
  }
};

const handleSubmit = async () => {
  if (!props.user?.id) return;

  if (selectedMode.value === 'FULL_ACCESS' && !adminPassword.value.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Password Diperlukan',
      text: 'Password administrator wajib diisi untuk mengaktifkan mode Akses Penuh (FULL_ACCESS).',
      confirmButtonColor: '#0f172a'
    });
    return;
  }

  try {
    loading.value = true;

    await impersonateStore.start(props.user.id, {
      mode: selectedMode.value,
      adminPassword: selectedMode.value === 'FULL_ACCESS' ? adminPassword.value.trim() : null
    });

    emit('success');
    emit('close');

    Swal.fire({
      icon: 'success',
      title: 'Mode Impersonate Aktif',
      text: `Anda sekarang masuk sebagai ${props.user.fullName || props.user.name || props.user.username} (${selectedMode.value === 'FULL_ACCESS' ? 'Akses Penuh' : 'Baca Saja'}).`,
      timer: 2000,
      showConfirmButton: false
    });

    // Arahkan ke dashboard user
    router.push('/dashboard').catch(() => {});
  } catch (err) {
    const errorMsg = mapBackendError(err);
    Swal.fire({
      icon: 'error',
      title: 'Gagal Impersonate',
      text: errorMsg,
      confirmButtonColor: '#0f172a'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-expand-enter-active,
.fade-expand-leave-active {
  transition: all 0.25s ease-out;
}
.fade-expand-enter-from,
.fade-expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

