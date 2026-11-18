<template>
  <div class="my-account">

    <!-- LOADING -->
    <div v-if="loading" class="flex justify-center py-20">
      <span class="animate-pulse text-gray-500">Memuat data akun...</span>
    </div>

    <!-- CONTENT -->
    <div v-else>
      <h2 class="text-2xl font-semibold text-slate-900 tracking-tight mb-6">Pengaturan Akun</h2>

      <nav class="flex gap-4 mb-6">
        <button
          :class="tabClass('profile')"
          @click="currentTab = 'profile'"
        >
          Profil
        </button>
        <button
          :class="tabClass('password')"
          @click="currentTab = 'password'"
        >
          Ganti Password
        </button>
        <button
          :class="tabClass('security')"
          @click="currentTab = 'security'"
        >
          Keamanan (2FA)
        </button>
        <button
          :class="tabClass('danger')"
          @click="currentTab = 'danger'"
        >
          Hapus Akun
        </button>
      </nav>

      <!-- PROFILE -->
      <ProfileInfo
        v-if="currentTab === 'profile'"
        :user="user"
        @update-profile="updateProfile"
      />

      <!-- PASSWORD -->
      <PasswordSettings
        v-if="currentTab === 'password'"
        @change-password="changePassword"
      />

      <!-- KEAMANAN: 2FA -->
      <TwoFactorSecurityCard v-if="currentTab === 'security'" standalone />

      <!-- DANGER ZONE / HAPUS AKUN -->
      <div v-if="currentTab === 'danger'" class="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div class="flex items-center gap-3 mb-2 border-b border-slate-100 pb-4">
          <span class="material-icons text-rose-500">report_problem</span>
          <h3 class="text-[16px] font-semibold text-slate-900" >Delete Account </h3>
        </div>

        <div class="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3">
          <span class="material-icons text-rose-600 text-xl flex-shrink-0">warning</span>
          <div class="space-y-1">
            <h4 class="text-sm font-semibold text-rose-900">Menghapus Akun</h4>
            <p class="text-xs text-rose-700 leading-relaxed font-normal">
              Tindakan ini bersifat <strong>permanen</strong>. Semua data Anda akan dihapus dan Anda tidak dapat login kembali.
            </p>
          </div>
        </div>

        <div class="space-y-4 max-w-md">
          <div class="space-y-1.5 relative">
            <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Verifikasi Kata Sandi</label>
            <div class="relative">
              <input 
                :type="deleteForm.showPassword ? 'text' : 'password'" 
                v-model="deleteForm.password"
                placeholder="Masukkan kata sandi saat ini"
                class="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-normal outline-none focus:bg-white focus:border-rose-500 transition-all"
              />
              <button 
                type="button"
                @click="deleteForm.showPassword = !deleteForm.showPassword" 
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                <span class="material-icons text-[20px]">{{ deleteForm.showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          <button
            @click="triggerDeleteAccount"
            :disabled="!deleteForm.password"
            class="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-lg font-medium text-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span class="material-icons text-sm">delete_forever</span>
            Hapus Akun Permanen
          </button>
        </div>
      </div>
    </div>

    <!-- Double Confirmation Delete Modal -->
    <transition name="modal-fade">
      <div
        v-if="showDeleteConfirmModal"
        @click.self="cancelDeleteAccount"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100 transform transition-all duration-300"
        >
          <!-- Header -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-600">
              <span class="material-icons text-3xl">delete_forever</span>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-2" >
              Konfirmasi Hapus Akun
            </p>
            <p class="text-xs text-slate-500 text-center leading-relaxed font-normal px-2" >
              Untuk mengonfirmasi penghapusan, silakan ketik kata kunci <span class="font-bold text-rose-600">HAPUS</span> di bawah ini.
            </p>
          </div>

          <!-- Input Box -->
          <div class="mx-8 mb-5">
            <input
              type="text"
              v-model="deleteConfirmText"
              placeholder="Ketik HAPUS untuk konfirmasi"
              class="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-rose-500 focus:bg-white rounded-xl text-sm font-medium text-center uppercase outline-none transition-all"
              
            />
          </div>

          <!-- Footer Buttons -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button
              @click="cancelDeleteAccount"
              :disabled="isDeleting"
              class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
              
            >
              Batal
            </button>
            <button
              @click="executeDeleteAccount"
              :disabled="deleteConfirmText !== 'HAPUS' || isDeleting"
              class="flex-[1.4] py-3.5 rounded-[14px] bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/10"
              
            >
              <span v-if="isDeleting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span class="material-icons text-sm" v-else>delete_forever</span>
              Hapus Sekarang
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import ProfileInfo from "@/components/ProfileInfo.vue";
import PasswordSettings from "@/components/PasswordSettings.vue";
import TwoFactorSecurityCard from "@/components/TwoFactorSecurityCard.vue";

import {
  getCurrentUser,      // ✅ GANTI getMyProfile → getCurrentUser
  updateMyProfile,
  changeMyPassword,
  deleteMyAccount
} from "@/services/user.js";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "PengaturanUser",
  components: { ProfileInfo, PasswordSettings, TwoFactorSecurityCard },

  data() {
    return {
      user: null,
      loading: true,
      currentTab: "profile",
      deleteForm: {
        password: '',
        showPassword: false
      },
      showDeleteConfirmModal: false,
      deleteConfirmText: '',
      isDeleting: false
    };
  },

  async mounted() {
    try {
      this.user = await getCurrentUser();
    } catch (err) {
      console.error(err);
      this.$router.push("/login");
    } finally {
      this.loading = false;
    }
  },

  methods: {
    tabClass(tab) {
      return [
        "px-4 py-2 rounded text-sm font-medium transition-all duration-200",
        this.currentTab === tab
          ? "bg-zinc-800 text-white border border-blue-500/30 shadow-[0_4px_12px_-3px_rgba(37,99,235,0.35)]"
          : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700"
      ];
    },

    async updateProfile(payload) {
      try {
        this.user = await updateMyProfile(payload);
        alert("Profil berhasil diperbarui");
      } catch (err) {
        alert(err.response?.data?.message || "Gagal update profil");
      }
    },

    async changePassword(payload) {
      try {
        await changeMyPassword(payload);
        alert("Password berhasil diubah, silakan login ulang");
        this.$router.push("/login");
      } catch (err) {
        alert(err.response?.data?.message || "Gagal ganti password");
      }
    },

    triggerDeleteAccount() {
      if (!this.deleteForm.password) {
        alert("Kata sandi harus diisi");
        return;
      }
      this.showDeleteConfirmModal = true;
    },

    cancelDeleteAccount() {
      this.showDeleteConfirmModal = false;
      this.deleteConfirmText = '';
    },

    async executeDeleteAccount() {
      if (this.deleteConfirmText !== 'HAPUS') return;
      try {
        this.isDeleting = true;
        await deleteMyAccount(this.deleteForm.password);
        alert("Akun Anda berhasil dihapus.");
        
        // Bersihkan sesi dan arahkan ke login
        const authStore = useAuthStore();
        authStore.clearAuth();
        this.$router.push({ name: 'Login' });
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Gagal menghapus akun. Silakan periksa kembali kata sandi Anda.';
        alert(errorMsg);
        this.cancelDeleteAccount();
      } finally {
        this.isDeleting = false;
      }
    }
  }
};
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
