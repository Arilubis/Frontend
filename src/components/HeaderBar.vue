<template>
  <header
    class="w-full h-14 flex items-center justify-between 
           bg-[#09090b] text-white shadow-[0_4px_30px_rgba(0,0,0,0.5)] 
           border-b border-zinc-800 sticky top-0 z-40 px-4"
  >

    <div v-if="isLoggingOut" class="absolute bottom-0 left-0 h-[2px] bg-blue-500 z-50 animate-progress-loading"></div>

    <transition name="fade">
      <div v-if="isLoggingOut" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center border-t border-blue-500/30">
        <div class="flex flex-col items-center gap-4 bg-zinc-900/80 p-8 rounded-3xl border border-zinc-800 shadow-2xl scale-95 animate-pulse">
          <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="text-center">
          <h3 class="text-lg font-bold text-white uppercase tracking-widest">{{ $t('header.disconnecting') }}</h3>
          <p class="text-xs text-zinc-400 mt-1 italic">{{ $t('header.pleaseWait') }}</p>
          </div>
        </div>
      </div>
    </transition>

    <div class="flex items-center space-x-4">
      <button
        @click="$emit('toggleSidebar')"
        class="hidden md:flex p-2 rounded-xl transition-all duration-200 active:scale-90 border border-transparent cursor-pointer group"
        :class="isSidebarOpen 
          ? 'bg-zinc-800 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      
      <h1 class="text-base font-semibold tracking-tight hidden md:block select-none">
        <span class="text-white "> Authorix System</span>
      </h1>
    </div>

    <div class="flex items-center space-x-6">
      <!-- Switch Role Button for Admin with Approver role -->
      <button
        v-if="canSwitchRole"
        @click="toggleMode"
        class="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 active:scale-95 cursor-pointer border backdrop-blur-md shadow-lg"
        :style="currentActiveRole === 'ADMIN'
          ? 'background: rgba(37,99,235,0.1); color: #60a5fa; border-color: rgba(59,130,246,0.3);'
          : 'background: rgba(16,185,129,0.1); color: #34d399; border-color: rgba(16,185,129,0.3);'"
      >
        <span class="material-icons text-[16px]">
          {{ currentActiveRole === 'ADMIN' ? 'swap_horiz' : 'shield' }}
        </span>
        <span>
          {{ currentActiveRole === 'ADMIN' ? $t('header.approverMode') : $t('header.backToAdmin') }}
        </span>
      </button>

      <div class="relative" v-click-outside="closeUserMenu">
        <button 
          @click="toggleUserMenu"
          class="group flex items-center gap-3 p-1 pr-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800 transition-all duration-300 active:scale-95 cursor-pointer shadow-lg ring-1 ring-white/5"
        >
          <!-- Avatar -->
          <div class="w-9 h-9 flex items-center justify-center rounded-xl overflow-hidden">
            <img 
              v-if="userData.foto || userData.avatar" 
              :src="userData.foto || userData.avatar" 
              alt="Avatar" 
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full bg-blue-600 flex items-center justify-center">
              <span 
                 
                class="text-[13px] font-bold text-white leading-none select-none">
                {{ userInitials }}
              </span>
            </div>
          </div>
          <!-- Name + Role -->
          <div class="text-left hidden lg:block">
            <p class="text-[12px] font-medium text-white leading-none truncate max-w-[110px]">
              {{ displayName.split(' ')[0] }}
            </p>
            <p 
              class="text-[10px] font-normal mt-1 uppercase tracking-wider transition-colors"
              :class="displayRole.toLowerCase() === 'admin' ? 'text-blue-400' : 'text-zinc-500'"
            >
              {{ displayRole }}
            </p>
          </div>
          <!-- Chevron -->
          <svg 
            class="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-transform duration-300" 
            :class="{ 'rotate-180': userMenu }" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <transition name="fade-scale">
          <div
            v-if="userMenu"
            class="user-dropdown absolute right-0 mt-3 w-64 bg-[#0c0c0e] border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-2 z-50 overflow-hidden ring-1 ring-white/5"
          >
            <!-- Header User Info -->
            <div class="px-4 py-4 border-b border-zinc-800/50 mb-1 bg-gradient-to-b from-zinc-900/40 to-transparent">
              <div class="flex items-center gap-2 mb-2">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border"
                  :class="displayRole.toLowerCase() === 'admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'"
                >
                  {{ displayRole }}
                </span>
              </div>
              <p class="text-sm font-medium text-white truncate">{{ displayName }}</p>
              <p class="text-[11px] text-zinc-500 truncate mt-0.5">{{ userData.email || 'sesi aktif' }}</p>
            </div>
            
            <!-- Menu Items -->
            <div class="px-2 py-1 space-y-1">
              <router-link 
                to="/my-account" 
                @click="userMenu = false" 
                class="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:bg-blue-600/10 hover:text-blue-400 rounded-xl transition-all group cursor-pointer"
              >
                <div class="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                  <span class="material-icons text-[18px]">person_outline</span>
                </div>
                <span class="font-normal text-[13px]">{{ activeLanguage === 'id' ? 'Akun Saya' : 'My Account' }}</span>
              </router-link>

              <router-link 
                :to="{ name: 'Pengaturan' }" 
                @click="userMenu = false" 
                class="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:bg-blue-600/10 hover:text-blue-400 rounded-xl transition-all group cursor-pointer"
              >
                <div class="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                  <span class="material-icons text-[18px]">tune</span>
                </div>
                <span class="font-normal text-[13px]">{{ $t('sidebar.settings') }}</span>
              </router-link>
            </div>

            <!-- Logout -->
            <div class="border-t border-zinc-800 mt-2 p-2">
              <button 
                @click="handleLogout" 
                :disabled="isLoggingOut"
                class="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200 group active:scale-95 cursor-pointer"
              >
                <div class="w-8 h-8 rounded-lg bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <span v-if="isLoggingOut" class="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></span>
                  <span v-else class="material-icons text-[18px]">power_settings_new</span>
                </div>
                <span class="font-medium text-[13px]">{{ isLoggingOut ? (activeLanguage === 'id' ? 'Memutus...' : 'Disconnecting...') : (activeLanguage === 'id' ? 'Keluar' : 'Log Out') }}</span>
              </button>
            </div>
          </div>
        </transition>
      </div>

    </div>
  </header>
</template>
<script>

import api from '@/services/api';
import permohonanService from '@/services/permohonanService';
import { useAuthStore } from '@/stores/authStore';

export default {
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    },
  },

  props: {
    isSidebarOpen: Boolean
  },

  data() {
    return {
      userMenu: false,
      searchQuery: '',
      searchResults: [],
      showResults: false,
      isSearching: false,
      searchTimeout: null,
      isLoggingOut: false,
      userData: JSON.parse(localStorage.getItem('user') || '{}')
    };
  },

  computed: {
    activeLanguage() {
      return this.$langStore ? this.$langStore.lang : 'id';
    },
    userInitials() {          
      try {
        const name = this.userData.full_name 
                  || this.userData.fullName 
                  || this.userData.name 
                  || this.userData.username 
                  || '?';
        // Ambil HANYA huruf pertama dari nama depan saja
        return name.trim().charAt(0).toUpperCase();
      } catch {
        return '?';
      }
    },

    displayName() {
      return (
        this.userData.full_name ||
        this.userData.fullName ||
        this.userData.name ||
        this.userData.username ||
        'Pengguna'
      );
    },

    displayRole() {
      const authStore = useAuthStore();
      return authStore.role || 'User';
    },

    canSwitchRole() {
      const roles = this.userData.roles || [];
      return roles.includes('ADMIN') && roles.includes('APPROVER');
    },

    currentActiveRole() {
      const authStore = useAuthStore();
      return authStore.role;
    }
  },

  methods: {
    handleClickOutside(event) {
      const searchDropdown = this.$el.querySelector('.search-dropdown');
      const searchInput = this.$el.querySelector('.search-input');
      
      if (searchDropdown && !searchDropdown.contains(event.target) && !searchInput.contains(event.target)) {
        this.closeSearch();
      }
      
      const userDropdown = this.$el.querySelector('.user-dropdown');
      const userButton = this.$el.querySelector('.user-button');
      
      if (userDropdown && !userDropdown.contains(event.target) && userButton && !userButton.contains(event.target)) {
        this.closeUserMenu();
      }
    },

    toggleUserMenu() {
      this.userMenu = !this.userMenu;
    },

    closeUserMenu() {
      this.userMenu = false;
    },

    handleKeyDown(e) {
      if (e.key === 'Escape') this.closeUserMenu();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.$el.querySelector('.search-input')?.focus();
      }
    },

    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      if (this.searchQuery.trim().length === 0) {
        this.searchResults = [];
        this.showResults = false;
        return;
      }
      
      this.showResults = true;
      this.isSearching = true;
      
      this.searchTimeout = setTimeout(async () => {
        await this.performSearch();
      }, 200);
    },

    async performSearch() {
      if (this.searchQuery.trim().length === 0) {
        this.searchResults = [];
        this.isSearching = false;
        return;
      }
      
      try {
        this.isSearching = true;
        
        console.log('🔍 Searching for:', this.searchQuery);
        
        const response = await permohonanService.searchPermohonan(this.searchQuery);
        
        console.log('✅ Search response:', response);
        
        const results = response.data || [];

        console.log('📦 Raw results count:', results.length);
        console.log('📦 Raw results titles:', results.map(d => d.title));
        
        this.searchResults = results.map(doc => {
          const categoryName = 
            doc.categoryName || 
            doc.category?.name || 
            doc.categoryInfo?.name || 
            'No Category';
          const creatorName = 
            doc.creatorName || 
            doc.creator?.name || 
            doc.creator?.fullName || 
            doc.creator?.username ||
            doc.creatorInfo?.name ||
            doc.creatorInfo?.fullName ||
            doc.userName ||
            'Unknown';
          
          return {
            id: doc.id,
            title: doc.title,
            description: doc.description,
            status: doc.status,
            categoryName: categoryName,
            creatorName: creatorName
          };
        });
        
        console.log('✅ Mapped results:', this.searchResults.length);
        console.log('📋 Mapped titles:', this.searchResults.map(d => d.title));
        
        if (this.searchResults.length > 0 && this.searchResults.length <= 10) {
          console.log('📊 ALL RESULTS:');
          this.searchResults.forEach((result, index) => {
            console.log(`  ${index + 1}. ${result.title} (${result.status})`);
          });
        }
      } catch (error) {
        console.error('❌ Search error:', error);
        this.searchResults = [];
      } finally {
        this.isSearching = false;
      }
    },

    navigateToDetail(docId) {
      console.log('📄 Navigating to document:', docId);
      this.showResults = false;
      this.searchQuery = '';
      this.searchResults = [];
      this.$router.push({
        name: 'ViewDocumentDetail',
        params: { id: docId }
      });
    },
    
    closeSearch() {
      this.showResults = false;
    },

    getStatusClass(status) {
      const statusMap = {
        'DRAFT': 'bg-slate-700 text-slate-300',
        'PENDING': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        'APPROVED': 'bg-green-500/20 text-green-400 border border-green-500/30',
        'REJECTED': 'bg-red-500/20 text-red-400 border border-red-500/30',
        'IN_REVIEW': 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        'ARCHIVED': 'bg-slate-600/20 text-slate-400 border border-slate-600/30'
      };
      
      return statusMap[status] || 'bg-slate-700 text-slate-300';
    },

    async handleLogout() {
      if (this.isLoggingOut) return;
      this.isLoggingOut = true;
      this.userMenu = false;
      
      try {
        await api.post('/auth/logout');
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Logout failed:", error);
        localStorage.removeItem("user");
      } finally {
        setTimeout(() => {
          this.isLoggingOut = false;
          this.userMenu = false;
          this.$router.replace({ name: 'Login' });
        }, 800);
      }
    },

    toggleMode() {
      const authStore = useAuthStore();
      const newRole = authStore.role === 'ADMIN' ? 'APPROVER' : 'ADMIN';
      authStore.switchRole(newRole);
      this.userMenu = false;
      
      console.log("Mode beralih ke:", newRole);
      
      if (newRole === 'ADMIN') {
        this.$router.push({ name: 'AdminDashboard' });
      } else {
        this.$router.push({ name: 'ApproverV2' }); // ApproverV2 is /v2-approver (UnifiedApproverHub)
      }
    }
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('keydown', this.handleKeyDown);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
};
</script>

<style scoped>

header {
  /* Pakai Poppins dari style.css global */
  letter-spacing: -0.01em;
}

@keyframes loading-bar {
  0% { width: 0%; left: 0%; }
  50% { width: 70%; left: 15%; }
  100% { width: 100%; left: 0%; }
}
.animate-progress-loading {
  animation: loading-bar 2s ease-in-out infinite;
}
.fade-scale-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-scale-leave-active {
  transition: all 0.2s ease-in;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(-15px) scale(0.92);
  filter: blur(4px);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
  filter: blur(4px);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.max-h-96::-webkit-scrollbar {
  width: 6px;
}
.max-h-96::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 10px;
}
.max-h-96::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.4);
  border-radius: 10px;
}
.max-h-96::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.6);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
button, .router-link-active, a {
  cursor: pointer;
}
</style>