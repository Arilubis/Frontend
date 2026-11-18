<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          Informasi Profil
        </h3>
        <p class="text-gray-500 text-[13px] font-normal mt-1 ml-13">Kelola informasi pribadi Anda</p>
      </div>
    </div>

    <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-600 p-5 rounded-xl mb-6 shadow-sm">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-900 mb-1">⚠️ Penting untuk Diperhatikan</p>
          <p class="text-sm text-gray-700">Username yang Anda ubah akan digunakan untuk login selanjutnya. Pastikan Anda mengingat username baru Anda.</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="saveProfile" class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Username -->
       <div class="group">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Username
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              id="username" 
              type="text" 
              v-model="localUser.username" 
              required
              placeholder="Masukkan username"
              @blur="validateField('username')"
              :class="[
                'w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 transition font-medium bg-white',
                errors.username ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-600 hover:border-gray-400'
              ]"
            >
          </div>
          <p v-if="errors.username" class="text-xs text-red-600 mt-1 font-normal">{{ errors.username }}</p>
          <p v-else class="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Digunakan untuk login
          </p>
        </div>

        <!-- Name -->
       <div class="group">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Nama Lengkap
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              id="name" 
              type="text" 
              v-model="localUser.name" 
              required
              placeholder="Masukkan nama lengkap"
              @blur="validateField('name')"
              :class="[
                'w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 transition font-medium bg-white',
                errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-600 hover:border-gray-400'
              ]"
            >
          </div>
          <p v-if="errors.name" class="text-xs text-red-600 mt-1 font-normal">{{ errors.name }}</p>
        </div>


        <!-- Email -->
        <div class="group">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              id="email" 
              type="email" 
              v-model="localUser.email" 
              required
              placeholder="Masukkan email"
              @blur="validateField('email')"
              :class="[
                'w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 transition font-medium bg-white',
                errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-600 hover:border-gray-400'
              ]"
            >
          </div>
          <p v-if="errors.email" class="text-xs text-red-600 mt-1 font-normal">{{ errors.email }}</p>
        </div>

        <!-- Phone -->
        <div class="group">
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Nomor Telepon
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input 
            id="phone" 
            type="tel" 
            v-model="localUser.phone" 
            placeholder="Masukkan nomor telepon"
            @blur="validateField('phone')"
            :class="[
              'w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-gray-500 transition font-medium bg-white',
              errors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-gray-600 hover:border-gray-400'
            ]"
          >
        </div>
        <p v-if="errors.phone" class="text-xs text-red-600 mt-1 font-normal">{{ errors.phone }}</p>
      </div>
      </div>

      <!-- Read-only Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-gray-200">
        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Peran
          </label>
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl px-5 py-3.5 flex items-center justify-between shadow-sm">
            <span class="text-gray-800 font-semibold">{{ user.role || 'USER' }}</span>
            <span :class="{
              'bg-purple-100 text-purple-800 border-purple-300': user.role === 'ADMIN',
              'bg-blue-100 text-blue-800 border-blue-300': user.role === 'USER',
              'bg-yellow-100 text-yellow-800 border-yellow-300': user.role === 'APPROVER'
            }" class="px-3 py-1 rounded-full text-xs font-bold border-2">
              {{ user.role || 'USER' }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Tidak dapat diubah
          </p>
        </div>

        <!-- Jabatan -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Jabatan
          </label>
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl px-5 py-3.5 shadow-sm">
            <span class="text-gray-800 font-semibold">{{ user.jabatan || '-' }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Tidak dapat diubah
          </p>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end gap-3 pt-6 border-t-2 border-gray-200">
        <button 
          type="button"
          @click="$emit('cancel')"
          class="px-8 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Batal
        </button>
        <button 
          type="submit" 
          :disabled="saving"
          class="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-3.5 rounded-xl hover:from-gray-800 hover:to-gray-950 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg v-if="!saving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          <svg v-else class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ProfileInfo',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localUser: { ...this.user },
      saving: false,
      errors: {
        username: '',
        name: '',
        email: '',
        phone: ''
      }
    };
  },
  watch: {
    user(newVal) {
      this.localUser = { ...newVal };
    }
  },
  methods: {
    // TAMBAHKAN METHOD VALIDASI
    validateField(field) {
      this.errors[field] = '';
      
      switch(field) {
        case 'name':
          if (this.localUser.name && this.localUser.name.trim().length < 2) {
            this.errors.name = 'Nama minimal 2 karakter';
            return false;
          }
          break;
          
        case 'username':
          if (this.localUser.username && this.localUser.username.trim().length < 3) {
            this.errors.username = 'Username minimal 3 karakter';
            return false;
          }
          break;
          
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (this.localUser.email && !emailRegex.test(this.localUser.email)) {
            this.errors.email = 'Format email tidak valid';
            return false;
          }
          break;
          
        case 'phone':
          if (this.localUser.phone && this.localUser.phone.trim().length < 10) {
            this.errors.phone = 'Nomor telepon tidak valid';
            return false;
          }
          break;
      }
      return true;
    },

    validateAll() {
      let isValid = true;
      
      // Reset semua error
      this.errors = {
        username: '',
        name: '',
        email: '',
        phone: ''
      };
      
      // Validasi semua field
      if (!this.validateField('name')) isValid = false;
      if (!this.validateField('username')) isValid = false;
      if (!this.validateField('email')) isValid = false;
      if (this.localUser.phone && !this.validateField('phone')) isValid = false;
      
      return isValid;
    },

    saveProfile() {
      if (!this.localUser.username || !this.localUser.name || !this.localUser.email) {
        alert('Username, nama, dan email wajib diisi!');
        return;
      }

      // TAMBAHKAN VALIDASI SEBELUM SUBMIT
      if (!this.validateAll()) {
        return;
      }

      this.saving = true;
      
      this.$emit('update-profile', {
        username: this.localUser.username.trim(),
        name: this.localUser.name.trim(),
        email: this.localUser.email.trim(),
        phone: this.localUser.phone?.trim() || ''
      });

      setTimeout(() => {
        this.saving = false;
      }, 1000);
    }
  }
};
</script>