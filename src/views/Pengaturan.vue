<template>
  <div class="min-h-screen bg-[#F1F5F9] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 text-slate-900 transition-all duration-300" >
    <div class="max-w-[1440px] mx-auto">
      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 tracking-tight" > {{ $t('settings.title') }}</h1>
          <p class="text-slate-500 text-[13px] font-normal" >{{ $t('settings.subtitle') }}</p>
        </div>
      </div>

      <!-- LOADING STATE -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600 font-medium">{{ $t('common.loading') }}</p>
        </div>
      </div>

      <!-- ERROR STATE -->
      <div v-else-if="error" class="bg-white border border-red-100 rounded-xl p-6 text-center max-w-lg mx-auto">
        <span class="material-icons text-red-500 text-4xl mb-3">error_outline</span>
        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ $t('common.error') }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
        <button @click="loadUserData" class="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-all">
          {{ activeLanguage === 'id' ? 'Coba Lagi' : 'Retry' }}
        </button>
      </div>

      <!-- MAIN CONTENT -->
      <template v-else-if="userData">
        <div class="flex flex-col lg:flex-row gap-8 mt-4">

          <!-- Sidebar Tabs -->
          <div class="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-col gap-2 lg:gap-1.5 lg:w-64">
            <button
              v-for="tab in tabs" :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                currentTab === tab.id
                  ? 'bg-zinc-800 text-white shadow-[0_4px_16px_-4px_rgba(37,99,235,0.3)] border border-zinc-700/60'
                  : 'bg-[#09090b]/5 text-zinc-500 border border-zinc-200/60 hover:bg-zinc-800/8 hover:text-zinc-700'
              ]"
              class="relative flex items-center justify-center lg:justify-start gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 outline-none group w-full"
              
            >
              <!-- Indikator aktif kiri - Hanya di Desktop -->
              <div
                v-if="currentTab === tab.id"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] hidden lg:block"
              ></div>

              <span
                class="material-icons text-[20px] flex-shrink-0 transition-colors duration-200"
                :class="currentTab === tab.id ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-600'"
              >{{ tab.icon }}</span>

              <span
                class="text-[12px] lg:text-[13px] font-normal transition-all duration-200 truncate"
                :class="currentTab === tab.id ? 'font-medium text-white' : 'text-zinc-500 group-hover:text-zinc-700'"
              >{{ getTabLabel(tab.id) }}</span>

              <!-- Indikator aktif kanan (Dot) - Hanya di Desktop -->
              <div
                v-if="currentTab === tab.id"
                class="ml-auto h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0 shadow-[0_0_8px_#3b82f6] hidden lg:block"
              ></div>
            </button>
          </div>

          <div class="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 relative overflow-hidden">

            <!-- TAB: PROFILE -->
            <div v-if="currentTab === 'profile'" class="space-y-6">
              <div class="flex items-center gap-3 mb-2 border-b border-slate-100 pb-4">
                <span class="material-icons text-slate-400">person_outline</span>
                <h3 class="text-[16px] font-semibold text-slate-900" >{{ $t('settings.profile.editTitle') }}</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div class="space-y-1.5">
                  <label class="text-[11px] font-medium text-slate-400 uppercase tracking-widest px-1" >{{ $t('settings.profile.fullName') }}</label>
                  <input 
                    type="text" 
                    v-model="editForm.fullName"
                    :placeholder="$t('settings.profile.fullNamePlaceholder')"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal outline-none focus:bg-white focus:border-blue-500 transition-all" 
                  >
                </div>

                <!-- Phone -->
                <div class="space-y-1.5">
                  <label class="text-[11px] font-medium text-slate-400 uppercase tracking-widest px-1" >{{ $t('settings.profile.phone') }}</label>
                  <input 
                    type="text" 
                    v-model="editForm.phone"
                    :placeholder="$t('settings.profile.phonePlaceholder')"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal outline-none focus:bg-white focus:border-blue-500 transition-all" 
                  >
                </div>
              </div>

              <div class="pt-4 flex items-center gap-3">
                <button
                  @click="saveProfileUpdate"
                  :disabled="isSaving"
                  class="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium text-[12px] hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                  
                >
                  <span v-if="isSaving" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {{ isSaving ? $t('settings.profile.saving') : $t('settings.profile.saveChanges') }}
                </button>
                <button
                  @click="resetForm"
                  class="px-6 py-3 text-slate-400 font-normal text-[12px] hover:text-slate-600 transition-all" 
                >
                  {{ $t('settings.profile.reset') }}
                </button>
              </div>
            </div>

            <!-- TAB: GENERAL -->
            <div v-else-if="currentTab === 'general'" class="space-y-6">
              <div class="flex items-center gap-3 mb-2 border-b border-slate-100 pb-4">
                <span class="material-icons text-slate-400">notifications_none</span>
                <h3 class="text-[16px] font-semibold text-slate-900" >{{ $t('settings.notifications.title') }}</h3>
              </div>

              <div class="space-y-4">
                <!-- Email -->
                <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span class="material-icons text-blue-500">email</span>
                  <div class="flex-1">
                    <p class="font-medium text-[13px] text-slate-800" >{{ $t('settings.notifications.emailTitle') }}</p>
                    <p class="text-[11px] text-slate-500 font-normal" >{{ $t('settings.notifications.emailDesc') }}</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="settings.notifEmail" class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-slate-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                  </label>
                </div>

                <!-- WhatsApp -->
                <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span class="material-icons text-emerald-500">chat</span>
                  <div class="flex-1">
                    <p class="font-medium text-[13px] text-slate-800" >{{ $t('settings.notifications.whatsappTitle') }}</p>
                    <p class="text-[11px] text-slate-500 font-normal" >{{ $t('settings.notifications.whatsappDesc') }}</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="settings.notifWhatsapp" @change="handleWhatsappToggle" class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                  </label>
                </div>
              </div>

              <div class="pt-4">
                <button @click="saveGeneralSettings" class="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium text-[12px] hover:bg-slate-800 transition-all" >
                  {{ $t('settings.notifications.save') }}
                </button>
              </div>
            </div>

            <!-- TAB: SECURITY -->
            <div v-else-if="currentTab === 'security'" class="space-y-6">
              <div class="flex items-center gap-3 mb-2 border-b border-slate-100 pb-4">
                <span class="material-icons text-slate-400">lock_outline</span>
                <h3 class="text-[16px] font-semibold text-slate-900" >{{ $t('settings.security.title') }}</h3>
              </div>
              
              <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div class="xl:col-span-8">
                  <PasswordSettings @change-password="handlePasswordChange" />
                </div>
                <div class="xl:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h5 class="text-[11px] font-medium uppercase tracking-widest text-slate-400 mb-4" >{{ $t('settings.security.requirements') }}</h5>
                  <ul class="space-y-3">
                    <li class="flex items-center gap-2 text-[12px] text-slate-600 font-normal" >
                      <span class="material-icons text-emerald-500 text-sm">check_circle</span> {{ $t('settings.security.reqLength') }}
                    </li>
                    <li class="flex items-center gap-2 text-[12px] text-slate-600 font-normal" >
                      <span class="material-icons text-emerald-500 text-sm">check_circle</span> {{ $t('settings.security.reqCase') }}
                    </li>
                    <li class="flex items-center gap-2 text-[12px] text-slate-600 font-normal" >
                      <span class="material-icons text-emerald-500 text-sm">check_circle</span> {{ $t('settings.security.reqSymbol') }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 2FA (self-service) -->
              <TwoFactorSecurityCard @toast="(t) => showToast(t.message, t.type)" />
            </div>

            <!-- TAB: LANGUAGE -->
            <div v-else-if="currentTab === 'language'" class="space-y-6">
              <div class="flex items-center gap-3 mb-2 border-b border-slate-100 pb-4">
                <span class="material-icons text-slate-400">language</span>
                <h3 class="text-[16px] font-semibold text-slate-900" >
                  {{ $t('settings.language.title') }}
                </h3>
              </div>

              <div class="space-y-1.5">
                <p class="text-[13px] text-slate-500 font-normal" >
                  {{ $t('settings.language.subtitle') }}
                </p>
              </div>

              <!-- Grid cards for ID and EN -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <!-- Option: ID -->
                <button 
                  @click="changeLanguage('id')"
                  class="group flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-all duration-300 relative outline-none overflow-hidden w-full"
                  :class="activeLanguage === 'id' 
                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20' 
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-200'"
                >
                  <div v-if="activeLanguage === 'id'" class="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
                  
                  <div 
                    class="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black text-blue-600 flex-shrink-0 transition-colors shadow-sm bg-blue-50/50"
                  >
                    ID
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-800" >
                      {{ $t('settings.language.idLabel') }}
                    </p>
                    <p class="text-[11px] text-slate-400 mt-0.5" >
                      {{ activeLanguage === 'id' ? '' : '' }}
                    </p>
                  </div>
                  
                  <!-- Checked Icon -->
                  <div v-if="activeLanguage === 'id'" class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-blue-500/30">
                    <span class="material-icons text-[14px]">check</span>
                  </div>
                </button>

                <!-- Option: EN -->
                <button 
                  @click="changeLanguage('en')"
                  class="group flex items-center gap-4 p-5 rounded-2xl border-2 text-left cursor-pointer transition-all duration-300 relative outline-none overflow-hidden w-full"
                  :class="activeLanguage === 'en' 
                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20' 
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-200'"
                >
                  <div v-if="activeLanguage === 'en'" class="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
                  
                  <div 
                    class="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black text-blue-600 flex-shrink-0 transition-colors shadow-sm bg-blue-50/50"
                  >
                    EN
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-800" >
                      {{ $t('settings.language.enLabel') }}
                    </p>
                    <p class="text-[11px] text-slate-400 mt-0.5" >
                      {{ activeLanguage === 'id' ? '' : '' }}
                    </p>
                  </div>
                  
                  <!-- Checked Icon -->
                  <div v-if="activeLanguage === 'en'" class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-blue-500/30">
                    <span class="material-icons text-[14px]">check</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- TAB: DANGER ZONE -->
            <div v-else-if="currentTab === 'danger'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div class="flex items-center gap-3 mb-2 border-b border-slate-100 pb-4">
                <span class="material-icons text-rose-500">report_problem</span>
                <h3 class="text-[16px] font-semibold text-slate-900" >{{ $t('settings.danger.title') }}</h3>
              </div>

              <div class="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-start gap-4">
                <div class="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0 text-rose-600">
                  <span class="material-icons text-2xl">warning</span>
                </div>
                <div class="space-y-1 flex-1">
                  <h4 class="text-sm font-semibold text-rose-900" >{{ $t('settings.danger.warningTitle') }}</h4>
                  <p class="text-xs text-rose-700 leading-relaxed font-normal" >
                    {{ $t('settings.danger.warningDesc') }}
                  </p>
                  <ul class="list-disc list-inside text-[11px] text-rose-700 space-y-1 mt-2 font-normal">
                    <li>{{ $t('settings.danger.bullet1') }}</li>
                    <li>{{ $t('settings.danger.bullet2') }}</li>
                    <li>{{ $t('settings.danger.bullet3') }}</li>
                  </ul>
                </div>
              </div>

              <!-- Password Verification Form -->
              <div class="space-y-4 max-w-lg mt-6">
                <div class="space-y-1.5 relative">
                  <label class="text-[11px] font-medium text-slate-500 uppercase tracking-widest px-1" >{{ $t('settings.danger.passwordVerify') }}</label>
                  <div class="relative">
                    <input 
                      :type="deleteForm.showPassword ? 'text' : 'password'" 
                      v-model="deleteForm.password"
                      :placeholder="$t('settings.danger.passwordPlaceholder')"
                      class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal outline-none focus:bg-white focus:border-rose-500 transition-all" 
                    >
                    <button 
                      type="button"
                      @click="deleteForm.showPassword = !deleteForm.showPassword" 
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    >
                      <span class="material-icons text-[20px]">{{ deleteForm.showPassword ? 'visibility_off' : 'visibility' }}</span>
                    </button>
                  </div>
                </div>

                <div class="pt-2">
                  <button
                    @click="triggerDeleteAccount"
                    :disabled="!deleteForm.password"
                    class="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-medium text-[12px] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-rose-600/10" 
                  >
                    <span class="material-icons text-[16px]">delete_forever</span>
                    {{ $t('settings.danger.deleteButton') }}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </template>

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
                {{ $t('settings.danger.modalTitle') }}
              </p>
              <p class="text-xs text-slate-500 text-center leading-relaxed font-normal px-2" >
                {{ activeLanguage === 'id' ? 'Untuk mengonfirmasi penghapusan, silakan ketik kata kunci' : 'To confirm deletion, please type the keyword' }} <span class="font-bold text-rose-600">{{ activeLanguage === 'id' ? 'HAPUS' : 'DELETE' }}</span> {{ activeLanguage === 'id' ? 'di bawah ini.' : 'below.' }}
              </p>
            </div>

            <!-- Input Box -->
            <div class="mx-8 mb-5">
              <input
                type="text"
                v-model="deleteConfirmText"
                :placeholder="activeLanguage === 'id' ? 'Ketik HAPUS untuk konfirmasi' : 'Type DELETE to confirm'"
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
                {{ $t('settings.danger.modalCancel') }}
              </button>
              <button
                @click="executeDeleteAccount"
                :disabled="(activeLanguage === 'id' ? deleteConfirmText !== 'HAPUS' : deleteConfirmText !== 'DELETE') || isDeleting"
                class="flex-[1.4] py-3.5 rounded-[14px] bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/10"
                
              >
                <span v-if="isDeleting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span class="material-icons text-sm" v-else>delete_forever</span>
                {{ $t('settings.danger.modalConfirm') }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Toast -->
      <transition name="slide-fade">
        <div v-if="toast.show"
             :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'"
             class="fixed bottom-6 right-6 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3">
            <span class="material-icons text-[20px]">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
            <span class="text-sm font-medium" >{{ toast.message }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import PasswordSettings from '@/components/PasswordSettings.vue';
import TwoFactorSecurityCard from '@/components/TwoFactorSecurityCard.vue';
import permohonanService from '@/services/permohonanService';
import {
  getCurrentUser,
  updateMyProfile,
  changeMyPassword,
  deleteMyAccount
} from '@/services/user.js';
import { useAuthStore } from '@/stores/authStore';
import { useLangStore } from '@/stores/langStore';

export default {
  name: 'PengaturanAkun',
  components: { PasswordSettings, TwoFactorSecurityCard },
  data() {
    return {
      currentTab: 'profile',
      tabs: [
        { id: 'profile',  name: 'Profile',     icon: 'person_outline' },
        { id: 'general',  name: 'Notifications', icon: 'notifications_none' },
        { id: 'security', name: 'Security',   icon: 'verified_user' },
        { id: 'language', name: 'Language',   icon: 'language' },
        { id: 'danger',   name: 'Danger Zone', icon: 'report_problem' }
      ],
      userData: null,
      loading: false,
      error: null,
      settings: {
        notifEmail: false,
        notifWhatsapp: false,
        notifPush: true
      },
      editForm: {
        fullName: '',
        phone: ''
      },
      deleteForm: {
        password: '',
        showPassword: false
      },
      showDeleteConfirmModal: false,
      deleteConfirmText: '',
      isSaving: false,
      isDeleting: false,
      toast: { show: false, message: '', type: 'success' }
    };
  },
  computed: {
    activeLanguage() {
      return useLangStore().lang;
    }
  },
  mounted() {
    this.loadUserData();
    if (this.$route.query.tab) {
      this.currentTab = this.$route.query.tab;
    }
  },
  methods: {
    getTabLabel(id) {
      if (id === 'profile') return this.$t('settings.tabProfile');
      if (id === 'general') return this.$t('settings.tabNotifications');
      if (id === 'security') return this.$t('settings.tabSecurity');
      if (id === 'language') return this.$t('settings.tabLanguage');
      if (id === 'danger') return this.$t('settings.tabDanger');
      return id;
    },
    changeLanguage(lang) {
      const langStore = useLangStore();
      langStore.setLanguage(lang);
      const toastMsg = lang === 'id' ? 'Bahasa diubah ke Bahasa Indonesia' : 'Language changed to English';
      this.showToast(toastMsg);
    },
    async loadUserData() {
      try {
        this.loading = true;
        const data = await getCurrentUser();
        this.userData = data;
        this.editForm.fullName = data.fullName || data.name || '';
        this.editForm.phone = data.phone || '';
        await this.loadNotificationPreference();
      } catch (err) {
        this.error = this.activeLanguage === 'id' ? 'Gagal memuat data pengguna.' : 'Failed to load user data.';
      } finally {
        this.loading = false;
      }
    },
    async saveProfileUpdate() {
      if (!this.editForm.fullName.trim()) {
        this.showToast(this.$t('settings.profile.nameRequired'), 'error');
        return;
      }
      try {
        this.isSaving = true;
        await updateMyProfile({
          fullName: this.editForm.fullName,
          phone: this.editForm.phone
        });
        this.showToast(this.$t('settings.profile.updateSuccess'));
        await this.loadUserData();
      } catch (err) {
        this.showToast(this.$t('settings.profile.updateFailed'), 'error');
      } finally {
        this.isSaving = false;
      }
    },
    resetForm() {
      this.editForm.fullName = this.userData.fullName || this.userData.name || '';
      this.editForm.phone = this.userData.phone || '';
    },
    async handlePasswordChange(passwords) {
      try {
        await changeMyPassword({
          currentPassword: passwords.current,
          newPassword: passwords.new
        });
        this.showToast(this.$t('settings.security.saveSuccess'));
      } catch (err) {
        this.showToast(err.response?.data?.message || this.$t('settings.security.saveFailed'), 'error');
      }
    },
    async loadNotificationPreference() {
      try {
        const pref = await permohonanService.getNotificationPreference();
        this.settings.notifEmail = !!pref.notifEmail;
        this.settings.notifWhatsapp = !!pref.notifWhatsapp;
      } catch (err) {}
    },
    handleWhatsappToggle() {
      if (this.settings.notifWhatsapp) {
        const phone = '6285260921669';
        const message = 'halo authorix,saya ingin mengaktifkan notif WhatsApp mohon konfirmasinya.';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      }
    },
    async saveGeneralSettings() {
      try {
        await permohonanService.updateNotificationPreference(this.settings);
        this.showToast(this.$t('settings.notifications.saveSuccess'));
      } catch (err) {
        this.showToast(this.$t('settings.notifications.saveFailed'), 'error');
      }
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => (this.toast.show = false), 3000);
    },
    triggerDeleteAccount() {
      if (!this.deleteForm.password) {
        this.showToast(this.$t('settings.danger.passwordRequired'), 'error');
        return;
      }
      this.showDeleteConfirmModal = true;
    },
    cancelDeleteAccount() {
      this.showDeleteConfirmModal = false;
      this.deleteConfirmText = '';
    },
    async executeDeleteAccount() {
      const confirmWord = this.activeLanguage === 'id' ? 'HAPUS' : 'DELETE';
      if (this.deleteConfirmText !== confirmWord) return;
      try {
        this.isDeleting = true;
        await deleteMyAccount(this.deleteForm.password);
        this.showToast(this.$t('settings.danger.deleteSuccess'));
        
        // Bersihkan sesi dan arahkan ke login
        const authStore = useAuthStore();
        authStore.clearAuth();
        
        setTimeout(() => {
          this.$router.push({ name: 'Login' });
        }, 1500);
      } catch (err) {
        const errorMsg = err.response?.data?.message || this.$t('settings.danger.deleteFailed');
        this.showToast(errorMsg, 'error');
        this.cancelDeleteAccount();
      } finally {
        this.isDeleting = false;
      }
    }
  }
};
</script>

<style scoped>
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(20px); opacity: 0; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>