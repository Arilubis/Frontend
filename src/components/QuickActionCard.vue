<template>
  <div 
    class="bg-white shadow rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
    @click="goToPage"
  >
    <div class="text-3xl mb-2">{{ icon }}</div>
    <p class="font-medium">{{ label }}</p>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

const props = defineProps({
  icon: String,
  label: String,
  route: String   // optional: biar tinggal kasih route dari parent
})

const router = useRouter()

const goToPage = () => {
  // kalau dari parent sudah diberi route → langsung pakai
  if (props.route) {
    return router.push(props.route)
  }

  // fallback berdasarkan label
  if (props.label === "Tambah Surat") {
    router.push("/add-document")
  }
}
</script>
