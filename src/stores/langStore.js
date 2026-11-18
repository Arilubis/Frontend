import { defineStore } from 'pinia';
import { twoFactorMessages } from '@/data/twoFactorMessages';

export const useLangStore = defineStore('lang', {
  state: () => {
    return {
      lang: localStorage.getItem('app_lang') || 'id',
      messages: {
        id: {
          common: {
            save: "Simpan",
            cancel: "Batal",
            loading: "Memuat data...",
            error: "Terjadi Kesalahan",
            success: "Berhasil",
            reset: "Reset",
            disconnecting: "Memutuskan Sesi",
            pleaseWait: "Mohon tunggu sebentar...",
            back: "Kembali",
            confirm: "Konfirmasi",
            warning: "Peringatan",
            delete: "Hapus",
            edit: "Ubah",
            retry: "Coba Lagi",
            sync: "Sinkronisasi..."
          },
          sidebar: {
            dashboard: "Dashboard",
            users: "Pengguna",
            approvals: "Persetujuan",
            analytics: "Analitik",
            logs: "Logs",
            security: "Keamanan",
            requests: "Permohonan",
            drafts: "Draft",
            settings: "Pengaturan",
            system: "Sistem",
            admin: "Admin",
            online: "Online",
            viewAs: "Masuk sebagai:",
            requester: "Pemohon",
            approver: "Penyetuju",
            reviewer: "Pemeriksa",
            backToAdmin: "Kembali ke Admin"
          },
          header: {
            disconnecting: "Memutuskan Sesi",
            pleaseWait: "Mohon tunggu sebentar...",
            approverMode: "Masuk Mode Approver",
            backToAdmin: "Kembali ke Admin"
          },
          twoFactor: twoFactorMessages.id,
          login: {
            secureAccess: "Akses Aman",
            authorizingAccess: "Mengotorisasi Akses...",
            greetingMorning: "Selamat Pagi",
            greetingAfternoon: "Selamat Siang",
            greetingEvening: "Selamat Malam",
            username: "Nama Pengguna",
            password: "Kata Sandi",
            signIn: "Masuk",
            forgotPassword: "Lupa Kata Sandi?",
            validationUsername: "Username wajib diisi",
            validationPassword: "Password wajib diisi",
            warningDeleted: "Akun Anda telah dihapus dari sistem."
          },
          settings: {
            title: "Pengaturan",
            subtitle: "Manajemen akun dan keamanan.",
            tabProfile: "Profil",
            tabNotifications: "Notifikasi",
            tabSecurity: "Keamanan",
            tabDanger: "Zona Bahaya",
            tabLanguage: "Bahasa",
            
            profile: {
              editTitle: "Edit Profil",
              fullName: "Nama Lengkap",
              fullNamePlaceholder: "Masukkan nama lengkap",
              phone: "Nomor Telepon",
              phonePlaceholder: "0812xxxx",
              saveChanges: "Simpan Perubahan",
              reset: "Reset",
              saving: "Menyimpan...",
              nameRequired: "Nama wajib diisi",
              updateSuccess: "Profil diperbarui",
              updateFailed: "Gagal memperbarui profil"
            },
            
            notifications: {
              title: "Saluran Notifikasi",
              emailTitle: "Notifikasi Email",
              emailDesc: "Kirim notifikasi ke alamat email Anda.",
              whatsappTitle: "Notifikasi WhatsApp",
              whatsappDesc: "Kirim notifikasi ke nomor WhatsApp Anda.",
              save: "Simpan Pengaturan",
              saveSuccess: "Pengaturan disimpan",
              saveFailed: "Gagal menyimpan pengaturan"
            },
            
            security: {
              title: "Ubah Kata Sandi",
              requirements: "Keamanan",
              reqLength: "Minimal 8 Karakter",
              reqCase: "Huruf Besar, Huruf Kecil, dan Angka",
              reqSymbol: "Simbol (@, #, $, !)",
              saveSuccess: "Kata sandi berhasil diubah",
              saveFailed: "Gagal mengubah kata sandi"
            },
            
            danger: {
              title: "Zona Bahaya",
              warningTitle: "Menghapus Akun Anda",
              warningDesc: "Tindakan ini bersifat permanen dan tidak dapat dibatalkan. Setelah akun dihapus:",
              bullet1: "Semua data profil dan pengaturan Anda akan dihapus.",
              bullet2: "Sesi login Anda akan segera diakhiri.",
              bullet3: "Anda tidak akan bisa login kembali menggunakan akun ini.",
              passwordVerify: "Verifikasi Kata Sandi",
              passwordPlaceholder: "Masukkan kata sandi saat ini",
              deleteButton: "Hapus Akun Permanen",
              modalTitle: "Konfirmasi Hapus Akun",
              modalDesc: "Untuk mengonfirmasi penghapusan, silakan ketik kata kunci HAPUS di bawah ini.",
              modalInputPlaceholder: "Ketik HAPUS untuk konfirmasi",
              modalCancel: "Batal",
              modalConfirm: "Hapus Sekarang",
              deleting: "Menghapus...",
              deleteSuccess: "Akun Anda berhasil dihapus.",
              deleteFailed: "Gagal menghapus akun. Silakan periksa kembali kata sandi Anda.",
              passwordRequired: "Kata sandi harus diisi"
            },
            
            language: {
              title: "Pengaturan Bahasa",
              subtitle: "Pilih bahasa utama untuk antarmuka pengguna.",
              selectLanguage: "Pilih Bahasa",
              desc: "Bahasa default adalah Bahasa Indonesia. Anda dapat mengubahnya ke Bahasa Inggris di bawah ini.",
              idLabel: "Bahasa Indonesia",
              enLabel: "English"
            }
          },
          dashboard: {
            hello: "Halo",
            manageMonitor: "Kelola dan pantau dokumen pribadi Anda dengan aman.",
            viewDashboardAs: "Lihat dashboard sebagai",
            activeRequester: "Pemohon",
            activeRequesterDesc: "Dokumen yang saya ajukan",
            activeApprover: "Penyetuju",
            activeApproverDesc: "Dokumen menunggu persetujuan",
            activeReviewer: "Pemeriksa",
            activeReviewerDesc: "Semua dokumen dalam sistem",
            addRequest: "Tambah Permohonan",
            stats: {
              submitted: "DIKIRIM",
              revision: "REVISI",
              approved: "DISETUJUI",
              rejected: "DITOLAK",
              pending: "TERTUNDA",
              inReview: "DIPERIKSA",
              all: "Semua",
              viewDetails: "Lihat rincian"
            },
            charts: {
              uploadStats: "Statistik Unggahan Saya",
              month: "1 bulan",
              year: "1 tahun",
              downloadReport: "Unduh Laporan"
            },
            activities: {
              title: "Aktivitas Sistem",
              loading: "Memuat aktivitas...",
              noActivities: "Belum ada aktivitas"
            }
          },
          requests: {
            title: "Permohonan Saya",
            loading: "Memuat dokumen...",
            noRequests: "Permohonan tidak ditemukan",
            startPrompt: "Buat permohonan dokumen pertama Anda untuk memulai",
            accessLevel: "Tingkat Akses",
            searchPlaceholder: "Cari Permohonan...",
            resultsCount: "hasil",
            table: {
              details: "Rincian Permohonan",
              status: "Status",
              date: "Tanggal",
              actions: "Aksi"
            },
            preview: {
              title: "Pratinjau Cepat",
              openReview: "Buka Mode Tinjauan",
              progress: "Progres Persetujuan",
              infoCategory: "Kategori",
              infoCreatedBy: "Dibuat Oleh",
              infoDate: "Tanggal",
              infoAttachments: "Lampiran",
              infoFilesCount: "file",
              commentsTitle: "Komentar",
              noComments: "Belum ada komentar",
              uncategorized: "Tanpa Kategori",
              unknown: "Tidak Diketahui"
            }
          },
          approvals: {
            title: "Persetujuan Saya",
            documents: "Dokumen",
            searchPlaceholder: "Cari Permohonan...",
            noApprovals: "Tidak ada permohonan persetujuan",
            filter: {
              all: "Semua Dokumen",
              pending: "Menunggu",
              inReview: "Ditinjau",
              approved: "Disetujui",
              revision: "Revisi",
              rejected: "Ditolak",
              takeover: "Pengalihan"
            }
          },
          drafts: {
            title: "Draft",
            subtitle: "Kelola draft sebelum mengirimkannya untuk persetujuan.",
            searchPlaceholder: "Cari Draft...",
            selectCategory: "Pilih Kategori",
            filtered: "terfilter",
            draf: "Draf",
            delete: "Hapus",
            selectAll: "Pilih Semua",
            deselectAll: "Batalkan Semua",
            blankTitle: "Draft Kosong",
            blankDesc: "Mulai membuat draf dokumen pertama Anda.",
            createNow: "Buat Dokumen Sekarang"
          }
        },
        en: {
          common: {
            save: "Save",
            cancel: "Cancel",
            loading: "Loading data...",
            error: "An Error Occurred",
            success: "Success",
            reset: "Reset",
            disconnecting: "Disconnecting",
            pleaseWait: "Please wait a moment...",
            back: "Back",
            confirm: "Confirm",
            warning: "Warning",
            delete: "Delete",
            edit: "Edit",
            retry: "Retry",
            sync: "Syncing..."
          },
          sidebar: {
            dashboard: "Dashboard",
            users: "Users",
            approvals: "Approvals",
            analytics: "Analytics",
            logs: "Logs",
            security: "Security",
            requests: "Requests",
            drafts: "Drafts",
            settings: "Settings",
            system: "System",
            admin: "Admin",
            online: "Online",
            viewAs: "View as:",
            requester: "Requester",
            approver: "Approver",
            reviewer: "Reviewer",
            backToAdmin: "Back to Admin"
          },
          header: {
            disconnecting: "Disconnecting",
            pleaseWait: "Please wait...",
            approverMode: "Enter Approver Mode",
            backToAdmin: "Back to Admin"
          },
          twoFactor: twoFactorMessages.en,
          login: {
            secureAccess: "Secure Access",
            authorizingAccess: "Authorizing Access...",
            greetingMorning: "Good Morning",
            greetingAfternoon: "Good Afternoon",
            greetingEvening: "Good Evening",
            username: "Username",
            password: "Password",
            signIn: "Sign In",
            forgotPassword: "Forgot Password?",
            validationUsername: "Username is required",
            validationPassword: "Password is required",
            warningDeleted: "Your account has been deleted from the system."
          },
          settings: {
            title: "Settings",
            subtitle: "Account management and security.",
            tabProfile: "Profile",
            tabNotifications: "Notifications",
            tabSecurity: "Security",
            tabDanger: "Danger Zone",
            tabLanguage: "Language",
            
            profile: {
              editTitle: "Edit Profile",
              fullName: "Full Name",
              fullNamePlaceholder: "Enter full name",
              phone: "Phone Number",
              phonePlaceholder: "0812xxxx",
              saveChanges: "Save Changes",
              reset: "Reset",
              saving: "Saving...",
              nameRequired: "Name is required",
              updateSuccess: "Profile updated successfully",
              updateFailed: "Failed to update profile"
            },
            
            notifications: {
              title: "Notification Channels",
              emailTitle: "Email Notifications",
              emailDesc: "Send notifications to your email address.",
              whatsappTitle: "WhatsApp Notifications",
              whatsappDesc: "Send notifications to your WhatsApp number.",
              save: "Save Settings",
              saveSuccess: "Settings saved successfully",
              saveFailed: "Failed to save settings"
            },
            
            security: {
              title: "Change Password",
              requirements: "Security Guidelines",
              reqLength: "At least 8 Characters",
              reqCase: "Uppercase, Lowercase, and Numbers",
              reqSymbol: "Symbols (@, #, $, !)",
              saveSuccess: "Password changed successfully",
              saveFailed: "Failed to change password"
            },
            
            danger: {
              title: "Danger Zone",
              warningTitle: "Deleting Your Account",
              warningDesc: "This action is permanent and cannot be undone. Once the account is deleted:",
              bullet1: "All your profile data and settings will be permanently erased.",
              bullet2: "Your active session will be terminated immediately.",
              bullet3: "You will not be able to log in again using this account.",
              passwordVerify: "Password Verification",
              passwordPlaceholder: "Enter current password",
              deleteButton: "Delete Account Permanently",
              modalTitle: "Confirm Account Deletion",
              modalDesc: "To confirm deletion, please type the keyword DELETE below.",
              modalInputPlaceholder: "Type DELETE to confirm",
              modalCancel: "Cancel",
              modalConfirm: "Delete Now",
              deleting: "Deleting...",
              deleteSuccess: "Your account has been deleted successfully.",
              deleteFailed: "Failed to delete account. Please verify your password and try again.",
              passwordRequired: "Password is required"
            },
            
            language: {
              title: "Language Settings",
              subtitle: "Select the primary language for the user interface.",
              selectLanguage: "Select Language",
              desc: "The default language is Bahasa Indonesia. You can switch to English below.",
              idLabel: "Bahasa Indonesia",
              enLabel: "English"
            }
          },
          dashboard: {
            hello: "Hello",
            manageMonitor: "Manage and monitor your personal documents securely.",
            viewDashboardAs: "View dashboard as",
            activeRequester: "Requester",
            activeRequesterDesc: "My submitted documents",
            activeApprover: "Approver",
            activeApproverDesc: "Documents waiting for approval",
            activeReviewer: "Reviewer",
            activeReviewerDesc: "All documents in system",
            addRequest: "Add Request",
            stats: {
              submitted: "SUBMITTED",
              revision: "REVISION",
              approved: "APPROVED",
              rejected: "REJECTED",
              pending: "PENDING",
              inReview: "IN REVIEW",
              all: "All",
              viewDetails: "View details"
            },
            charts: {
              uploadStats: "My Upload Statistics",
              month: "1 month",
              year: "1 year",
              downloadReport: "Download Report"
            },
            activities: {
              title: "System Activities",
              loading: "Loading activities...",
              noActivities: "No activities yet"
            }
          },
          requests: {
            title: "My Requests",
            loading: "Loading documents...",
            noRequests: "No requests found",
            startPrompt: "Create your first document request to get started",
            accessLevel: "Access Level",
            searchPlaceholder: "Search Requests...",
            resultsCount: "results",
            table: {
              details: "Requests Details",
              status: "Status",
              date: "Date",
              actions: "Actions"
            },
            preview: {
              title: "Quick Preview",
              openReview: "Open Review Mode",
              progress: "Approval Progress",
              infoCategory: "Category",
              infoCreatedBy: "Created By",
              infoDate: "Date",
              infoAttachments: "Attachments",
              infoFilesCount: "file(s)",
              commentsTitle: "Comments",
              noComments: "No comments yet",
              uncategorized: "Uncategorized",
              unknown: "Unknown"
            }
          },
          approvals: {
            title: "My Approvals",
            documents: "Documents",
            searchPlaceholder: "Search Requests...",
            noApprovals: "No Approval Requests",
            filter: {
              all: "All Documents",
              pending: "Pending",
              inReview: "In Review",
              approved: "Approved",
              revision: "Revision",
              rejected: "Rejected",
              takeover: "Takeover"
            }
          },
          drafts: {
            title: "Drafts",
            subtitle: "Manage drafts before submitting them for approval.",
            searchPlaceholder: "Search Draft...",
            selectCategory: "Select Category",
            filtered: "filtered",
            draf: "drafts",
            delete: "Delete",
            selectAll: "Select All",
            deselectAll: "Deselect All",
            blankTitle: "Blank Draft",
            blankDesc: "Start drafting your first document.",
            createNow: "Create a Document Now"
          }
        }
      }
    };
  },
  actions: {
    setLanguage(newLang) {
      if (this.messages[newLang]) {
        this.lang = newLang;
        localStorage.setItem('app_lang', newLang);
      }
    },
    t(key) {
      const keys = key.split('.');
      let obj = this.messages[this.lang];
      for (const k of keys) {
        if (obj && obj[k] !== undefined) {
          obj = obj[k];
        } else {
          // Fallback to Indonesian if key not found in current language
          let fallbackObj = this.messages['id'];
          for (const fk of keys) {
            if (fallbackObj && fallbackObj[fk] !== undefined) {
              fallbackObj = fallbackObj[fk];
            } else {
              return key;
            }
          }
          return fallbackObj;
        }
      }
      return obj;
    }
  }
});
