<template>
  <div class="min-h-screen w-full bg-[#020617] flex items-center justify-center overflow-hidden relative font-sans">

    <div class="absolute inset-0 flex items-center justify-center z-0 bg-[#060d2e]">
      <div class="text-white text-center">
        <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-[10px] tracking-[0.5em] uppercase opacity-50 font-black">Authorizing Access...</p>
      </div>
    </div>

    <!-- Panel Kiri: Logo + animasi (hidden di mobile, tampil di md+) -->
    <div
  class="hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-[#060d2e] z-30 transition-transform duration-[1200ms] ease-in-out items-center justify-center border-r border-blue-900/30 shadow-2xl"
  :class="{ '-translate-x-full': isDoorOpen }"
>
  <!-- Speed Lines tetap ada -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div v-for="n in 20" :key="n" class="speed-line" :style="generateSpeedStyle()"></div>
  </div>

  

  <!-- Logo Section -->
  <div
    class="z-50 transition-all duration-1000 flex flex-col items-center gap-8"
    :class="{ 'opacity-0 scale-75 blur-lg': isDoorOpen }"
  >
    <!-- Logo icon saja, diperbesar -->
    <img
      :src="logoSource"
      alt="Authorix Logo"
      class="w-[250px] h-[250px] object-contain logo-final-style"
    />

    <!-- Teks Authorix putih -->
    <div class="flex flex-col items-center gap-1">
      
      <span class="text-[11px] font-bold text-blue-400 tracking-[0.5em] uppercase">
        Authorix System
      </span>
    </div>

    <!-- Divider -->
    <div class="flex items-center gap-4 w-64">
      <div class="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/40"></div>
      <span class="text-[8px] font-black text-white/25 tracking-[0.4em] uppercase">EST. 2026</span>
      <div class="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/40"></div>
    </div>

    <!-- Tagline -->
    <div class="flex items-center gap-3">
      <span class="text-[10px] font-semibold text-white/35 tracking-widest uppercase">Secure</span>
      <div class="w-1 h-1 rounded-full bg-blue-500/50"></div>
      <span class="text-[10px] font-semibold text-white/35 tracking-widest uppercase">Smart</span>
      <div class="w-1 h-1 rounded-full bg-blue-500/50"></div>
      <span class="text-[10px] font-semibold text-white/35 tracking-widest uppercase">Seamless</span>
    </div>
  </div>
</div>

    <div
      class="absolute top-0 right-0 w-full md:w-1/2 h-full bg-white z-20 transition-transform duration-[1200ms] ease-in-out flex items-start justify-start overflow-y-auto"
      :class="{ 'md:translate-x-full': isDoorOpen }"
    >
      <div
        class="w-full px-6 py-8 sm:px-10 sm:py-10 my-auto mx-auto md:mx-0 md:ml-12 lg:ml-24 bg-white md:bg-transparent rounded-none md:rounded-none shadow-none md:shadow-none border-none md:border-none"
        :class="[
          stage === 'credentials' ? 'max-w-md md:px-16 md:py-0' : 'max-w-lg md:px-10 md:py-10',
          { 'opacity-50 pointer-events-none transition-all duration-700 blur-[2px]': isLoading }
        ]"
      >

        <transition name="slide-up">
          <div v-if="loginMessage.text"
               :class="['mb-6 p-4 rounded-2xl text-[11px] font-bold flex items-center gap-3 border shadow-sm',
               loginMessage.type === 'success'
                 ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                 : 'bg-rose-50 text-rose-600 border-rose-100']">
            <span class="w-2 h-2 rounded-full animate-pulse"
                  :class="loginMessage.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'"></span>
            {{ loginMessage.text }}
          </div>
        </transition>

        <transition name="slide-up">
          <div v-if="userDeletedWarning"
               class="mb-6 p-4 rounded-2xl text-[11px] font-bold flex items-center gap-3 border shadow-sm bg-amber-50 text-amber-600 border-amber-100">
            <span class="w-2 h-2 rounded-full flex-shrink-0 bg-amber-500 animate-pulse"></span>
            {{ $t('login.warningDeleted') }}
          </div>
        </transition>


        <!-- Logo mobile-only: tampil di hp, tersembunyi di desktop -->
        <div class="flex md:hidden flex-col items-center mb-8">
          <div class="relative mb-4">
            <div class="absolute inset-0 bg-blue-500/25 blur-2xl rounded-3xl scale-110"></div>
            <div class="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl flex items-center justify-center shadow-2xl ring-2 ring-blue-500/30 p-3">
              <img :src="logoSource" alt="Authorix" class="w-full h-full object-contain" />
            </div>
          </div>
          <h2 class="text-[18px] sm:text-[20px] font-semibold text-slate-900 tracking-tight mt-1">Authorix System</h2>
          <span class="text-[11px] sm:text-[12px] text-blue-500 font-medium tracking-[0.25em] uppercase mt-1">{{ $t('login.secureAccess') }}</span>
        </div>

        <!-- ═══ LANGKAH 2FA (verifikasi kode / setup paksa) ═══ -->
        <TwoFactorLoginStep
          v-if="stage !== 'credentials'"
          :key="stage"
          :mode="stage"
          :challenge-token="challengeToken"
          :setup-token="setupToken"
          @authenticated="completeLogin"
          @cancel="backToCredentials"
        />

        <template v-if="stage === 'credentials'">
        <div class="mb-8">
          <div class="hidden md:flex items-center gap-2 mb-2">
            <div class="h-[2px] w-6 bg-slate-300"></div>
            <span class="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{{ $t('login.secureAccess') }}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
            {{ getTimeGreeting }}
          </h2>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-4">

            <!-- Username Field -->
            <div :class="{ 'animate-shake': loginError && !username }" class="group">
              <label class="text-[11px] font-medium text-slate-600 mb-1.5 block">
                {{ $t('login.username') }}
              </label>
              <input
                v-model="username"
                @blur="validateUsername"
                @input="errors.username = ''"
                id="username"
                :disabled="isLoading"
                :class="[
                  'w-full px-6 py-4 bg-slate-100 border rounded-xl transition-all outline-none focus:bg-white text-sm font-normal text-slate-800 placeholder:text-slate-300',
                  errors.username
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-200 focus:border-slate-900'
                ]"
                :placeholder="$t('login.username')"
              />
           
              <transition name="slide-up">
                <p v-if="errors.username"
                   class="text-[9px] text-rose-500 font-normal mt-1 ml-1 uppercase flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  {{ errors.username }}
                </p>
              </transition>
            </div>

            <!-- Password Field -->
            <div :class="{ 'animate-shake': loginError && !password }" class="group relative">
              <label class="text-[11px] font-medium text-slate-600 mb-1.5 block">
                {{ $t('login.password') }}
              </label>
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  @blur="validatePassword"
                  @input="errors.password = ''"
                  id="password"
                  :disabled="isLoading"
                  :class="[
                    'w-full px-6 py-4 bg-slate-100 border rounded-xl transition-all outline-none focus:bg-white text-sm font-normal text-slate-800 placeholder:text-slate-300',
                    errors.password
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-200 focus:border-slate-900'
                  ]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors focus:outline-none"
                >
                  <!-- Icon Mata Terbuka -->
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>

                  <!-- Icon Mata Tertutup -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 012.525-4.098m2.818-2.504A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.967 9.967 0 01-1.357 2.707M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                  </svg>
                </button>
              </div>

              <div class="flex justify-end mt-1.5">
                <router-link
                  to="/forgot-password"
                  class="text-[11px] text-slate-400 hover:text-slate-700 transition-colors font-normal"
                >
                  {{ $t('login.forgotPassword') }}
                </router-link>
              </div>
              <!-- Error Password (logika kamu) -->
              <transition name="slide-up">
                <p v-if="errors.password"
                   class="text-[9px] text-rose-500 font-normal mt-1 ml-1 uppercase flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  {{ errors.password }}
                </p>
              </transition>
            </div>
          </div>
         
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full relative py-4 rounded-xl font-medium text-[13px] tracking-wide transition-all bg-slate-900 text-white shadow-lg hover:bg-slate-700 active:scale-[0.98] overflow-hidden group/btn disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shine-effect"></div>
            <span class="relative z-10 flex items-center justify-center gap-3">
              <span v-if="isLoading" class="flex items-center gap-3">
                <div class="custom-spinner"></div>
                {{ activeLanguage === 'id' ? 'Memproses...' : 'Processing...' }}
              </span>
              <span v-else class="flex items-center gap-3">
                {{ $t('login.signIn') }}
                <span class="text-lg opacity-50 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all">→</span>
              </span>
            </span>
          </button>
        </form>
        </template>

        <!-- Footer -->
        <div class="mt-12 flex flex-col items-center gap-2 opacity-90">
          <router-link
            to="/privacy-policy"
            class="text-[9px] text-slate-800 hover:text-slate-800 uppercase tracking-[0.35em] transition-colors duration-200 font-medium"
          >
            Privacy Policy
          </router-link>
          <p class="text-[9px] text-slate-900 font-black uppercase tracking-[0.4em]">© 2026 Authorix System</p>
        </div>

      </div>
    </div>

    <!-- Premium App Bridge Popup -->
    <transition name="fade-pop">
      <div v-if="showAppPopup" class="fixed inset-0 z-[150] flex items-center justify-center px-4">
        <!-- Backdrop with dynamic blur -->
        <div class="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" @click="showAppPopup = false"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-[2rem] w-full max-w-[340px] p-10 text-center shadow-[0_32px_64px_rgba(0,0,0,0.5)] animate-modal-in">
          <div class="flex justify-center mb-8">
            <div class="relative">
              <div class="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-125"></div>
              <div class="relative w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-xl ring-1 ring-white/10">
                <img :src="logoSource" alt="Authorix" class="w-10 h-10 object-contain brightness-0 invert" />
              </div>
            </div>
          </div>

          <h3 class="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
            {{ activeLanguage === 'id' ? 'Buka di Aplikasi?' : 'Open in App?' }}
          </h3>
          <p class="text-slate-500 text-[13px] leading-relaxed mb-10 font-normal">
            {{ activeLanguage === 'id' ? 'Dapatkan pengalaman Authorix penuh dengan pemrosesan dokumen yang lebih cepat dan notifikasi instan.' : 'Get the full Authorix experience with faster document processing and instant notifications.' }}
          </p>

          <div class="space-y-4">
            <button 
              @click="openApp"
              class="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-[13px] tracking-wide hover:bg-slate-800 transition-all active:scale-[0.97] shadow-lg shadow-slate-900/10"
            >
              {{ activeLanguage === 'id' ? 'Buka Aplikasi' : 'Launch Application' }}
            </button>
            <button 
              @click="showAppPopup = false"
              class="w-full bg-slate-50 text-slate-400 py-3 rounded-xl font-semibold text-[11px] hover:text-slate-600 transition-all"
            >
              {{ activeLanguage === 'id' ? 'Lanjutkan di Browser' : 'Continue in Browser' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>

import { loginUser } from "../services/auth";
import { useAuthStore } from "@/stores/authStore";
import authorixLogo from "@/assets/authorix-logo.png";
import TwoFactorLoginStep from "@/components/TwoFactorLoginStep.vue";
import { detectTwoFactorStage } from "@/services/twoFactor";

export default {
  name: 'LoginForm',
  components: { TwoFactorLoginStep },

  data() {
    return {

      username: "",
      password: "",
      showPassword: false,
      loginMessage: { type: "", text: "" },
      isLoading: false,
      error: "",
      userDeletedWarning: false,
      errors: { username: "", password: "" },

      isDoorOpen: false,
      rememberMe: false,
      loginError: false,
      logoSource: authorixLogo,
      showAppPopup: false,

      // 2FA: 'credentials' → form login | 'verify' → input kode | 'setup' → enrollment paksa
      stage: 'credentials',
      challengeToken: '',
      setupToken: '',
    };
  },

  computed: {
    activeLanguage() {
      return this.$langStore ? this.$langStore.lang : 'id';
    },
    getTimeGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return this.$t('login.greetingMorning');
      if (hour < 17) return this.$t('login.greetingAfternoon');
      return this.$t('login.greetingEvening');
    }
  },

  mounted() {
 
    if (localStorage.getItem("userDeleted") === "true") {
      this.userDeletedWarning = true;
      localStorage.removeItem("userDeleted");
      setTimeout(() => {
        this.userDeletedWarning = false;
      }, 5000);
    }

    const twoFactorNotice = localStorage.getItem("twoFactorNotice");
    if (twoFactorNotice) {
      localStorage.removeItem("twoFactorNotice");
      this.loginMessage = { type: "error", text: twoFactorNotice };
    }

    // Check for ?open=app query parameter
    if (this.$route.query.open === 'app') {
      setTimeout(() => {
        this.showAppPopup = true;
      }, 1200); // Delay for a smoother transition after page load
    }
  },

  methods: {

    generateSpeedStyle() {
      return {
        top: Math.random() * 100 + '%',
        left: '100%',
        width: Math.random() * 100 + 50 + 'px',
        height: '1px',
        background: 'rgba(255,255,255,0.15)',
        position: 'absolute',
        animation: 'speed-move ' + (Math.random() * 0.8 + 0.4) + 's infinite linear'
      };
    },

    triggerError() {
      this.loginError = true;
      setTimeout(() => { this.loginError = false; }, 500);
    },

    validateUsername() {
      if (!this.username.trim()) {
        this.errors.username = this.activeLanguage === 'id' ? "Username wajib diisi" : "Username is required";
        return false;
      }
      if (this.username.length < 3) {
        this.errors.username = this.activeLanguage === 'id' ? "Username minimal 3 karakter" : "Username must be at least 3 characters";
        return false;
      }
      this.errors.username = "";
      return true;
    },

    validatePassword() {
      if (!this.password) {
        this.errors.password = this.activeLanguage === 'id' ? "Password wajib diisi" : "Password is required";
        return false;
      }
      this.errors.password = "";
      return true;
    },

    openApp() {
      // Trigger the custom scheme registered in AndroidManifest
      // Corrected to 'approver-detail' and passing the document ID from query params
      const docId = this.$route.query.id || "";
      window.location.href = `authorix://approver-detail?id=${docId}`;

      // Fallback: If app doesn't open in 2.5s, keep it on web or redirect to store
      setTimeout(() => {
        if (!document.hidden && this.showAppPopup) {
          // You can change this to Play Store URL later
          console.log("App not detected, staying on web.");
        }
      }, 2500);
    },

    // Dipakai login biasa DAN setelah langkah 2FA selesai (cookie sesi sudah diset backend)
    completeLogin(user) {
      this.isLoading = true;

      const authStore = useAuthStore();
      authStore.setAuthentication({
        token: "cookie-mode",
        user: user
      });

      this.loginMessage = {
        type: "success",
        text: this.activeLanguage === 'id' ? "Identitas Terverifikasi. Mengakses Sistem..." : "Identity Verified. Accessing System..."
      };

      setTimeout(() => {
        this.isDoorOpen = true;

        const roles = Array.isArray(user.roles) ? user.roles : [];

        setTimeout(() => {
          this.isLoading = false;
          if (roles.includes("ADMIN")) {
            this.$router.push("/admin/dashboard");
          } else {
            this.$router.push("/dashboard");
          }
        }, 1300);

      }, 800);
    },

    // Batal / token 2FA kedaluwarsa → kembali ke form login
    backToCredentials(message) {
      this.stage = 'credentials';
      this.challengeToken = '';
      this.setupToken = '';
      this.password = '';
      this.loginMessage = typeof message === 'string' && message
        ? { type: 'error', text: message }
        : { type: '', text: '' };
    },

    async handleLogin() {
      this.errors = { username: "", password: "" };
      this.loginMessage = { type: "", text: "" };
      this.error = "";

      const isUsernameValid = this.validateUsername();
      const isPasswordValid = this.validatePassword();

      if (!isUsernameValid || !isPasswordValid) {
        this.triggerError(); 
        return;
      }

      this.isLoading = true;

      try {
        const res = await loginUser(this.username, this.password);
        const payload = res.data?.data;

        // ── 2FA: password benar tapi sesi belum dibuat ──
        const twoFactorStage = detectTwoFactorStage(payload);
        if (twoFactorStage === 'verify') {
          this.challengeToken = payload.challengeToken;
          this.stage = 'verify';
          this.isLoading = false;
          return;
        }
        if (twoFactorStage === 'setup') {
          this.setupToken = payload.setupToken;
          this.stage = 'setup';
          this.isLoading = false;
          return;
        }

        const user = payload?.user;

        if (!user) {
          throw new Error('Data user tidak ditemukan');
        }

        this.completeLogin(user);

      } catch (err) {
        this.isLoading = false;
        this.triggerError(); 

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          (this.activeLanguage === 'id' ? "Login gagal! Terjadi masalah koneksi." : "Login failed! Connection issue occurred.");

        this.loginMessage = {
          type: "error",
          text: errorMessage
        };
        this.error = errorMessage;
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>


@keyframes spin {
  to { transform: rotate(360deg); }
}
.custom-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.logo-final-style {
  filter: brightness(1.1) contrast(1.05) saturate(1.15);
  transition: all 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
.animate-shake { animation: shake 0.2s ease-in-out 0s 2; }

@keyframes speed-move {
  from { transform: translateX(0); }
  to { transform: translateX(-2500px); }
}
.speed-line { position: absolute; }

@keyframes shine-effect {
  100% { transform: translateX(100%); }
}
.animate-shine-effect { animation: shine-effect 1.2s ease-in-out; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(10px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-10px); }

.transition-transform {
  transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
}

@media (max-width: 768px) {
  .animate-float-custom { animation: none; }
}

/* App Bridge Animations */
.fade-pop-enter-active, .fade-pop-leave-active {
  transition: opacity 0.5s ease;
}
.fade-pop-enter-from, .fade-pop-leave-to {
  opacity: 0;
}

@keyframes modal-in {
  0% { transform: scale(0.85); opacity: 0; filter: blur(10px); }
  100% { transform: scale(1); opacity: 1; filter: blur(0); }
}
.animate-modal-in {
  animation: modal-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>