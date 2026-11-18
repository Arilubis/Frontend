<template>
  <div class="modal">
    <h2>Reset Password {{ user.username }}</h2>

    <input :type="show ? 'text' : 'password'" v-model="password" />
    <button @click="show = !show">👁</button>

    <button @click="submit">Reset</button>
    <button @click="$emit('close')">Batal</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const props = defineProps({ user: Object })
const emit = defineEmits(['close'])

const password = ref('')
const show = ref(false)

const submit = async () => {
  await api.patch(`/users/${props.user.id}/reset-password`, {
    newPassword: password.value
  })
  emit('close')
}
</script>
