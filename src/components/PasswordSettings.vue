<template>
  <div class="space-y-6">
    

    <!-- ============================================
         FORM 
         ============================================ -->
    <form @submit.prevent="changePassword" class="space-y-6">

      <div class="group">
        <label for="current-password" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {{ activeLanguage === 'id' ? 'Kata Sandi Saat Ini' : 'Current Password' }} 
          <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <input
            id="current-password"
            :type="showCurrent ? 'text' : 'password'"
            v-model="passwords.current"
            @keyup="detectCapsLock"
            required
            :placeholder="activeLanguage === 'id' ? 'Masukkan kata sandi saat ini' : 'Enter your current password'"
            class="w-full pl-12 pr-14 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition font-medium bg-white hover:border-gray-300 placeholder:text-gray-400 placeholder:font-normal"
          />
          <button type="button" @click="showCurrent = !showCurrent"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition">
            <svg v-if="!showCurrent" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
      </div>

      <div class="group">
        <label for="new-password" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          {{ activeLanguage === 'id' ? 'Kata Sandi Baru' : 'New Password' }}
          <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>

          <input
            id="new-password"
            :type="showNew ? 'text' : 'password'"
            v-model="passwords.new"
            @keyup="detectCapsLock"
            required
            minlength="6"
            :placeholder="activeLanguage === 'id' ? 'Gunakan kombinasi simbol dan angka' : 'Use a combination of symbols and numbers'"
            class="w-full pl-12 pr-14 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition font-medium bg-white hover:border-gray-300 placeholder:text-gray-400 placeholder:font-normal"
          />
          <button type="button" @click="showNew = !showNew"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition">
            <svg v-if="!showNew" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>

        <div v-if="passwords.new" class="mt-3">
          <div class="flex gap-1.5 mb-1.5">
            <div v-for="i in 4" :key="i"
                 :class="getStrengthColor(i)"
                 class="h-1.5 flex-1 rounded-full transition-all duration-500 ease-in-out">
            </div>
          </div>
          <div class="flex justify-between items-center">
            <p :class="getStrengthTextColor()" class="text-[11px] font-bold uppercase tracking-wider">
              {{ getStrengthText() }}
            </p>
            <span class="text-[10px] text-gray-400 font-medium">Security</span>
          </div>
        </div>
      </div>

      <div class="group">
        <label for="confirm-password" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ activeLanguage === 'id' ? 'Konfirmasi Kata Sandi Baru' : 'Confirm New Password' }} 
          <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <input
            id="confirm-password"
            :type="showConfirm ? 'text' : 'password'"
            v-model="passwords.confirm"
            @keyup="detectCapsLock"
            required
            :placeholder="activeLanguage === 'id' ? 'Masukkan kembali kata sandi baru' : 'Re-enter new password'"
            class="w-full pl-12 pr-14 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-600 transition font-medium bg-white hover:border-gray-300 placeholder:text-gray-400 placeholder:font-normal"
          />
          <button type="button" @click="showConfirm = !showConfirm"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition">
            <svg v-if="!showConfirm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>

        <div v-if="passwords.new && passwords.confirm" class="mt-2">
          <div v-if="passwordMatch"
               class="flex items-center text-emerald-600 text-[11px] font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ activeLanguage === 'id' ? 'Kata sandi cocok' : 'The password matches' }}
          </div>
          <div v-else
               class="flex items-center text-rose-600 text-[11px] font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
            <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            {{ activeLanguage === 'id' ? 'Konfirmasi kata sandi tidak cocok' : 'The confirmation password does not match' }}
          </div>
        </div>
      </div>

      <div v-if="error" class="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex items-start">
        <svg class="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs text-rose-800 font-bold ml-3">{{ error }}</p>
      </div>

      <div class="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          @click="resetForm"
          class="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition flex items-center gap-2 text-sm"
        >
          Reset
        </button>

        <button
          type="submit"
          :disabled="submitting || !passwordMatch || cooldown > 0"
          class="bg-gray-900 text-white px-8 py-2.5 rounded-xl hover:bg-black transition-all font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg text-sm"
        >

          <template v-if="cooldown > 0">
            {{ activeLanguage === 'id' ? 'Coba lagi dalam' : 'Retry in' }} {{ cooldown }}s
          </template>
          <template v-else-if="submitting">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ activeLanguage === 'id' ? 'Memproses...' : 'Processing...' }}
          </template>
          <template v-else>
            {{ activeLanguage === 'id' ? 'Ubah Kata Sandi' : 'Change Password' }}
          </template>
        </button>
      </div>

    </form>
  </div>
</template>

<script>
export default {
  name: 'PasswordSettings',

  emits: ['change-password'], 

  data() {
    return {
      passwords: {
        current: '',
        new: '',
        confirm: ''
      },
      showCurrent: false,
      showNew: false,
      showConfirm: false,
      error: null,
      submitting: false,

      isCapsLockOn: false,
      cooldown: 0,
      failedAttempts: 0,
    };
  },

  computed: {
    activeLanguage() {
      return this.$langStore ? this.$langStore.lang : 'id';
    },
    passwordMatch() {
      if (!this.passwords.new || !this.passwords.confirm) return false;
      return this.passwords.new === this.passwords.confirm;
    },

    passwordStrength() {
      const p = this.passwords.new;
      if (!p) return 0;

      let score = 0;
      if (p.length >= 8) score++;
      if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
      if (/[0-9]/.test(p)) score++;
      if (/[^A-Za-z0-9]/.test(p)) score++;

      return score;
    }
  },

  methods: {

    detectCapsLock(e) {
      this.isCapsLockOn = e.getModifierState('CapsLock');
    },

    startCooldown(seconds) {
      this.cooldown = seconds;
      const timer = setInterval(() => {
        this.cooldown--;
        if (this.cooldown <= 0) {
          clearInterval(timer);
          this.failedAttempts = 0;
        }
      }, 1000);
    },

    getStrengthColor(i) {
      if (i > this.passwordStrength) return 'bg-gray-200';
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
      return colors[this.passwordStrength - 1];
    },

    getStrengthText() {
      const texts = this.activeLanguage === 'id' 
        ? ['', 'Sangat Lemah', 'Cukup Baik', 'Kata Sandi Kuat', 'Sangat Aman']
        : ['', 'Very Weak', 'Fairly Good', 'Strong Password', 'Very Secure'];
      return texts[this.passwordStrength];
    },

    getStrengthTextColor() {
      const colors = ['', 'text-red-600', 'text-orange-600', 'text-yellow-600', 'text-emerald-600'];
      return colors[this.passwordStrength];
    },

    resetForm() {
      this.passwords = { current: '', new: '', confirm: '' };
      this.error = null;
      this.showCurrent = false;
      this.showNew = false;
      this.showConfirm = false;
    },

    changePassword() {
      this.error = null;

      if (!this.passwordMatch) {
        this.error = this.activeLanguage === 'id' ? 'Kata sandi baru dan konfirmasi tidak cocok.' : 'The new password and the confirmation do not match.';
        return;
      }
      if (this.passwords.new.length < 8) {
        this.error = this.activeLanguage === 'id' ? 'Kata sandi harus terdiri dari minimal 8 karakter.' : 'The password must be at least 8 characters long.';
        return;
      }
      if (!/[A-Z]/.test(this.passwords.new) || !/[a-z]/.test(this.passwords.new)) {
        this.error = this.activeLanguage === 'id' ? 'Gunakan kombinasi huruf besar dan huruf kecil.' : 'Use a combination of uppercase and lowercase letters.';
        return;
      }
      if (!/[0-9]/.test(this.passwords.new)) {
        this.error = this.activeLanguage === 'id' ? 'Kata sandi harus mengandung angka.' : 'The password must contain numbers.';
        return;
      }
      if (!/[^A-Za-z0-9]/.test(this.passwords.new)) {
        this.error = this.activeLanguage === 'id' ? 'Kata sandi harus mengandung simbol.' : 'The password must contain symbols';
        return;
      }
      if (this.passwords.current === this.passwords.new) {
        this.error = this.activeLanguage === 'id' ? 'Kata sandi baru tidak boleh sama dengan kata sandi lama.' : 'The new password must not be the same as the old one.';
        return;
      }

      this.submitting = true;

      this.$emit('change-password', { ...this.passwords });

      setTimeout(() => {
        this.resetForm();
        this.submitting = false;
      }, 1000);
    }
  }
};
</script>