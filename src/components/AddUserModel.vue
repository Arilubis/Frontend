<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" 
       @click.self="$emit('close')">
    
    <div class="bg-white p-6 rounded-lg shadow-2xl w-full max-w-xl">
      
      <h3 class="text-2xl font-bold text-gray-800 text-center mb-6 border-b pb-3">Add New Users</h3>

      <form @submit.prevent="submitUser" class="space-y-4">
        
        <h4 class="text-lg font-semibold text-gray-700 mt-4 mb-2 border-b border-gray-200 pb-1">Informasi Pribadi</h4>
        
        <input type="text" v-model="form.namaLengkap" placeholder="Nama Lengkap" 
               class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:text-sm" required>
        <input type="email" v-model="form.email" placeholder="Email" 
               class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:text-sm" required>
        <input type="tel" v-model="form.nomorTelepon" placeholder="Nomor telepon" 
               class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:text-sm">
        <input type="date" v-model="form.birthdate" 
               class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:text-sm">
        
        <select v-model="form.jenisKelamin" 
                class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:text-sm appearance-none">
          <option value="" disabled selected>Jenis Kelamin</option>
          <option value="Pria">Pria</option>
          <option value="Wanita">Wanita</option>
        </select>
        
        <h4 class="text-lg font-semibold text-gray-700 mt-4 mb-2 border-b border-gray-200 pb-1">Role & Permissions</h4>
        
        <select v-model="form.role" 
                class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:text-sm appearance-none" required>
          <option value="" disabled selected>Role</option>
          <option value="administrator">Administrator</option>
          <option value="User">User</option>
        </select>
        <input type="password" v-model="form.kataSandi" placeholder="Kata Sandi" 
               class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:text-sm" required>
        <input type="password" v-model="form.ulangKataSandi" placeholder="Ulang Kata Sandi" 
               class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:text-sm" required>

        <div class="flex justify-end gap-3 pt-4">
          
          <button type="button" @click="$emit('close')" 
                  class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">
            Batalkan
          </button>
          
          <button type="submit" 
                  class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-md">
            Tambah Pengguna
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddUserModal',
  emits: ['close', 'add-user'], 
  data() {
    return {
      form: {
        namaLengkap: '', email: '', nomorTelepon: '', birthdate: '',
        jenisKelamin: '', role: '', kataSandi: '', ulangKataSandi: ''
      }
    };
  },
  methods: {
    submitUser() {
      if (this.form.kataSandi !== this.form.ulangKataSandi) {
        alert("Kata sandi tidak cocok!");
        return;
      }

      const newUser = {
        name: this.form.namaLengkap, email: this.form.email, phone: this.form.nomorTelepon, 
        birthdate: this.form.birthdate, gender: this.form.jenisKelamin, role: this.form.role, 
        password: this.form.kataSandi 
      };

      this.$emit('add-user', newUser);
      
      this.form = {
        namaLengkap: '', email: '', nomorTelepon: '', birthdate: '',
        jenisKelamin: '', role: '', kataSandi: '', ulangKataSandi: ''
      };
    }
  }
};
</script>