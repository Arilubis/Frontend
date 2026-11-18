
import axios from "axios";

const api = axios.create({
  baseURL: "",
  withCredentials: true, // ✅ PENTING: kirim cookies otomatis
});

// ❌ HAPUS: Tidak perlu interceptor untuk set Authorization dari localStorage
// ✅ Backend akan ambil token dari cookies

let refreshing = false;
let queue = [];

function processQueue(error, token = null) {
  queue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
}

api.interceptors.response.use(
  response => response,

  async (error) => {
    const originalReq = error.config;

    // ✅ Handle user deleted/not found
    if (error.response?.status === 404 && originalReq.url.includes("/auth/me")) {
      localStorage.setItem("userDeleted", "true");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // ✅ Handle Impersonate Blocked (READ_ONLY mutation atau Sensitive operation)
    if (error.response?.status === 403) {
      const errorData = error.response?.data;
      const errorCode = Array.isArray(errorData?.errors) ? errorData.errors[0]?.code : null;

      if (errorCode === 'IMPERSONATE_READ_ONLY') {
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            icon: 'warning',
            title: 'Mode Baca Saja',
            text: errorData?.message || 'Aksi ini diblokir karena Anda sedang dalam mode Impersonate (READ_ONLY).',
            confirmButtonColor: '#0f172a'
          });
        });
      } else if (errorCode === 'IMPERSONATE_SENSITIVE_BLOCKED') {
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            icon: 'error',
            title: 'Operasi Sensitif Diblokir',
            text: errorData?.message || 'Operasi ini tidak diizinkan dalam mode impersonate demi keamanan data user.',
            confirmButtonColor: '#0f172a'
          });
        });
      }
    }

    // ✅ Handle unauthorized
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 🔐 Endpoint login & 2FA mengembalikan 401 untuk kode/kredensial SALAH
    // (bukan token kedaluwarsa). Jangan di-refresh / di-retry: retry akan
    // menghitung ulang percobaan gagal dan refresh akan redirect ke /login.
    const NO_REFRESH_URLS = [
      "/auth/login",
      "/auth/2fa/verify",
      "/auth/2fa/setup",
      "/auth/2fa/disable",
      "/auth/2fa/backup-codes",
    ];
    if (NO_REFRESH_URLS.some((u) => originalReq.url?.includes(u))) {
      return Promise.reject(error);
    }

    // Skip jika refresh endpoint
    if (originalReq.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Skip jika sudah retry
    if (originalReq._retry) {
      return Promise.reject(error);
    }
    originalReq._retry = true;

    // Queue jika sedang refresh
    if (refreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => resolve(api(originalReq)),
          reject,
        });
      });
    }

    refreshing = true;

    try {
      // 🔑 Refresh token dari cookies (backend akan baca dari cookies)
      await api.post("/auth/refresh");

      processQueue(null);
      refreshing = false;

      // ✅ Retry request asli (token baru sudah ada di cookies)
      return api(originalReq);

    } catch (err) {
      processQueue(err, null);
      refreshing = false;

      // 🔐 Admin baru mewajibkan 2FA & user belum enroll → refresh ditolak (403).
      // Simpan pesan agar halaman login bisa menjelaskan alasannya.
      const rd = err.response?.data;
      const rdCode = Array.isArray(rd?.data) ? rd.data[0]?.code : undefined;
      if (rdCode === "TWO_FACTOR_SETUP_REQUIRED") {
        localStorage.setItem("twoFactorNotice", rd.message || "");
      }

      // ❌ Hapus data user dan redirect ke login
      localStorage.removeItem("user");
      window.location.href = "/login";

      return Promise.reject(err);
    }
  }
);

export default api;

