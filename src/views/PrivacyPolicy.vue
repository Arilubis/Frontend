<template>
  <div id="main-scroll-container" class="h-screen w-full bg-[#060d2e] font-[Poppins,sans-serif] relative overflow-y-auto scroll-smooth">

    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/8 blur-[140px] rounded-full -translate-x-1/4 -translate-y-1/4"></div>
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-500/6 blur-[120px] rounded-full translate-x-1/4 translate-y-1/4"></div>
    </div>


    <header class="sticky top-0 z-50 w-full px-6 md:px-12 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#060d2e]/90 backdrop-blur-md">
      <router-link
        to="/login"
        class="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[13px] font-normal group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Kembali ke Login
      </router-link>
    </header>
  
    <!-- Page Wrapper -->
    <div class="relative">

      <section class="w-full max-w-4xl mx-auto px-6 md:px-8 pt-12 pb-10 text-center fade-up" style="animation-delay: 0s;">
        <div class="flex justify-center mb-6">
          <img src="../assets/authorix-logo.png" alt="Authorix Logo" class="h-20 w-auto object-contain drop-shadow-md" />
        </div>
        <h1 class="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight mb-4">
        Kebijakan Privasi
      </h1>
        <p class="text-slate-400 text-[13px] font-normal max-w-xl mx-auto leading-relaxed mb-8">
          Authorix menjelaskan bagaimana Authorix mengumpulkan, menggunakan, dan melindungi data Anda sebagai pengguna aplikasi enterprise internal.
        </p>
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <div class="flex items-center gap-2 text-[12px] text-slate-500 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Berlaku: 11 Mei 2026
          </div>
          <div class="flex items-center gap-2 text-[12px] text-slate-500 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
            V1.0.0
          </div>
          <div class="flex items-center gap-2 text-[12px] text-slate-500 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Diperbarui: 20 Mei 2026
          </div>
        </div>
      </section>
      
      <div class="w-full max-w-6xl mx-auto px-6 md:px-8 lg:px-12 pb-16">
        <div class="flex flex-col md:grid md:grid-cols-[240px_1fr] md:gap-16 lg:gap-24">

            <!-- Sidebar Navigasi (sticky, responsive) -->
            <div class="sticky top-[58px] md:top-24 z-40 bg-[#060d2e]/95 backdrop-blur-md md:bg-transparent md:backdrop-blur-none py-3 md:py-0 mb-8 md:mb-0 md:self-start md:max-h-[calc(100vh-140px)] overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-auto border-b border-white/[0.06] md:border-none scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
              <p class="hidden md:block text-[10px] uppercase tracking-[0.3em] text-slate-600 mb-3 font-medium">Navigasi</p>
              <nav class="flex md:flex-col gap-2 md:gap-0 md:space-y-0.5 w-max md:w-auto">
                <a
                  v-for="(section, i) in sections"
                    :key="i"
                    :href="`#section-${i+1}`"
                    @click.prevent="scrollToSection(i + 1)"
                    class="flex items-center gap-2 px-3 py-2 rounded-md text-[12px] font-normal transition-all duration-200 group border-l-2"
                    :class="activeSection === i + 1
                      ? 'text-white bg-purple-500/10 border-purple-500'
                      : 'text-slate-500 hover:text-white hover:bg-purple-500/10 hover:border-purple-500 border-transparent'"
                  >
                    <span
                      class="text-[10px] font-medium w-4 md:w-5 flex-shrink-0 transition-colors"
                      :class="activeSection === i + 1 ? 'text-purple-400' : 'text-white/40 group-hover:text-white'"
                    >{{ String(i+1).padStart(2,'0') }}</span>
                    <span class="whitespace-nowrap md:whitespace-normal">{{ section.navLabel }}</span>
                  </a>
              </nav>
          </div>

          <main class="min-w-0 space-y-12">

            <!-- Intro -->
            <p class="text-[14px] font-normal leading-[1.9] text-slate-300 fade-up" style="animation-delay: 0.05s;">
              <span class="font-semibold text-white">Authorix</span> adalah aplikasi enterprise internal yang digunakan untuk alur persetujuan dokumen dan kegiatan operasional di dalam lingkungan
              <span class="font-medium text-blue-300">PT DIPO Internasional Pahala Otomotif</span>.
            </p>

            <!-- BAGIAN 01 -->
            <section :id="`section-1`" class="fade-up" style="animation-delay: 0.1s;">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-[11px] font-medium text-white/50">01</span>
                <h2 class="text-[15px] font-semibold text-white">Informasi yang Kami Kumpulkan</h2>
              </div>
              <!-- Chip Tags -->
              <div class="flex flex-wrap gap-2 mb-5">
                <span v-for="chip in section1Chips" :key="chip" class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-white">{{ chip }}</span>
              </div>
              <!-- Tabel -->
              <div class="rounded-xl border border-white/[0.07] overflow-hidden">
                <table class="w-full text-[13px]">
                  <thead>
                    <tr class="border-b border-white/[0.07] bg-white/[0.02]">
                      <th class="text-left px-4 py-3 text-slate-500 font-medium">Jenis Data</th>
                      <th class="text-left px-4 py-3 text-slate-500 font-medium">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in section1Table"
                      :key="row.type"
                      class="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td class="px-4 py-3 text-slate-300 font-medium">{{ row.type }}</td>
                      <td class="px-4 py-3 text-slate-400">{{ row.detail }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- Alert: data yang TIDAK dikumpulkan -->
              <div class="mt-4 flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <p class="text-[12px] text-yellow-300/80 leading-relaxed">Authorix <span class="font-semibold text-yellow-300">tidak pernah</span> mengumpulkan nomor kartu kredit, data biometrik, atau akses ke kontak dan galeri foto perangkat Anda.</p>
              </div>
            </section>

            <!-- BAGIAN 02 -->
            <section :id="`section-2`" class="fade-up" style="animation-delay: 0.15s;">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-[11px] font-medium text-white/50">02</span>
                <h2 class="text-[15px] font-semibold text-white">Bagaimana Kami Menggunakan Data Anda</h2>
              </div>
              <!-- Daftar dengan → -->
              <ul class="space-y-2.5 mb-5">
                <li v-for="item in section2List" :key="item" class="flex items-start gap-2.5 text-[13px] text-slate-300 leading-relaxed">
                  <span class="text-white/60 font-medium flex-shrink-0 mt-0.5">→</span>
                  {{ item }}
                </li>
              </ul>
              <!-- Card: Dasar Hukum -->
              <div class="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-2 h-2 rounded-sm bg-white/50 flex-shrink-0"></span>
                  <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dasar Hukum Pemrosesan</p>
                </div>
                <div class="space-y-2">
                  <p v-for="basis in section2LegalBasis" :key="basis" class="text-[13px] text-slate-300 flex items-start gap-2">
                    <span class="text-white/60 flex-shrink-0">→</span>{{ basis }}
                  </p>
                </div>
              </div>
            </section>

            <!-- BAGIAN 03 -->
            <section :id="`section-3`" class="fade-up" style="animation-delay: 0.2s;">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-[11px] font-medium text-white/50">03</span>
                <h2 class="text-[15px] font-semibold text-white">Berbagi Data dengan Pihak Ketiga</h2>
              </div>
              <!-- Alert hijau: tidak menjual data -->
              <div class="mb-5 flex items-start gap-3 bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p class="text-[12px] text-green-300/80 leading-relaxed">Authorix <span class="font-semibold text-green-300">tidak menjual atau memperdagangkan</span> data pengguna kepada pengiklan manapun.</p>
              </div>
              <!-- Tabel layanan pihak ketiga -->
              <div class="rounded-xl border border-white/[0.07] overflow-hidden">
                <table class="w-full text-[13px]">
                  <thead>
                    <tr class="border-b border-white/[0.07] bg-white/[0.02]">
                      <th class="text-left px-4 py-3 text-slate-500 font-medium">Layanan</th>
                      <th class="text-left px-4 py-3 text-slate-500 font-medium">Tujuan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in section3Table"
                      :key="row.service"
                      class="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td class="px-4 py-3 text-slate-300 font-medium">{{ row.service }}</td>
                      <td class="px-4 py-3 text-slate-400">{{ row.purpose }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- Chips -->
              <div class="flex flex-wrap gap-2 mt-4">
                <span v-for="chip in section3Chips" :key="chip" class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-white">{{ chip }}</span>
              </div>
            </section>

            <!-- BAGIAN 04 -->
            <section :id="`section-4`" class="fade-up" style="animation-delay: 0.25s;">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-[11px] font-medium text-white/50">04</span>
                <h2 class="text-[15px] font-semibold text-white">Penyimpanan &amp; Keamanan Data</h2>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="card in section4Cards" :key="card.title" class="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-2 h-2 rounded-sm bg-white/50 flex-shrink-0"></span>
                    <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{{ card.title }}</p>
                  </div>
                  <p class="text-[13px] text-slate-300 leading-relaxed">{{ card.content }}</p>
                </div>
              </div>
              <!-- Alert kuning: retensi data -->
              <div class="mt-4 flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <p class="text-[12px] text-yellow-300/80 leading-relaxed">Data dihapus permanen dalam <span class="font-semibold text-yellow-300">1 hari</span> setelah akun ditutup. Log keamanan disimpan maksimal <span class="font-semibold text-yellow-300">90 hari</span>.</p>
              </div>
            </section>

            <!-- BAGIAN 05 -->
            <section :id="`section-5`" class="fade-up" style="animation-delay: 0.3s;">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-[11px] font-medium text-white/50">05</span>
                <h2 class="text-[15px] font-semibold text-white">Hak Pengguna &amp; Penghapusan Data</h2>
              </div>
              <!-- Tabel hak pengguna -->
              <div class="rounded-xl border border-white/[0.07] overflow-hidden mb-4">
                <table class="w-full text-[13px]">
                  <thead>
                    <tr class="border-b border-white/[0.07] bg-white/[0.02]">
                      <th class="text-left px-4 py-3 text-slate-500 font-medium">Hak</th>
                      <th class="text-left px-4 py-3 text-slate-500 font-medium">Cara Menggunakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="row in section5Table"
                      :key="row.right"
                      class="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td class="px-4 py-3 text-slate-300 font-medium">{{ row.right }}</td>
                      <td class="px-4 py-3 text-slate-400">{{ row.how }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- Alert hijau: waktu pemrosesan -->
              <div class="flex items-start gap-3 bg-green-500/5 border border-green-500/15 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p class="text-[12px] text-green-300/80 leading-relaxed">Permintaan penghapusan akun diproses dalam <span class="font-semibold text-green-300">1 hari kerja</span> melalui menu Pengaturan di dalam aplikasi.</p>
              </div>
            </section>

            <!-- BAGIAN 06 -->
            <section :id="`section-6`" class="fade-up" style="animation-delay: 0.35s;">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-[11px] font-medium text-white/50">06</span>
                <h2 class="text-[15px] font-semibold text-white">Kebijakan Privasi Anak-anak</h2>
              </div>
              <p class="text-[13px] text-slate-300 leading-relaxed mb-4">Authorix adalah aplikasi enterprise internal yang hanya dapat diakses oleh <span class="font-semibold text-white">karyawan atau mitra resmi</span> PT DIPO Internasional Pahala Otomotif. Seluruh akun dibuat secara manual oleh Administrator perusahaan, sehingga tidak ada mekanisme pendaftaran mandiri yang memungkinkan penggunaan oleh pihak yang tidak berwenang.</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="chip in section6Chips" :key="chip" class="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-white">{{ chip }}</span>
              </div>
            </section>

            <!-- BAGIAN 07 -->
            <section :id="`section-7`" class="fade-up" style="animation-delay: 0.4s;">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-[11px] font-medium text-white/50">07</span>
                <h2 class="text-[15px] font-semibold text-white">Perubahan Kebijakan Privasi</h2>
              </div>
              <ul class="space-y-2.5">
                <li v-for="item in section7List" :key="item" class="flex items-start gap-2.5 text-[13px] text-slate-300 leading-relaxed">
                  <span class="text-white/60 font-medium flex-shrink-0 mt-0.5">→</span>
                  {{ item }}
                </li>
              </ul>
            </section>

            <!-- BAGIAN 08 -->
            <section :id="`section-8`" class="fade-up" style="animation-delay: 0.45s;">
              <div class="flex items-center gap-2 mb-5">
                <span class="text-[11px] font-medium text-white/50">08</span>
                <h2 class="text-[15px] font-semibold text-white">Informasi Kontak</h2>
              </div>
              <!-- Kartu Kontak grid 2 kolom -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div v-for="item in section8Contact" :key="item.label" class="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5">
                  <p class="text-[10px] uppercase tracking-[0.3em] text-slate-600 mb-1 font-medium">{{ item.label }}</p>
                  <p class="text-[13px] text-slate-300 font-medium">{{ item.value }}</p>
                </div>
              </div>
              <p class="mt-4 text-[12px] text-slate-500 leading-relaxed">
                Setiap pertanyaan dijawab dalam <span class="text-slate-400">1 hari kerja</span>. Permintaan penghapusan data diproses maksimal <span class="text-slate-400">1 hari kerja</span>.
              </p>
            </section>

          </main>
        </div>
      </div>

      <footer class="mt-4 border-t border-white/[0.07] py-8 text-center space-y-2">
        <p class="text-[10px] font-normal text-slate-600 uppercase tracking-[0.4em]">
          © 2026 Authorix System
        </p>
        <p class="text-[12px] font-normal text-slate-600">
          PT DIPO Internasional Pahala Otomotif
        </p>
      </footer>

    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',

  data() {
    return {
      activeSection: 1,
      // Navigasi sidebar — 8 tautan
      sections: [
        { navLabel: 'Informasi yang Dikumpulkan' },
        { navLabel: 'Penggunaan Data' },
        { navLabel: 'Berbagi Data Pihak Ketiga' },
        { navLabel: 'Penyimpanan & Keamanan' },
        { navLabel: 'Hak Pengguna' },
        { navLabel: 'Privasi Anak-anak' },
        { navLabel: 'Perubahan Kebijakan' },
        { navLabel: 'Informasi Kontak' },
      ],

      // Bagian 01 — Chip
      section1Chips: [
        'Data Akun',
        'Log Aktivitas',
        'Data Dokumen',
        'Preferensi Notifikasi',
      ],

      // Bagian 01 — Tabel
      section1Table: [
        { type: 'Informasi Akun', detail: 'Username, nama lengkap, email, nomor telepon, foto profil, jabatan, dan peran (role)' },
        { type: 'Data Sesi & Token', detail: 'Data token disimpan pada browser untuk menjaga sesi login pengguna agar tetap aktif saat menggunakan aplikasi' },
        { type: 'Log Aktivitas', detail: 'Waktu login, tindakan pada permohonan (approve, reject, revisi, disposisi), dan riwayat persetujuan dokumen' },
        { type: 'Data Dokumen', detail: 'Judul, deskripsi, kategori, status permohonan, serta file lampiran yang diunggah (nama, ukuran, tipe, checksum)' },
        { type: 'Preferensi Notifikasi', detail: 'Pilihan saluran notifikasi yang dikonfigurasi pengguna: email dan WhatsApp' },
      ],

      // Bagian 02 — Daftar →
      section2List: [
        'Memverifikasi identitas pengguna dan menjaga keamanan sesi login',
        'Memproses alur persetujuan dokumen secara bertingkat antara User, Approver, dan Reviewer',
        'Mencatat riwayat dan audit trail setiap tindakan yang dilakukan pada dokumen permohonan',
        'Mengirim notifikasi operasional melalui email dan WhatsApp sesuai preferensi masing-masing pengguna',
        'Memungkinkan Administrator mengelola akun, peran, dan status pengguna di dalam sistem',
        'Menyajikan statistik dan laporan operasional pada halaman Dashboard perusahaan',
      ],

      // Bagian 02 — Card: Dasar Hukum
      section2LegalBasis: [
        'Persetujuan pengguna saat akun dibuat dan diaktifkan oleh Administrator perusahaan',
        'Pelaksanaan kewajiban kerja dalam kontrak kepegawaian PT DIPO Internasional Pahala Otomotif',
        'Kepentingan operasional dan keamanan sistem yang sah',
      ],

      // Bagian 03 — Tabel layanan pihak ketiga
      section3Table: [
        { service: 'Server Backend Internal', purpose: 'Seluruh data pengguna dan dokumen disimpan di server yang dikelola langsung oleh tim IT perusahaan' },
        { service: 'Email Service', purpose: 'Pengiriman notifikasi operasional dan tautan reset password ke alamat email pengguna yang terdaftar' },
        { service: 'WhatsApp Notification', purpose: 'Pengiriman notifikasi terkait status permohonan melalui nomor WhatsApp pengguna sesuai preferensi' },
      ],

      // Bagian 03 — Chips
      section3Chips: [
        'Tidak Ada Iklan Pihak Ketiga',
        'Data Dikelola Internal Perusahaan',
        'Tanpa Monetisasi Data',
      ],

      // Bagian 04 — Cards
      section4Cards: [
        { title: 'Keamanan Sesi & Token', content: 'Token akses disimpan di localStorage dan dikirim melalui cookie terautentikasi. Sistem secara otomatis memperbarui token saat hampir habis, dan menghapus semua sesi saat pengguna logout.' },
        { title: 'Keamanan Kata Sandi', content: 'Kata sandi wajib minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol. Tersedia indikator kekuatan kata sandi dan mekanisme cooldown untuk mencegah percobaan login berulang.' },
        { title: 'Kontrol Akses (RBAC)', content: 'Setiap halaman dilindungi Navigation Guard berbasis peran: ADMIN, USER, APPROVER, dan REVIEWER. Pengguna hanya dapat mengakses fitur yang sesuai dengan perannya di sistem.' },
        { title: 'Manajemen Status Akun', content: 'Administrator dapat mengubah status akun pengguna menjadi INACTIVE, FREEZE, atau BLOCKED untuk segera mencabut akses pengguna yang tidak lagi berhak menggunakan sistem.' },
      ],

      // Bagian 05 — Tabel hak pengguna
      section5Table: [
        { right: 'Lihat Data Profil', how: 'Akses menu My Account atau Settings untuk melihat seluruh data diri yang tersimpan' },
        { right: 'Edit Profil', how: 'Ubah nama lengkap dan nomor telepon melalui Settings → Profile → Save Changes' },
        { right: 'Ganti Kata Sandi', how: 'Ubah kata sandi kapan saja melalui Settings → Security → Change Password' },
        { right: 'Kelola Foto Profil', how: 'Unggah atau hapus foto profil (avatar) melalui halaman My Account' },
        { right: 'Atur Notifikasi', how: 'Aktifkan atau nonaktifkan notifikasi email dan WhatsApp di Settings → Notifications' },
        { right: 'Kelola Dokumen Draft', how: 'Edit, hapus, atau batalkan permohonan yang masih berstatus Draft sebelum disubmit' },
      ],

      // Bagian 06 — Chips
      section6Chips: [
        'Akun Dibuat oleh Administrator',
        'Khusus Karyawan Perusahaan',
        'Sistem Akses Tertutup',
      ],

      // Bagian 07 — Daftar →
      section7List: [
        'Perubahan fitur atau cara pengumpulan data akan diumumkan melalui notifikasi di dalam aplikasi atau email resmi yang dikirim kepada seluruh pengguna terdaftar.',
        'Penggunaan aplikasi yang berlanjut setelah pembaruan kebijakan diberlakukan dianggap sebagai bentuk persetujuan pengguna atas perubahan tersebut.',
        'Untuk melihat riwayat kebijakan sebelumnya atau mengajukan pertanyaan terkait perubahan kebijakan, hubungi Departemen IT atau HRD perusahaan.',
      ],

      // Bagian 08 — Kartu Kontak
      section8Contact: [
        { label: 'Nama Aplikasi', value: 'Authorix' },
        { label: 'Perusahaan', value: 'PT DIPO Internasional Pahala Otomotif' },
        { label: 'Pengelola Sistem', value: 'Departemen IT Perusahaan' },
        { label: 'Saluran Kontak', value: 'Melalui jalur komunikasi internal perusahaan' },
      ],
    };
  },

  mounted() {
    
    this.scrollContainer = document.getElementById('main-scroll-container');

    // ─── IntersectionObserver — gunakan scrollContainer sebagai root ──────
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const index = parseInt(id.split('-')[1]);
            this.activeSection = index;
          }
        });
      },
      {
        root: this.scrollContainer || null,
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    );

    this.sections.forEach((_, i) => {
      const el = document.getElementById(`section-${i + 1}`);
      if (el) this.observer.observe(el);
    });
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
  },

  methods: {
    scrollToSection(index) {
      const el = document.getElementById(`section-${index}`);
      if (!el) return;

      const container = this.scrollContainer;
      if (container) {
        // Scroll di dalam container (main.overflow-y-auto)
        // offsetTop relatif terhadap offsetParent, kita perlu posisi relatif container
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        // Pada mobile (lebar < 768px), kita offset tambahan sedikit untuk tinggi menu horizontal yang sticky
        const isMobile = window.innerWidth < 768;
        const offset = isMobile ? 130 : 96;

        // Jarak dari top container ke elemen + posisi scroll saat ini - offset
        const scrollTop = container.scrollTop + (elRect.top - containerRect.top) - offset;
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      } else {
        // Fallback ke window jika container tidak ditemukan
        const headerOffset = 96;
        const elTop = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: elTop, behavior: 'smooth' });
      }
    },
  },
};
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-up {
  animation: fadeUp 0.55s ease forwards;
  opacity: 0;
}
/* Smooth scroll untuk scroll container di SidebarWrapper dan PrivacyPolicy */
:global(main.flex-1), #main-scroll-container {
  scroll-behavior: smooth;
}

/* Hide scrollbar for mobile horizontal nav */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>