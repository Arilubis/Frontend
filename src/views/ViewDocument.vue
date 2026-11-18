<template>
  <div class="p-4 md:p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
    <div class="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6">
      
      <!-- Main Document List Panel -->
      <div :class="selectedDoc ? 'lg:w-[60%]' : 'lg:w-full'" 
           class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all duration-300 min-h-[600px]">
        
        <!-- Header -->
        <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-t-2xl">
          <div>
            <h2 class="text-2xl font-semibold text-slate-900 tracking-tight">
              {{ $t('requests.title') }}
            </h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {{ loading ? $t('common.sync') : `${totalThisMonth} ${$t('requests.resultsCount')} · ${$t('settings.profile.reset').toLowerCase()} ${currentPage} ${activeLanguage === 'id' ? 'dari' : 'of'} ${totalPages}` }}
              </p>
            </div>
          </div>

          <!-- RIGHT SIDE: Access Level + Add Request Button -->
          <div class="flex items-center gap-3 flex-shrink-0">

            <!-- Access Level Badge -->
            <div class="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <span class="material-icons text-blue-600 text-sm">verified_user</span>
              <div class="flex flex-col">
                <span class="text-[10px] font-normal text-slate-400 uppercase leading-none">{{ $t('requests.accessLevel') }}</span>
                <span class="text-xs font-medium text-slate-700 mt-1">{{ currentUserRole }}</span>
              </div>
            </div>

            <button
              v-if="isPureBasicUser"
              @click="$router.push('/add-document')"
              class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-[13px] font-semibold transition-all shadow-lg shadow-blue-600/25 group"
            >
              <span class="material-icons text-[18px] group-hover:rotate-90 transition-transform duration-200">add</span>
              <span class="hidden sm:inline">{{ $t('Add Request') || $t('dashboard.addRequest') }}</span>
            </button>

          </div>
        </div>

        <!-- Search Bar -->
        <div class="px-6 py-3 border-b border-slate-100 bg-white">
          <div class="flex items-center gap-3">
            
            <!-- Search Input — responsif di mobile -->
            <div class="relative group flex-1 min-w-0">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-blue-600 transition-colors">search</span>
              <input 
                v-model="searchQuery"
                type="text"
                :placeholder="$t('requests.searchPlaceholder')"
                class="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-8 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none text-slate-700 transition-all"
              />
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400 transition-colors">
                <span class="material-icons text-[16px]">close</span>
              </button>
            </div>

            <!-- Search Result Badge -->
            <transition name="fade-quick">
              <div v-if="searchQuery && searchQuery.trim().length > 0"
                   class="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                <span class="material-icons text-blue-500 text-[12px]">filter_list</span>
                <span class="text-[10px] font-medium text-blue-600">
                  {{ filteredDocs.length }} {{ $t('requests.resultsCount') }}
                </span>
                <span class="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                  "{{ searchQuery.trim() }}"
                </span>
              </div>
            </transition>

            <!-- Status Filter Badge -->
            <transition name="fade-quick">
              <div v-if="filters.status"
                   class="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                <span class="material-icons text-blue-500 text-[12px]">filter_alt</span>
                <span class="text-[10px] font-medium text-blue-600">
                  Status: {{ formatStatus(filters.status) }}
                </span>
                <button 
                  @click="filters.status = ''; loadDocuments(); $router.replace({ query: {} })"
                  class="text-slate-300 hover:text-red-400 transition-colors active:scale-95 ml-1 flex items-center cursor-pointer">
                  <span class="material-icons text-[14px]">close</span>
                </button>
              </div>
            </transition>

          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex-1 flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p class="text-sm text-slate-500">{{ $t('requests.loading') }}</p>
          </div>
        </div>

        <div v-else-if="filteredDocs.length === 0" class="flex-1 flex items-center justify-center">
          <div class="text-center py-12">
            <div class="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-100">
              <span class="material-icons text-blue-300 text-4xl">description</span>
            </div>
            <p class="text-slate-500 font-medium text-sm mb-1">{{ $t('requests.noRequests') }}</p>
            <p class="text-slate-300 text-xs mb-6">{{ $t('requests.startPrompt') }}</p>
            <button
              v-if="isPureBasicUser"
              @click="$router.push('/add-document')"
              class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-[13px] font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              <span class="material-icons text-[18px]">add</span>
              {{ $t('requests.addPrompt') || $t('dashboard.addRequest') }}
            </button>
          </div>
        </div>

        <!-- Document Table -->
        <div v-else class="flex-1 overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100 text-[11px] font-medium uppercase text-slate-500 tracking-wider">
                <th class="px-6 py-4 w-[45%]">{{ $t('requests.table.details') }}</th>
                <th class="px-6 py-4 text-center">{{ $t('requests.table.status') }}</th>
                <th class="px-6 py-4">{{ $t('requests.table.date') }}</th>
                <th class="px-6 py-4 text-right">{{ $t('requests.table.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="doc in filteredDocs" :key="doc.id" 
                  @click="handleRowClick(doc)" 
                  :class="selectedDoc?.id === doc.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'"
                  class="cursor-pointer transition-colors group">
                
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div :class="selectedDoc?.id === doc.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'" 
                         class="w-10 h-10 flex items-center justify-center rounded-lg transition-all shadow-sm">
                      <span class="material-icons text-lg">description</span>
                    </div>
                    <div>
                      <p class="font-medium text-sm text-slate-800 truncate max-w-[260px] leading-snug" 
                        :title="doc.title">
                        {{ doc.title }}
                      </p>
                      <p class="text-xs text-slate-500 mt-0.5">
                        {{ doc.categoryInfo?.name || $t('requests.preview.uncategorized') }} • {{ doc.creatorInfo?.fullName || $t('requests.preview.unknown') }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 text-center">
                  <span :class="statusClass(doc.status, false)" 
                        class="px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wide border">
                    {{ formatStatus(doc.status) }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-xs font-medium text-slate-600">
                      {{ formatShortDate(doc.createdAt) }}
                    </span>
                    <span class="text-[10px] text-slate-400 mt-0.5">
                      {{ new Date(doc.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <div class="flex justify-end items-center gap-2">
                    <button @click.stop="openDetailModal(doc)"
                            class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <span class="material-icons text-lg">visibility</span>
                    </button>
                    <button v-if="canApprove(doc)" 
                            @click.stop="handleQuickApprove(doc)"
                            class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                      <span class="material-icons text-lg">check_circle</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ✅ PAGINATION -->
        <div v-if="!loading && totalPages > 1" 
             class="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white rounded-b-2xl">
          
          <!-- Info -->
          <div class="text-[11px] text-slate-400 font-medium">
            Showing 
            <span class="text-slate-600 font-semibold">
              {{ ((currentPage - 1) * itemsPerPage) + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredDocsAll.length) }}
            </span> 
            of 
            <span class="text-slate-600 font-semibold">{{ filteredDocsAll.length }}</span> 
            requests
          </div>

          <!-- Page Buttons -->
          <div class="flex items-center gap-1">
            
            <!-- Prev -->
            <button 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <span class="material-icons text-[16px]">chevron_left</span>
            </button>

            <!-- Page Numbers -->
            <template v-for="page in paginationPages" :key="page">
              <!-- Ellipsis -->
              <span v-if="page === '...'" 
                    class="w-8 h-8 flex items-center justify-center text-slate-300 text-[12px]">
                ···
              </span>
              <!-- Page Button -->
              <button 
                v-else
                @click="changePage(page)"
                :class="[
                  'w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium transition-all border',
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                    : 'border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                ]">
                {{ page }}
              </button>
            </template>

            <!-- Next -->
            <button 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <span class="material-icons text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Side Detail Panel -->
      <Transition name="slide-fade">
        <div v-if="selectedDoc" class="lg:w-[40%] flex flex-col gap-6 animate-in slide-in-from-right duration-300">
          
          <!-- Preview Card -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div class="flex justify-between items-start mb-4">
              <span class="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-normal uppercase tracking-wide">{{ $t('requests.preview.title') }}</span>
              <button @click="selectedDoc = null" class="text-slate-400 hover:text-red-500 p-1">
                <span class="material-icons">close</span>
              </button>
            </div>
            <h3 class="text-sm font-medium text-slate-700 mb-2 leading-snug">{{ selectedDoc.title }}</h3>

            <div class="bg-slate-50 rounded-xl border border-slate-100 mb-4 overflow-hidden"
                 :class="isFullHtmlDocument(selectedDoc.description) ? 'h-[500px]' : 'p-4 max-h-[600px] overflow-auto'">
              <iframe
                v-if="isFullHtmlDocument(selectedDoc.description)"
                :srcdoc="selectedDoc.description"
                class="w-full h-full rounded-xl border-none bg-white"
                sandbox="allow-same-origin"
                scrolling="yes">
              </iframe>
              <div v-else-if="selectedDoc.description && selectedDoc.description.includes('<')"
                  class="text-sm text-slate-600 leading-relaxed"
                  v-html="selectedDoc.description">
              </div>
              <p v-else class="text-sm text-slate-600 italic leading-relaxed">
                "{{ selectedDoc.description || $t('common.noNotes') }}"
              </p>
            </div>

            <button v-if="canApprove(selectedDoc)" 
                    @click="goToFullReview(selectedDoc.id)"
                    class="w-full bg-slate-900 hover:bg-blue-600 text-white py-3 rounded-xl font-medium text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm">
              {{ $t('requests.preview.openReview') }}
              <span class="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

          <!-- Approval Progress -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-y-auto max-h-[400px]">
            <h2 class="text-[11px] font-medium uppercase tracking-wider mb-6 text-slate-400 flex items-center gap-2">
              <span class="material-icons text-sm">account_tree</span> 
              {{ $t('requests.preview.progress') }}
            </h2>
            
            <div class="space-y-6">
              <div v-for="(level, index) in selectedDoc.approvalLevels" :key="index" class="relative flex gap-4">
                <div v-if="index !== selectedDoc.approvalLevels.length - 1" 
                     :class="isLevelCompleted(level) ? 'bg-emerald-500' : 'bg-slate-100'"
                     class="absolute left-[11px] top-7 w-[2px] h-full"></div>
                
                <div class="relative z-10">
                  <div v-if="isLevelCompleted(level)" class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm">
                    <span class="material-icons text-[14px]">check</span>
                  </div>
                  <div v-else-if="isLevelCurrent(level)" class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white ring-4 ring-blue-50">
                    <span class="material-icons text-[12px] animate-spin">refresh</span>
                  </div>
                  <div v-else class="w-6 h-6 bg-white border-2 border-slate-200 rounded-full"></div>
                </div>

                <div class="flex-1 pb-2">
                  <h4 :class="isLevelPending(level) ? 'text-slate-400' : 'text-slate-800'" class="font-medium text-xs uppercase mb-2">
                    Level {{ level.level }}
                  </h4>
                  <div class="space-y-2">
                    <div v-for="(approver, aIndex) in level.approvers" :key="aIndex" 
                         class="text-[11px] flex items-center justify-between p-2 rounded-lg bg-slate-50 text-slate-600">
                      <div class="flex items-center gap-2">
                        <span class="material-icons text-[14px]"
                              :class="approver.status === 'APPROVED' ? 'text-emerald-500' : 
                                      approver.status === 'REJECTED' ? 'text-red-500' : 'text-blue-400'">
                          person_outline
                        </span>
                        <span :class="isLevelPending(level) ? 'text-slate-400' : 'text-slate-700'">
                          {{ approver.fullName }}
                        </span>
                      </div>
                      <span v-if="approver.status === 'APPROVED'" 
                            class="text-emerald-600 font-medium text-[10px]">✓ {{ $t('dashboard.stats.approved') }}</span>
                      <span v-else-if="approver.status === 'REJECTED'" 
                            class="text-red-600 font-medium text-[10px]">✗ {{ $t('dashboard.stats.rejected') }}</span>
                      <span v-else-if="isLevelPending(level)"
                            class="text-slate-400 font-medium text-[10px]">⏳ {{ $t('dashboard.stats.pending') }}</span>
                      <span v-else-if="isLevelCurrent(level)"
                            class="text-blue-600 font-medium text-[10px]">⏳ {{ activeLanguage === 'id' ? 'SEDANG BERJALAN' : 'IN PROGRESS' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-50">
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-normal text-slate-500 uppercase tracking-widest">{{ $t('requests.preview.infoCategory') }}</span>
                  <span class="text-xs font-normal text-slate-600">{{ selectedDoc.categoryInfo?.name || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-normal text-slate-500 uppercase tracking-widest">{{ $t('requests.preview.infoCreatedBy') }}</span>
                  <span class="text-xs font-normal text-slate-600">{{ selectedDoc.creatorInfo?.fullName || $t('requests.preview.unknown') }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-normal text-slate-500 uppercase tracking-widest">{{ $t('requests.preview.infoDate') }}</span>
                  <span class="text-xs font-normal text-slate-600">{{ formatDate(selectedDoc.createdAt) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-normal text-slate-500 uppercase tracking-widest">{{ $t('requests.preview.infoAttachments') }}</span>
                  <span class="text-xs font-normal text-blue-500">{{ selectedDoc.attachmentCount || 0 }} {{ $t('requests.preview.infoFilesCount') }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-[11px] font-medium uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span class="material-icons text-sm">chat</span>
                {{ $t('requests.preview.commentsTitle') }}
              </h2>
              <span v-if="isLoadingComments" class="material-icons text-[14px] text-slate-400 animate-spin">sync</span>
              <span v-else class="text-[9px] font-normal text-slate-500 uppercase">
                {{ comments.length }} {{ $t('requests.preview.commentsTitle') }}
              </span>
            </div>

            <!-- Comment List -->
            <div class="space-y-3 mb-4 max-h-[280px] overflow-y-auto custom-scrollbar">
              <div v-if="!isLoadingComments && comments.length === 0"
                  class="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                <span class="material-icons text-slate-200 text-2xl block mb-1">chat_bubble_outline</span>
                <p class="text-[10px] text-slate-300 font-normal uppercase">{{ $t('requests.preview.noComments') }}</p>
              </div>

              <!-- Comment Item -->
              <div v-for="comment in comments" :key="comment.id" class="flex flex-col gap-2">

                <!-- Top-level bubble -->
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="flex items-start gap-2">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-[10px] font-medium text-blue-600">
                        {{ (comment.authorName || 'U').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2 mb-1">
                        <span class="text-[10px] font-medium text-slate-700 truncate">
                          {{ comment.authorName }}
                        </span>
                        <span class="text-[8px] text-slate-400 flex-shrink-0">
                          {{ formatDate(comment.createdAt) }}
                          <span v-if="comment.isEdited" class="italic"> · edited</span>
                        </span>
                      </div>

                      <!-- Edit mode -->
                      <div v-if="editingCommentId === comment.id" class="flex flex-col gap-2">
                        <textarea
                          v-model="editCommentContent"
                          rows="2"
                          class="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        ></textarea>
                        <div class="flex gap-2">
                          <button @click="submitEditComment(comment.id)"
                                  :disabled="isSubmittingEdit || !editCommentContent.trim()"
                                  class="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-[10px] rounded-lg font-medium transition-all">
                            {{ isSubmittingEdit ? 'Saving…' : 'Save' }}
                          </button>
                          <button @click="editingCommentId = null"
                                  class="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] rounded-lg font-medium transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>

                      <!-- Normal mode -->
                      <p v-else class="text-[11px] text-slate-600 leading-relaxed"
                        :class="{ 'italic text-slate-400': comment.isDeleted }">
                        {{ comment.content }}
                      </p>

                      <!-- Action row -->
                      <div v-if="!comment.isDeleted && editingCommentId !== comment.id"
                          class="flex items-center gap-3 mt-1.5">
                        <button v-if="comment.reply === null || comment.reply === undefined"
                                @click="replyingToId = comment.id; replyContent = ''"
                                class="text-[10px] text-slate-400 hover:text-blue-600 transition-colors">
                          ↩ Reply
                        </button>
                        <span v-else class="text-[10px] text-slate-300 italic">1 reply</span>

                        <template v-if="comment.author?.id === currentUser.id || currentUserRole === 'Admin'">
                          <button @click="startEditComment(comment)"
                                  class="text-[10px] text-slate-400 hover:text-slate-700 transition-colors">
                            Edit
                          </button>
                          <button @click="deleteComment(comment.id)"
                                  :disabled="deletingCommentId === comment.id"
                                  class="text-[10px] text-slate-400 hover:text-red-500 transition-colors">
                            {{ deletingCommentId === comment.id ? '…' : 'Delete' }}
                          </button>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reply input box -->
                <div v-if="replyingToId === comment.id"
                    class="ml-8 p-3 bg-blue-50 border border-blue-200 rounded-xl flex flex-col gap-2">
                  <p class="text-[10px] font-medium text-blue-600">
                    Replying to {{ comment.authorName }}
                  </p>
                  <textarea
                    v-model="replyContent"
                    rows="2"
                    placeholder="Write a Reply…"
                    class="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  ></textarea>
                  <div class="flex gap-2">
                    <button @click="submitReply"
                            :disabled="isSubmittingReply || !replyContent.trim()"
                            class="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-[10px] rounded-lg font-medium transition-all">
                      {{ isSubmittingReply ? 'Sending…' : 'Send Reply' }}
                    </button>
                    <button @click="replyingToId = null; replyContent = ''"
                            class="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 text-[10px] rounded-lg font-medium transition-all border border-slate-200">
                      Cancel
                    </button>
                  </div>
                </div>

                <!-- Reply bubble -->
                <div v-if="comment.reply"
                    class="ml-8 p-3 bg-white rounded-xl border border-slate-100 border-l-2 border-l-slate-300">
                  <div class="flex items-start gap-2">
                    <div class="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span class="text-[9px] font-medium text-slate-500">
                        {{ (comment.reply.author?.fullName || 'U').charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between gap-2 mb-1">
                        <span class="text-[10px] font-medium text-slate-700">
                          {{ comment.reply.author?.fullName || 'Unknown' }}
                        </span>
                        <span class="text-[8px] text-slate-400">
                          {{ formatDate(comment.reply.createdAt) }}
                          <span v-if="comment.reply.isEdited" class="italic"> · edited</span>
                        </span>
                      </div>

                      <!-- Edit mode reply -->
                      <div v-if="editingCommentId === comment.reply.id" class="flex flex-col gap-2">
                        <textarea
                          v-model="editCommentContent"
                          rows="2"
                          class="w-full bg-white border border-slate-200 rounded-lg text-xs p-2 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                        ></textarea>
                        <div class="flex gap-2">
                          <button @click="submitEditComment(comment.reply.id)"
                                  :disabled="isSubmittingEdit"
                                  class="px-3 py-1 bg-blue-600 text-white text-[10px] rounded-lg font-medium">
                            {{ isSubmittingEdit ? 'Saving…' : 'Save' }}
                          </button>
                          <button @click="editingCommentId = null"
                                  class="px-3 py-1 bg-slate-200 text-slate-600 text-[10px] rounded-lg font-medium">
                            Cancel
                          </button>
                        </div>
                      </div>

                      <p v-else class="text-[11px] text-slate-600 leading-relaxed"
                        :class="{ 'italic text-slate-400': comment.reply.isDeleted }">
                        {{ comment.reply.content }}
                      </p>

                      <!-- Reply actions -->
                      <div v-if="!comment.reply.isDeleted && editingCommentId !== comment.reply.id"
                          class="flex gap-3 mt-1.5">
                        <template v-if="comment.reply.author?.id === currentUser.id || currentUserRole === 'Admin'">
                          <button @click="startEditComment(comment.reply)"
                                  class="text-[10px] text-slate-400 hover:text-slate-700 transition-colors">
                            Edit
                          </button>
                          <button @click="deleteComment(comment.reply.id)"
                                  :disabled="deletingCommentId === comment.reply.id"
                                  class="text-[10px] text-slate-400 hover:text-red-500 transition-colors">
                            {{ deletingCommentId === comment.reply.id ? '…' : 'Delete' }}
                          </button>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Input komentar baru -->
            <div v-if="!isSelectedDocFinalized" class="space-y-2">
              <textarea
                v-model="newComment"
                placeholder="Write a comment..."
                rows="2"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-medium resize-none"
              ></textarea>
              <button
                @click="submitComment"
                :disabled="!newComment.trim() || isSubmittingComment"
                class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-[11px] font-medium uppercase tracking-wide transition-all">
                <span v-if="!isSubmittingComment" class="material-icons text-[14px]">send</span>
                <span v-else class="material-icons text-[14px] animate-spin">sync</span>
                {{ isSubmittingComment ? 'Mengirim...' : 'Submit Comment' }}
              </button>
            </div>
            <div v-else class="text-center py-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="material-icons text-slate-200 text-xl block mb-1">lock</span>
              <p class="text-[10px] text-slate-400 font-medium italic">
                Comments are disabled for completed documents
              </p>
            </div>
          </div>

        </div>
      </Transition>

    <!-- Detail Modal with Edit Mode -->
    <Transition name="modal-fade">
      <div v-if="showDetailModal" @click.self="closeDetailModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
          
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700">
            <div class="flex-1">
              <h2 class="font-semibold text-white flex items-center gap-2 text-xl">
                <span class="material-icons">description</span>
                {{ isEditMode ? (modalDoc?.status === 'DRAFT' ? 'Edit Draft' : 'Edit Document') : modalDoc?.title }}
              </h2>
              <span v-if="!isEditMode" :class="statusClass(modalDoc?.status, false)" 
                    class="inline-block mt-2 px-3 py-1 rounded-lg text-[9px] font-medium uppercase tracking-widest">
                {{ formatStatus(modalDoc?.status) }}
              </span>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            
            <!-- Warning for documents in approval process -->
            <div v-if="hasAnyApprovalAction(modalDoc)" 
                 class="mb-4 bg-amber-50 border border-amber-200 text-amber-700 text-xs p-3 rounded-xl">
              Dokumen ini sudah masuk proses approval. Edit dan delete tidak lagi diperbolehkan.
            </div>

            <!-- Warning for revision required -->
            <div v-if="modalDoc?.status === 'REVISION' && !isEditMode"
                 class="mb-4 bg-amber-50 border border-amber-200 text-amber-700 text-xs p-3 rounded-xl flex items-start gap-2">
              <span class="material-icons text-amber-600 text-sm flex-shrink-0">edit_note</span>
              <div>
                <p class="font-medium mb-1">Revision Required</p>
                <p class="text-[10px]">{{ modalDoc.revisionNotes || 'Approver meminta revisi pada dokumen ini.' }}</p>
              </div>
            </div>

            <!-- VIEW MODE -->
            <div v-if="!isEditMode" class="space-y-6">
              
              <!-- Description -->
              <div>
                <label class="text-[10px] font-normal uppercase text-slate-400 tracking-widest block mb-2">Description</label>
                
                <!-- HTML dengan <style> atau full doc → iframe terisolasi -->
                <iframe
                  v-if="isFullHtmlDocument(modalDoc?.description)"
                  :srcdoc="modalDoc.description"
                  class="w-full h-[400px] bg-white rounded-xl border border-slate-100"
                  sandbox="allow-same-origin"
                  scrolling="yes">
                </iframe>
                <!-- HTML fragment tanpa <style> → v-html -->
                <div v-else-if="modalDoc?.description && modalDoc.description.includes('<')"
                    class="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 overflow-auto max-h-[400px]"
                    v-html="modalDoc.description">
                </div>
                <!-- Plain text -->
                <p v-else class="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {{ modalDoc?.description || 'No description provided.' }}
                </p>
              </div>

              <!-- Document Information Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-slate-50 rounded-xl">
                  <span class="text-[10px] font-normal text-slate-400 uppercase block mb-1">Category</span>
                  <span class="text-sm font-medium text-slate-700">{{ modalDoc?.categoryInfo?.name || 'N/A' }}</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl">
                  <span class="text-[10px] font-normal text-slate-400 uppercase block mb-1">Created By</span>
                  <span class="text-sm font-medium text-slate-700">{{ modalDoc?.creatorInfo?.fullName || 'Unknown' }}</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl">
                  <span class="text-[10px] font-normal text-slate-400 uppercase block mb-1">Date Created</span>
                  <span class="text-sm font-medium text-slate-700">{{ formatDate(modalDoc?.createdAt) }}</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl">
                  <span class="text-[10px] font-normal text-slate-400 uppercase block mb-1">Attachments</span>
                  <span class="text-sm font-medium text-slate-700">{{ modalDoc?.attachmentCount || 0 }} file</span>
                </div>
              </div>

              <!-- Attachments Download Section -->
              <div v-if="modalDoc?.attachments && modalDoc.attachments.length > 0">
                <div class="flex items-center justify-between mb-3">
                  <label class="text-[10px] font-normal uppercase text-slate-400 tracking-widest">
                    Attachments
                  </label>
                  <!-- Tombol tambah file baru — hanya untuk REVISION -->
                  <label v-if="modalDoc?.status === 'REVISION'" class="cursor-pointer">
                    <input 
                      type="file" 
                      multiple 
                      class="hidden" 
                      @change="handleAddRevisionAttachment"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
                    <div class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-medium transition-all shadow-sm cursor-pointer">
                      <span class="material-icons text-[14px]">add</span>
                      Tambah File
                    </div>
                  </label>
                </div>

                <!-- List file yang sudah ada -->
                <div class="space-y-2">
                  <div v-for="(att, index) in modalDoc.attachments" :key="att.id || index"
                       class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    
                    <!-- File Icon -->
                    <div class="w-9 h-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span class="material-icons text-lg"
                            :class="{
                              'text-red-500': (att.mimeType || '').includes('pdf') || (att.fileName || '').toLowerCase().endsWith('.pdf'),
                              'text-blue-500': (att.mimeType || '').includes('word') || (att.fileName || '').toLowerCase().match(/\.(doc|docx)$/),
                              'text-green-500': (att.mimeType || '').includes('sheet') || (att.fileName || '').toLowerCase().match(/\.(xls|xlsx)$/),
                              'text-purple-500': (att.mimeType || '').startsWith('image/'),
                              'text-slate-400': true
                            }">
                        {{ 
                          (att.mimeType || '').includes('pdf') || (att.fileName || '').toLowerCase().endsWith('.pdf') ? 'picture_as_pdf' :
                          (att.mimeType || '').includes('word') || (att.fileName || '').toLowerCase().match(/\.(doc|docx)$/) ? 'description' :
                          (att.mimeType || '').includes('sheet') || (att.fileName || '').toLowerCase().match(/\.(xls|xlsx)$/) ? 'table_chart' :
                          (att.mimeType || '').startsWith('image/') ? 'image' : 'insert_drive_file'
                        }}
                      </span>
                    </div>

                    <!-- File Info -->
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-medium text-slate-700 truncate" :title="att.fileName || att.displayName">
                        {{ att.fileName || att.displayName || 'File' }}
                      </p>
                      <p class="text-[10px] text-slate-400 mt-0.5">
                        {{ att.fileSizeFormatted || formatFileSize(att.fileSize || 0) }}
                      </p>
                    </div>

                    <!-- Tombol Download -->
                    <button
                      @click="downloadModalAttachment(att)"
                      :disabled="downloadingAttachmentId === att.id || removingAttachmentId === att.id"
                      class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-[10px] font-medium transition-all shadow-sm">
                      <span v-if="downloadingAttachmentId !== att.id" class="material-icons text-[14px]">download</span>
                      <span v-else class="material-icons text-[14px] animate-spin">sync</span>
                      {{ downloadingAttachmentId === att.id ? '...' : 'Download' }}
                    </button>

                    <!-- Tombol Remove — hanya untuk REVISION -->
                    <button
                      v-if="modalDoc?.status === 'REVISION'"
                      @click="removeModalAttachment(att, index)"
                      :disabled="removingAttachmentId === att.id || downloadingAttachmentId === att.id"
                      class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-lg text-[10px] font-medium transition-all shadow-sm">
                      <span v-if="removingAttachmentId !== att.id" class="material-icons text-[14px]">delete</span>
                      <span v-else class="material-icons text-[14px] animate-spin">sync</span>
                      {{ removingAttachmentId === att.id ? '...' : 'Remove' }}
                    </button>
                  </div>
                </div>

                <!-- Preview file baru yang akan diupload (untuk REVISION) -->
                <div v-if="modalDoc?.status === 'REVISION' && editForm.attachments && editForm.attachments.length > 0"
                     class="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p class="text-[10px] font-medium text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <span class="material-icons text-[12px]">upload</span>
                    File Baru (Belum Tersimpan)
                  </p>
                  <div class="space-y-2">
                    <div v-for="(file, fIdx) in editForm.attachments" :key="fIdx"
                         class="flex items-center gap-3 p-2 bg-white rounded-lg border border-emerald-100">
                      <span class="material-icons text-emerald-500 text-sm">insert_drive_file</span>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-slate-700 truncate">{{ file.name }}</p>
                        <p class="text-[10px] text-slate-400">{{ formatFileSize(file.size) }}</p>
                      </div>
                      <button @click="removeEditAttachment(fIdx)"
                              type="button"
                              class="text-slate-300 hover:text-red-500 transition-colors">
                        <span class="material-icons text-sm">close</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Jika attachmentCount > 0 tapi array kosong (data belum load) -->
              <div v-else-if="modalDoc?.attachmentCount > 0"
                   class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <span class="material-icons text-slate-300 text-3xl mb-2 block">attach_file</span>
                <p class="text-xs text-slate-400 font-medium">{{ modalDoc.attachmentCount }} file(s) tersedia</p>
                <p class="text-[10px] text-slate-300 mt-1">Buka dokumen untuk melihat file</p>
              </div>

              <!-- Approval Workflow -->
              <div>
                <h3 class="text-[10px] font-normal uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></span>
                  Approval Workflow
                </h3>
                
                <div class="space-y-4">
                  <div v-for="(level, index) in modalDoc?.approvalLevels" :key="index" 
                       class="relative flex gap-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    
                    <!-- Status Icon -->
                    <div class="flex-shrink-0">
                      <div v-if="isLevelCompleted(level)" class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                        <span class="material-icons text-sm">check</span>
                      </div>
                      <div v-else-if="isLevelCurrent(level)" class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white ring-4 ring-blue-50">
                        <span class="material-icons text-xs animate-spin">sync</span>
                      </div>
                      <div v-else class="w-8 h-8 bg-white border-2 border-slate-200 rounded-full"></div>
                    </div>

                    <!-- Level Info -->
                    <div class="flex-1">
                      <h4 :class="isLevelPending(level) ? 'text-slate-400' : 'text-slate-900'" 
                          class="font-medium text-xs uppercase tracking-wide mb-2">
                        Level {{ level.level }}
                      </h4>
                      
                      <!-- Approvers -->
                      <div class="space-y-3 mt-3">
                        <div v-for="(approver, aIndex) in level.approvers" :key="aIndex" 
                             class="text-xs flex items-center gap-3 bg-white px-3 py-2 rounded-xl"
                             :class="isLevelPending(level) ? 'text-slate-400' : 'text-slate-700'">
                          <span class="material-icons text-sm"
                                :class="approver.status === 'APPROVED' ? 'text-emerald-500' : 
                                        approver.status === 'REJECTED' ? 'text-red-500' : 'text-blue-400'">
                            person
                          </span>

                          <div class="flex-1 flex flex-col gap-0.5">
                            <span class="font-normal">{{ approver.fullName }}</span>
                            <!-- Badge disposisi group -->
                            <span v-if="approver.disposisiGroupId"
                                  class="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-normal w-fit flex items-center gap-1">
                              <span class="material-icons text-[10px]">swap_horiz</span>
                               Disposition Group{{ approver.disposisiGroupId.slice(-4) }}
                            </span>
                          </div>
                          
                          <span v-if="approver.status === 'APPROVED'" 
                                class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                            ✓ APPROVED
                          </span>
                          <span v-else-if="approver.status === 'REJECTED'" 
                                class="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                            ✗ REJECTED
                          </span>
                          <span v-else-if="approver.status === 'PENDING'" 
                                class="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            ⏳ PENDING
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- EDIT MODE -->
            <div v-else class="space-y-4">
              
              <!-- Draft Auto-save Indicator -->
              <div v-if="draftState.hasChanges" 
                   class="bg-blue-50 border border-blue-200 text-blue-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <span class="material-icons text-sm">save</span>
                <div>
                  <p class="font-medium">Draft auto-saved</p>
                  <p class="text-[10px] text-blue-600">
                    Last saved: {{ draftState.savedAt ? formatDate(draftState.savedAt) : 'Just now' }}
                  </p>
                </div>
              </div>

              <!-- Title Field -->
              <div>
                <label class="text-xs font-medium text-slate-700 block mb-1">Document Title *</label>
                <input v-model="editForm.title" 
                       type="text" 
                       placeholder="Enter document title (min 5 characters)..."
                       class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       required
                       minlength="5">
                <p class="text-xs text-slate-400 mt-1">{{ editForm.title.length }} characters</p>
              </div>

              <!-- Category Field -->
              <div>
                <label class="text-xs font-medium text-slate-700 block mb-1">Category *</label>
                <select v-model="editForm.categoryId" 
                        class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                        required>
                  <option value="" disabled>-- Select Category --</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <!-- Description Field -->
              <div>
                <label class="text-xs font-medium text-slate-700 block mb-1">Description *</label>
                <textarea v-model="editForm.description" 
                          rows="4" 
                          placeholder="Enter document description..."
                          class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none"
                          required></textarea>
                <p class="text-xs text-slate-400 mt-1">{{ editForm.description.length }} characters</p>
              </div>

              <!-- Attachments Field -->
              <div>
                <label class="text-xs font-medium text-slate-700 block mb-1">Attachments</label>
                <div class="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <div class="flex items-center justify-center gap-3 mb-3">
                    <label class="cursor-pointer">
                      <input type="file" 
                             multiple 
                             class="hidden" 
                             @change="handleEditAttachments" 
                             accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
                      <div class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-xs font-medium"> <span class="material-icons text-sm">attach_file</span>
                        Add Files
                      </div>
                    </label>
                    <div class="text-[10px] text-slate-400">
                      <p>Max 5MB per file</p>
                      <p>PDF, DOC, XLS, JPG, PNG</p>
                    </div>
                  </div>
                  
                  <!-- File List -->
                  <div v-if="editForm.attachments && editForm.attachments.length > 0" 
                       class="space-y-2 max-h-[200px] overflow-y-auto">
                    <div v-for="(file, index) in editForm.attachments" :key="index" 
                         class="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <div class="flex items-center gap-2 overflow-hidden">
                        <span class="material-icons text-blue-500 text-sm">description</span>
                        <div class="flex flex-col overflow-hidden">
                          <span class="text-[10px] font-medium text-slate-600 truncate">
                            {{ file.name }}
                          </span>
                          <span class="text-[9px] text-slate-400">
                            {{ formatFileSize(file.size) }}
                          </span>
                        </div>
                      </div>
                      <button @click="removeEditAttachment(index)" 
                              type="button"
                              class="text-slate-300 hover:text-red-500 transition">
                        <span class="material-icons text-sm">close</span>
                      </button>
                    </div>
                  </div>
                  <p v-else class="text-[9px] text-slate-400 italic text-center py-2">
                    No files attached
                  </p>
                </div>
              </div>

              <!-- Current Status Info -->
              <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div class="flex items-center gap-2 mb-2">
                  <span class="material-icons text-blue-600 text-sm">info</span>
                  <span class="text-[10px] font-medium text-blue-600 uppercase">Current Status</span>
                </div>
                <p class="text-xs text-blue-700 font-medium">{{ formatStatus(modalDoc?.status) }}</p>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            
            <!-- VIEW MODE BUTTONS -->
            <template v-if="!isEditMode">
              <button @click="closeDetailModal" 
                      class="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Close
              </button>
              <button v-if="canDisposisi"
                      @click="openDisposisiModal"
                      class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm flex items-center gap-2">
                <span class="material-icons text-sm">swap_horiz</span>
                Disposition
              </button>
              <button v-if="canEditDocument(modalDoc)" 
                      @click="enterEditMode" 
                      class="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2">
                <span class="material-icons text-sm">edit</span>
                Edit
              </button>
              <button v-if="canDeleteDocument(modalDoc)" 
                      @click="handleDeleteDocument(modalDoc)"
                      class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all shadow-sm flex items-center gap-2">
                <span class="material-icons text-sm">delete</span>
                Delete
              </button>
            </template>

            <!-- EDIT MODE BUTTONS -->
            <template v-else>
              <button @click="cancelEdit" 
                      type="button"
                      class="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Cancel
              </button>
              <button @click="handleSaveUpdate" 
                      type="button"
                      :disabled="isUpdating"
                      class="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!isUpdating" class="material-icons text-sm">save</span>
                <span v-else class="material-icons text-sm animate-spin">sync</span>
                {{ isUpdating ? 'Saving...' : 'Save Changes' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== DISPOSISI MODAL ===== -->
    <Transition name="modal-fade">
      <div v-if="showDisposisiModal"
          @click.self="closeDisposisiModal"
          class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
          
          <!-- Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 flex justify-between items-center">
            <div>
              <h2 class="text-white font-semibold text-lg flex items-center gap-2">
                <span class="material-icons">swap_horiz</span>
                Approval Disposition
              </h2>
              <p class="text-blue-200 text-xs mt-0.5">{{ modalDoc?.title }}</p>
            </div>
            <button @click="closeDisposisiModal" class="text-white/70 hover:text-white transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5">
            <!-- Field 1: Pilih approver yang akan didisposisi -->
            <div>
              <label class="text-xs font-medium text-slate-700 block mb-2">
                Approver to be Assigned <span class="text-red-500">*</span>
              </label>
              <select v-model="disposisiForm.approverId"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all">
                <option value="" disabled>-- Select approver --</option>
                <option v-for="approver in pendingApproversCurrentLevel"
                        :key="approver.id"
                        :value="approver.id">
                  {{ approver.fullName || approver.name }} (Level {{ modalDoc?.currentLevel }})
                </option>
              </select>
              <p class="text-[10px] text-slate-400 mt-1">Active approver at the current level who cannot be reached</p>
            </div>

            <!-- Field 2: Pilih approver pengganti -->
            <div>
              <label class="text-xs font-medium text-slate-700 block mb-2">
                Replacement Approver <span class="text-red-500">*</span>
              </label>
              <div v-if="loadingApprovers" class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span class="material-icons text-slate-400 text-sm animate-spin">sync</span>
                <span class="text-xs text-slate-400">Load list of approver...</span>
              </div>
              <select v-else
                      v-model="disposisiForm.substituteId"
                      :disabled="!disposisiForm.approverId"
                      class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="" disabled>-- Select an alternate approver --</option>
                <option v-for="approver in filteredSubstituteApprovers()"
                        :key="approver.id"
                        :value="approver.id">
                  {{ approver.fullName || approver.name }}
                </option>
              </select>
              <p class="text-[10px] text-slate-400 mt-1">Replacement approver must not already exist at the same level</p>
            </div>

            <!-- Field 3: Alasan/keterangan disposisi -->
            <div>
              <label class="text-xs font-medium text-slate-700 block mb-2">
                Reason for Disposition <span class="text-red-500">*</span>
              </label>
              <textarea v-model="disposisiForm.reason"
                        rows="3"
                        placeholder="reasonnn..."
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none transition-all"
                        maxlength="500">
              </textarea>
              <p class="text-[10px] mt-1"
                :class="disposisiForm.reason.length < 10 ? 'text-red-400' : 'text-slate-400'">
                {{ disposisiForm.reason.length }}/500 characters (minimum 10)
              </p>
            </div>

            <!-- Preview disposisi grup yang akan terbentuk -->
            <div v-if="disposisiForm.approverId && disposisiForm.substituteId"
                class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p class="text-[10px] font-medium text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                <span class="material-icons text-[12px]">preview</span>
                Disposition Group Preview
              </p>
              <div class="flex items-center gap-3 flex-wrap">
                <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-emerald-100">
                  <span class="material-icons text-slate-500 text-sm">person</span>
                  <div>
                    <p class="text-[10px] text-slate-400">Original Approver</p>
                    <p class="text-xs font-medium text-slate-700">
                      {{ pendingApproversCurrentLevel.find(a => a.id === disposisiForm.approverId)?.fullName || '-' }}
                    </p>
                  </div>
                </div>
                <span class="material-icons text-emerald-500 text-xl">sync_alt</span>
                <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-emerald-100">
                  <span class="material-icons text-blue-500 text-sm">person_add</span>
                  <div>
                    <p class="text-[10px] text-slate-400">Replacement Approver</p>
                    <p class="text-xs font-medium text-slate-700">
                      {{ availableApprovers.find(a => a.id === disposisiForm.substituteId)?.fullName || '-' }}
                    </p>
                  </div>
                </div>
              </div>
              <p class="text-[10px] text-emerald-600 mt-3 font-medium">
                ✓ If one approves → this slot is completed. Other approvers at the same level must still approve.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button @click="closeDisposisiModal"
                    type="button"
                    class="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
              Cancel
            </button>
            <button @click="handleSubmitDisposisi"
                    type="button"
                    :disabled="isSubmittingDisposisi || !disposisiForm.approverId || !disposisiForm.substituteId || disposisiForm.reason.trim().length < 10"
                    class="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all shadow-sm flex items-center gap-2">
              <span v-if="!isSubmittingDisposisi" class="material-icons text-sm">swap_horiz</span>
              <span v-else class="material-icons text-sm animate-spin">sync</span>
              {{ isSubmittingDisposisi ? 'Memproses...' : 'Send Disposition' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== CONFIRM DISPOSISI MODAL ===== -->
    <Transition name="modal-fade">
      <div v-if="showConfirmDisposisiModal"
          @click.self="showConfirmDisposisiModal = false"
          class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
          
          <!-- Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center gap-3">
            <div class="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span class="material-icons text-white text-lg">swap_horiz</span>
            </div>
            <div>
              <h2 class="text-white font-semibold text-base">Confirm Disposition</h2>
              <p class="text-blue-200 text-xs mt-0.5">Please review before proceeding</p>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-3">
            <div class="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
              <div class="flex items-start gap-3 px-4 py-3">
                <span class="material-icons text-blue-500 text-[18px] mt-0.5">description</span>
                <div>
                  <p class="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Document</p>
                  <p class="text-sm font-medium text-slate-800 mt-0.5">{{ modalDoc?.title }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3 px-4 py-3">
                <span class="material-icons text-slate-500 text-[18px] mt-0.5">person</span>
                <div>
                  <p class="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Original Approver</p>
                  <p class="text-sm font-medium text-slate-800 mt-0.5">
                    {{ pendingApproversCurrentLevel.find(a => a.id === disposisiForm.approverId)?.fullName || '-' }}
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3 px-4 py-3">
                <span class="material-icons text-blue-500 text-[18px] mt-0.5">person_add</span>
                <div>
                  <p class="text-[10px] font-normal text-slate-400 uppercase tracking-widest"> Replacement Approver</p>
                  <p class="text-sm font-medium text-slate-800 mt-0.5">
                    {{ availableApprovers.find(a => a.id === disposisiForm.substituteId)?.fullName || '-' }}
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3 px-4 py-3">
                <span class="material-icons text-slate-500 text-[18px] mt-0.5">notes</span>
                <div>
                  <p class="text-[10px] font-normal text-slate-400 uppercase tracking-widest">Reason</p>
                  <p class="text-sm text-slate-700 mt-0.5">{{ disposisiForm.reason }}</p>
                </div>
              </div>
            </div>

            <p class="text-[11px] text-slate-400 text-center">Continue the disposition process?</p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <button @click="showConfirmDisposisiModal = false"
                    type="button"
                    class="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
              Cancel
            </button>
            <button @click="executeDisposisi"
                    type="button"
                    :disabled="isSubmittingDisposisi"
                    class="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-xl transition-all shadow-sm flex items-center gap-2">
              <span v-if="!isSubmittingDisposisi" class="material-icons text-sm">check_circle</span>
              <span v-else class="material-icons text-sm animate-spin">sync</span>
              {{ isSubmittingDisposisi ? 'Memproses...' : 'Yes, continue' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== SUCCESS DISPOSISI MODAL ===== -->
    <Transition name="modal-fade">
      <div v-if="showSuccessDisposisiModal"
          @click.self="showSuccessDisposisiModal = false"
          class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
        <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

          <!-- Body -->
          <div class="px-6 pt-8 pb-6 text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-emerald-500 text-3xl">check_circle</span>
            </div>
            <h2 class="text-lg font-semibold text-slate-900 mb-2">Disposition Successful!</h2>
            <p class="text-sm text-slate-500 leading-relaxed">
              Replacement approver 
              <span class="font-medium text-slate-700">{{ successDisposisiMessage }}</span>
              has been added to the disposition group along with the original approver.
            </p>
            <div class="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p class="text-xs text-blue-600 font-medium flex items-center justify-center gap-1.5">
                <span class="material-icons text-[14px]">info</span>
                Only one approval is required to proceed with the process.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 flex justify-center">
            <button @click="showSuccessDisposisiModal = false"
                    type="button"
                    class="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm">
              OK, Got it
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== CUSTOM MODAL (Confirm & Alert) ===== -->
    <Transition name="modal-fade">
      <div
        v-if="customModal.show"
        @click.self="customModal.type === 'confirm' ? resolveModal(false) : resolveModal(true)"
        class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[26px] shadow-2xl w-full max-w-[400px] overflow-hidden border border-slate-100"
          
        >
          <!-- Icon + Title + Message -->
          <div class="flex flex-col items-center px-8 pt-10 pb-6">

            <!-- SUCCESS -->
            <div v-if="customModal.variant === 'success'"
                class="w-[68px] h-[68px] rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 15L12 22L25 8" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <!-- WARNING -->
            <div v-else-if="customModal.variant === 'warning'"
                class="w-[68px] h-[68px] rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-5">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M15 11V17M15 21H15.01M6 26H24L15 4L6 26Z"
                      stroke="#D97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <!-- DANGER -->
            <div v-else-if="customModal.variant === 'danger'"
                class="w-[68px] h-[68px] rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-5">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="11" stroke="#DC2626" stroke-width="2.5"/>
                <path d="M11 11L19 19M19 11L11 19" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>

            <!-- INFO (default / blue) -->
            <div v-else
                class="w-[68px] h-[68px] rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="11" stroke="#2563EB" stroke-width="2.5"/>
                <path d="M15 13V21M15 9.5H15.01" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>

            <p class="text-[18px] font-semibold text-slate-800 text-center mb-2 leading-snug">
              {{ customModal.title }}
            </p>
            <p class="text-[13px] text-slate-500 text-center leading-relaxed font-normal">
              {{ customModal.message }}
            </p>
          </div>

          <div class="h-px bg-slate-100"></div>

          <!-- Buttons -->
          <div class="flex gap-3 px-6 py-5">
            <!-- Cancel — only for confirm type -->
            <button
              v-if="customModal.type === 'confirm'"
              @click="resolveModal(false)"
              class="flex-1 py-3 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all"
            >
              {{ customModal.cancelText }}
            </button>

            <!-- Confirm / OK -->
            <button
              @click="resolveModal(true)"
              :class="[
                customModal.type === 'confirm' ? 'flex-[1.4]' : 'flex-1',
                customModal.variant === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : customModal.variant === 'warning'
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                  : customModal.variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
              ]"
              class="py-3 rounded-[14px] text-white text-[13px] font-medium flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
              {{ customModal.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</div>
</template>

<script>
import permohonanService from '@/services/permohonanService';
import api from '@/services/api';
import CryptoJS from 'crypto-js';
// Import category service jika ada, atau gunakan API langsung
// import categoryService from '@/services/categoryService';

export default {
  name: 'ViewDocument',

  props: {
    id: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      documents: [],
      selectedDoc: null,
      searchQuery: '',
      loading: false,
      showDetailModal: false,
      modalDoc: null,
      isEditMode: false,
      isUpdating: false,
      currentPage: 1,
      itemsPerPage: 10,

      // Draft state management
      draftState: {
        documentId: null,
        hasChanges: false,
        savedAt: null
      },

      // Auto-save watcher reference
      autoSaveWatcher: null,

      // Edit form
      editForm: {
        title: '',
        description: '',
        categoryId: '',
        attachments: []
      },

      // Categories for dropdown
      categories: [],


      filters: {
        page: 1,
        limit: 50,
        search: '',
        status: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },

      pagination: {
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0
      },
      downloadingAttachmentId: null,
      removingAttachmentId: null,

      // === COMMENTS ===
      comments: [],
      newComment: '',
      isSubmittingComment: false,
      isLoadingComments: false,
      replyingToId: null,
      replyContent: '',
      isSubmittingReply: false,
      editingCommentId: null,
      editCommentContent: '',
      isSubmittingEdit: false,
      deletingCommentId: null,
      
      // === DISPOSISI ===
      showDisposisiModal: false,
      disposisiForm: {
        approverId: '',
        substituteId: '',
        reason: ''
      },
      isSubmittingDisposisi: false,
      availableApprovers: [],
      loadingApprovers: false,

      showConfirmDisposisiModal: false,
      showSuccessDisposisiModal: false,
      successDisposisiMessage: '',
      pendingDisposisiSubmit: false,

      // ─── Custom Modal System 
      customModal: {
        show: false,
        type: 'confirm',     
        variant: 'info',      
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        resolve: null,
      },

    };
  },

  computed: {
    activeLanguage() {
      return this.$langStore ? this.$langStore.lang : 'id';
    },

    currentUser() {
      return JSON.parse(localStorage.getItem('user') || '{}');
    },

    currentUserRole() {
      const roles = this.currentUser.roles || [];
      if (roles.includes('ADMIN')) return 'Admin';
      if (roles.includes('APPROVER')) return 'Approver';
      if (roles.includes('REVIEWER')) return 'Reviewer';
      return 'User';
    },

    isPureBasicUser() {
      const roles = (this.currentUser.roles || []).map(r => r.toUpperCase());
      return roles.includes('USER') || roles.includes('REQUESTER');
    },

    filteredDocsAll() {
      let docs = this.documents;

      // Filter pencarian
      if (this.searchQuery) {
        const search = this.searchQuery.toLowerCase();
        docs = docs.filter(d => {
          const title = (d.title || '').toLowerCase();
          const desc = (d.description || '').toLowerCase();
          return title.includes(search) || desc.includes(search);
        });
      }

      // Urutkan terbaru dulu berdasarkan tanggal
      docs = [...docs].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      return docs;
    },

    filteredDocs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDocsAll.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredDocsAll.length / this.itemsPerPage);
    },

    paginationPages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const pages = [];

      if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

      pages.push(1);

      if (current > 4) pages.push('...');

      const start = Math.max(2, current - 2);
      const end = Math.min(total - 1, current + 2);

      for (let i = start; i <= end; i++) pages.push(i);

      if (current < total - 3) pages.push('...');

      pages.push(total);

      return pages;
    },

    totalThisMonth() {
      return this.filteredDocsAll.length;
    },

    hasSavedDraft() {
      if (!this.modalDoc) return false;
      const savedDraft = this.loadDraftFromStorage(this.modalDoc.id);
      return savedDraft !== null;
    },

    // ✅ PINDAHKAN KE DALAM computed
    isDocumentCreator() {
      if (!this.modalDoc) return false;
      return String(this.modalDoc.createdBy) === String(this.currentUser.id);
    },

    pendingApproversCurrentLevel() {
      if (!this.modalDoc?.approvalLevels) return [];

      // Cari level aktif dari currentLevel field
      let currentLevel = null;

      if (this.modalDoc.currentLevel) {
        currentLevel = this.modalDoc.approvalLevels.find(
          lvl => lvl.level === this.modalDoc.currentLevel
        );
      }

      // Fallback: level pertama yang belum semua selesai
      if (!currentLevel) {
        currentLevel = this.modalDoc.approvalLevels.find(lvl =>
          lvl.approvers?.some(app => !['APPROVED', 'REJECTED'].includes(app.status))
        );
      }

      // Fallback terakhir: level pertama
      if (!currentLevel) {
        currentLevel = this.modalDoc.approvalLevels[0];
      }

      if (!currentLevel) return [];

      // Terima semua status yang berarti "belum selesai": PENDING, IN_PROGRESS, null, undefined
      return (currentLevel.approvers || []).filter(app =>
        !['APPROVED', 'REJECTED'].includes(app.status)
      );
    },

    isReviewer() {
      const roles = this.currentUser.roles || [];
      return roles.some(r => ['REVIEWER', 'ADMIN', 'APPROVER', 'USER'].includes(r));
    },

    isSelectedDocFinalized() {
      if (!this.selectedDoc) return false;
      return ['APPROVED', 'REJECTED', 'COMPLETED'].includes(this.selectedDoc.status);
    },

    canDisposisi() {
      if (!this.modalDoc) return false;

      const isCreator = String(this.modalDoc.createdBy) === String(this.currentUser.id);
      const validStatus = ['SUBMITTED', 'IN_REVIEW'].includes(this.modalDoc.status);
      const hasPendingApprovers = this.pendingApproversCurrentLevel.length > 0;

      console.log('🔍 canDisposisi:', { isCreator, validStatus, hasPendingApprovers,
        createdBy: this.modalDoc.createdBy, userId: this.currentUser.id,
        status: this.modalDoc.status, pendingCount: this.pendingApproversCurrentLevel.length });

      return isCreator && validStatus && hasPendingApprovers;
    },
  },


  methods: {

    async fetchAllDocuments(baseParams = {}) {
      let allDocs = [];
      let page = 1;
      const pageSize = 100;
      const maxPages = 3; // Batasi maksimal 3 halaman (300 dokumen) agar tidak loop tanpa henti

      const params = {
        view: 'compact',
        ...baseParams,
      };
      if (!params.status) {
        params.status = 'SUBMITTED,IN_REVIEW,APPROVED,REJECTED,REVISION';
      }

      while (page <= maxPages) {
        const response = await permohonanService.getMyApproval({
          ...params,
          page,
          limit: pageSize,
        });

        const docs = response.data || [];
        allDocs = [...allDocs, ...docs];

        const pagination = response.pagination || {};
        const totalPages =
          pagination.totalPages ||
          Math.ceil((pagination.total || docs.length) / pageSize);

        if (page >= totalPages || docs.length < pageSize) break;
        page++;
      }

      return allDocs;
    },

    /* ===============================
      CUSTOM MODAL SYSTEM
      =============================== */
    $confirm(title, message, options = {}) {
      return new Promise((resolve) => {
        this.customModal = {
          show: true,
          type: 'confirm',
          variant: options.variant || 'info',
          title,
          message,
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          resolve,
        };
      });
    },

    $alert(title, message, options = {}) {
      return new Promise((resolve) => {
        this.customModal = {
          show: true,
          type: 'alert',
          variant: options.variant || 'info',
          title,
          message,
          confirmText: options.confirmText || 'OK',
          cancelText: '',
          resolve,
        };
      });
    },

    resolveModal(result) {
      if (this.customModal.resolve) this.customModal.resolve(result);
      this.customModal.show = false;
    },

    /* ===============================
       MODAL METHODS
       =============================== */
    openDetailModal(doc) {
      this.modalDoc = doc;
      this.showDetailModal = true;
      this.isEditMode = false;
      document.body.style.overflow = 'hidden';
    },

    closeDetailModal() {
      if (this.isUpdating) {
        console.warn('⚠️ Cannot close modal while updating');
        return;
      }
      
      if (this.isEditMode && this.draftState.hasChanges) {
        const confirmMsg = 'Ada perubahan yang belum disimpan!\n\nDraft akan tetap tersimpan. Tutup modal?';
        
        if (!confirm(confirmMsg)) {
          return; 
        }
        
        console.log('💾 Draft tersimpan, modal ditutup');
      }
      
      this.showDetailModal = false;
      this.modalDoc = null;
      this.isEditMode = false;
      this.resetEditForm();
      
      if (this.autoSaveWatcher) {
        this.autoSaveWatcher();
        this.autoSaveWatcher = null;
      }
      
      document.body.style.overflow = '';
    },

    enterEditMode() {
      // Validasi permission
      if (!this.canEditDocument(this.modalDoc)) {
        alert('❌ Anda tidak memiliki izin untuk mengubah dokumen ini.\n\nDokumen hanya bisa diubah jika:\n- Anda adalah creator\n- Status masih DRAFT\n- Belum ada approval action');
        return;
      }

      this.isEditMode = true;

      const savedDraft = this.loadDraftFromStorage(this.modalDoc.id);
      
      if (savedDraft) {
        // Tanya user apakah mau restore draft
        const restoreMsg = `Ditemukan draft yang belum tersimpan!\n\nDraft terakhir: ${this.formatDate(savedDraft.savedAt)}\n\nRestore draft?`;
        
        if (confirm(restoreMsg)) {
          // Restore dari draft
          this.editForm = {
            title: savedDraft.title,
            description: savedDraft.description || '',
            categoryId: savedDraft.categoryId || '',
            attachments: [] // File objects tidak bisa di-restore
          };
          
          // Warning tentang attachments
          if (savedDraft.attachments && savedDraft.attachments.length > 0) {
            alert(`ℹ️ Draft restored!\n\n⚠️ Note: ${savedDraft.attachments.length} file(s) yang sebelumnya dipilih tidak dapat di-restore.\n\nSilakan pilih ulang file yang ingin diupload.`);
          }
          
          console.log('✅ Draft restored');
        } else {
          this.clearDraftFromStorage(this.modalDoc.id);
        
          this.editForm = {
            title: this.modalDoc.title,
            description: this.modalDoc.description || '',
            categoryId: this.modalDoc.categoryInfo?.id || this.modalDoc.categoryId || '',
            attachments: []
          };
        }
      } else {
        // Tidak ada draft, populate dengan data asli
        this.editForm = {
          title: this.modalDoc.title,
          description: this.modalDoc.description || '',
          categoryId: this.modalDoc.categoryInfo?.id || this.modalDoc.categoryId || '',
          attachments: []
        };
      }

      if (this.categories.length === 0) {
        this.loadCategories();
      }

      this.setupAutoSaveWatcher();
    },

    async cancelEdit() {
      if (this.draftState.hasChanges) {
        const ok = await this.$confirm(
          'Unsaved Changes',
          'You have unsaved changes. Canceling will delete the draft. Do you want to continue?',
          { variant: 'warning', confirmText: 'Yes, Discard', cancelText: 'Keep Editing' }
        );
        if (!ok) return;
        this.clearDraftFromStorage(this.modalDoc.id);
      }
      this.isEditMode = false;
      this.resetEditForm();
      if (this.autoSaveWatcher) {
        this.autoSaveWatcher();
        this.autoSaveWatcher = null;
      }
    },

    resetEditForm() {
      this.editForm = {
        title: '',
        description: '',
        categoryId: '',
        attachments: [] 
      };
    },


    /* ===============================
       LOAD CATEGORIES
       =============================== */
    async loadCategories() {
      try {
        // Sesuaikan dengan API endpoint Anda
        const response = await permohonanService.getCategories();
        this.categories = response.data || [];
        
        console.log('✅ Categories loaded:', this.categories.length);
      } catch (error) {
        console.error('❌ Load categories error:', error);
        
        // Fallback: gunakan kategori dari dokumen yang ada
        const uniqueCategories = [...new Map(
          this.documents
            .filter(d => d.categoryInfo)
            .map(d => [d.categoryInfo.id, d.categoryInfo])
        ).values()];
        
        this.categories = uniqueCategories;
      }
    },

    /* ===============================
       SAVE UPDATE
       =============================== */
    async handleSaveUpdate() {
      const doc = this.modalDoc;
      
      if (!doc) {
        console.error('❌ No modal doc');
        return;
      }

      if (!this.canEditDocument(doc)) {
        alert('❌ Anda tidak memiliki izin untuk mengubah dokumen ini.\n\nDokumen hanya bisa diubah jika:\n- Anda adalah creator\n- Status masih DRAFT atau REVISION\n- Belum ada approval action');
        this.isEditMode = false;
        return;
      }
      
      if (!this.editForm.title.trim() || this.editForm.title.trim().length < 5) {
        alert('Document Title wajib diisi (minimal 5 karakter)');
        return;
      }

      if (!this.editForm.description.trim()) {
        alert('Description wajib diisi');
        return;
      }

      if (!this.editForm.categoryId) {
        alert('Category wajib dipilih');
        return;
      }

      const ok = await this.$confirm(
        'Save Changes',
        'Are you sure you want to save changes to this document?',
        { variant: 'info', confirmText: 'Save Changes', cancelText: 'Cancel' }
      );
      if (!ok) return;

      try {
        this.isUpdating = true;

        // ✅ PERBAIKAN: Simpan original status
        const originalStatus = doc.status;

        // ✅ PERBAIKAN: Prepare update data - include status jika REVISION
        const updateData = {
          title: this.editForm.title.trim(),
          description: this.editForm.description.trim(),
          categoryId: this.editForm.categoryId
        };

        let uploadMessage = '';
        let updateResponse;

        // Step 1: Update metadata dokumen dulu (tanpa file)
        updateResponse = await permohonanService.updatePermohonan(doc.id, updateData);

        const activeDocId = updateResponse?.data?.id || doc.id;
        console.log('📄 Active doc ID:', activeDocId, '| Original:', doc.id);

        // Jika revision (ID berubah), pindahkan attachment lama ke dokumen baru
        if (activeDocId !== doc.id) {
          // Fetch fresh data dulu agar dapat fileUrl dan metadata lengkap
          let oldAttachments = [];
          try {
            const oldDocResponse = await permohonanService.getPermohonanById(doc.id);
            oldAttachments = oldDocResponse?.data?.attachments || [];
            console.log('📋 Fresh old attachments fetched:', oldAttachments.length);
            console.log('📋 Sample:', JSON.stringify(oldAttachments[0]));
          } catch (fetchError) {
            console.warn('⚠️ Gagal fetch old doc, fallback ke local:', fetchError.message);
            oldAttachments = doc.attachments || this.modalDoc?.attachments || [];
          }
          console.log('📋 Migrating old attachments:', oldAttachments.length);
          
          for (const oldAtt of oldAttachments) {
            try {
              const objectId = oldAtt.fileUrl || oldAtt.objectId || oldAtt.metadata?.objectId;
              const hash = oldAtt.metadata?.hash || oldAtt.hash;
              const path = oldAtt.metadata?.path || `attachments/${activeDocId}`;
              const fileName = oldAtt.fileName || oldAtt.metadata?.originalFileName || 'file';

              console.log('📋 Migrating:', fileName, '| objectId:', objectId, '| hash:', hash);

              if (!objectId) {
                console.warn('⚠️ Skip migrasi - objectId kosong:', fileName);
                continue;
              }

              if (!hash) {
                console.warn('⚠️ Skip migrasi - hash kosong:', fileName);
                continue;
              }

              await permohonanService.confirmAttachmentUpload(activeDocId, {
                objectId,
                fileName,
                fileSize: oldAtt.fileSize || 0,
                mimeType: oldAtt.mimeType || 'application/octet-stream',
                hash,
                path
              });
              console.log('✅ Old attachment migrated:', fileName);
            } catch (migrateError) {
              console.warn('⚠️ Gagal migrasi attachment lama:', oldAtt.fileName, migrateError.message);
            }
          }
        }

        // Step 2: Upload file lewat backend → Objx → confirm
        if (this.editForm.attachments && this.editForm.attachments.length > 0) {
          for (const file of this.editForm.attachments) {
            try {
              // Step 2a: Hitung checksum — dengan fallback CryptoJS untuk HTTP
              const checksum = await this._checksumFile(file);

              // Step 2b: Minta presigned URL dari backend
              const uploadRequest = await permohonanService.requestAttachmentUpload(doc.id, {
                name: file.name,
                size: file.size,
                type: file.type || 'application/octet-stream',
                checksum
              });

              const responseData = uploadRequest.data;
              const upload_init_url = responseData.upload_init_url;
              const objxPath = responseData.path || responseData._meta?.path || '';
              const bucketId = responseData.bucket_id || responseData._meta?.bucketId || import.meta.env.VITE_OBJX_BUCKET_ID || 'a9c4a4f9-2c1e-410e-b43f-a9068bb1c154';
              const CHUNK_SIZE = responseData.chunk_size || 5 * 1024 * 1024;
              // Ekstrak upload_token dari URL query params (sama seperti ObjxSDK)
              const initUrl = new URL(upload_init_url);
              const upload_token = initUrl.searchParams.get('upload_token') || responseData.upload_token;
              const baseUrl = import.meta.env.DEV ? '/objx-storage/api/v1' : `${initUrl.protocol}//${initUrl.host}/api/v1`;

              if (!upload_token) throw new Error('Upload token tidak tersedia dari server');

              // Init upload session
              const initResp = await fetch(`${baseUrl}/files/init?upload_token=${upload_token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  filename: file.name,
                  size: file.size,
                  checksum,
                  path: objxPath,
                  bucket_id: bucketId
                })
              });

              const initData = await initResp.json();
              console.log('📤 Init response:', initData);

              if (!initData.upload_id) throw new Error(`Init upload gagal: ${JSON.stringify(initData)}`);

              const uploadId = initData.upload_id;
              const totalParts = Math.ceil(file.size / CHUNK_SIZE);

              // Upload tiap chunk
              for (let i = 0; i < totalParts; i++) {
                const start = i * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);
                const formData = new FormData();
                formData.append('file', chunk, file.name);
                await fetch(
                  `${baseUrl}/files/${uploadId}/part?part_num=${i + 1}&upload_token=${upload_token}`,
                  { method: 'POST', body: formData }
                );
              }

              // Complete upload
              const completeResp = await fetch(
                `${baseUrl}/files/${uploadId}/complete?upload_token=${upload_token}`,
                { 
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({})
                }
              );

              if (!completeResp.ok) {
                const errText = await completeResp.text();
                throw new Error(`Complete upload gagal (${completeResp.status}): ${errText}`);
              }

              const completeData = await completeResp.json();
              console.log('✅ Complete response:', JSON.stringify(completeData));

              const objectId = completeData.object_id 
                || completeData.id 
                || completeData.objectId 
                || completeData.data?.object_id 
                || completeData.data?.id;

              console.log('📦 objectId extracted:', objectId);

              if (!objectId) throw new Error(`object_id kosong. Response: ${JSON.stringify(completeData)}`);
              const confirmResult = await permohonanService.confirmAttachmentUpload(activeDocId, {
                objectId: objectId,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type || 'application/octet-stream',
                hash: completeData.hash,
                path: objxPath || `attachments/${activeDocId}`
              });
              console.log('✅ Confirm result:', confirmResult);
              console.log('✅ File uploaded & confirmed:', file.name);
            } catch (fileError) {
              console.error('❌ File upload failed:', file.name, fileError.message);
              throw new Error(`Gagal upload file "${file.name}": ${fileError.message}`);
            }
          }

          uploadMessage = ` dengan ${this.editForm.attachments.length} file attachment`;
        }


        // Verifikasi dulu sebelum submit
        try {
          const verifyResponse = await permohonanService.getPermohonanById(activeDocId);
          const attachmentCount = verifyResponse?.data?.attachmentCount || 0;
          const attachments = verifyResponse?.data?.attachments || [];
          console.log('🔍 VERIFY - activeDocId:', activeDocId);
          console.log('🔍 VERIFY - attachmentCount:', attachmentCount);
          console.log('🔍 VERIFY - attachments:', JSON.stringify(attachments));
        } catch (verifyError) {
          console.error('❌ VERIFY gagal:', verifyError.message);
        }



        console.log('✅ Document updated successfully');
        
        // ✅ Clear draft dari storage
        this.clearDraftFromStorage(doc.id);

        // ✅ Exit edit mode
        this.isEditMode = false;
        
        // ✅ Destroy watcher
        if (this.autoSaveWatcher) {
          this.autoSaveWatcher();
          this.autoSaveWatcher = null;
        }

        // ✅ Show appropriate message
        if (originalStatus === 'REVISION') {
        await this.$alert(
          'Document Revised Successfully',
          `Your document has been revised${uploadMessage} and resubmitted for approval. Status: SUBMITTED`,
          { variant: 'success', confirmText: 'Got It' }
        );
        this.showDetailModal = false;
        this.modalDoc = null;
        this.resetEditForm();
          
        } else if (originalStatus === 'DRAFT') {
          alert(`✅ Draft berhasil diupdate ${uploadMessage}!\n\nStatus: DRAFT\n\nAnda bisa submit nanti dari halaman Draft.`);
          
        } else {
          alert(`✅ Dokumen berhasil edit ${uploadMessage}!`);
        }

        // ✅ Reload documents
        await this.loadDocuments();

        // ✅ Update references jika modal masih terbuka
        if (this.showDetailModal && this.modalDoc) {
          const updatedDoc = this.documents.find(d => d.id === doc.id);
          if (updatedDoc) {
            this.modalDoc = updatedDoc;
          }
        }

        // ✅ Update selected doc
        if (this.selectedDoc && this.selectedDoc.id === doc.id) {
          const updatedDoc = this.documents.find(d => d.id === doc.id);
          if (updatedDoc) {
            this.selectedDoc = updatedDoc;
          } else {
            // ✅ Jika dokumen sudah jadi DRAFT (tidak ada di list), clear selection
            this.selectedDoc = null;
          }
        }

      } catch (error) {
        console.error('❌ Update document error:', error);
        
        const errorMsg = error.response?.data?.message || error.message || 'Gagal update dokumen';
        alert(`Error: ${errorMsg}`);
        
      } finally {
        this.isUpdating = false;
      }
    },

    /* ===============================
       PERMISSION CHECKS
       =============================== */
    canEditDocument(doc) {
      if (!doc) return false;

      const isCreator = doc.createdBy === this.currentUser.id;
      
      // ✅ UBAH: Status REVISION (bukan REVISION_REQUESTED)
      const canEdit = ['DRAFT', 'REVISION'].includes(doc.status);
      
      return isCreator && canEdit;
    },

    canDeleteDocument(doc) {
      if (!doc) return false;

      const isCreator = doc.createdBy === this.currentUser.id;
      const isAdmin = this.currentUserRole === 'Admin';
      
      const canDelete = ['DRAFT'].includes(doc.status);
      const noApprovalActionYet = !this.hasAnyApprovalAction(doc);
      return (isCreator && canDelete && noApprovalActionYet) || isAdmin;
    },

    /* ===============================
       DELETE HANDLER
       =============================== */
    async handleDeleteDocument(doc) {
      if (!doc) return;

      if (!this.canDeleteDocument(doc)) {
        alert('❌ Anda tidak memiliki izin untuk menghapus dokumen ini.');
        return;
      }

      const confirmMsg = `Are you sure you want to delete "${doc.title}"?\n\nThis action cannot be undone.`;
      if (!confirm(confirmMsg)) return;

      try {
        await permohonanService.deletePermohonan(doc.id);

        // ✅ FIX: Pesan benar
        alert('✅ Dokumen berhasil dihapus!');

        // ✅ FIX: Clear draft
        this.clearDraftFromStorage(doc.id);

        // ✅ FIX: Reset edit mode & watcher
        this.isEditMode = false;
        if (this.autoSaveWatcher) {
          this.autoSaveWatcher();
          this.autoSaveWatcher = null;
        }

        // ✅ FIX: Tutup modal
        this.showDetailModal = false;
        this.modalDoc = null;
        this.resetEditForm();
        document.body.style.overflow = '';

        // ✅ FIX: Clear selected doc jika itu yang dihapus
        if (this.selectedDoc?.id === doc.id) {
          this.selectedDoc = null;
        }

        // ✅ FIX: Reload list
        await this.loadDocuments();

      } catch (error) {
        console.error('❌ Delete document error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to delete document';
        alert(`Error: ${errorMsg}`);
      }
    },

    saveDraftToStorage() {
      if (!this.modalDoc || !this.isEditMode) return;
      
      const draftKey = `draft_doc_${this.modalDoc.id}`;
      
      // Convert attachments ke format serializable
      const attachmentData = (this.editForm.attachments || []).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));
      
      const draftData = {
        documentId: this.modalDoc.id,
        title: this.editForm.title,
        description: this.editForm.description,
        categoryId: this.editForm.categoryId,
        attachments: attachmentData,
        savedAt: new Date().toISOString(),
        originalData: {
          title: this.modalDoc.title,
          description: this.modalDoc.description,
          categoryId: this.modalDoc.categoryInfo?.id
        }
      };
      
      try {
        localStorage.setItem(draftKey, JSON.stringify(draftData));
        this.draftState.hasChanges = true;
        this.draftState.savedAt = draftData.savedAt;
        
        console.log('💾 Draft auto-saved:', draftKey);
      } catch (error) {
        console.error('❌ Failed to save draft:', error);
      }
    },

    loadDraftFromStorage(documentId) {
      const draftKey = `draft_doc_${documentId}`;
      
      try {
        const savedDraft = localStorage.getItem(draftKey);
        if (!savedDraft) return null;
        
        const draftData = JSON.parse(savedDraft);
        console.log('📂 Draft loaded from storage:', draftKey);
        
        return draftData;
      } catch (error) {
        console.error('❌ Failed to load draft:', error);
        return null;
      }
    },

    clearDraftFromStorage(documentId) {
      const draftKey = `draft_doc_${documentId}`;
      
      try {
        localStorage.removeItem(draftKey);
        this.draftState.hasChanges = false;
        this.draftState.savedAt = null;
        
        console.log('🗑️ Draft cleared:', draftKey);
      } catch (error) {
        console.error('❌ Failed to clear draft:', error);
      }
    },

    setupAutoSaveWatcher() {
      // Destroy previous watcher jika ada
      if (this.autoSaveWatcher) {
        this.autoSaveWatcher();
      }
      
      // Setup new watcher untuk auto-save
      this.autoSaveWatcher = this.$watch(
        'editForm',
        () => {
          this.saveDraftToStorage();
        },
        { deep: true }
      );
      
      console.log('👁️ Auto-save watcher activated');
    },

    handleEditAttachments(e) {
      const newFiles = Array.from(e.target.files);
      
      if (!this.editForm.attachments) {
        this.editForm.attachments = [];
      }
  
      if (this.editForm.attachments.length + newFiles.length > 10) {
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

      this.editForm.attachments = [...this.editForm.attachments, ...newFiles];
      
      console.log('📎 Files added in edit mode:', newFiles.map(f => f.name));
      e.target.value = '';

      if (this.modalDoc) {
        this.saveDraftToStorage();
      }
    },

    removeEditAttachment(index) {
      if (!this.editForm.attachments) return;
      
      const removedFile = this.editForm.attachments[index];
      this.editForm.attachments.splice(index, 1);
      
      console.log('🗑️ File removed:', removedFile.name);
      
      this.saveDraftToStorage();
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
    
    /* ===============================
       LOAD DOCUMENTS FROM API
       =============================== */
        async loadDocuments() {
          try {
            this.loading = true;

            const baseParams = {
              sortBy: this.filters.sortBy,
              sortOrder: this.filters.sortOrder,
            };

            if (this.filters.search) baseParams.search = this.filters.search;
            if (this.filters.status) baseParams.status = this.filters.status;

            let allDocs = await this.fetchAllDocuments(baseParams);

            // ✅ Step 1 - Filter DRAFT
            allDocs = allDocs.filter(doc => !['DRAFT', 'CANCELLED'].includes(doc.status));
            const docMap = new Map();
            allDocs.forEach(doc => {
              const rootKey = doc.parentId || doc.id;
              if (!docMap.has(rootKey)) {
                docMap.set(rootKey, doc);
              } else {
                const existing = docMap.get(rootKey);
                const existingRev = existing.rev || 0;
                const currentRev = doc.rev || 0;
                if (currentRev > existingRev) {
                  docMap.set(rootKey, doc);
                } else if (currentRev === existingRev) {
                  const existingDate = new Date(existing.createdAt || 0);
                  const currentDate = new Date(doc.createdAt || 0);
                  if (currentDate > existingDate) {
                    docMap.set(rootKey, doc);
                  }
                }
              }
            });

            this.documents = Array.from(docMap.values());
            console.log('✅ After dedup:', this.documents.length, 'from', allDocs.length);
            

            // ✅ UBAH: Console log lebih detail
            console.log('✅ Documents loaded (excluding DRAFT and old REVISION):', this.documents.length);
            console.log('📊 Filtered from', allDocs.length, 'to', this.documents.length, 'documents');

            // Auto-select first document
            if (this.documents.length > 0 && !this.selectedDoc) {
              this.selectedDoc = this.documents[0];
            }

          } catch (error) {
            console.error('❌ Load documents error:', error);
            
            const errorMsg = error.response?.data?.message || 'Failed to load documents';
            alert(`Error: ${errorMsg}`);
            
            this.documents = [];
          } finally {
            this.loading = false;
          }
        },

    /* ===============================
   FILTER LATEST REVISIONS - PERBAIKAN
   =============================== */
    filterLatestRevisions(documents) {
      console.log('📝 filterLatestRevisions INPUT:', documents.length, 'docs');
      
      if (!documents || documents.length === 0) {
        return [];
      }

      // ✅ Step 1: Buat map untuk track revisions
      const revisionChains = new Map();
      
      documents.forEach(doc => {
        // Tentukan root ID
        const rootId = doc.parentId || doc.id;
        
        if (!revisionChains.has(rootId)) {
          revisionChains.set(rootId, []);
        }
        
        revisionChains.get(rootId).push(doc);
        
        console.log(`  📎 Grouped: ${doc.title} → root: ${rootId}, REV: ${doc.rev || 0}, status: ${doc.status}`);
      });

      console.log(`📊 Found ${revisionChains.size} revision chains`);

      // ✅ Step 2: Process each chain
      const validDocuments = [];
      
      revisionChains.forEach((chain, rootId) => {
        console.log(`\n🔗 Processing chain: ${rootId}`);
        console.log(`   Docs in chain: ${chain.length}`);
        
        // Sort by REV number (highest first)
        chain.sort((a, b) => {
          const revA = a.rev || 0;
          const revB = b.rev || 0;
          return revB - revA;
        });
        
        chain.forEach((doc, idx) => {
          console.log(`   [${idx}] REV ${doc.rev || 0}: ${doc.status} - ${doc.title}`);
        });
        
        // ✅ CRITICAL RULE:
        // Jika chain punya lebih dari 1 dokumen, hanya tampilkan yang REV tertinggi
        // KECUALI jika yang tertinggi adalah DRAFT (karena DRAFT ada di halaman lain)
        
        if (chain.length === 1) {
          // Hanya ada 1 dokumen di chain, langsung add
          validDocuments.push(chain[0]);
          console.log(`   ✅ Single doc - Added: ${chain[0].title}`);
          return;
        }
        
        // Ada multiple revisions
        const highestRev = chain[0]; // Sudah sorted, ini yang tertinggi
        
        // Check apakah ada DRAFT di chain
        const hasDraft = chain.some(doc => doc.status === 'DRAFT');
        
        if (hasDraft) {
          console.log(`   ⚠️ Chain has DRAFT - checking...`);
          
          // Jika ada DRAFT, skip SEMUA dokumen di chain ini
          // Karena berarti dokumen ini sedang dalam proses revisi
          // DRAFT akan tampil di halaman Draft
          console.log(`   ❌ SKIP entire chain - has active DRAFT revision`);
          return;
        }
        
        // Tidak ada DRAFT, tampilkan yang REV tertinggi
        validDocuments.push(highestRev);
        console.log(`   ✅ Added highest REV: ${highestRev.title} (REV ${highestRev.rev || 0})`);
      });

      console.log(`\n📋 FINAL OUTPUT: ${validDocuments.length} documents`);
      
      return validDocuments;
    },

    //Load specific document by ID
    async loadDocumentById(docId) {
      try {
        console.log('📄 Loading specific document:', docId);
        
        const response = await permohonanService.getPermohonanById(docId);
        
        if (!response || !response.data) {
          throw new Error('Document not found');
        }
        
        const doc = response.data;
        
        console.log('✅ Document loaded:', doc.title);
        
        // Buka modal langsung
        this.openDetailModal(doc);
        
        // Load all documents juga (untuk list)
        await this.loadDocuments();
        
      } catch (error) {
        console.error('❌ Load document by ID error:', error);
        
        alert('❌ Dokumen tidak ditemukan atau Anda tidak memiliki akses.\n\nAnda akan diarahkan ke daftar dokumen.');
        
        // Redirect ke view-document tanpa ID
        this.$router.replace('/view-document');
        
        // Load documents list
        await this.loadDocuments();
      }
    },

    /* ===============================
       DOCUMENT SELECTION
       =============================== */
    handleRowClick(doc) {
      this.selectedDoc = doc;
      this.loadComments(doc.id);
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      // Scroll ke atas tabel
      this.$nextTick(() => {
        const tableEl = this.$el.querySelector('table');
        if (tableEl) {
          tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },

    goToFullReview(id) {
      this.$router.push({
        path: '/approver',
        query: { id }
      });
    },

    /* ===============================
       APPROVAL LOGIC
       =============================== */
    canApprove(doc) {
      if (!doc) return false;
      
      // ✅ TAMBAH: User tidak bisa approve permohonannya sendiri
      const isCreator = doc.createdBy === this.currentUser.id;
      if (isCreator) return false;
      
      // ✅ Check role
      if (!['Approver', 'Admin'].includes(this.currentUserRole)) return false;
      
      // ✅ Check status
      if (!['SUBMITTED', 'IN_REVIEW'].includes(doc.status)) return false;

      // ✅ Check apakah user ada di current level dan masih PENDING
      const currentLevel = doc.approvalLevels?.find(
        lvl => lvl.level === doc.currentLevel
      );
      
      if (!currentLevel) return false;

      const userId = this.currentUser.id;
      const isApprover = currentLevel.approvers?.some(app => 
        app.id === userId && app.status === 'PENDING'
      );

      return isApprover;
    },

    async handleQuickApprove(doc) {
      if (!confirm(`Quick Approve "${doc.title}"?`)) return;

      try {
        await permohonanService.respondToApproval(
          doc.id,
          'APPROVED',
          'Quick approval from dashboard'
        );

        alert('✅ Document approved successfully!');

        await this.loadDocuments();

        if (this.selectedDoc?.id === doc.id) {
          this.selectedDoc = this.documents.find(d => d.id === doc.id);
        }

      } catch (error) {
        console.error('❌ Quick approve failed:', error);
        const errorMsg = error.response?.data?.message || 'Failed to approve document';
        alert(`Error: ${errorMsg}`);
      }
    },

    /* ===============================
       WORKFLOW STATUS CHECKS
       =============================== */
    isLevelCompleted(level) {
      return level.approvers?.every(app => app.status === 'APPROVED');
    },

    isLevelCurrent(level) {
      if (!this.selectedDoc && !this.modalDoc) return false;
      
      const doc = this.modalDoc || this.selectedDoc;

      if (doc.currentLevel) {
        return (
          level.level === doc.currentLevel &&
          level.approvers?.some(app => !['APPROVED', 'REJECTED'].includes(app.status))
        );
      }

      const allLevels = doc.approvalLevels || [];
      const thisIndex = allLevels.findIndex(l => l.level === level.level);
      
      const allPreviousCompleted = allLevels
        .slice(0, thisIndex)
        .every(l => l.approvers?.every(app => app.status === 'APPROVED'));

      const hasPending = level.approvers?.some(
        app => !['APPROVED', 'REJECTED'].includes(app.status)
      );

      return allPreviousCompleted && hasPending;
    },

    isLevelPending(level) {
      if (!this.selectedDoc && !this.modalDoc) return false;
      
      const doc = this.modalDoc || this.selectedDoc;

      if (doc.currentLevel) {
        return level.level > doc.currentLevel;
      }

      const allLevels = doc.approvalLevels || [];
      const thisIndex = allLevels.findIndex(l => l.level === level.level);

      const allPreviousCompleted = allLevels
        .slice(0, thisIndex)
        .every(l => l.approvers?.every(app => app.status === 'APPROVED'));

      return !allPreviousCompleted;
    },

    hasAnyApprovalAction(doc) {
    if (!doc?.approvalLevels) return false;

    return doc.approvalLevels.some(level =>
        level.approvers?.some(app =>
          ['APPROVED', 'REJECTED'].includes(app.status)
        )
      );
    },

    /* ===============================
       UI HELPERS
       =============================== */
    statusClass(status, isActiveRow) {
      if (isActiveRow) {
        return 'bg-blue-50/50 text-white border-transparent';
      }
      
      const statusClasses = {
        'DRAFT': 'bg-slate-100 text-slate-600 border-slate-200',
        'SUBMITTED': 'bg-blue-50 text-blue-600 border-blue-100',
        'REVISION': 'bg-amber-50 text-amber-600 border-amber-100', 
        'APPROVED': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'REJECTED': 'bg-red-50 text-red-600 border-red-100',
        'CANCELLED': 'bg-slate-100 text-slate-400 border-slate-200'  
      };
      
      return statusClasses[status] || 'bg-slate-100 text-slate-600 border-slate-200';
    },

    formatStatus(status) {
      const statusMap = {
        'DRAFT': 'Draft',
        'SUBMITTED': 'Submitted',
        'REVISION': 'Needs Revision',
        'APPROVED': 'Approved',
        'REJECTED': 'Rejected',
        'CANCELLED': 'Cancelled',
      };
      
      return statusMap[status] || status;
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Invalid Date';
      }
    },

    stripHtml(html) {
      if (!html) return '';
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    },

    isFullHtmlDocument(html) {
      if (!html) return false;
      const trimmed = html.trim().toLowerCase();
      return trimmed.startsWith('<!doctype')
        || trimmed.startsWith('<html')
        || trimmed.includes('<style');
    },

  formatShortDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  },
  
  async _checksumFile(file) {
      if (window.isSecureContext && window.crypto?.subtle) {
        try {
          const buffer = await file.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
          return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        } catch (e) {
          console.warn('⚠️ WebCrypto gagal, beralih ke CryptoJS:', e.message);
        }
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const wordArray = CryptoJS.lib.WordArray.create(reader.result);
            const hash = CryptoJS.SHA256(wordArray);
            resolve(hash.toString(CryptoJS.enc.Hex));
          } catch (cryptoErr) {
            reject(new Error('Gagal hitung checksum: ' + cryptoErr.message));
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
  },

  async downloadModalAttachment(att) {
      if (!att || !att.id || !this.modalDoc) return;

      try {
        this.downloadingAttachmentId = att.id;

        // Ambil link download dari backend (presigned ObjxStore)
        const metaRes = await api.get(
          `/approval-request/${this.modalDoc.id}/attachments/${att.id}/download`
        );
        const downloadUrl = metaRes.data?.data?.url || metaRes.data?.url;
        if (!downloadUrl) throw new Error('URL download tidak ditemukan');

        // Buka langsung via browser link (bebas dari pembatasan CORS JS)
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = att.fileName || att.displayName || 'file';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();

      } catch (error) {
        console.error('❌ Download attachment error:', error);
        alert(`Gagal download file: ${error.message}`);
      } finally {
        this.downloadingAttachmentId = null;
      }
  },

  async removeModalAttachment(att, index) {
      if (!att || !att.id || !this.modalDoc) return;

      if (this.modalDoc.status !== 'REVISION') {
        alert('❌ File hanya bisa dihapus saat status dokumen NEEDS REVISION.');
        return;
      }

      const confirmMsg = `Hapus file "${att.fileName || att.displayName}"?\n\nFile yang dihapus tidak bisa dikembalikan.`;
      if (!confirm(confirmMsg)) return;

      try {
        this.removingAttachmentId = att.id;

        await api.delete(
          `/approval-request/${this.modalDoc.id}/attachments/${att.id}`
        );

        // Hapus dari array lokal tanpa reload penuh
        if (this.modalDoc.attachments) {
          this.modalDoc.attachments.splice(index, 1);
        }
        if (this.modalDoc.attachmentCount > 0) {
          this.modalDoc.attachmentCount -= 1;
        }

        console.log('✅ Attachment removed:', att.fileName);

      } catch (error) {
        console.error('❌ Remove attachment error:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Gagal menghapus file';
        alert(`Gagal hapus file: ${errorMsg}`);
      } finally {
        this.removingAttachmentId = null;
      }
    },

    handleAddRevisionAttachment(e) {
      const newFiles = Array.from(e.target.files);

      if (!this.editForm.attachments) {
        this.editForm.attachments = [];
      }

      const currentTotal = (this.modalDoc?.attachments?.length || 0) + this.editForm.attachments.length;
      if (currentTotal + newFiles.length > 10) {
        alert('❌ Maksimal 10 file total!');
        e.target.value = '';
        return;
      }

      const invalidFiles = newFiles.filter(f => f.size > 5 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        alert(`❌ File melebihi 5MB:\n${invalidFiles.map(f => f.name).join('\n')}`);
        e.target.value = '';
        return;
      }

      this.editForm.attachments = [...this.editForm.attachments, ...newFiles];
      e.target.value = '';

      console.log('📎 Files added for revision:', newFiles.map(f => f.name));
    },

    /* ===============================
       COMMENT METHODS
       =============================== */
    async loadComments(docId) {
      if (!docId) return;
      try {
        this.isLoadingComments = true;
        const response = await api.get(`/approval-requests/${docId}/comments`);
        const rawComments = response.data?.data || response.data || [];
        this.comments = rawComments.map(c => ({
          ...c,
          authorName: c.author?.fullName || c.authorName || 'Unknown',
          content: c.content || c.comment || c.message || '',
          reply: c.reply || null
        }));
      } catch (error) {
        console.warn('⚠️ Load comments error:', error.message);
        this.comments = [];
      } finally {
        this.isLoadingComments = false;
      }
    },

    async submitComment() {
      if (!this.newComment.trim() || !this.selectedDoc) return;
      try {
        this.isSubmittingComment = true;
        await api.post(`/approval-requests/${this.selectedDoc.id}/comments`, {
          content: this.newComment.trim()
        });
        this.newComment = '';
        await this.loadComments(this.selectedDoc.id);
      } catch (error) {
        console.error('❌ Submit comment error:', error);
        alert('Gagal mengirim komentar: ' + (error.response?.data?.message || error.message));
      } finally {
        this.isSubmittingComment = false;
      }
    },

    async submitReply() {
      if (!this.replyContent.trim() || !this.replyingToId || !this.selectedDoc) return;
      try {
        this.isSubmittingReply = true;
        await api.post(
          `/approval-requests/${this.selectedDoc.id}/comments/${this.replyingToId}/reply`,
          { content: this.replyContent.trim() }
        );
        this.replyContent = '';
        this.replyingToId = null;
        await this.loadComments(this.selectedDoc.id);
      } catch (error) {
        console.error('❌ Submit reply error:', error);
        alert('Gagal mengirim reply: ' + (error.response?.data?.message || error.message));
      } finally {
        this.isSubmittingReply = false;
      }
    },

    startEditComment(comment) {
      this.editingCommentId = comment.id;
      this.editCommentContent = comment.content;
      this.replyingToId = null;
    },

    async submitEditComment(commentId) {
      if (!this.editCommentContent.trim()) return;
      try {
        this.isSubmittingEdit = true;
        await api.patch(`/comments/${commentId}`, {
          content: this.editCommentContent.trim()
        });
        this.editingCommentId = null;
        this.editCommentContent = '';
        await this.loadComments(this.selectedDoc.id);
      } catch (error) {
        console.error('❌ Edit comment error:', error);
        alert('Gagal edit komentar: ' + (error.response?.data?.message || error.message));
      } finally {
        this.isSubmittingEdit = false;
      }
    },

    async deleteComment(commentId) {
      try {
        this.deletingCommentId = commentId;
        await api.delete(`/comments/${commentId}`);
        await this.loadComments(this.selectedDoc.id);
      } catch (error) {
        console.error('❌ Delete comment error:', error);
        alert('Gagal hapus komentar: ' + (error.response?.data?.message || error.message));
      } finally {
        this.deletingCommentId = null;
      }
    },

    openDisposisiModal() {
      if (!this.canDisposisi) {
        alert('❌ Anda tidak bisa mendisposisi dokumen ini.\n\nSyarat disposisi:\n- Anda adalah pembuat dokumen\n- Status dokumen SUBMITTED atau IN_REVIEW\n- Ada approver yang masih PENDING');
        return;
      }

      this.disposisiForm = {
        approverId: '',
        substituteId: '',
        reason: ''
      };

      this.showDisposisiModal = true;
      this.loadAvailableApprovers();
    },

    closeDisposisiModal() {
      this.showDisposisiModal = false;
      this.disposisiForm = { approverId: '', substituteId: '', reason: '' };
    },

    async loadAvailableApprovers() {
      try {
        this.loadingApprovers = true;
        const response = await permohonanService.getApprovers();
        this.availableApprovers = response.data || [];
        console.log('✅ Approvers loaded for disposisi:', this.availableApprovers.length);
      } catch (error) {
        console.error('❌ Load approvers error:', error);
        this.availableApprovers = [];
        alert('Gagal memuat daftar approver. Coba lagi.');
      } finally {
        this.loadingApprovers = false;
      }
    },

    // Filter: substitute tidak boleh sama dengan approver asli,
    // dan tidak boleh sudah ada di level yang sama
    filteredSubstituteApprovers() {
      if (!this.disposisiForm.approverId) return this.availableApprovers;

      const currentLevel = this.modalDoc?.approvalLevels?.find(
        lvl => lvl.level === this.modalDoc.currentLevel
      );
      const existingApproverIds = (currentLevel?.approvers || []).map(a => a.id);

      return this.availableApprovers.filter(approver => {
        return approver.id !== this.disposisiForm.approverId
          && !existingApproverIds.includes(approver.id);
      });
    },

    async handleSubmitDisposisi() {
      if (!this.disposisiForm.approverId) {
        alert('❌ Pilih approver yang akan didisposisi terlebih dahulu.');
        return;
      }
      if (!this.disposisiForm.substituteId) {
        alert('❌ Pilih approver pengganti terlebih dahulu.');
        return;
      }
      if (!this.disposisiForm.reason.trim() || this.disposisiForm.reason.trim().length < 10) {
        alert('❌ Keterangan/alasan disposisi wajib diisi (minimal 10 karakter).');
        return;
      }
      if (this.disposisiForm.approverId === this.disposisiForm.substituteId) {
        alert('❌ Approver pengganti tidak boleh sama dengan approver asli.');
        return;
      }

      // Tampilkan custom confirm modal
      this.showConfirmDisposisiModal = true;
    },

    async executeDisposisi() {
      const originalApprover = this.pendingApproversCurrentLevel.find(
        a => a.id === this.disposisiForm.approverId
      );
      const substituteApprover = this.availableApprovers.find(
        a => a.id === this.disposisiForm.substituteId
      );

      try {
        this.isSubmittingDisposisi = true;
        this.showConfirmDisposisiModal = false;

        if (!this.modalDoc?.id) {
          throw new Error('ID dokumen tidak tersedia. Coba tutup dan buka kembali modal.');
        }

        await permohonanService.submitDisposisi(this.modalDoc.id, {
          approverId: this.disposisiForm.approverId,
          substituteId: this.disposisiForm.substituteId,
          reason: this.disposisiForm.reason.trim()
        });

        this.successDisposisiMessage = substituteApprover?.fullName || substituteApprover?.name || 'Approver pengganti';
        this.showSuccessDisposisiModal = true;

        this.closeDisposisiModal();

        await this.loadDocuments();

        if (this.showDetailModal && this.modalDoc) {
          const updated = this.documents.find(d => d.id === this.modalDoc.id);
          if (updated) {
            this.modalDoc = updated;
          } else {
            try {
              const fresh = await permohonanService.getPermohonanById(this.modalDoc.id);
              if (fresh?.data) this.modalDoc = fresh.data;
            } catch (e) {
              console.warn('Could not refresh modal doc:', e.message);
            }
          }
        }

      } catch (error) {
        console.error('❌ Disposisi error:', error);
        const errMsg = error.response?.data?.message || error.message || 'Gagal melakukan disposisi';
        alert(`❌ Error: ${errMsg}`);
      } finally {
        this.isSubmittingDisposisi = false;
      }
    },
  },

  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    '$route'(to, from) {
      if (to.query.status !== from.query.status) {
        this.filters.status = to.query.status || '';
        this.loadDocuments();
      }
    }
  },
  
  async mounted() {
    if (this.$route.query.status) {
      this.filters.status = this.$route.query.status;
    }

    const docId = this.id || this.$route.params.id;
    if (docId) {
      await this.loadDocumentById(docId);
    } else {
      await this.loadDocuments();
    }
    if (this.$route.query.refresh) {
      await this.loadDocuments();
      this.$router.replace({ query: {} }); // bersihkan query param
    }
  },

  beforeUnmount() {
    document.body.style.overflow = '';
    
    if (this.autoSaveWatcher) {
      this.autoSaveWatcher();
      this.autoSaveWatcher = null;
    }
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.modal-fade-enter-active {
  transition: all 0.3s ease-out;
}

.modal-fade-leave-active {
  transition: all 0.2s ease-in;
}

.modal-fade-enter-from {
  opacity: 0;
}

.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .bg-white {
  transform: scale(0.95);
}

.modal-fade-leave-to .bg-white {
  transform: scale(0.95);
}

/* Search input focus animation */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
/* Search result badge animation */
.fade-quick-enter-active,
.fade-quick-leave-active {
  transition: all 0.2s ease;
}
.fade-quick-enter-from,
.fade-quick-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style> 

