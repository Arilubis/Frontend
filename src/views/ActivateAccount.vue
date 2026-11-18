<template>
  <div class="min-h-screen w-full bg-[#060d2e] flex items-center justify-center px-4 font-[Poppins,sans-serif]">

    <!-- Subtle background glow -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.4)] rounded-3xl w-full max-w-md p-10">

      <!-- Header Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>

      <!-- Title — same weight as "Good Morning" in Login.vue -->
      <h2 class="text-2xl font-semibold text-white text-center mb-1 tracking-tight">
        Account Activation
      </h2>
      <p class="text-slate-400 text-center mb-8 text-[13px] font-normal">
        Create a password to activate your account
      </p>

      <!-- ── Invalid Token State ── -->
      <div v-if="!token && !isSuccess" class="text-center py-4">
        <div class="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
          </svg>
        </div>
        <p class="text-rose-400 font-semibold text-[15px] mb-2">Invalid Link</p>
        <p class="text-slate-400 text-[13px] font-normal mb-6 leading-relaxed">
          Activation token not found or has expired.<br>Please check your email again.
        </p>
        <router-link to="/login" class="text-blue-400 hover:text-blue-300 text-[13px] font-medium transition-colors">
          ← Back to Login
        </router-link>
      </div>

      <!-- ── Success State ── -->
      <div v-else-if="isSuccess" class="text-center py-4">
        <div class="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-emerald-400 font-semibold text-[15px] mb-2">Account Activated!</p>
        <p class="text-slate-400 text-[13px] font-normal mb-6 leading-relaxed">
          Your password has been set successfully.<br>You can now log in with your account.
        </p>
        <button
          @click="$router.push('/login')"
          class="w-full bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-xl transition-all font-medium text-[13px] shadow-lg active:scale-[0.98]"
        >
          Go to Login
        </button>
      </div>

      <!-- ── Activation Form ── -->
      <form v-else @submit.prevent="handleActivate" class="w-full space-y-5">

        <!-- Error message -->
        <div v-if="errorMessage" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-[12px] font-normal flex items-start gap-2">
          <span class="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0"></span>
          {{ errorMessage }}
        </div>

        <!-- New Password -->
        <div class="space-y-1.5">
          <label for="password" class="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            New Password
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              id="password"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition text-white text-sm font-normal placeholder:text-slate-600 pr-16"
              placeholder="Create your password"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-[11px] font-normal"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <!-- Password requirements -->
        <ul class="space-y-1.5 px-1">
          <li class="flex items-center text-[11px] gap-2 transition-colors"
            :class="password.length >= 8 ? 'text-emerald-400' : 'text-slate-600'">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            At least 8 characters
          </li>
          <li class="flex items-center text-[11px] gap-2 transition-colors"
            :class="hasSpecialChar ? 'text-emerald-400' : 'text-slate-600'">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Contains a special character (!@#$...)
          </li>
          <li class="flex items-center text-[11px] gap-2 transition-colors"
            :class="hasUpperCase ? 'text-emerald-400' : 'text-slate-600'">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Contains an uppercase letter
          </li>
          <li class="flex items-center text-[11px] gap-2 transition-colors"
            :class="hasNumber ? 'text-emerald-400' : 'text-slate-600'">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Contains numbers
          </li>
        </ul>

        <!-- Confirm Password -->
        <div class="space-y-1.5">
          <label for="confirmPassword" class="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Confirm Password
          </label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              id="confirmPassword"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 transition text-white text-sm font-normal placeholder:text-slate-600 pr-16"
              :class="confirmPassword && password !== confirmPassword
                ? 'border-rose-500/40 focus:ring-rose-500/20'
                : confirmPassword && password === confirmPassword
                  ? 'border-emerald-500/40 focus:ring-emerald-500/20'
                  : 'border-white/10 focus:ring-blue-500/40 focus:border-blue-500/40'"
              placeholder="Repeat your password"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-[11px] font-normal"
            >
              {{ showConfirmPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="confirmPassword && password !== confirmPassword"
            class="text-[11px] text-rose-400 font-normal mt-1">
            Passwords do not match
          </p>
          <p v-if="confirmPassword && password === confirmPassword && confirmPassword.length > 0"
            class="text-[11px] text-emerald-400 font-normal mt-1">
            ✓ Passwords match
          </p>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="isLoading"
          :class="{ 'opacity-60 cursor-not-allowed': isLoading }"
          class="w-full bg-slate-100 hover:bg-white text-slate-900 py-3.5 rounded-xl transition-all font-medium text-[13px] shadow-lg active:scale-[0.98] mt-2"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Activating...
          </span>
          <span v-else>Activate Account</span>
        </button>

        <div class="text-center pt-1">
          <router-link to="/login" class="text-[12px] text-slate-500 hover:text-slate-300 transition-colors font-normal">
            ← Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { verifyAndSetPassword } from "@/services/user";
export default {
  name: 'ActivateAccount',
  data() {
    return {
      token: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      isSuccess: false,
      errorMessage: ""
    };
  },

  computed: {
    hasSpecialChar() {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
    },
    hasUpperCase() {
      return /[A-Z]/.test(this.password);
    },
    hasNumber() {
      return /[0-9]/.test(this.password);
    }
  },
  mounted() {
    this.token = this.$route.query.token || "";

    // Jika ada ?open=app → teruskan ke deep link mobile app
    if (this.$route.query.open === "app" && this.token) {
      const deepLink = `authorix://activate-account?token=${this.token}`;

      // Coba buka app, fallback tetap di web jika app tidak terinstall
      window.location.href = deepLink;

      // Fallback: setelah 2.5 detik jika app tidak terbuka, tetap di halaman web
      setTimeout(() => {
        // Halaman masih aktif berarti app tidak terbuka, lanjut di web
      }, 2500);
    }
  },

  methods: {
    async handleActivate() {
      this.errorMessage = "";

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }
      if (this.password.length < 8) {
        this.errorMessage = "Password must be at least 8 characters.";
        return;
      }
      if (!this.hasSpecialChar) {
        this.errorMessage = "Password must contain at least 1 special character.";
        return;
      }
      if (!this.hasUpperCase) {
        this.errorMessage = "Password must contain at least 1 uppercase letter.";
        return;
      }
      if (!this.hasNumber) {
        this.errorMessage = "Password must contain at least 1 number.";
        return;
      }

      this.isLoading = true;

      try {
        await verifyAndSetPassword({
          token: this.token,
          password: this.password,
          confirmPassword: this.confirmPassword
        });

        this.isSuccess = true;

      } catch (err) {
        this.errorMessage =
          err.response?.data?.message ||
          "Failed to activate account. Token is invalid or has expired.";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>