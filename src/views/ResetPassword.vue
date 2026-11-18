<template>
  <div class="min-h-screen w-full bg-[#060d2e] flex items-center justify-center px-4 font-[Poppins,sans-serif]">

    <!-- Background glow — same as ActivateAccount -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.4)] rounded-3xl w-full max-w-md p-10">

      <!-- Header Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-semibold text-white text-center mb-1 tracking-tight">
        Reset Password
      </h2>
      <p class="text-slate-400 text-center mb-8 text-[13px] font-normal">
        Create a new password for your account
      </p>

      <!-- ── Invalid Token State ── -->
      <div v-if="!token && !isSuccess" class="text-center py-4">
        <div class="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
          </svg>
        </div>
        <p class="text-rose-400 font-semibold text-[15px] mb-2">Invalid Link</p>
        <p class="text-slate-400 text-[13px] font-normal mb-6 leading-relaxed">
          Reset token not found or has expired.<br>Please request a new password reset.
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
        <p class="text-emerald-400 font-semibold text-[15px] mb-2">Password Reset Successful!</p>
        <p class="text-slate-400 text-[13px] font-normal mb-6 leading-relaxed">
          Your password has been updated successfully.<br>You can now log in with your new password.
        </p>
        <button
          @click="$router.push('/login')"
          class="w-full bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-xl transition-all font-medium text-[13px] shadow-lg active:scale-[0.98]"
        >
          Go to Login
        </button>
      </div>

      <!-- ── Reset Password Form ── -->
      <form v-else @submit.prevent="handleReset" class="w-full space-y-5">

        <!-- Error message -->
        <div v-if="errorMessage" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-[12px] font-normal flex items-start gap-2">
          <span class="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0"></span>
          {{ errorMessage }}
        </div>

        <!-- New Password -->
        <div class="space-y-1.5">
          <label for="newPassword" class="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            New Password
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="newPassword"
              id="newPassword"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition text-white text-sm font-normal placeholder:text-slate-600 pr-16"
              placeholder="Enter your new password"
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

        <!-- Password Requirements -->
        <ul class="space-y-1.5 px-1">
          <li class="flex items-center text-[11px] gap-2 transition-colors"
            :class="newPassword.length >= 8 ? 'text-emerald-400' : 'text-slate-600'">
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
            Confirm New Password
          </label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              id="confirmPassword"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 transition text-white text-sm font-normal placeholder:text-slate-600 pr-16"
              :class="confirmPassword && newPassword !== confirmPassword
                ? 'border-rose-500/40 focus:ring-rose-500/20'
                : confirmPassword && newPassword === confirmPassword
                  ? 'border-emerald-500/40 focus:ring-emerald-500/20'
                  : 'border-white/10 focus:ring-blue-500/40 focus:border-blue-500/40'"
              placeholder="Repeat your new password"
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
          <p v-if="confirmPassword && newPassword !== confirmPassword"
            class="text-[11px] text-rose-400 font-normal mt-1">
            Passwords do not match
          </p>
          <p v-if="confirmPassword && newPassword === confirmPassword && confirmPassword.length > 0"
            class="text-[11px] text-emerald-400 font-normal mt-1">
            ✓ Passwords match
          </p>
        </div>

        <!-- Submit Button -->
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
            Resetting...
          </span>
          <span v-else>Reset Password</span>
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
import { setupPassword } from "@/services/user";

export default {
  name: 'ResetPassword',

  data() {
    return {
      token: "",
      newPassword: "",
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
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);
    },
    hasUpperCase() {
      return /[A-Z]/.test(this.newPassword);
    },
    hasNumber() {
      return /[0-9]/.test(this.newPassword);
    }
  },

  mounted() {
    this.token = this.$route.query.token || "";

    // Jika ada ?open=app → teruskan ke deep link mobile app
    if (this.$route.query.open === "app" && this.token) {
      const deepLink = `authorix://reset-password?token=${this.token}`;

      window.location.href = deepLink;

      setTimeout(() => {
        // Fallback: tetap di halaman web jika app tidak terinstall
      }, 2500);
    }
  },

  methods: {
    async handleReset() {
      this.errorMessage = "";

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }
      if (this.newPassword.length < 8) {
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
        await setupPassword({
          token: this.token,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        });

        this.isSuccess = true;

      } catch (err) {
        this.errorMessage =
          err.response?.data?.message ||
          "Failed to reset password. Token is invalid or has expired.";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>