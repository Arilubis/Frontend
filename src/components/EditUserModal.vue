<template>
  <div class="modal">
    <h2>Edit User</h2>

    <input v-model="local.username" />
    <select v-model="local.role">
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>

    <button @click="submit">Update</button>
    <button @click="$emit('close')">Batal</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({ user: Object })
const emit = defineEmits(['updated', 'close'])

const local = ref({ ...props.user })

watch(() => props.user, u => local.value = { ...u })

const submit = async () => {
  const res = await api.put(`/users/${local.value.id}`, local.value)
  emit('updated', res.data.data)
}
</script>
