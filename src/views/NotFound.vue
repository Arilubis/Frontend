<template>
  <div class="min-h-screen w-full bg-[#060d2e] flex items-center justify-center px-4 font-poppins relative overflow-hidden">

    <!-- Background glow -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/8 blur-[140px] rounded-full"></div>
      <div class="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-700/5 blur-[100px] rounded-full"></div>
    </div>

    <div class="relative text-center max-w-sm w-full flex flex-col items-center">

      <!-- 404 Number -->
      <div class="mb-2 select-none leading-none">
        <span class="text-[100px] md:text-[120px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/15 to-white/[0.03]">
          404
        </span>
      </div>

      <!-- Icon -->
      <div class="flex justify-center mb-5 -mt-2">
        <div class="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/[0.08]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-xl md:text-2xl font-semibold text-white tracking-tight mb-2">
        Halaman Tidak Ditemukan
      </h1>

      <!-- URL Info -->
      <p class="text-slate-400 text-[13px] font-normal leading-relaxed mb-1">
        URL <span class="font-medium text-slate-300">{{ $route.fullPath }}</span> tidak tersedia.
      </p>
      <p class="text-slate-600 text-[12px] font-normal mb-8">
        Periksa kembali alamat URL yang Anda masukkan.
      </p>

      <!-- Divider -->
      <div class="flex items-center gap-4 w-full mb-8">
        <div class="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.08]"></div>
        <div class="w-1 h-1 rounded-full bg-blue-500/40"></div>
        <div class="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.08]"></div>
      </div>

      <!-- Single Action Button — centered -->
      <router-link
        :to="userIsLoggedIn ? '/dashboard' : '/login'"
        class="px-8 py-3 rounded-xl bg-slate-100 hover:bg-white text-slate-900 transition-all text-[13px] font-medium shadow-lg active:scale-[0.98] inline-block"
      >
        {{ userIsLoggedIn ? 'Ke Dashboard' : 'Kembali ke Login' }}
      </router-link>

      <!-- Footer -->
      <p class="mt-12 text-[10px] font-normal text-slate-700 uppercase tracking-[0.4em]">
        © 2026 Authorix System
      </p>

    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',

  computed: {
    userIsLoggedIn() {
      return !!localStorage.getItem('user');
    }
  },
};
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
</style>
