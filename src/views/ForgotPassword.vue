<template>
  <div class="min-h-screen w-full bg-[#060d2e] flex items-center justify-center px-4 font-[Poppins,sans-serif]">

    <!-- Background glow -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full"></div>
    </div>

    <div class="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.4)] rounded-3xl w-full max-w-md p-10">

      <!-- Header Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-semibold text-white text-center mb-1 tracking-tight">
        Forgot Password
      </h2>
      <p class="text-slate-400 text-center mb-8 text-[13px] font-normal">
        Enter your email to receive a password reset link
      </p>

      <!-- ── Success State ── -->
      <div v-if="isSuccess" class="text-center py-4">
        <div class="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-emerald-400 font-semibold text-[15px] mb-2">Email Sent!</p>
        <p class="text-slate-400 text-[13px] font-normal mb-2 leading-relaxed">
          We've sent a password reset link to:
        </p>
        <p class="text-white font-medium text-[13px] mb-6">{{ submittedEmail }}</p>
        <p class="text-slate-500 text-[12px] mb-8 leading-relaxed">
          Please check your inbox and click the link to reset your password. The link will expire in 24 hours.
        </p>
        <router-link
          to="/login"
          class="w-full inline-block text-center bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-xl transition-all font-medium text-[13px] shadow-lg active:scale-[0.98]"
        >
          Back to Login
        </router-link>
      </div>

      <!-- ── Form ── -->
      <form v-else @submit.prevent="handleSubmit" class="w-full space-y-5">

        <!-- Error message -->
        <div v-if="errorMessage" class="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-[12px] font-normal flex items-start gap-2">
          <span class="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 flex-shrink-0"></span>
          {{ errorMessage }}
        </div>

        <!-- Email Input -->
        <div class="space-y-1.5">
          <label for="email" class="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Email Address
          </label>
          <input
            type="email"
            v-model="email"
            id="email"
            :disabled="isLoading"
            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition text-white text-sm font-normal placeholder:text-slate-600"
            placeholder="Enter your email address"
            required
          />
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
            Sending...
          </span>
          <span v-else>Send Reset Link</span>
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
import { forgotPassword } from "@/services/user";

export default {
  name: 'ForgotPassword',

  data() {
    return {
      email: "",
      submittedEmail: "",
      isLoading: false,
      isSuccess: false,
      errorMessage: ""
    };
  },

  methods: {
    async handleSubmit() {
      this.errorMessage = "";

      if (!this.email.trim()) {
        this.errorMessage = "Please enter your email address.";
        return;
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.errorMessage = "Please enter a valid email address.";
        return;
      }

      this.isLoading = true;

      try {
        await forgotPassword(this.email);

        this.submittedEmail = this.email;
        this.isSuccess = true;

      } catch (err) {
        this.errorMessage =
          err.response?.data?.message ||
          "Failed to send reset link. Please check your email and try again.";
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>