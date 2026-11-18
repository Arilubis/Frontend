<template>
  <div class="space-y-2">
    <!-- Multi-select with searchable dropdown (Simplified: No Sequential/Parallel toggle) -->
    <div class="space-y-2">
      <!-- Selected Users Tags -->
      <div class="flex flex-wrap gap-1.5 p-2 min-h-[40px] bg-slate-50 rounded-lg border border-slate-100">
        <div 
          v-for="userId in reviewers" 
          :key="userId" 
          class="inline-flex items-center bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-1 rounded-md"
        >
          {{ getUserName(userId) }}
          <button 
            @click="removeUser(userId)" 
            class="ml-1.5 text-blue-400 hover:text-blue-600 transition-colors"
          >
            <span class="material-icons text-[12px]">close</span>
          </button>
        </div>
        <span v-if="reviewers.length === 0" class="text-[9px] text-slate-400 italic py-1">
          No approvers selected
        </span>
      </div>

      <!-- Searchable Add -->
      <div class="relative">
        <div class="relative">
          <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">person_add</span>
          <input 
            type="text"
            v-model="searchQuery"
            @focus="isDropdownOpen = true"
            @blur="closeDropdownDelayed"
            placeholder="Search & add approver..."
            class="w-full pl-9 pr-3 py-2 text-[10px] font-bold bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div v-if="isDropdownOpen" class="absolute z-[60] w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-[150px] overflow-y-auto">
          <div 
            v-for="user in filteredUsers" 
            :key="user.id"
            @mousedown="addUser(user.id)"
            class="px-3 py-2 text-[10px] font-medium hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
          >
            {{ user.name }} <span class="text-slate-400 font-normal">{{ user.position ? `(${user.position})` : '' }}</span>
          </div>
          <div v-if="filteredUsers.length === 0" class="px-3 py-2 text-[10px] text-slate-400 italic">
            No matches found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  levelId: { type: Number, required: true },
  levelIndex: { type: Number, required: true },
  reviewers: { type: Array, required: true },
  approverList: { type: Array, required: true },
  otherLevelsReviewers: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:reviewers']);

const searchQuery = ref('');
const isDropdownOpen = ref(false);

const closeDropdownDelayed = () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 200);
};

// Get available users (not selected yet)
const availableUsers = computed(() => {
  return props.approverList.filter(
    user =>
      !props.otherLevelsReviewers.includes(user.id) &&
      !props.reviewers.includes(user.id)
  );
});

// Filtered list based on search query
const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return availableUsers.value;
  return availableUsers.value.filter(user => 
    user.name.toLowerCase().includes(query) || 
    (user.position && user.position.toLowerCase().includes(query))
  );
});

// Get user name by ID
const getUserName = (userId) => {
  const user = props.approverList.find(u => u.id === userId);
  return user ? `${user.name}${user.position ? ` (${user.position})` : ''}` : 'Unknown';
};

// Add user to parallel list
const addUser = (userId) => {
  if (!userId) return;
  
  if (!props.reviewers.includes(userId)) {
    const newReviewers = [...props.reviewers, userId];
    emit('update:reviewers', newReviewers);
  }
  searchQuery.value = ''; // Clear search after selection
};

// Remove user from parallel list
const removeUser = (userId) => {
  const newReviewers = props.reviewers.filter(id => id !== userId);
  emit('update:reviewers', newReviewers);
};
</script>