<template>
  <div class="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">Approval Queue</h1>
          <p class="text-slate-400 text-[12px] mt-0.5">{{ documents.length }} document(s) pending review</p>
        </div>
      </div>

      <!-- Card layout untuk mobile -->
      <div class="space-y-3 md:hidden">
        <div v-for="doc in documents" :key="doc.id"
             class="bg-white rounded-[20px] border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="p-2.5 bg-blue-50 rounded-xl flex-shrink-0 text-blue-600">
              <span class="material-icons text-lg">description</span>
            </div>
            <div class="min-w-0">
              <div class="text-[13px] font-semibold text-slate-900 truncate">{{ doc.title }}</div>
              <div class="text-[9px] text-slate-400 font-mono truncate">{{ doc.number }}</div>
              <span :class="doc.priority === 'High' ? 'text-red-600 bg-red-50 border-red-100' : 'text-blue-600 bg-blue-50 border-blue-100'"
                    class="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium uppercase border">
                {{ doc.priority }}
              </span>
            </div>
          </div>
          <button @click="handleReview(doc.id)"
                  class="flex-shrink-0 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-[10px] uppercase tracking-wider hover:bg-blue-600 transition-all active:scale-95 whitespace-nowrap">
            Review
          </button>
        </div>
        <div v-if="documents.length === 0" class="bg-white rounded-[20px] border border-slate-100 p-10 text-center">
          <span class="material-icons text-slate-200 text-4xl block mb-2">auto_awesome</span>
          <p class="text-sm text-slate-400">No documents in queue</p>
        </div>
      </div>

      <!-- Table layout untuk desktop -->
      <div class="hidden md:block bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-medium">
              <th class="px-8 py-5">Document Details</th>
              <th class="px-8 py-5 text-center">Priority</th>
              <th class="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="doc in documents" :key="doc.id" class="group hover:bg-blue-50/30 transition-all">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div class="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                    <span class="material-icons text-xl">description</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ doc.title }}</div>
                    <div class="text-[10px] text-gray-400 font-normal font-mono">{{ doc.number }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5 text-center">
                <span :class="doc.priority === 'High' ? 'text-red-600 bg-red-50 border-red-100' : 'text-blue-600 bg-blue-50 border-blue-100'"
                      class="px-3 py-1 rounded-full text-[10px] font-medium uppercase border">
                  {{ doc.priority }}
                </span>
              </td>
              <td class="px-8 py-5 text-right">
                <button @click="handleReview(doc.id)"
                        class="bg-gray-900 text-white px-6 py-3 rounded-2xl font-medium text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95">
                  REVIEW TASK
                </button>
              </td>
            </tr>
            <tr v-if="documents.length === 0">
              <td colspan="3" class="px-8 py-16 text-center">
                <span class="material-icons text-slate-200 text-4xl block mb-2">auto_awesome</span>
                <p class="text-sm text-slate-400">No documents in queue</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import permohonanService from '@/services/permohonanService';

const router = useRouter();
const authStore = useAuthStore();

const documents = ref([]);
const loading = ref(false);

const isUserAuthorized = (doc) => {
  const userId = authStore.user?.id;
  if (!userId) return false;
  
  const isApprover = doc.approvalLevels?.some(level => 
    level.approvers?.some(approver => approver.id === userId)
  );

  const isReviewer = doc.reviewers?.some(reviewer => reviewer.id === userId);

  return isApprover || isReviewer;
};

onMounted(async () => {
  await loadDocuments();
});

const loadDocuments = async () => {
  try {
    loading.value = true;
    
    const response = await permohonanService.getApprovalPending();
    const userId = authStore.user?.id;
    
    documents.value = response.data
      .filter(doc => doc.createdBy !== userId)
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        number: doc.id.substring(0, 12).toUpperCase(),
        priority: doc.categoryInfo?.name?.includes('Urgent') ? 'High' : 'Normal',
        category: doc.categoryInfo?.name || 'General',
        canApprove: doc._metadata?.canApprove || false,
        createdBy: doc.createdBy
      }));
    
    console.log('✅ Authorized documents loaded:', documents.value.length);
  } catch (error) {
    console.error('Failed to load documents:', error);
    alert('❌ Gagal memuat dokumen: ' + (error.response?.data?.message || error.message));
  } finally {
    loading.value = false;
  }
};

const handleReview = (id) => {
  router.push(`/approver/review/${id}`);
};
</script>