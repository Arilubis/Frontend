<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-white font-sans text-slate-900" >
    
    <!-- Sidebar / Tab nav: vertikal di desktop, horizontal scroll di mobile -->
    <aside class="w-full md:w-72 md:min-h-screen border-b md:border-b-0 md:border-r border-slate-200 flex flex-col bg-slate-50 md:flex-shrink-0">
      <div class="p-4 md:p-6 border-b border-slate-200 bg-white">
        <button 
          @click="$router.push({ name: 'Dashboard' })" 
          class="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all mb-3 md:mb-4"
        >
          <span class="material-icons text-[18px]">arrow_back</span>
          <span class="text-xs font-medium uppercase tracking-wider">Dashboard</span>
        </button>
        <h1 class="text-base md:text-lg font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <span class="material-icons text-blue-600">description</span>
          User Guide
        </h1>
      </div>

      <!-- Nav: horizontal scroll di mobile, vertikal di desktop -->
      <nav class="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-auto p-3 md:p-4 gap-1 md:gap-6 md:space-y-6 custom-scrollbar">
        <div v-for="group in menuGroups" :key="group.title" class="flex flex-row md:flex-col gap-1 flex-shrink-0 md:w-full">
          <h5 class="hidden md:block px-4 text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">{{ group.title }}</h5>
          <ul class="flex flex-row md:flex-col gap-1">
            <li v-for="item in group.items" :key="item.id">
              <button 
                @click="activeSection = item.id"
                :class="activeSection === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-white hover:border-slate-200'"
                class="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-xl border border-transparent transition-all whitespace-nowrap w-full"
              >
                <span class="material-icons text-[16px] md:text-[18px]">{{ item.icon }}</span>
                {{ item.label }}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <main class="flex-1 overflow-y-auto bg-white p-5 md:p-8 lg:p-16">
      <div class="max-w-4xl mx-auto pb-16 md:pb-32">
        
        <div v-if="activeSection === 'dashboard'" class="animate-in">
          <h2 class="text-2xl font-semibold mb-6 text-slate-800">Dashboard Admin & Real-time Stats</h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Halaman utama memberikan gambaran menyeluruh mengenai kesehatan sistem dan aliran dokumen secara real-time.
          </p>

          <div class="grid grid-cols-1 gap-6">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-icons text-blue-600">analytics</span>
                <h4 class="font-semibold text-slate-800">Indikator Kinerja Utama (KPI)</h4>
              </div>
              <p class="text-sm text-slate-500 mb-4">Terdapat 4 metrik utama yang diperbarui secara otomatis:</p>
              <ul class="text-sm text-slate-600 space-y-3 ml-4">
                <li class="flex items-start gap-2">
                  <span class="text-blue-500">•</span>
                  <span><b>Active Docs:</b> Total dokumen aktif dalam sistem.</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-500">•</span>
                  <span><b>Total Users:</b> Seluruh pengguna yang terdaftar di database.</span>
                </li>
              </ul>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-icons text-blue-600">show_chart</span>
                <h4 class="font-semibold text-slate-800">Document Flow Analysis</h4>
              </div>
              <p class="text-sm text-slate-500 mb-3">
                Grafika interaktif (ApexCharts) yang memvisualisasikan tren dokumen.
              </p>
              <div class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                <span class="material-icons text-xs">file_download</span> FITUR EXPORT TERSEDIA
              </div>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-icons text-blue-600">format_list_bulleted</span>
                <h4 class="font-semibold text-slate-800">Recent Document Queue</h4>
              </div>
              <p class="text-sm text-slate-500 mb-4">
                Daftar antrean dokumen terbaru beserta status verifikasinya:
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-green-200">Approved</span>
                <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-orange-200">Pending</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold uppercase tracking-wider border border-blue-200">Review</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'Draft'" class="animate-in fade-in duration-500">
          <h2 class="text-2xl font-semibold mb-6 text-slate-800">Kelola Draft Dokumen</h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Draf adalah tempat penyimpanan sementara untuk dokumen yang belum selesai Anda isi. Dokumen di sini <b>belum dapat dilihat</b> oleh Approver sampai Anda menekan tombol Submit.
          </p>

          <div class="grid grid-cols-1 gap-6">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <span class="material-icons">search</span>
                </div>
                <div>
                  <h4 class="font-semibold text-slate-800">Pencarian & Filter Kategori</h4>
                  <p class="text-[12px] text-slate-500">Menemukan dokumen dengan cepat.</p>
                </div>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed">
                Gunakan kolom <b>Cari judul draf</b> untuk mencari berdasarkan teks, atau gunakan dropdown <b>Semua Kategori</b> untuk menyaring dokumen berdasarkan departemen (HRD, Finance, dll).
              </p>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <span class="material-icons">delete_sweep</span>
                </div>
                <h4 class="font-semibold text-slate-800">Manajemen Massal (Bulk Action)</h4>
              </div>
              <p class="text-sm text-slate-600 mb-3">Anda dapat mengelola banyak dokumen sekaligus untuk efisiensi waktu:</p>
              <ul class="text-sm text-slate-600 space-y-2 ml-4 list-disc">
                <li>Klik kotak centang pada kartu dokumen untuk memilih.</li>
                <li>Gunakan tombol <b>"Pilih Semua"</b> di bagian atas untuk memilih seluruh draf yang tersaring.</li>
                <li>Tombol <b>"Hapus (Jumlah)"</b> akan muncul secara otomatis untuk menghapus draf yang terpilih secara permanen.</li>
              </ul>
            </div>

            <div class="p-6 bg-blue-600 rounded-[24px] text-white shadow-xl shadow-blue-200">
              <div class="flex items-center gap-3 mb-4">
                <span class="material-icons">publish</span>
                <h4 class="font-semibold">Langkah Submit Dokumen</h4>
              </div>
              <div class="space-y-4">
                <div class="flex gap-3 items-start bg-white/10 p-3 rounded-xl border border-white/20">
                  <span class="font-semibold text-blue-200">01</span>
                  <p class="text-xs">Pastikan metadata (judul & deskripsi) sudah benar melalui tombol <b>Edit</b>.</p>
                </div>
                <div class="flex gap-3 items-start bg-white/10 p-3 rounded-xl border border-white/20">
                  <span class="font-semibold text-blue-200">02</span>
                  <p class="text-xs">Tekan tombol <b>Submit</b>. Status dokumen akan berubah dari <b>DRAFT</b> menjadi <b>PENDING</b>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'upload'" class="animate-in fade-in duration-500">
          <h2 class="text-2xl font-semibold mb-6 text-slate-800">Membuat Dokumen Baru</h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Gunakan modul ini untuk mendaftarkan dokumen ke dalam sistem. Pastikan informasi dasar lengkap dan alur persetujuan telah diatur dengan benar agar proses verifikasi berjalan lancar.
          </p>

          <div class="grid grid-cols-1 gap-8">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div class="flex items-center gap-3 mb-4">
                <span class="material-icons text-blue-600">edit_note</span>
                <h4 class="font-semibold text-slate-800">1. Informasi Dasar (Wajib)</h4>
              </div>
              <p class="text-sm text-slate-600 mb-4">Sistem mewajibkan pengisian data berikut sebelum dokumen dapat diajukan:</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-3 bg-white rounded-xl border border-slate-200">
                  <p class="text-[11px] font-semibold text-blue-600 uppercase mb-1">Judul</p>
                  <p class="text-xs text-slate-500 font-medium">Minimal 5 karakter untuk submit.</p>
                </div>
                <div class="p-3 bg-white rounded-xl border border-slate-200">
                  <p class="text-[11px] font-semibold text-blue-600 uppercase mb-1">Kategori</p>
                  <p class="text-xs text-slate-500 font-medium">Pilih kategori yang sesuai (Master Data).</p>
                </div>
                <div class="p-3 bg-white rounded-xl border border-slate-200">
                  <p class="text-[11px] font-semibold text-blue-600 uppercase mb-1">Deskripsi</p>
                  <p class="text-xs text-slate-500 font-medium">Minimal 10 karakter untuk penjelasan internal.</p>
                </div>
              </div>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div class="flex items-center gap-3 mb-4">
                <span class="material-icons text-blue-600">schema</span>
                <h4 class="font-semibold text-slate-800">2. Alur Persetujuan (Approval Path)</h4>
              </div>
              <p class="text-sm text-slate-600 mb-4">Anda dapat mengatur siapa saja yang berhak meninjau dokumen ini hingga <b>3 Level</b>:</p>
              <ul class="space-y-3">
                <li class="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span class="material-icons text-blue-500 text-sm mt-1">settings_ethernet</span>
                  <div class="text-xs">
                    <b class="text-slate-800">Sequential vs Parallel:</b>
                    <p class="text-slate-500">Gunakan <i>Sequential</i> jika persetujuan harus berurutan, atau <i>Parallel</i> jika semua approver di level tersebut bisa menyetujui secara bersamaan.</p>
                  </div>
                </li>
                <li class="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <span class="material-icons text-amber-500 text-sm mt-1">verified</span>
                  <div class="text-xs">
                    <b class="text-slate-800">Final Authorization:</b>
                    <p class="text-slate-500">Tentukan satu reviewer akhir (level atasan tertinggi) yang akan memberikan otorisasi final terhadap dokumen.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="p-6 bg-slate-900 rounded-[24px] text-white">
              <div class="flex items-center gap-3 mb-4">
                <span class="material-icons text-blue-400">offline_pin</span>
                <h4 class="font-semibold">3. Penyelesaian & Fitur Cerdas</h4>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 class="text-[11px] font-semibold text-blue-400 uppercase mb-2">Auto-Save System</h5>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    Dalam mode <b>Edit Draf</b>, sistem akan menyimpan perubahan secara otomatis setiap 3 detik. Anda tidak perlu khawatir kehilangan data jika koneksi terputus.
                  </p>
                </div>
                <div>
                  <h5 class="text-[11px] font-semibold text-blue-400 uppercase mb-2">Tombol Aksi</h5>
                  <ul class="text-xs text-slate-300 space-y-2">
                    <li><b class="text-white">Execute & Send:</b> Kirim langsung ke alur approval (Status: PENDING).</li>
                    <li><b class="text-white">Save as Draft:</b> Simpan untuk dilanjutkan nanti (Status: DRAFT).</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl">
              <span class="material-icons text-slate-400 text-3xl">attach_file</span>
              <div class="text-xs">
                <p class="font-semibold text-slate-700 uppercase mb-0.5">Lampiran Dokumen</p>
                <p class="text-slate-500">Mendukung format PDF, Word, Excel, dan Gambar dengan ukuran maksimal <b>5MB per file</b>. Anda dapat melampirkan hingga 10 file sekaligus.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'approver'" class="animate-in fade-in duration-500">
          <h2 class="text-2xl font-semibold mb-6 text-slate-800">Verification <span class="text-blue-600">Hub</span></h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Modul ini dirancang khusus untuk otoritas pemberi izin. Dilengkapi dengan <b>Hybrid Engine</b> untuk memantau alur persetujuan dan <b>Cryptographic Seal</b> untuk keamanan dokumen.
          </p>

          <div class="grid grid-cols-1 gap-6">
            <div class="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <span class="material-icons text-blue-600">visibility</span>
                </div>
                <div>
                  <h4 class="font-semibold text-slate-900">Preview & Tracking</h4>
                  <p class="text-[11px] text-slate-500 uppercase font-medium tracking-wider">Audit Trail Active</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
                <div class="space-y-3">
                  <p class="flex items-center gap-2">
                    <span class="material-icons text-blue-500 text-sm">check_circle</span> 
                    <b>Live Viewer:</b> Baca dokumen langsung tanpa download.
                  </p>
                  <p class="flex items-center gap-2">
                    <span class="material-icons text-blue-500 text-sm">check_circle</span> 
                    <b>Progress Tracking:</b> Pantau posisi dokumen di level mana saat ini.
                  </p>
                </div>
                <div class="space-y-3">
                  <p class="flex items-center gap-2">
                    <span class="material-icons text-blue-500 text-sm">check_circle</span> 
                    <b>Audit Log:</b> Lihat sejarah lengkap siapa yang menyentuh dokumen.
                  </p>
                  <p class="flex items-center gap-2">
                    <span class="material-icons text-blue-500 text-sm">check_circle</span> 
                    <b>Internal Notes:</b> Tambahkan alasan jika meminta revisi.
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl group transition-all hover:shadow-md">
                <span class="material-icons text-emerald-600 mb-2">verified_user</span>
                <h5 class="font-semibold text-emerald-900 text-sm mb-1">Approve</h5>
                <p class="text-[11px] text-emerald-700 leading-snug">Setujui dokumen. Memerlukan <b>Digital Signature</b> untuk menghasilkan segel SHA.</p>
              </div>
              <div class="p-5 bg-amber-50 border border-amber-100 rounded-2xl group transition-all hover:shadow-md">
                <span class="material-icons text-amber-600 mb-2">history_edu</span>
                <h5 class="font-semibold text-amber-900 text-sm mb-1">Revise</h5>
                <p class="text-[11px] text-amber-700 leading-snug">Kembalikan ke pembuat. Wajib memberikan catatan perbaikan agar status kembali ke <b>DRAFT</b>.</p>
              </div>
              <div class="p-5 bg-red-50 border border-red-100 rounded-2xl group transition-all hover:shadow-md">
                <span class="material-icons text-red-600 mb-2">block</span>
                <h5 class="font-semibold text-red-900 text-sm mb-1">Reject</h5>
                <p class="text-[11px] text-red-700 leading-snug">Tolak permanen. Dokumen akan dihapus dari antrean verifikasi dan tidak bisa diproses lagi.</p>
              </div>
            </div>

            <div class="bg-slate-900 rounded-[24px] p-6 text-white overflow-hidden relative">
              <div class="relative z-10">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-4">Pro Shortcuts (Keyboard)</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="flex flex-col">
                    <span class="text-xl font-semibold">S</span>
                    <span class="text-[10px] text-slate-400 uppercase font-medium">Sign/Approve</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xl font-semibold">R</span>
                    <span class="text-[10px] text-slate-400 uppercase font-medium">Reject</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xl font-semibold">↑ ↓</span>
                    <span class="text-[10px] text-slate-400 uppercase font-medium">Navigate</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-xl font-semibold">Esc</span>
                    <span class="text-[10px] text-slate-400 uppercase font-medium">Cancel/Exit</span>
                  </div>
                </div>
              </div>
              <span class="material-icons absolute -right-4 -bottom-4 text-white/5 text-8xl">keyboard</span>
            </div>

            <div class="p-4 bg-blue-600 rounded-2xl text-white flex items-center gap-4">
              <span class="material-icons text-3xl">security</span>
              <div class="text-xs">
                <p class="font-semibold uppercase tracking-wider mb-1">Cryptographic Seal</p>
                <p class="text-blue-100 leading-relaxed">
                  Setiap persetujuan akan menghasilkan <b>Unique SHA Hash</b> yang tertanam secara permanen pada log audit sebagai bukti keabsahan verifikasi digital.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeSection === 'settings'" class="animate-in fade-in duration-500">
          <h2 class="text-2xl font-semibold mb-6 text-slate-800">Control <span class="text-blue-600">Center</span></h2>
          <p class="text-slate-600 mb-8 leading-relaxed">
            Kelola identitas digital, preferensi notifikasi, dan konfigurasi keamanan tingkat tinggi Anda dalam satu panel terpusat.
          </p>

          <div class="grid grid-cols-1 gap-6">
            <div class="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">Struktur Pengaturan</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <span class="material-icons text-blue-600 mb-2">tune</span>
                  <h5 class="font-semibold text-slate-900 text-xs">Umum</h5>
                  <p class="text-[10px] text-slate-500 mt-1">Notifikasi & preferensi email.</p>
                </div>
                <div class="p-4 border border-blue-100 rounded-2xl bg-blue-50">
                  <span class="material-icons text-blue-600 mb-2">verified_user</span>
                  <h5 class="font-semibold text-slate-900 text-xs">Keamanan</h5>
                  <p class="text-[10px] text-slate-500 mt-1">Manajemen password & sesi.</p>
                </div>
                <div class="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <span class="material-icons text-blue-600 mb-2">account_tree</span>
                  <h5 class="font-semibold text-slate-900 text-xs">Alur Kerja</h5>
                  <p class="text-[10px] text-slate-500 mt-1">Logika peninjauan dokumen.</p>
                </div>
                <div class="p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <span class="material-icons text-blue-600 mb-2">settings</span>
                  <h5 class="font-semibold text-slate-900 text-xs">Sistem</h5>
                  <p class="text-[10px] text-slate-500 mt-1">Limit upload & arsip data.</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div class="lg:col-span-7 bg-slate-900 rounded-[24px] p-6 text-white relative overflow-hidden">
                <div class="relative z-10">
                  <div class="flex items-center gap-3 mb-4">
                    <span class="material-icons text-amber-400">shield</span>
                    <h4 class="font-semibold">Protokol Kata Sandi</h4>
                  </div>
                  <p class="text-sm text-slate-400 mb-6 leading-relaxed">
                    Untuk menjaga integritas akun, perubahan password wajib memenuhi kriteria kompleksitas sistem.
                  </p>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-slate-300">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 8+ Karakter Campuran
                    </div>
                    <div class="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-slate-300">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Simbol Khusus (@, #, $, %)
                    </div>
                    <div class="flex items-center gap-3 text-[11px] font-medium uppercase tracking-wider text-slate-300">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Re-Login Otomatis
                    </div>
                  </div>
                </div>
                <span class="material-icons absolute -right-8 -bottom-8 text-white/5 text-[160px]">lock</span>
              </div>

              <div class="lg:col-span-5 bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Feedback Sistem</h4>
                <div class="space-y-4">
                  <div class="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                    <span class="material-icons text-sm">check_circle</span>
                    <span class="text-[11px] font-medium uppercase">Success Toast (Green)</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
                    <span class="material-icons text-sm">error</span>
                    <span class="text-[11px] font-medium uppercase">Error Toast (Red)</span>
                  </div>
                  <div class="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                    <span class="material-icons text-sm animate-spin">refresh</span>
                    <span class="text-[11px] font-medium uppercase">Loading State</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-600 rounded-[24px] p-6 text-white">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 class="font-semibold text-lg mb-1">Konfigurasi Data & API</h4>
                  <p class="text-blue-100 text-xs">Sistem sinkronisasi otomatis menggunakan normalisasi Zod.</p>
                </div>
                <div class="flex gap-2">
                  <div class="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                    <p class="text-[10px] uppercase font-black text-blue-200">Session Guard</p>
                    <p class="text-sm font-bold">Active</p>
                  </div>
                  <div class="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                    <p class="text-[10px] uppercase font-black text-blue-200">Auto-Sync</p>
                    <p class="text-sm font-bold">Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeSection = ref('dashboard');

const menuGroups = [
  {
    title: 'Utama',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
      { id: 'upload', label: 'Add Dokumen', icon: 'add_box' },
      { id: 'Draft', label: 'My Drafts', icon: 'grid_view' },
    ]
  },
  {
    title: 'Otorisasi',
    items: [
      { id: 'approver', label: 'Approver ', icon: 'account_tree' },
      { id: 'arsip', label: 'Pengarsipan', icon: 'inventory' },
    ]
  },
  {
    title: 'Lainnya',
    items: [
      { id: 'settings', label: 'Pengaturan', icon: 'manage_accounts' },
    ]
  }
];
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar Style */
aside nav::-webkit-scrollbar, main::-webkit-scrollbar {
  width: 5px;
}
aside nav::-webkit-scrollbar-thumb, main::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}

/* Sembunyikan scrollbar horizontal nav di mobile */
@media (max-width: 767px) {
  aside nav::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
}
</style>