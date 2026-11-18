<template>
  <div>
    <button @click="showAddUserModal = true">
      + Add New User
    </button>
    
    <AddUserModal 
      v-if="showAddUserModal" 
      @close="showAddUserModal = false"
      @add-user="handleAddNewUser"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
// PENTING: Impor AddUserModal.vue karena ia berada di folder components yang sama
import AddUserModal from './AddUserModal.vue'; 

const showAddUserModal = ref(false); 

const handleAddNewUser = (newUser) => {
    console.log("Menambahkan user:", newUser);
    // Lakukan API call di sini
    showAddUserModal.value = false;
};
</script>