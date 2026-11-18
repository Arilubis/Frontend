<template>
  <Transition name="modal-fade">
    <div v-if="isVisible" 
        @click.self="close"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4" 
        style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);">
      <div class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        <!-- Header dengan Gradient Merah -->
        <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-red-600 to-red-700">
          <button @click="close" 
                  class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors">
            <span class="material-icons text-2xl">close</span>
          </button>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span class="material-icons text-white text-4xl">block</span>
            </div>
            <div>
              <h2 class="text-3xl font-black italic uppercase text-white tracking-tight">
                Akses Ditolak!
              </h2>
              <p class="text-white/80 text-sm font-medium mt-1">
                Tidak dapat mengakses halaman
              </p>
            </div>
          </div>
        </div>
        
        <!-- Body Content -->
        <div class="p-8">
          <div class="bg-red-50 rounded-2xl p-5 border-2 border-red-100">
            <div class="flex items-start gap-3">
              <span class="material-icons text-red-600 text-2xl flex-shrink-0">error</span>
              <div>
                <p class="text-sm font-bold text-slate-900 mb-2">
                  {{ message }}
                </p>
                <p class="text-xs text-slate-600">
                  Role Anda: <span class="font-bold">{{ userRoles }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
          <button @click="close" 
                  class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-red-100 active:scale-95">
            <span class="material-icons text-sm">close</span>
            OK
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';

const isVisible = ref(false);
const message = ref('');
const userRoles = ref('');
const redirectPath = ref('/');

const show = (options = {}) => {
  message.value = options.message || 'Hanya User yang dapat membuat permohonan.';
  userRoles.value = options.roles || 'APPROVER';
  redirectPath.value = options.redirectPath || '/';
  isVisible.value = true;
};

const close = () => {
  isVisible.value = false;
  // Redirect setelah modal ditutup
  if (window.$router && redirectPath.value) {
    setTimeout(() => {
      window.$router.push(redirectPath.value);
    }, 300);
  }
};

// Expose methods untuk digunakan dari luar
defineExpose({
  show,
  close
});
</script>

<style scoped>
.modal-fade-enter-active {
  transition: all 0.3s ease-out;
}

.modal-fade-leave-active {
  transition: all 0.2s ease-in;
}

.modal-fade-enter-from {
  opacity: 0;
}

.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .bg-white {
  transform: scale(0.95);
}

.modal-fade-leave-to .bg-white {
  transform: scale(0.95);
}

/* Smooth icon animation */
.material-icons {
  transition: transform 0.2s ease;
}

button:hover .material-icons {
  transform: scale(1.1);
}
</style>