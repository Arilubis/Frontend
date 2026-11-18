<template>
  <div class="flex-1 p-8 bg-gray-50 h-full overflow-y-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Document Management System</h1>

    <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div class="mb-5">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" id="title" placeholder="" class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-accent focus:border-primary-accent">
      </div>

      <div class="mb-5">
        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select id="category" class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-accent focus:border-primary-accent text-gray-500">
          <option value="" disabled selected>--Select Category--</option>
          <option value="internal">Internal</option>
          <option value="external">External</option>
        </select>
      </div>

      <div class="mb-5">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="description" rows="3" class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-accent focus:border-primary-accent"></textarea>
      </div>

      <div class="mb-8 border p-4 rounded-lg bg-gray-100 relative">
        <label class="block text-sm font-medium text-gray-700 mb-3">Approval Flow</label>
        
        <div class="flex flex-wrap gap-4">
          <ApprovalLevel
            v-for="(level, index) in approvalLevels"
            :key="level.id"
            :level-id="level.id"
            :level-index="index"
            :level-type="level.type"
            :reviewers="level.reviewers"
            :all-selected-reviewers="allSelectedReviewers"
            @update:reviewers="level.reviewers = $event"
            @deleteLevel="deleteApprovalLevel"
            :class="{ 'w-full md:w-[calc(50%-0.5rem)]': approvalLevels.length >= 2, 'w-full': approvalLevels.length === 1 }"
          />
        </div>

        <div class="flex justify-end mt-4">
          <button @click="addApprovalLevel" class="flex items-center text-white bg-dark-control hover:bg-gray-700 font-medium rounded-md text-xs px-3 py-1.5 transition-colors">
            + Add more approval level
          </button>
        </div>
      </div>

      <div class="mb-5">
        <label for="reviewer" class="block text-sm font-medium text-gray-700 mb-1">Reviewer</label>
        <select id="reviewer" class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-accent focus:border-primary-accent text-gray-700">
          <option value="" disabled selected>Select Reviewer</option>
          <option value="userA">User A</option>
          <option value="userB">User B</option>
        </select>
      </div>

      <div class="mb-8">
        <label class="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
        <div class="flex items-center p-2 border border-gray-300 rounded-md bg-white cursor-pointer hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13.5" />
          </svg>
          <span class="text-gray-500">Select Files</span>
          <input type="file" multiple class="hidden">
        </div>
      </div>

      <div class="flex justify-start gap-4">
        <button type="button" class="px-6 py-2 bg-secondary-button text-white font-medium rounded-md hover:bg-indigo-600 transition-colors">
          ← Kembali
        </button>
        <button type="submit" class="px-6 py-2 bg-primary-accent text-white font-medium rounded-md hover:bg-indigo-600 transition-colors ml-auto">
          SUBMIT
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ApprovalLevel from './ApprovalLevel.vue';

let nextLevelId = 3; // Mulai ID untuk level berikutnya setelah 1 dan 2

// Struktur data untuk mengelola Level Persetujuan
const approvalLevels = ref([
  { id: 1, type: 'sequential', reviewers: [1, 2, 3] }, // Level 1 (Sequential)
  { id: 2, type: 'parallel', reviewers: [4] },        // Level 2 (Parallel)
]);

const allSelectedReviewers = computed(() => {
  return approvalLevels.value.flatMap(level => level.reviewers);
});

// Fungsi untuk menambah level baru
function addApprovalLevel() {
  const newLevel = {
    id: nextLevelId++,
    // Level selanjutnya akan bertipe 'parallel' secara default, 
    // tetapi Anda bisa menyesuaikan logika ini
    type: 'parallel', 
    reviewers: [],
  };
  approvalLevels.value.push(newLevel);
}

// Fungsi untuk menghapus level
function deleteApprovalLevel(id) {
  if (approvalLevels.value.length > 1) {
    const index = approvalLevels.value.findIndex(level => level.id === id);
    if (index !== -1) {
      approvalLevels.value.splice(index, 1);
      // Opsional: Perbarui index/penamaan Level setelah penghapusan
    }
  }
}
</script>