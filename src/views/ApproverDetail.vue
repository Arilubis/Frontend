<template>
  <div class="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans selection:bg-emerald-100">
    <div class="max-w-7xl mx-auto">
      
      <Transition name="slide-fade" mode="out-in">
        <div v-if="selectedDoc" :key="'detail'" class="space-y-6">
          <nav class="flex justify-between items-center backdrop-blur-md bg-white/70 sticky top-5 z-50 p-4 rounded-[24px] border border-white shadow-xl shadow-slate-200/50">
            <button @click="closeDetail" class="group flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all duration-500">
              <span class="material-icons text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
              <span class="text-[10px] font-medium uppercase tracking-[0.2em]">Back to Queue</span>
            </button>
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
              <span class="text-[10px] font-medium uppercase text-slate-500 tracking-widest">Live Reviewing Mode</span>
            </div>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
            <div class="lg:col-span-8 group">
              <div class="relative h-[60vh] md:h-[85vh] bg-slate-900 rounded-[24px] md:rounded-[40px] p-2 shadow-2xl overflow-hidden border-4 md:border-[8px] border-slate-900 transition-all duration-700">
                <div class="absolute top-4 right-4 flex gap-2 z-10">
                  <button 
                    v-if="pdfUrl"
                    @click="openInNewTab(pdfUrl)" 
                    title="Buka di Tab Baru (Google Chrome)"
                    class="bg-white/10 backdrop-blur-md hover:bg-white px-3 py-2 rounded-xl text-white hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-medium border border-white/10 shadow-lg"
                  >
                    <span class="material-icons text-sm">open_in_new</span>
                    <span class="hidden sm:inline">Buka di Tab Baru</span>
                  </button>
                </div>
                <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div ref="pdfMobileContainer" class="w-full h-full overflow-y-auto bg-slate-800 flex flex-col items-center p-4 gap-4 rounded-[20px] scroll-smooth">
                  <!-- Canvas pages will be rendered here via PDF.js (No iframe, safe from CSP framing) -->
                </div>
              </div>
            </div>

            <div class="lg:col-span-4 space-y-6">
              <div class="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                
                <div class="relative">
                  <span class="px-3 py-1 bg-slate-900 text-white text-[9px] font-medium rounded-lg uppercase tracking-widest">{{ selectedDoc.category }}</span>
                  <h2 class="text-2xl font-semibold text-slate-900 leading-tight mt-4 tracking-tight">{{ selectedDoc.title }}</h2>
                  <p class="text-[11px] font-mono text-slate-400 mt-2">Ref: {{ selectedDoc.number }}</p>
                  
                  <div class="mt-8 space-y-4">
                    <div class="p-6 bg-slate-50 rounded-[30px] border border-slate-100 italic text-slate-600 text-sm leading-relaxed relative">
                      <span class="material-icons absolute -top-3 -left-1 text-slate-200 text-4xl">format_quote</span>
                      "Mohon segera ditinjau untuk kebutuhan operasional kantor pusat."
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-slate-900 rounded-[40px] p-8 shadow-2xl space-y-4 border border-slate-800">
                <p class="text-center text-[10px] font-medium text-slate-500 uppercase tracking-[0.3em] mb-4">Execute Decision</p>
                <div class="grid grid-cols-1 gap-3">
                  <button @click="handleAction('Approved')" 
                          class="group relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 text-white py-5 rounded-[24px] font-semibold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/30">
                    <span class="relative z-10 flex items-center justify-center gap-2">
                      <span class="material-icons">check_circle</span> APPROVE DOCUMENT
                    </span>
                  </button>
                  <button @click="handleRequestRevision" 
                          class="group relative overflow-hidden bg-amber-500 hover:bg-amber-400 text-white py-5 rounded-[24px] font-semibold text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/30">
                    <span class="relative z-10 flex items-center justify-center gap-2">
                      <span class="material-icons">edit_note</span> REQUEST REVISION
                    </span>
                  </button>
                  <button @click="handleAction('Rejected')" class="group border border-slate-700 hover:bg-red-500 text-slate-400 hover:text-white py-6 rounded-[24px] font-semibold text-xs uppercase tracking-widest transition-all">
                    REJECT WITH NOTES
                  </button>
                </div>
              </div>

              <!-- ✅ TAMBAH: Revision Popup -->
              <Transition 
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <div v-if="showConfirmRevision" 
                    @click.self="showConfirmRevision = false"
                    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden">
                    <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-amber-500 to-amber-600">
                      <button @click="showConfirmRevision = false" 
                              class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors">
                        <span class="material-icons text-2xl">close</span>
                      </button>
                      <div class="flex items-center gap-4">
                        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <span class="material-icons text-white text-4xl">edit_note</span>
                        </div>
                        <div>
                          <h2 class="text-2xl font-semibold text-white tracking-tight">
                            Request Revision
                          </h2>
                          <p class="text-white/80 text-sm font-medium mt-1">Require changes</p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="p-8">
                      <div class="mb-4">
                        <label class="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 block mb-3">
                          Revision Notes *
                        </label>
                        <textarea v-model="revisionNotes" 
                                  rows="4"
                                  placeholder="Jelaskan apa yang perlu direvisi..."
                                  class="w-full px-4 py-3 rounded-2xl text-sm font-medium bg-slate-50 border-2 border-slate-200 focus:border-amber-500 outline-none resize-none"
                                  required></textarea>
                      </div>
                      
                      <div class="bg-amber-50 rounded-2xl p-5 border-2 border-amber-100">
                        <p class="text-xs text-slate-600">
                          Dokumen akan dikembalikan ke creator untuk direvisi sesuai catatan Anda.
                        </p>
                      </div>
                    </div>
                    
                    <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex gap-3 justify-end">
                      <button @click="showConfirmRevision = false" 
                              class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium text-sm uppercase tracking-wide transition-all">
                        Cancel
                      </button>
                      <button @click="confirmRevision" 
                              :disabled="!revisionNotes.trim()"
                              class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-2 disabled:opacity-50">
                        <span class="material-icons text-sm">send</span>
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>

            </div>
          </div>
        </div>

        <div v-else :key="'list'" class="max-w-6xl mx-auto py-10">
          <header class="flex justify-between items-end mb-12 px-4">
            <div>
              <h1 class="text-3xl font-semibold text-slate-900 tracking-tight">
                Inbox<span class="text-emerald-500 text-4xl">.</span>
              </h1>
              <p class="text-slate-400 font-normal tracking-wide mt-2">You have <span class="text-slate-900 font-semibold">{{ documents.length }} pending</span> tasks today.</p>
            </div>
            <div class="hidden md:block text-right">
              <div class="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mb-1">Queue Status</div>
              <div class="flex gap-1">
                <div v-for="i in 5" :key="i" class="w-1.5 h-6 rounded-full" :class="i <= documents.length ? 'bg-emerald-500' : 'bg-slate-200'"></div>
              </div>
            </div>
          </header>

          <div class="grid gap-3 md:gap-4">
            <TransitionGroup name="list-stagger">
              <div v-for="(doc, index) in documents" :key="doc.id" 
                class="group relative bg-white hover:bg-slate-900 p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 flex items-center justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-slate-300 hover:-translate-y-1">
                
                <div class="flex items-center gap-3 md:gap-6 min-w-0 flex-1">
                  <div class="relative flex-shrink-0">
                    <div class="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <span class="material-icons text-2xl md:text-3xl text-slate-300 group-hover:text-emerald-400">description</span>
                    </div>
                    <div v-if="doc.priority === 'High'" class="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-5 md:h-5 bg-red-500 border-4 border-white rounded-full group-hover:border-slate-900"></div>
                  </div>
                  
                  <div class="min-w-0 flex-1">
                    <h3 class="text-sm md:text-base font-semibold text-slate-800 group-hover:text-white transition-colors tracking-tight truncate">{{ doc.title }}</h3>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                      <span class="text-[9px] md:text-[10px] font-medium text-slate-400 group-hover:text-slate-500 uppercase tracking-widest">{{ doc.number }}</span>
                      <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span class="text-[9px] md:text-[10px] font-medium text-emerald-500 uppercase tracking-widest">{{ doc.category }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3 flex-shrink-0">
                  <button 
                    @click="openDetail(doc)" 
                    class="px-4 md:px-8 py-3 md:py-4 bg-slate-900 text-white group-hover:bg-emerald-500 rounded-xl md:rounded-2xl font-medium text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                  >
                    Review
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <div v-if="documents.length === 0" class="py-20 text-center">
            <div class="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner mb-6">
              <span class="material-icons text-5xl text-slate-200">auto_awesome</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-400 tracking-wide">All Clear!</h3>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import permohonanService from '@/services/permohonanService';
// ✅ TAMBAH: Import authStore
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore(); // ✅ TAMBAH

// Mobile responsiveness and PDF.js state
const pdfMobileContainer = ref(null);
const isMobile = ref(false);

const updateMobileState = () => {
  isMobile.value =
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
};

let pdfjsPromise = null;
const loadPdfJs = () => {
  if (!pdfjsPromise) {
    pdfjsPromise = new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js";
        resolve(window.pdfjsLib);
      };
      script.onerror = (err) => {
        pdfjsPromise = null;
        reject(err);
      };
      document.head.appendChild(script);
    });
  }
  return pdfjsPromise;
};

const renderPdfMobile = async (url) => {
  try {
    const pdfjs = await loadPdfJs();
    const targetUrl = (import.meta.env.DEV && typeof url === 'string')
      ? url.replace(/^https?:\/\/[^\/]+/, '/objx-storage')
      : url;
    const loadingTask = pdfjs.getDocument(targetUrl);
    const pdf = await loadingTask.promise;
    
    if (pdfMobileContainer.value) {
      pdfMobileContainer.value.innerHTML = "";
    }
    
    const containerWidth = pdfMobileContainer.value
      ? pdfMobileContainer.value.clientWidth
      : window.innerWidth;
    
    const maxPageWidth = 900;
    const targetWidth = Math.min(Math.max(containerWidth - 32, 200), maxPageWidth);
    
    // Tingkatkan ketajaman dengan Device Pixel Ratio monitor (minimal 1.5x, max 2.5x)
    const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2.5);
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const unscaledViewport = page.getViewport({ scale: 1 });
      
      const baseScale = targetWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale: baseScale * dpr });
      
      const canvas = document.createElement("canvas");
      canvas.className = "rounded-xl shadow-xl bg-white block mb-4 border border-slate-700/20";
      const context = canvas.getContext("2d");
      
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(targetWidth)}px`;
      canvas.style.height = `${Math.floor(unscaledViewport.height * baseScale)}px`;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;
      if (pdfMobileContainer.value) {
        pdfMobileContainer.value.appendChild(canvas);
      }
    }
  } catch (err) {
    console.error("PDF render error in detail view:", err);
  }
};

const openInNewTab = (url) => {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const selectedDoc = ref(null);
const documents = ref([]);
const loading = ref(false);

const showConfirmRevision = ref(false);
const revisionNotes = ref('');

const pdfUrl = computed(() => {
  return selectedDoc.value?.attachments?.[0]?.fileUrl || 
         'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
});

// ✅ TAMBAH: Helper function untuk cek authorization
const isUserAuthorized = (doc) => {
  const userId = authStore.user?.id;
  if (!userId) return false;

  // Cek di approvalLevels
  const isApprover = doc.approvalLevels?.some(level => 
    level.approvers?.some(approver => approver.id === userId)
  );

  // Cek di reviewers
  const isReviewer = doc.reviewers?.some(reviewer => reviewer.id === userId);

  return isApprover || isReviewer;
};

watch(pdfUrl, async (newUrl) => {
  if (newUrl && !newUrl.includes("compressed.tracemonkey-pldi-09.pdf")) {
    await nextTick();
    await renderPdfMobile(newUrl);
  }
}, { immediate: true });

onMounted(async () => {
  updateMobileState();
  window.addEventListener("resize", updateMobileState);

  const id = route.query.id || route.query.token; // Support both just in case
  await loadDocuments();

  // 📄 Jika ada ID di query → otomatis buka detail dokumen tersebut
  if (id) {
    const docInList = documents.value.find(d => d.id === id);
    if (docInList) {
      await openDetail(docInList);
    } else {
      // Jika tidak ada di list pending, coba load langsung (misal sudah diproses)
      try {
        await openDetail({ id });
      } catch (err) {
        console.error("Failed to auto-open document from URL:", err);
      }
    }
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", updateMobileState);
});

const loadDocuments = async () => {
  try {
    loading.value = true;
    
    const response = await permohonanService.getApprovalPending();
    
    // ✅ TAMBAH: Filter bukan creator
    const userId = authStore.user?.id;
    
    documents.value = response.data
      .filter(doc => doc.createdBy !== userId) // ✅ Exclude dokumen sendiri
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        number: doc.id.substring(0, 12).toUpperCase(),
        priority: doc.categoryInfo?.name?.includes('Urgent') ? 'High' : 'Normal',
        category: doc.categoryInfo?.name || 'General',
        note: doc.description,
        attachments: doc.attachments || [],
        canApprove: doc._metadata?.canApprove || false,
        userLevel: doc._metadata?.userLevel,
        isCurrentLevel: doc._metadata?.isCurrentLevel || false,
        createdBy: doc.createdBy // ✅ TAMBAH
      }));
    
    console.log('✅ Documents loaded:', documents.value.length);
    
  } catch (error) {
    console.error('Failed to load documents:', error);
    alert('❌ Gagal memuat dokumen: ' + (error.response?.data?.message || error.message));
  } finally {
    loading.value = false;
  }
};

const openDetail = async (doc) => {
  try {
    loading.value = true;
    
    const response = await permohonanService.getPermohonanById(doc.id);
    selectedDoc.value = {
      ...doc,
      ...response.data
    };
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Failed to load document detail:', error);
    alert('❌ Gagal memuat detail dokumen');
  } finally {
    loading.value = false;
  }
};

// ✅ TAMBAH
const handleRequestRevision = () => {
  if (!selectedDoc.value) return;
  revisionNotes.value = '';
  showConfirmRevision.value = true;
};

const confirmRevision = async () => {
  if (!selectedDoc.value || !revisionNotes.value.trim()) return;
  
  try {
    showConfirmRevision.value = false;
    loading.value = true;
    
    await permohonanService.requestRevision(
      selectedDoc.value.id,
      revisionNotes.value.trim()
    );
    
    alert('✅ Revision request sent!\n\nDokumen telah dikembalikan ke creator.');
    
    selectedDoc.value = null;
    await loadDocuments();
    router.push('/approver/documents');
    
  } catch (error) {
    console.error('❌ Request revision failed:', error);
    alert('❌ Gagal mengirim revision request: ' + error.message);
  } finally {
    loading.value = false;
    revisionNotes.value = '';
  }
};

// ... rest of the code tetap sama
</script>

<style scoped>
/* LUXURY ANIMATIONS */
.slide-fade-enter-active { transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-fade-leave-active { transition: all 0.4s cubic-bezier(0.7, 0, 0.84, 0); }
.slide-fade-enter-from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
.slide-fade-leave-to { opacity: 0; transform: translateY(-30px); filter: blur(10px); }

/* STAGGERED LIST ANIMATION */
.list-stagger-enter-active, .list-stagger-leave-active { transition: all 0.5s ease; }
.list-stagger-enter-from { opacity: 0; transform: translateX(-50px); }
.list-stagger-leave-to { opacity: 0; transform: scale(0.9); }

/* SHIMMER EFFECT FOR CARDS */
.group:hover::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* CUSTOM SCROLLBAR (LUXURY) */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
</style>