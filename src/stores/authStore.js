import { defineStore } from 'pinia';
import { logoutUser as apiLogout } from '@/services/auth';
import router from '../router';

export const useAuthStore = defineStore('auth', {
    // 1. STATE: Dibuat lebih aman dari error "undefined" JSON
    state: () => {
        const savedUser = localStorage.getItem('user');
        const userData = (savedUser && savedUser !== "undefined" && savedUser !== "null")
            ? JSON.parse(savedUser)
            : null;

        return {
            token: localStorage.getItem('accessToken') || null,
            user: userData,
            role: localStorage.getItem('userRole') || null,
            isAuthenticated: !!localStorage.getItem('accessToken'),
        };
    },

    // 2. GETTERS
    getters: {
        getIsAuthenticated: (state) => !!state.token,
        getUserRole: (state) => state.role,
        userName: (state) => state.user ? state.user.namaLengkap : 'Tamu',
    },

    // 3. ACTIONS
    actions: {
        /**
         * Sinkronisasi ulang saat halaman di-refresh
         */
        async initializeAuth() {
            const token = localStorage.getItem('accessToken');
            const userStr = localStorage.getItem('user');
            const role = localStorage.getItem('userRole');

            if (token && userStr && userStr !== "undefined" && role) {
                try {
                    this.token = token;

                    // ✅ PERBAIKAN DI SINI:
                    // Kita parse string dari localStorage ke objek parsedUser
                    const parsedUser = JSON.parse(userStr);
                    this.user = parsedUser;

                    // ✅ Ambil role langsung dari localStorage (atau parsedUser.role)
                    this.role = role;

                    this.isAuthenticated = true;
                    console.log("Auth Restored. Role:", this.role);
                } catch (e) {
                    console.error("Gagal parsing data user saat inisialisasi", e);
                    this.clearAuth();
                }
            } else {
                this.clearAuth();
            }
        },
        /**
         * Set data setelah login berhasil
         */
        setAuthentication({ token, user }) {
            if (!token || !user) return;

            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Tentukan role default aktif: jika roles mengandung ADMIN, default-kan ke ADMIN.
            const userRoles = Array.isArray(user.roles) ? user.roles : [];
            const defaultRole = userRoles.includes('ADMIN') ? 'ADMIN' : (user.role || 'USER');

            localStorage.setItem('userRole', defaultRole);

            this.token = token;
            this.user = user;
            this.role = defaultRole;
            this.isAuthenticated = true;
            console.log("Login Success. State Updated. Role:", defaultRole);
        },

        /**
         * Hapus semua data sesi
         */
        clearAuth() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');

            this.token = null;
            this.user = null;
            this.role = null;
            this.isAuthenticated = false;
            console.log("Sesi dibersihkan.");
        },

        async logout() {
            try {
                // panggil API logout jika ada
                // await apiLogout(); 
            } catch (error) {
                console.warn("API Gagal");
            } finally {
                // 1. Bersihkan data lokal
                this.clearAuth();

                // 2. Langsung tendang ke Login dari sini
                router.push({ name: 'Login' });
            }
        },

        switchRole(newRole) {
            this.role = newRole;
            localStorage.setItem('userRole', newRole);
            console.log("Sesi peran dialihkan ke:", newRole);
        },
    }
});