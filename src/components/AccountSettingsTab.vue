<template>
  <div class="space-y-10">

    <div>
      <h2 class="text-2xl font-semibold text-gray-800 tracking-tight">
        Pengaturan Akun
      </h2>
      <p class="text-gray-500 text-[13px] font-normal mt-1">Kelola profil, keamanan, dan preferensi Anda.</p>
    </div>
    
    <div class="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
      <h3 class="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
        <span class="w-2 h-2 bg-blue-500 rounded-full"></span> Profil Saya
      </h3>

      <div class="flex items-center gap-8">

        <div class="flex flex-col items-center">
          <img
            :src="previewImage || defaultImage"
            class="w-28 h-28 rounded-full object-cover border border-gray-200 shadow-sm"
            alt="Foto Profil Pengguna"
          />

          <label class="mt-3 cursor-pointer text-sm font-medium text-blue-600 hover:underline">
            <input type="file" class="hidden" @change="uploadPhoto" />
            Ganti Foto
          </label>
        </div>

        <div class="flex-1 space-y-4">

          <div>
            <label class="label-modern">Nama</label>
            <input v-model="profile.name" class="input-modern" />
          </div>

          <div>
            <label class="label-modern">Email</label>
            <input v-model="profile.email" class="input-modern" />
          </div>

          <button class="btn-modern-primary w-fit" @click="updateProfile">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 transition hover:shadow-md">
      <h3 class="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
        <span class="w-2 h-2 bg-purple-500 rounded-full"></span> Ganti Password
      </h3>

      <div class="space-y-4 max-w-lg">
        <input
          v-model="oldPassword"
          type="password"
          class="input-modern"
          placeholder="Password Lama"
        />

        <input
          v-model="newPassword"
          type="password"
          class="input-modern"
          placeholder="Password Baru"
        />

        <button class="btn-modern-primary w-fit" @click="changePassword">
          Ganti Password
        </button>
      </div>
    </div>

    <div class="pt-4">
      <button
        @click="handleLogout"
        class="btn-modern-danger"
      >
        Logout
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// Asumsi axios sudah dikonfigurasi sebagai alias
import axios from "@/utils/axios"; 
import { useRouter } from "vue-router";
import { logoutUser } from "@/services/auth";

const router = useRouter();

const profile = ref({
  name: "",
  email: ""
});

const oldPassword = ref("");
const newPassword = ref("");

const defaultImage = "/default-avatar.png";
const previewImage = ref("");

// Fetch profile data saat komponen dimuat
onMounted(async () => {
  try {
    const res = await axios.get("/auth/me");
    profile.value = res.data.data;
    // Asumsi res.data.data juga berisi URL foto profil jika ada
    if (res.data.data.profile_photo_url) {
      previewImage.value = res.data.data.profile_photo_url;
    }
  } catch (error) {
    console.error("Gagal memuat profil:", error);
  }
});

// Update Profile
const updateProfile = async () => {
  try {
    await axios.put("/auth/me", profile.value);
    alert("Profil berhasil diperbarui");
  } catch (error) {
    console.error("Gagal update profil:", error);
    alert("Gagal update profil.");
  }
};

// Change Password
const changePassword = async () => {
  try {
    await axios.patch("/auth/me/change-password", {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    });
    alert("Password berhasil diganti");
    oldPassword.value = '';
    newPassword.value = '';
  } catch (error) {
    console.error("Gagal ganti password:", error);
    alert("Gagal ganti password. Periksa password lama Anda.");
  }
};

// Upload Foto
const uploadPhoto = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Tampilkan preview lokal
    previewImage.value = URL.createObjectURL(file);

    // TODO: Tambahkan logika API call untuk upload foto ke server
    console.log("File siap diupload:", file.name);
  }
};

// Logout
const handleLogout = async () => {
  try {
    // Panggil service logout
    await logoutUser(); 
    // Hapus token lokal
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    // Redirect ke halaman login
    router.push("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Tetap hapus token dan redirect meskipun logout API gagal
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  }
};
</script>

<style scoped>

</style>