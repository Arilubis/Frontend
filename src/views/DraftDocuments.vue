<template>
  <div class="min-h-screen bg-[#F1F5F9] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 font-sans text-slate-900 transition-all duration-300 relative overflow-x-hidden">

    <!-- ============================================
         TOAST NOTIFICATION (UI TEMAN)
         ============================================ -->
    <transition-group name="toast" tag="div" class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <div v-for="toast in toasts" :key="toast.id"
           class="pointer-events-auto bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 min-w-[300px]">
        <span class="material-icons text-blue-400">{{ toast.icon }}</span>
        <p class="text-[11px] font-medium uppercase tracking-widest">{{ toast.message }}</p>
      </div>
    </transition-group>

    <div class="max-w-[1440px] mx-auto">

      <!-- ============================================
           HEADER SECTION (UI TEMAN)
           ============================================ -->
      <header class="flex flex-col gap-3 mb-5">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">{{ $t('drafts.title') }}</h1>
          <p class="text-slate-500 text-[12px] md:text-[13px] font-medium mt-1">{{ $t('drafts.subtitle') }}</p>
        </div>

        <!-- Search + Category Filter -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
          <div class="relative group flex-[3]">
            <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input v-model="searchQuery" type="text" :placeholder="$t('drafts.searchPlaceholder')"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all shadow-sm text-[13px] font-normal" />
          </div>
          <select v-model="selectedCategory"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-normal text-[11px] uppercase outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[160px] sm:flex-1 cursor-pointer">
            <option value="">{{ $t('drafts.selectCategory') }}</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </header>

      <!-- ============================================
           STATUS BAR + BULK DELETE (UI TEMAN)
           ============================================ -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex gap-3 items-center">
          <div class="inline-flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <span class="flex h-2 w-2 rounded-full bg-blue-500" :class="{ 'animate-pulse': loading }"></span>
            <span class="text-[11px] font-medium text-slate-600 uppercase tracking-widest">
              {{ $t('drafts.filtered') }}: {{ filteredDrafts.length }} {{ $t('drafts.draf') }}
            </span>
          </div>

          <transition name="fade">
            <button v-if="selectedIds.length > 0" @click="handleBulkDelete"
                    class="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[11px] font-medium uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm">
              <span class="material-icons text-sm">delete_sweep</span>
              {{ $t('drafts.delete') }} {{ selectedIds.length }}
            </button>
          </transition>
        </div>

        <button v-if="filteredDrafts.length > 0" @click="toggleSelectAll"
                class="text-[11px] font-medium uppercase text-blue-600 hover:underline">
          {{ selectedIds.length === filteredDrafts.length ? $t('drafts.deselectAll') : $t('drafts.selectAll') }}
        </button>
      </div>

      <!-- ============================================
           LOADING STATE (UI TEMAN — skeleton grid)
           ============================================ -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i"
             class="bg-white h-48 rounded-[24px] border border-slate-200 animate-pulse p-5">
        </div>
      </div>

      <!-- ============================================
           EMPTY STATE (UI TEMAN)
           ============================================ -->
      <div v-else-if="filteredDrafts.length === 0"
           class="bg-white rounded-[24px] p-10 md:p-16 shadow-sm border border-slate-200 text-center">
        <div class="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <span class="material-icons text-slate-200 text-4xl md:text-5xl">folder_open</span>
        </div>
        <h3 class="text-slate-900 font-semibold uppercase tracking-widest mb-2 text-base">{{ $t('drafts.blankTitle') }}</h3>
        <p class="text-slate-400 text-[12px] mb-6 max-w-xs mx-auto font-medium">
          {{ $t('drafts.blankDesc') }}
        </p>
        <button @click="$router.push('/add-document')"
                class="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl whitespace-nowrap">
          {{ $t('drafts.createNow') }}
        </button>
      </div>

      <!-- ============================================
           DRAFT GRID CARDS (UI TEMAN + logika kamu)
           ============================================ -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="draft in filteredDrafts" :key="draft.id"
             :class="[
               'group bg-white border border-slate-200 rounded-[24px] p-5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden shadow-sm hover:border-blue-500',
               isSelected(draft.id) ? 'border-blue-500 ring-2 ring-blue-500/10' : 'hover:shadow-lg'
             ]">

          <div class="relative">
            <!-- Top Row: Checkbox + ID badge + Delete -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex gap-2">
                <button @click="toggleSelection(draft.id)"
                        class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                        :class="isSelected(draft.id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-white'">
                  <span v-if="isSelected(draft.id)" class="material-icons text-[12px]">check</span>
                </button>
              </div>
              <!-- ✅ Logika kamu: deleteDraft() + confirm popup -->
              <button @click="deleteDraft(draft.id)"
                      class="text-slate-300 hover:text-red-500 transition-all">
                <span class="material-icons text-xl">delete_outline</span>
              </button>
            </div>

            <!-- Title -->
            <h3 class="text-base font-semibold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors uppercase truncate">
              {{ draft.title || 'Untitled Draft' }}
            </h3>

            <!-- Category -->
            <div class="flex items-center gap-2 mb-4">
              <span class="text-[10px] font-normal text-slate-400 tracking-widest uppercase">
                {{ draft.categoryInfo?.name || 'No Category' }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-6 font-medium h-9">
              {{ draft.description || 'Tidak ada deskripsi singkat.' }}
            </p>
          </div>

          <!-- Bottom: Date + Action Buttons -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
            <div class="flex flex-col">
              <span class="text-[10px] font-normal text-slate-400 uppercase tracking-widest mb-0.5">Modified</span>
              <span class="text-[11px] font-medium text-slate-700">{{ formatDate(draft.updatedAt) }}</span>
            </div>

            <div class="flex gap-1.5">
              <!-- ✅ Logika kamu: handleDraftClick() buka edit modal -->
              <button @click.stop="handleDraftClick(draft)"
                      class="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center active:scale-90 shadow-sm"
                      title="Edit">
                <span class="material-icons text-sm">edit</span>
              </button>
              <!-- ✅ Logika kamu: submitDraft() + confirm popup -->
              <button @click="submitDraft(draft.id)"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-medium text-[10px] uppercase tracking-widest transition-all shadow-md">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ============================================
         EDIT MODAL (logika kamu — utuh)
         ============================================ -->
    <Transition name="modal-fade">
      <div v-if="showEditModal"
           @click.self="closeEditModal"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">

          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-start">
            <div class="flex items-center gap-3">
              <span class="material-icons text-white text-3xl">edit_document</span>
              <h2 class="text-2xl font-semibold italic uppercase text-white tracking-tight">Edit Draft</h2>
            </div>
            <button @click="closeEditModal" class="text-white/70 hover:text-white transition-colors">
              <span class="material-icons text-3xl">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
            <form @submit.prevent="handleSaveDraft" class="space-y-6">

              <!-- Title -->
              <div>
                <label class="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 block mb-3">
                  Document Title *
                </label>
                <input type="text"
                       v-model="editForm.title"
                       placeholder="Enter document title (min 5 characters)..."
                       class="w-full px-4 py-3 bg-white rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-normal text-sm transition-colors"
                       required minlength="5" />
                <p class="text-xs text-slate-400 mt-2">{{ editForm.title.length }} characters</p>
              </div>

              <!-- Description -->
              <div>
                <label class="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 block mb-3">
                  Description *
                </label>
                <textarea v-model="editForm.description"
                          rows="5"
                          placeholder="Enter document description..."
                          class="w-full px-4 py-3 bg-white rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-normal text-sm transition-colors resize-none"
                          required></textarea>
                <p class="text-xs text-slate-400 mt-2">{{ editForm.description.length }} characters</p>
              </div>

              <!-- Category -->
              <div>
                <label class="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 block mb-3">
                  Category *
                </label>
                <select v-model="editForm.categoryId"
                        class="w-full px-4 py-3 bg-white rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-normal text-sm transition-colors"
                        required>
                  <option value="" disabled>-- Select Category --</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Attachments -->
              <div>
                <label class="text-[10px] font-medium uppercase tracking-[0.3em] text-slate-400 block mb-3">
                  Attachments
                </label>
                <div class="border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-blue-300 transition-colors">
                  <div class="flex items-center justify-center gap-3 mb-3">
                    <label class="cursor-pointer">
                      <input type="file" multiple class="hidden"
                             @change="handleEditAttachments"
                             accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
                      <div class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-xs font-medium uppercase">
                        <span class="material-icons text-sm">attach_file</span>
                        Add Files
                      </div>
                    </label>
                    <div class="text-[10px] text-slate-400">
                      <p>Max 5MB per file</p>
                      <p>PDF, DOC, XLS, JPG, PNG</p>
                    </div>
                  </div>
                  <div v-if="editForm.attachments && editForm.attachments.length > 0"
                       class="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    <div v-for="(file, index) in editForm.attachments" :key="index"
                         class="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div class="flex items-center gap-2 overflow-hidden">
                        <span class="material-icons text-blue-500 text-sm">description</span>
                        <div class="flex flex-col overflow-hidden">
                          <span class="text-[10px] font-medium text-slate-600 truncate">{{ file.name }}</span>
                          <span class="text-[9px] text-slate-400">{{ formatFileSize(file.size) }}</span>
                        </div>
                      </div>
                      <button @click="removeEditAttachment(index)" type="button"
                              class="text-slate-300 hover:text-red-500 transition">
                        <span class="material-icons text-sm">close</span>
                      </button>
                    </div>
                  </div>
                  <p v-else class="text-[9px] text-slate-400 italic text-center py-2">No files attached</p>
                </div>
              </div>

            </form>
          </div>

          <!-- Footer -->
          <div class="bg-slate-50 p-6 flex gap-3 justify-end border-t border-slate-100">
            <button @click="closeEditModal" type="button"
                    class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium text-sm uppercase tracking-wide transition-all">
              Cancel
            </button>
            <button @click="handleSaveDraft" type="button"
                    :disabled="isUpdating || !canSave"
                    class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!isUpdating" class="material-icons text-sm">save</span>
              <span v-else class="material-icons text-sm animate-spin">sync</span>
              {{ isUpdating ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- CONFIRM SUBMIT POPUP -->
    <Transition name="modal-fade">
      <div v-if="showConfirmSubmit"
          @click.self="showConfirmSubmit = false"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <span class="material-icons text-blue-600 text-3xl">send</span>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-2">Submit Draft?</p>
          </div>

          <!-- Info Card -->
          <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="material-icons text-blue-600 text-[18px]">info</span>
              </div>
              <div>
                <p class="text-[13px] font-semibold text-slate-800 mb-1">Should I submit this draft for approval?</p>
                <p class="text-[12px] text-slate-500 leading-relaxed">Once submitted, the draft cannot be edited and will enter the approval process.</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="showConfirmSubmit = false"
                    class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button @click="confirmSubmitDraft"
                    class="flex-[1.4] py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 7.5L6.5 11.5L12.5 3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Submit
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- SUCCESS SUBMIT POPUP -->
    <Transition name="modal-fade">
      <div v-if="showSuccessSubmit"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 15L12.5 22.5L25 8" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-1">Success!</p>
          </div>

          <!-- Info Card -->
          <div class="mx-6 mb-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <span class="material-icons text-blue-600 text-3xl mb-2 block">check_circle</span>
            <p class="text-[13px] font-semibold text-slate-900">The document has been successfully created and submitted for approval!</p>
          </div>

          <!-- Footer -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="showSuccessSubmit = false"
                    class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 7.5L6.5 11.5L12.5 3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ============================================
         DRAFT UPDATED POPUP (logika kamu — utuh)
         ============================================ -->
    <Transition name="modal-fade">
      <div v-if="showDraftUpdated"
           class="fixed inset-0 z-[100] flex items-center justify-center p-4"
           style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);">
        <div class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden">
          <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span class="material-icons text-white text-4xl">check_circle</span>
              </div>
              <div>
                <h2 class="text-3xl font-semibold italic uppercase text-white tracking-tight">Updated!</h2>
                <p class="text-white/80 text-sm font-medium mt-1">Draft successfully updated</p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100 text-center">
              <span class="material-icons text-blue-600 text-5xl mb-3 block">save</span>
              <p class="text-sm font-medium text-slate-900 mb-2">Draft berhasil diupdate!</p>
              <p class="text-xs text-slate-600">Perubahan Anda telah tersimpan dengan sukses.</p>
            </div>
          </div>
          <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
            <button @click="handleDraftUpdatedClose"
                    class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
              <span class="material-icons text-sm">check_circle</span> OK
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ============================================
         UPDATE ERROR POPUP (logika kamu — utuh)
         ============================================ -->
    <Transition name="modal-fade">
      <div v-if="showUpdateError"
           @click.self="showUpdateError = false"
           class="fixed inset-0 z-[100] flex items-center justify-center p-4"
           style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);">
        <div class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden">
          <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700">
            <button @click="showUpdateError = false"
                    class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors">
              <span class="material-icons text-2xl">close</span>
            </button>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span class="material-icons text-white text-4xl">warning</span>
              </div>
              <div>
                <h2 class="text-3xl font-semibold italic uppercase text-white tracking-tight">Error</h2>
                <p class="text-white/80 text-sm font-medium mt-1">Update failed</p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100">
              <div class="flex items-start gap-3">
                <span class="material-icons text-blue-600 text-2xl flex-shrink-0">info</span>
                <p class="text-sm font-medium text-slate-900">{{ updateErrorMessage }}</p>
              </div>
            </div>
          </div>
          <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
            <button @click="showUpdateError = false"
                    class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
              <span class="material-icons text-sm">close</span> Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- CONFIRM DELETE POPUP -->
    <Transition name="modal-fade">
      <div v-if="showConfirmDelete"
          @click.self="showConfirmDelete = false"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M8 8l14 14M22 8L8 22" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-2">Delete Draft?</p>
          </div>

          <!-- Info Card -->
          <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="material-icons text-red-500 text-[18px]">warning</span>
              </div>
              <div>
                <p class="text-[13px] font-semibold text-slate-800 mb-1">Delete this draft?</p>
                <p class="text-[12px] text-slate-500 leading-relaxed">This action cannot be undone. The draft will be permanently deleted from the system.</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="showConfirmDelete = false"
                    class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button @click="confirmDeleteDraft"
                    class="flex-[1.4] py-3.5 rounded-[14px] bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20">
              <span class="material-icons text-[16px]">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- DELETE SUCCESS POPUP -->
    <Transition name="modal-fade">
      <div v-if="showDeleteSuccess"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 15L12.5 22.5L25 8" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-1">Draft successfully removed!</p>
          </div>

          <!-- Info Card -->
          <div class="mx-6 mb-5 bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
            <span class="material-icons text-red-600 text-3xl mb-2 block">delete_forever</span>
            <p class="text-[13px] font-semibold text-slate-900 mb-1">The draft has been permanently deleted from the system.!</p>
          </div>

          <!-- Footer -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="handleDeleteSuccessClose"
                    class="flex-1 py-3.5 rounded-[14px] bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 7.5L6.5 11.5L12.5 3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ============================================
         DELETE ERROR POPUP (logika kamu — utuh)
         ============================================ -->
    <Transition name="modal-fade">
      <div v-if="showDeleteError"
           @click.self="showDeleteError = false"
           class="fixed inset-0 z-[100] flex items-center justify-center p-4"
           style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);">
        <div class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden">
          <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700">
            <button @click="showDeleteError = false"
                    class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors">
              <span class="material-icons text-2xl">close</span>
            </button>
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span class="material-icons text-white text-4xl">warning</span>
              </div>
              <div>
                <h2 class="text-3xl font-semibold italic uppercase text-white tracking-tight">Error</h2>
                <p class="text-white/80 text-sm font-medium mt-1">Delete failed</p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100">
              <div class="flex items-start gap-3">
                <span class="material-icons text-blue-600 text-2xl flex-shrink-0">info</span>
                <p class="text-sm font-medium text-slate-900">{{ deleteErrorMessage }}</p>
              </div>
            </div>
          </div>
          <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end">
            <button @click="showDeleteError = false"
                    class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
              <span class="material-icons text-sm">close</span> Close
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
// ============================================
// SEMUA IMPORT & LOGIKA KAMU — UTUH
// ============================================
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLangStore } from '@/stores/langStore';
import permohonanService from '@/services/permohonanService';
import categoryService from '@/services/categoryService';
import '@/lib/objx-sdk';

const router = useRouter();
const langStore = useLangStore();
const activeLanguage = computed(() => langStore.lang);
const loading = ref(false);
const drafts = ref([]);
const selectedDraft = ref(null);
const showEditModal = ref(false);
const editingDraft = ref(null);
const isUpdating = ref(false);
const categories = ref([]);

const showConfirmSubmit = ref(false);
const showSuccessSubmit = ref(false);
const pendingSubmitDraftId = ref(null);
const showDraftUpdated = ref(false);
const showUpdateError = ref(false);
const updateErrorMessage = ref('');
const showConfirmDelete = ref(false);
const showDeleteSuccess = ref(false);
const showDeleteError = ref(false);
const deleteErrorMessage = ref('');
const pendingDeleteDraftId = ref(null);

const editForm = ref({
  title: '',
  description: '',
  categoryId: '',
  attachments: []
});

// ============================================
// TAMBAH dari teman — state baru
// ============================================
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedIds = ref([]);
const toasts = ref([]);

// ============================================
// COMPUTED — logika kamu + filteredDrafts teman
// ============================================
const currentUserRole = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const roles = user.roles || [];
    return roles.join(', ') || 'USER';
  } catch {
    return 'USER';
  }
});

const canSave = computed(() => {
  if (!editForm.value) return false;
  const hasTitle = editForm.value.title && editForm.value.title.trim().length >= 5;
  const hasDescription = editForm.value.description && editForm.value.description.trim().length >= 10;
  const hasCategory = editForm.value.categoryId && editForm.value.categoryId !== '';
  return hasTitle && hasDescription && hasCategory;
});

// ✅ TAMBAH computed filteredDrafts dari teman
const filteredDrafts = computed(() => {
  return (drafts.value || []).filter(draft => {
    const title = (draft.title || '').toLowerCase();
    const matchesSearch = title.includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value
      ? (draft.categoryInfo?.id === selectedCategory.value || draft.categoryId === selectedCategory.value)
      : true;
    return matchesSearch && matchesCategory;
  });
});

// ============================================
// METHODS dari teman — toast + selection + bulk delete
// ============================================
const showToast = (message, icon = 'check_circle') => {
  const id = Date.now();
  toasts.value.push({ id, message, icon });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};

const toggleSelection = (id) => {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) selectedIds.value.splice(index, 1);
  else selectedIds.value.push(id);
};

const isSelected = (id) => selectedIds.value.includes(id);

const toggleSelectAll = () => {
  if (selectedIds.value.length === filteredDrafts.value.length) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredDrafts.value.map(d => d.id);
  }
};

// ✅ Bulk delete — pakai endpoint kamu permohonanService.deletePermohonan
const handleBulkDelete = async () => {
  if (!confirm(`Hapus ${selectedIds.value.length} draf terpilih secara permanen?`)) return;
  try {
    await Promise.all(selectedIds.value.map(id => permohonanService.deletePermohonan(id)));
    showToast(`${selectedIds.value.length} Draf dihapus`, 'delete_sweep');
    selectedIds.value = [];
    await loadDrafts();
  } catch (err) {
    showToast('Sebagian gagal dihapus', 'warning');
  }
};

// ============================================
// SEMUA LOGIKA KAMU — UTUH, endpoint tidak diubah
// ============================================
const handleDraftClick = async (draft) => {
  isUpdating.value = false;
  editingDraft.value = draft;
  editForm.value = {
    title: draft.title,
    description: draft.description || '',
    categoryId: draft.categoryInfo?.id || draft.categoryId || '',
    attachments: []
  };
  console.log('📝 Edit Form initialized:', {
    title: editForm.value.title,
    titleLength: editForm.value.title?.length,
    description: editForm.value.description,
    descriptionLength: editForm.value.description?.length,
    categoryId: editForm.value.categoryId
  });
  if (categories.value.length === 0) {
    await loadCategories();
  }
  showEditModal.value = true;
};

// ✅ Logika kamu — endpoint getMyApproval utuh
const loadDrafts = async () => {
  try {
    loading.value = true;
    const response = await permohonanService.getMyApproval({
      status: 'DRAFT',
      limit: 100,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
      view: 'compact'
    });
    drafts.value = response.data || [];
    console.log('✅ Drafts loaded (DRAFT only):', drafts.value.length);
  } catch (error) {
    console.error('❌ Load drafts error:', error);
    const errorMsg = error.response?.data?.message || error.message || 'Gagal memuat draft';
    alert(`Error: ${errorMsg}`);
  } finally {
    loading.value = false;
  }
};

// ✅ Logika kamu — endpoint getCategories utuh
const loadCategories = async () => {
  try {
    const response = await permohonanService.getCategories();
    categories.value = response.data || [];
    console.log('✅ Categories loaded:', categories.value.length);
  } catch (error) {
    console.error('❌ Load categories error:', error);
  }
};

const handleEditAttachments = (e) => {
  const newFiles = Array.from(e.target.files);
  if (!editForm.value.attachments) editForm.value.attachments = [];
  if (editForm.value.attachments.length + newFiles.length > 10) {
    alert('❌ Maksimal 10 file!');
    e.target.value = '';
    return;
  }
  const invalidFiles = newFiles.filter(f => f.size > 5 * 1024 * 1024);
  if (invalidFiles.length > 0) {
    alert(`❌ File berikut melebihi 5MB:\n${invalidFiles.map(f => f.name).join('\n')}`);
    e.target.value = '';
    return;
  }
  editForm.value.attachments = [...editForm.value.attachments, ...newFiles];
  console.log('📎 Files added:', newFiles.map(f => f.name));
  e.target.value = '';
};

const removeEditAttachment = (index) => {
  const removedFile = editForm.value.attachments[index];
  editForm.value.attachments.splice(index, 1);
  console.log('🗑️ File removed:', removedFile.name);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingDraft.value = null;
  isUpdating.value = false;
  editForm.value = { title: '', description: '', categoryId: '', attachments: [] };
};

const handleSaveDraft = async () => {
  if (!editingDraft.value) return;

  // Validasi
  if (!editForm.value.title.trim() || editForm.value.title.trim().length < 5) {
    updateErrorMessage.value = 'Document Title wajib diisi (minimal 5 karakter)';
    showUpdateError.value = true;
    return;
  }
  if (!editForm.value.description.trim()) {
    updateErrorMessage.value = 'Description wajib diisi';
    showUpdateError.value = true;
    return;
  }
  if (!editForm.value.categoryId) {
    updateErrorMessage.value = 'Category wajib dipilih';
    showUpdateError.value = true;
    return;
  }

  try {
    isUpdating.value = true;

    const updateData = {
      title: editForm.value.title.trim(),
      description: editForm.value.description.trim(),
      categoryId: editForm.value.categoryId
    };
    await permohonanService.updatePermohonan(editingDraft.value.id, updateData);

    if (editForm.value.attachments && editForm.value.attachments.length > 0) {
      console.log(`📎 Uploading ${editForm.value.attachments.length} attachment(s) via Objx...`);
      const draftId = editingDraft.value.id;

      for (let i = 0; i < editForm.value.attachments.length; i++) {
        const file = editForm.value.attachments[i];
        console.log(`Uploading attachment [${i + 1}/${editForm.value.attachments.length}]: ${file.name}`);

        try {
          const hashBuffer = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
          const checksum = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');

          const uploadRequest = await permohonanService.requestAttachmentUpload(draftId, {
            name: file.name,
            size: file.size,
            type: file.type || 'application/octet-stream',
            checksum: checksum
          });

          const uploadInitUrl = uploadRequest.data.upload_init_url;
          const bucketId = uploadRequest.data.bucket_id || uploadRequest.data._meta?.bucketId || import.meta.env.VITE_OBJX_BUCKET_ID || 'a9c4a4f9-2c1e-410e-b43f-a9068bb1c154';
          const path = uploadRequest.data.path || uploadRequest.data._meta?.path || '';

          const uploader = new window._ObjxUploaderInternal(uploadInitUrl, null);
          const uploadResult = await uploader.upload(
            file,
            bucketId,
            path,
            null, 
            checksum
          );

          console.log(`✅ Upload result:`, uploadResult);
          await permohonanService.confirmAttachmentUpload(draftId, {
            objectId: uploadResult?.object_id || uploadResult?.id || '',
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || 'application/octet-stream',
            hash: checksum,
            path: uploadRequest.data._meta?.path || ''
          });

          console.log(`✅ Attachment confirmed: ${file.name}`);
        } catch (attachErr) {
          console.error(`❌ Failed to upload attachment ${file.name}:`, attachErr);
        }
      }
    }
    closeEditModal();
    showDraftUpdated.value = true;
  } catch (error) {
    console.error('❌ Update draft error:', error);
    updateErrorMessage.value = error.response?.data?.message || error.message || 'Gagal update draft';
    showUpdateError.value = true;
  } finally {
    isUpdating.value = false;
  }
};

const handleDraftUpdatedClose = () => {
  showDraftUpdated.value = false;
  loadDrafts();
};

const submitDraft = async (draftId) => {
  pendingSubmitDraftId.value = draftId;
  showConfirmSubmit.value = true;
};

const confirmSubmitDraft = async () => {
  if (!pendingSubmitDraftId.value) return;
  try {
    showConfirmSubmit.value = false;
    await permohonanService.submitPermohonan(pendingSubmitDraftId.value);
    showSuccessSubmit.value = true;
    setTimeout(async () => {
      showSuccessSubmit.value = false;
      await loadDrafts();
    }, 2000);
  } catch (error) {
    console.error('❌ Submit draft error:', error);
    alert('Gagal submit draft: ' + (error.response?.data?.message || error.message));
  } finally {
    pendingSubmitDraftId.value = null;
  }
};

// ✅ Logika kamu — endpoint deletePermohonan utuh
const deleteDraft = (draftId) => {
  pendingDeleteDraftId.value = draftId;
  showConfirmDelete.value = true;
};

const confirmDeleteDraft = async () => {
  if (!pendingDeleteDraftId.value) return;
  try {
    showConfirmDelete.value = false;
    await permohonanService.deletePermohonan(pendingDeleteDraftId.value);
    showDeleteSuccess.value = true;
  } catch (error) {
    console.error('❌ Delete draft error:', error);
    deleteErrorMessage.value = error.response?.data?.message || error.message || 'Gagal hapus draft';
    showDeleteError.value = true;
  } finally {
    pendingDeleteDraftId.value = null;
  }
};

const handleDeleteSuccessClose = () => {
  showDeleteSuccess.value = false;
  loadDrafts();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

onMounted(() => {
  loadDrafts();
  loadCategories();
});
</script>

<style scoped>
/* ============================================
   MODAL TRANSITIONS 
   ============================================ */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.3s ease; }
.modal-fade-leave-active { transition: all 0.2s ease-in; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.9); }

/* ============================================
   TOAST TRANSITIONS
   ============================================ */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }

/* ============================================
   FADE (untuk bulk delete button)
   ============================================ */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* ============================================
   CUSTOM SCROLLBAR
   ============================================ */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

/* ============================================
   LINE CLAMP
   ============================================ */
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>



