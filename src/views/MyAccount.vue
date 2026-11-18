<template>
  <div class="min-h-screen pb-16 bg-[#F1F5F9]" >

    <!-- ── Loading ── -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="text-center">
        <div class="relative w-16 h-16 mx-auto">
          <div class="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin" style="border-top-color:#3b82f6;"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="material-icons text-blue-500 text-2xl">person</span>
          </div>
        </div>
        <p class="mt-4 text-xs font-medium text-slate-400">Memuat profil...</p>
      </div>
    </div>

    <!-- ── Error ── -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-6 py-20 text-center">
      <div class="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
        <span class="material-icons text-red-500 text-5xl mb-4">error_outline</span>
        <h3 class="text-xl font-semibold text-slate-900 mb-2">Terjadi Kesalahan</h3>
        <p class="text-slate-500 mb-8">{{ error }}</p>
        <button @click="loadUserData" class="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto hover:bg-slate-800 transition-all">
          <span class="material-icons text-sm">refresh</span> Coba Lagi
        </button>
      </div>
    </div>

    <!-- ── Main ── -->
    <template v-else-if="userData">

      <!-- HEADER -->
      <div class="relative overflow-hidden bg-slate-900" style="height:260px;">
        <!-- Subtle Pattern -->
        <div class="absolute inset-0 opacity-[0.05]" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 32px 32px;"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>

        <div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 h-full flex flex-col justify-between py-8 relative z-10">
          <div class="flex items-center justify-between">
            <button @click="goBack" class="flex items-center gap-2 text-white/80 hover:text-white font-medium transition-all px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 backdrop-blur-md">
              <span class="material-icons text-[18px]">arrow_back</span>
              <span class="text-[13px]">Back</span>
            </button>
            <router-link :to="{ name: 'Pengaturan', query: { tab: 'profile' } }"
              class="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg bg-blue-600 hover:bg-blue-500 border border-blue-400/30 active:scale-95">
              <span class="material-icons text-[18px]">edit</span>
              <span class="text-[13px]">Edit Profile</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- CONTENT -->
      <div class="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 pb-16" style="margin-top:-80px; position:relative; z-index:20;">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <!-- ── LEFT (SIDEBAR) ── -->
          <div class="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 delay-75">

            <!-- Profile Summary Card -->
            <div class="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-200 relative">
              <div class="h-32 bg-slate-100 relative">
                <div v-if="profileImage" class="absolute inset-0">
                   <img :src="profileImage" class="w-full h-full object-cover blur-xl opacity-20" alt="Banner">
                </div>
                <div v-else class="w-full h-full bg-slate-800"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
              </div>

              <div class="px-6 pb-8">
                <!-- Avatar -->
                <div class="flex justify-center -mt-16 mb-6 relative">
                  <div class="relative group">
                    <div class="w-28 h-28 rounded-3xl overflow-hidden border-8 border-white shadow-xl transition-all duration-300 group-hover:shadow-blue-500/10">
                      <img v-if="profileImage" :src="profileImage" class="w-full h-full object-cover" alt="Profile">
                      <div v-else class="w-full h-full flex items-center justify-center text-white text-4xl font-semibold" :style="avatarGradient">
                        {{ getUserInitial(userData.username) }}
                      </div>
                    </div>
                    <label class="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-xl border-4 border-white hover:bg-blue-600 transition-all z-30">
                      <span class="material-icons text-[18px]">camera_alt</span>
                      <input type="file" class="hidden" accept="image/*" @change="handleImageUpload">
                    </label>
                    <button v-if="profileImage" @click="deleteAvatar"
                      class="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-lg flex items-center justify-center shadow-lg border border-slate-100 hover:text-red-600 transition-all z-30">
                      <span class="material-icons text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <div class="text-center space-y-1">
                  <h2 class="text-xl font-semibold text-slate-800 tracking-tight">{{ userData.name || userData.username }}</h2>
                  <div class="flex items-center justify-center gap-2">
                    <span class="text-blue-600 font-medium text-xs">@{{ userData.username }}</span>
                    <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span class="text-slate-500 text-xs font-normal">{{ userData.jabatan || 'Member' }}</span>
                  </div>
                </div>

                <!-- Simple Stats -->
                <div class="grid grid-cols-2 gap-3 mt-8">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p class="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <div class="flex items-center justify-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass"></span>
                      <span class="text-[11px] font-medium text-slate-700 uppercase tracking-wider">{{ getStatusText(userData.status) }}</span>
                    </div>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p class="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">Role</p>
                    <span class="text-[11px] font-medium text-slate-700 uppercase tracking-wider">{{ userData.role || 'USER' }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- ── RIGHT (MAIN CONTENT) ── -->
          <div class="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">

            <!-- Personal Data Section -->
            <div class="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
              <div class="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div class="flex items-center gap-4">
                </div>
                <router-link :to="{ name: 'Pengaturan', query: { tab: 'profile' } }" class="text-blue-600 hover:text-blue-700 font-medium text-[10px] uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-all">
                  Update <span class="material-icons text-[14px]">chevron_right</span>
                </router-link>
              </div>

              <div class="p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  <div v-for="field in [
                    { label: 'Username', value: userData.username, icon: 'alternate_email', readonly: true },
                    { label: 'Nama Lengkap', value: userData.name || 'Belum diisi', icon: 'person_outline' },
                    { label: 'Alamat Email', value: userData.email || 'Belum diisi', icon: 'mail_outline' },
                    { label: 'Nomor Telepon', value: userData.phone || 'Belum diisi', icon: 'phone_iphone' },
                    { label: 'Jabatan', value: userData.jabatan || 'Belum diisi', icon: 'work_outline' },
                    { label: 'Role Akses', value: userData.role || 'USER', icon: 'verified_user', readonly: true }
                  ]" :key="field.label" class="space-y-1.5 group">
                    <label class="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                      <span class="material-icons text-[14px] group-hover:text-blue-500 transition-colors">{{ field.icon }}</span>
                      {{ field.label }}
                    </label>
                    <div :class="field.readonly ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-white border-slate-200 text-slate-700'" 
                      class="w-full px-5 py-3 rounded-xl text-[13px] font-normal border transition-all flex items-center justify-between">
                      <span class="truncate">{{ field.value }}</span>
                      <span v-if="field.readonly" class="material-icons text-[16px] opacity-30">lock</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Keamanan: 2FA (tersembunyi otomatis bila admin menonaktifkan 2FA) -->
            <TwoFactorSecurityCard standalone @toast="(t) => showToast(t.message, t.type)" />

            <!-- Role Permissions Detail -->
            <div class="bg-white rounded-[24px] shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
              <div class="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-10 transition-all duration-700 group-hover:rotate-12">
                <span class="material-icons text-[120px]">{{ roleInfo.icon }}</span>
              </div>
              
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10 shadow-lg" :style="avatarGradient">
                <span class="material-icons text-white text-3xl">{{ roleInfo.icon }}</span>
              </div>
              
              <div class="flex-1 relative z-10 text-center md:text-left space-y-1">
                <h4 class="text-[15px] font-semibold text-slate-800">{{ roleInfo.title }}</h4>
                <p class="text-slate-500 text-[12px] leading-relaxed font-normal">{{ roleInfo.description }}</p>
              </div>

              <div class="flex-shrink-0 relative z-10">
                 <router-link to="/user-guide" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[12px] font-medium hover:bg-blue-600 transition-all flex items-center gap-2 shadow-sm active:scale-95">
                   User Guide <span class="material-icons text-[16px]">open_in_new</span>
                 </router-link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </template>

    <!-- Toast Component -->
    <transition name="slide-up">
      <div v-if="toast.show"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3.5 text-white rounded-2xl shadow-xl border border-white/10 backdrop-blur-xl"
        :style="toastStyle">
        <span class="material-icons text-[20px]">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
        <span class="text-[13px] font-medium tracking-wide">{{ toast.message }}</span>
      </div>
    </transition>

  </div>
</template>

<script>
import { getCurrentUser, uploadMyAvatar, deleteMyAvatar } from '@/services/user.js';
import TwoFactorSecurityCard from '@/components/TwoFactorSecurityCard.vue';

export default {
  name: 'MyAccount',
  components: { TwoFactorSecurityCard },

  data() {
    return {
      userData:     null,
      profileImage: null,
      loading:      false,
      error:        null,
      toast: { show: false, message: '', type: 'success' }
    };
  },

  computed: {
    avatarGradient() {
      const role = this.userData?.role;
      if (role === 'ADMIN')    return 'background:#1e293b;';
      if (role === 'APPROVER') return 'background:#334155;';
      return 'background:#3b82f6;';
    },

    statusDotClass() {
      const status = this.userData?.status;
      if (status === 1 || status === true  || status === 'ACTIVE')  return 'bg-emerald-500 animate-pulse';
      if (status === 3 || status === 'FREEZE')                      return 'bg-blue-400';
      if (status === 4 || status === 'BLOCKED')                     return 'bg-red-500';
      return 'bg-orange-400';
    },

    toastStyle() {
      if (this.toast.type === 'success') return 'background: rgba(16, 185, 129, 0.9);';
      if (this.toast.type === 'error')   return 'background: rgba(225, 29, 72, 0.9);';
      return 'background: rgba(15, 23, 42, 0.9);';
    },

    roleInfo() {
      const role = this.userData?.role;
      if (role === 'ADMIN') return {
        icon:        'shield',
        title:       'Admin Control Panel',
        description: 'As an admin, you have full access to manage users, delete documents, and view activities.'
      };
      if (role === 'APPROVER') return {
        icon:        'verified',
        title:       'Approver Hub',
        description: 'As an Approver, you are responsible for reviewing and making decisions on documents.'
      };
      return {
        icon:        'person',
        title:       'User Access',
        description: 'You can manage your personal documents, submit applications, and track status.'
      };
    }
  },

  mounted() {
    this.loadUserData();
  },

  methods: {
    normalizeAvatarUrl(url) {
      if (!url) return null;
      if (url.startsWith('blob:')) return url;
      if (url.startsWith('http')) {
        try { return new URL(url).pathname; } catch { return url; }
      }
      return url.startsWith('/') ? url : '/' + url;
    },

    getUserInitial(username) {
      if (!username) return '?';
      return username.charAt(0).toUpperCase();
    },

    getStatusText(status) {
      if (status === 1 || status === true  || status === 'ACTIVE')   return 'Aktif';
      if (status === 2 || status === false || status === 'INACTIVE') return 'Nonaktif';
      if (status === 3 || status === 'FREEZE')                       return 'Freeze';
      if (status === 4 || status === 'BLOCKED')                      return 'Diblokir';
      return 'Aktif';
    },

    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        this.showToast('Ukuran file maksimal 2MB', 'error');
        event.target.value = '';
        return;
      }
      const localPreview = URL.createObjectURL(file);
      this.profileImage = localPreview;
      try {
        const result = await uploadMyAvatar(file);
        const rawUrl = result?.avatarUrl || result?.data?.avatarUrl || result?.data?.avatar;
        if (rawUrl) {
          const normalizedUrl = this.normalizeAvatarUrl(rawUrl);
          this.profileImage = normalizedUrl + '?t=' + Date.now();
          if (this.userData) this.userData.avatarUrl = rawUrl;
          URL.revokeObjectURL(localPreview);
        }
        this.showToast('Foto profil diperbarui', 'success');
      } catch (err) {
        URL.revokeObjectURL(localPreview);
        this.profileImage = null;
        this.showToast('Gagal mengupload foto profil', 'error');
      }
      event.target.value = '';
    },

    async deleteAvatar() {
      if (!this.profileImage) return;
      if (!confirm('Hapus foto profil?')) return;
      try {
        await deleteMyAvatar();
        this.profileImage = null;
        if (this.userData) this.userData.avatarUrl = null;
        this.showToast('Foto profil dihapus', 'success');
      } catch (err) {
        this.showToast('Gagal menghapus foto profil', 'error');
      }
    },

    async loadUserData() {
      try {
        this.loading = true;
        this.error   = null;
        const rawData = await getCurrentUser();
        this.userData = {
          ...rawData,
          name:    rawData.fullName || rawData.name    || '',
          phone:   rawData.phone    || '',
          jabatan: rawData.position || rawData.jabatan  || '',
          role:    Array.isArray(rawData.roles)
                    ? rawData.roles[0].toUpperCase()
                    : (rawData.role || 'USER').toUpperCase(),
        };
        if (this.userData.avatarUrl) {
          this.profileImage = this.normalizeAvatarUrl(this.userData.avatarUrl) + '?t=' + Date.now();
        }
      } catch (err) {
        this.error = 'Gagal memuat data profil.';
      } finally {
        this.loading = false;
      }
    },

    goBack() { this.$router.go(-1); },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => (this.toast.show = false), 3000);
    }
  }
};
</script>

<style scoped>
.animate-in {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.slide-up-enter-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.slide-up-leave-active { transition: all 0.2s ease-in; }
.slide-up-enter-from   { transform: translate(-50%, 40px); opacity: 0; }
.slide-up-leave-to     { transform: translate(-50%, 40px); opacity: 0; }

.delay-75 { animation-delay: 0.075s; }
.delay-150 { animation-delay: 0.15s; }
</style>