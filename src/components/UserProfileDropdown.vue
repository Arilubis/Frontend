<template>
  <div class="relative inline-block text-left">
    <button
      @click="isDropdownOpen = !isDropdownOpen"
      type="button"
      class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white font-semibold text-sm shadow-md transition duration-150"
      aria-expanded="true"
      aria-haspopup="true"
    >
      R
    </button>

    <div
      v-if="isDropdownOpen"
      class="origin-top-right absolute right-0 mt-3 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700 z-50"
      role="menu"
      aria-orientation="vertical"
    >
      <div class="py-1">
        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left transition duration-100">
          User Profile
        </a>
        <a href="#" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left transition duration-100">
          My Account
        </a>
      </div>

      <div class="py-1">
        <router-link :to="{ name: 'Pengaturan' }" class="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left transition duration-100">
          Settings
        </router-link>

        <button @click="handleLogout" class="block px-4 py-2 text-sm text-red-400 font-semibold hover:bg-gray-700 w-full text-left transition duration-100">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logoutUser } from '@/services/auth';

const router = useRouter();
const isDropdownOpen = ref(false);

const handleLogout = async () => {
    isDropdownOpen.value = false;

    try {
        // Jika ingin panggil API:
         await logoutUser();

        // Hapus token
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        router.push({ name: "Login" });

    } catch (error) {
        console.error("Logout failed:", error);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        router.push({ name: "Login" });
    }
};

</script>


<style scoped>
/* .dropdown-item {
    @apply block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left transition duration-100;
}
.logout-item {
    @apply text-red-400 font-semibold;
}
*/
</style>