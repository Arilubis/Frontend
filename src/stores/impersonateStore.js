import { defineStore } from 'pinia';
import impersonateService from '@/services/impersonateService';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';
import Swal from 'sweetalert2';

export const useImpersonateStore = defineStore('impersonate', {
  state: () => {
    let savedState = null;
    try {
      const raw = localStorage.getItem('impersonate_state');
      if (raw) savedState = JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse impersonate_state:', e);
    }

    return {
      isImpersonating: savedState?.isImpersonating || false,
      mode: savedState?.mode || null, // 'READ_ONLY' | 'FULL_ACCESS'
      targetUser: savedState?.targetUser || null,
      actor: savedState?.actor || null,
      expiresAt: savedState?.expiresAt || null,
      remainingSeconds: 0,
      tickerId: null,
      isEnding: false
    };
  },

  getters: {
    isReadOnly: (state) => state.isImpersonating && state.mode === 'READ_ONLY',
    isFullAccess: (state) => state.isImpersonating && state.mode === 'FULL_ACCESS',
    formattedRemainingTime: (state) => {
      const total = Math.max(0, state.remainingSeconds);
      const minutes = Math.floor(total / 60);
      const seconds = total % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  },

  actions: {
    /**
     * Inisialisasi ticker countdown berdasarkan expiresAt
     */
    startTicker() {
      this.stopTicker();

      if (!this.expiresAt) return;

      const calculateRemaining = () => {
        const expiry = new Date(this.expiresAt).getTime();
        const now = Date.now();
        const diff = Math.floor((expiry - now) / 1000);
        return Math.max(0, diff);
      };

      this.remainingSeconds = calculateRemaining();

      if (this.remainingSeconds <= 0) {
        this.handleSessionExpired();
        return;
      }

      this.tickerId = setInterval(() => {
        const remaining = calculateRemaining();
        this.remainingSeconds = remaining;

        if (remaining <= 0) {
          this.stopTicker();
          this.handleSessionExpired();
        }
      }, 1000);
    },

    stopTicker() {
      if (this.tickerId) {
        clearInterval(this.tickerId);
        this.tickerId = null;
      }
    },

    /**
     * Simpan status ke localStorage untuk reaktivitas reload
     */
    persistState() {
      if (this.isImpersonating) {
        localStorage.setItem(
          'impersonate_state',
          JSON.stringify({
            isImpersonating: this.isImpersonating,
            mode: this.mode,
            targetUser: this.targetUser,
            actor: this.actor,
            expiresAt: this.expiresAt
          })
        );
      } else {
        localStorage.removeItem('impersonate_state');
      }
    },

    /**
     * Cek status aktif dari backend saat aplikasi di-mount
     */
    async checkStatus() {
      try {
        const res = await impersonateService.getStatus();
        const data = res?.data;

        if (data && data.isImpersonating) {
          this.isImpersonating = true;
          this.mode = data.mode || 'READ_ONLY';
          this.targetUser = data.targetUser || null;
          this.actor = data.actor || null;
          this.expiresAt = data.expiresAt || null;

          this.persistState();
          this.startTicker();
          return data;
        } else {
          // Backend menyatakan tidak sedang impersonate
          if (this.isImpersonating || localStorage.getItem('impersonate_backup_admin')) {
            this.restoreAdminLocally();
          }
          this.clearLocalState();
          return null;
        }
      } catch (err) {
        // Jika error 401/403 atau offline, pertahankan fallback lokal jika valid
        console.warn('⚠️ Gagal memeriksa status impersonate:', err?.message);
        if (this.isImpersonating && this.expiresAt) {
          this.startTicker();
        }
        return null;
      }
    },

    /**
     * Memulai sesi impersonate
     */
    async start(targetUserId, { mode = 'READ_ONLY', adminPassword = null } = {}) {
      const authStore = useAuthStore();

      // 1. Backup akun admin sebelum beralih identitas
      const existingBackup = localStorage.getItem('impersonate_backup_admin');
      if (!existingBackup && authStore.user) {
        const adminBackup = {
          user: JSON.parse(JSON.stringify(authStore.user)),
          role: authStore.role || 'ADMIN',
          token: authStore.token
        };
        localStorage.setItem('impersonate_backup_admin', JSON.stringify(adminBackup));
      }

      // 2. Request backend untuk mulai impersonate
      const response = await impersonateService.startImpersonate(targetUserId, {
        mode,
        adminPassword
      });

      const resData = response?.data;
      if (!resData || !resData.targetUser) {
        throw new Error(response?.message || 'Data target user tidak valid');
      }

      // 3. Update state impersonate
      this.isImpersonating = true;
      this.mode = resData.mode || mode;
      this.targetUser = resData.targetUser;
      this.expiresAt = resData.expiresAt;
      this.actor = { id: authStore.user?.id, email: authStore.user?.email };

      this.persistState();
      this.startTicker();

      // 4. Update authStore agar sistem menampilkan data target user
      const target = resData.targetUser;
      const targetRoles = Array.isArray(target.roles) ? target.roles : [target.role || 'USER'];
      // Jika target punya peran selain ADMIN, gunakan peran target
      const targetRole = targetRoles.find((r) => r !== 'ADMIN') || targetRoles[0] || 'USER';

      authStore.user = target;
      authStore.role = targetRole;
      localStorage.setItem('user', JSON.stringify(target));
      localStorage.setItem('userRole', targetRole);

      return response;
    },

    /**
     * Menghentikan sesi impersonate dan mengembalikan akun admin
     */
    async stop(options = { redirect: true }) {
      this.isEnding = true;
      this.stopTicker();

      try {
        await impersonateService.stopImpersonate();
      } catch (err) {
        console.warn('⚠️ Gagal stop impersonate di backend (mungkin sudah expired):', err?.message);
      } finally {
        this.restoreAdminLocally();
        this.clearLocalState();
        this.isEnding = false;

        if (options.redirect) {
          router.push('/admin/users').catch(() => {});
        }
      }
    },

    /**
     * Pulihkan data akun Administrator dari backup lokal
     */
    restoreAdminLocally() {
      const backupRaw = localStorage.getItem('impersonate_backup_admin');
      if (backupRaw) {
        try {
          const backup = JSON.parse(backupRaw);
          const authStore = useAuthStore();
          if (backup.user) {
            authStore.user = backup.user;
            authStore.role = backup.role || 'ADMIN';
            localStorage.setItem('user', JSON.stringify(backup.user));
            localStorage.setItem('userRole', backup.role || 'ADMIN');
          }
        } catch (e) {
          console.error('Failed to restore admin backup:', e);
        }
      }
      localStorage.removeItem('impersonate_backup_admin');
    },

    /**
     * Bersihkan state lokal store
     */
    clearLocalState() {
      this.isImpersonating = false;
      this.mode = null;
      this.targetUser = null;
      this.actor = null;
      this.expiresAt = null;
      this.remainingSeconds = 0;
      this.stopTicker();
      localStorage.removeItem('impersonate_state');
    },

    /**
     * Tangani sesi habis (TTL expiry)
     */
    async handleSessionExpired() {
      this.stopTicker();
      this.restoreAdminLocally();
      this.clearLocalState();

      await Swal.fire({
        icon: 'warning',
        title: 'Sesi Impersonate Berakhir',
        text: 'Waktu sesi impersonate telah habis. Anda otomatis dikembalikan ke akun Administrator.',
        confirmButtonText: 'Kembali ke Admin',
        confirmButtonColor: '#0f172a'
      });

      router.push('/admin/users').catch(() => {});
    }
  }
});

