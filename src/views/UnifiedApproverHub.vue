


<template>
  <div
    class="min-h-screen bg-[#F1F5F9] px-2 pb-6 pt-4 md:px-8 md:pb-8 md:pt-5 font-sans text-slate-900 transition-all duration-300 relative overflow-x-hidden"
  >
    <div class="max-w-[1800px] mx-auto h-full flex flex-col">
      <!-- Header -->
      <header
        class="flex flex-col md:flex-row justify-between items-center mb-2 gap-2"
      >
        <div class="w-full md:w-auto -mt-2">
          <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">
            {{ $t('approvals.title') }} <span class="text-blue-600"></span>
          </h1>
        </div>

        <div
          class="flex flex-col md:flex-row gap-3 flex-1 max-w-2xl w-full justify-end"
        >
          <div
            class="bg-white border border-slate-200 px-5 py-2 rounded-xl shadow-sm flex items-center gap-4 self-end md:self-auto"
          >
            <div class="flex flex-col items-end border-r border-slate-100 pr-4">
              <p
                class="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mb-1"
              >
                {{ $t('approvals.documents') }}
              </p>
              <p class="text-xl font-semibold text-slate-900 leading-none">
                {{ canAccessApprover ? documents.length : 0 }}
              </p>
            </div>
            <div
              class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"
            >
              <span class="material-icons text-xl">assignment_turned_in</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Grid -->
      <div
        class="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden min-h-[calc(100vh-180px)]"
      >
        <!-- Left Sidebar - Document List -->
         <div class="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
          <!-- Search -->
          <div class="relative group">
            <span
              class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-blue-600 transition-colors"
              >search</span
            >
            <input
              v-model="searchQuery"
              :placeholder="$t('approvals.searchPlaceholder')"
              class="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-[13px] font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none text-slate-700 transition-all"
            />
          </div>

          <!-- STATUS FILTER DROPDOWN -->
          <div class="relative">
            <button
              @click="showFilterDropdown = !showFilterDropdown"
              class="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-all"
            >
              <div class="flex items-center gap-2.5">
                <!-- dot warna sesuai filter aktif -->
                <span
                  :class="{
                    'bg-slate-700':       activeFilter === 'ALL',
                    'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]':   activeFilter === 'PENDING',
                    'bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(251,191,36,0.8)]': activeFilter === 'IN_REVIEW',
                    'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]': activeFilter === 'APPROVED',
                    'bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)]':  activeFilter === 'REVISION',
                    'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]':      activeFilter === 'REJECTED',
                    'bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.8)] animate-bounce':     activeFilter === 'TAKEOVER',
                  }"
                  class="w-2 h-2 rounded-full flex-shrink-0"
                ></span>

                <span class="text-[12px] font-semibold text-slate-700 uppercase tracking-wide">
                  {{
                    activeFilter === 'ALL'      ? $t('approvals.filter.all') :
                    activeFilter === 'PENDING'  ? $t('approvals.filter.pending') :
                    activeFilter === 'IN_REVIEW'? $t('approvals.filter.inReview') :
                    activeFilter === 'APPROVED' ? $t('approvals.filter.approved') :
                    activeFilter === 'REVISION' ? $t('approvals.filter.revision') :
                    activeFilter === 'REJECTED' ? $t('approvals.filter.rejected') :
                    activeFilter === 'TAKEOVER' ? (activeLanguage === 'id' ? 'Pengalihan' : 'Takeover') : activeFilter
                  }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <!-- badge count -->
                <span class="px-2 py-0.5 rounded-xl text-[10px] font-semibold bg-slate-100 text-slate-600">
                  {{
                    activeFilter === 'ALL'       ? statusCounts.ALL :
                    activeFilter === 'PENDING'   ? statusCounts.PENDING :
                    activeFilter === 'IN_REVIEW' ? statusCounts.IN_REVIEW :
                    activeFilter === 'APPROVED'  ? statusCounts.APPROVED :
                    activeFilter === 'REVISION'  ? statusCounts.REVISION :
                    activeFilter === 'REJECTED'  ? statusCounts.REJECTED :
                    statusCounts.TAKEOVER
                  }}
                </span>
                <!-- chevron -->
                <span
                  class="material-icons text-slate-400 text-[18px] transition-transform duration-200"
                  :class="showFilterDropdown ? 'rotate-180' : ''"
                >expand_more</span>
              </div>
            </button>

            <!-- Dropdown Panel -->
            <Transition name="dropdown-fade">
              <div
                v-if="showFilterDropdown"
                class="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
              >
                <div class="p-1.5 flex flex-col gap-0.5">

                  <!-- ALL -->
                  <button
                    @click="activeFilter = 'ALL'; selectedDoc = null; showFilterDropdown = false"
                    :class="activeFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'"
                    class="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
                  >
                    <div class="flex items-center gap-2.5">
                       <span class="material-icons text-[15px]">folder</span>
                       <span class="text-[12px] font-semibold uppercase tracking-wide">{{ $t('approvals.filter.all') }}</span>
                    </div>
                    <span :class="activeFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'"
                          class="px-2 py-0.5 rounded-xl text-[10px] font-semibold">
                      {{ statusCounts.ALL }}
                    </span>
                  </button>

                  <!-- PENDING -->
                  <button
                    @click="activeFilter = 'PENDING'; selectedDoc = null; showFilterDropdown = false"
                    :class="activeFilter === 'PENDING' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-blue-50'"
                    class="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)] flex-shrink-0"></span>
                      <span class="text-[12px] font-semibold uppercase tracking-wide">{{ $t('approvals.filter.pending') }}</span>
                    </div>
                    <span :class="activeFilter === 'PENDING' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'"
                          class="px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      {{ statusCounts.PENDING }}
                    </span>
                  </button>

                  <!-- IN REVIEW -->
                  <button
                    @click="activeFilter = 'IN_REVIEW'; selectedDoc = null; showFilterDropdown = false"
                    :class="activeFilter === 'IN_REVIEW' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-amber-50'"
                    class="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(251,191,36,0.8)] flex-shrink-0"></span>
                      <span class="text-[12px] font-semibold uppercase tracking-wide">{{ $t('approvals.filter.inReview') }}</span>
                    </div>
                    <span :class="activeFilter === 'IN_REVIEW' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'"
                          class="px-2 py-0.5 rounded-xl text-[10px] font-semibold">
                      {{ statusCounts.IN_REVIEW }}
                    </span>
                  </button>

                  <!-- APPROVED -->
                  <button
                    @click="activeFilter = 'APPROVED'; selectedDoc = null; showFilterDropdown = false"
                    :class="activeFilter === 'APPROVED' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-emerald-50'"
                    class="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] flex-shrink-0"></span>
                      <span class="text-[12px] font-semibold uppercase tracking-wide">{{ $t('approvals.filter.approved') }}</span>
                    </div>
                    <span :class="activeFilter === 'APPROVED' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'"
                          class="px-2 py-0.5 rounded-xl text-[10px] font-semibold">
                      {{ statusCounts.APPROVED }}
                    </span>
                  </button>

                  <!-- REVISION -->
                  <button
                    @click="activeFilter = 'REVISION'; selectedDoc = null; showFilterDropdown = false"
                    :class="activeFilter === 'REVISION' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-orange-50'"
                    class="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)] flex-shrink-0"></span>
                      <span class="text-[12px] font-semibold uppercase tracking-wide">{{ $t('approvals.filter.revision') }}</span>
                    </div>
                    <span :class="activeFilter === 'REVISION' ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-700'"
                          class="px-2 py-0.5 rounded-xl text-[10px] font-semibold">
                      {{ statusCounts.REVISION }}
                    </span>
                  </button>

                  <!-- REJECTED -->
                  <button
                    @click="activeFilter = 'REJECTED'; selectedDoc = null; showFilterDropdown = false"
                    :class="activeFilter === 'REJECTED' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-red-50'"
                    class="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] flex-shrink-0"></span>
                      <span class="text-[12px] font-semibold uppercase tracking-wide">{{ $t('approvals.filter.rejected') }}</span>
                    </div>
                    <span :class="activeFilter === 'REJECTED' ? 'bg-white/20 text-white' : 'bg-red-50 text-red-700'"
                          class="px-2 py-0.5 rounded-xl text-[10px] font-semibold">
                      {{ statusCounts.REJECTED }}
                    </span>
                  </button>

                  <!-- TAKEOVER -->
                  <button
                    @click="activeFilter = 'TAKEOVER'; selectedDoc = null; showFilterDropdown = false"
                    :class="activeFilter === 'TAKEOVER' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-blue-50'"
                    class="flex items-center justify-between px-4 py-2.5 rounded-xl transition-all"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.8)] flex-shrink-0"></span>
                      <span class="text-[12px] font-semibold uppercase tracking-wide">{{ activeLanguage === 'id' ? 'Bisa Dialihkan' : 'Takeover Eligible' }}</span>
                    </div>
                    <span :class="activeFilter === 'TAKEOVER' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'"
                          class="px-2 py-0.5 rounded-xl text-[10px] font-semibold">
                      {{ statusCounts.TAKEOVER }}
                    </span>
                  </button>

                </div>
              </div>
            </Transition>
          </div>

          <!-- Divider + Label -->
          <div class="flex items-center gap-2">
            <div class="h-px flex-1 bg-slate-200"></div>
            <span
              class="text-[9px] font-medium text-slate-400 uppercase tracking-widest"
            >
              {{
                activeFilter === "ALL" ? "All" : activeFilter.replace("_", " ")
              }}
              — {{ filteredDocs.length }} docs
            </span>
            <div class="h-px flex-1 bg-slate-200"></div>
          </div>

          <!-- Document Cards -->
          <div
            class="flex-1 overflow-y-auto px-0 custom-scroll space-y-2 max-h-[calc(100vh-200px)]"
          >
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-10">
              <div class="text-center">
                <div
                  class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"
                ></div>
                <p class="text-sm text-slate-500">Loading documents...</p>
              </div>
            </div>

            <div
              v-else-if="filteredDocs.length === 0"
              class="flex items-center justify-center py-10"
            >
              <div class="text-center">
                <span class="material-icons text-slate-200 text-5xl mb-3"
                  >inbox</span
                >
                <p class="text-sm text-slate-400 font-medium">
                  {{ $t('approvals.noApprovals') }}
                </p>
              </div>
            </div>

            <!-- Document List -->
            <TransitionGroup
              v-else
              name="list-fast"
              tag="div"
              class="space-y-2"
            >
              <div
                v-for="doc in filteredDocs"
                :key="doc.id"
                @click="selectDocument(doc)"
                :class="[
                  selectedDoc?.id === doc.id
                    ? 'bg-slate-900 border-slate-900 shadow-lg scale-[1.00]'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md shadow-sm',
                  'group p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden',
                ]"
              >
                <div class="flex items-start justify-between gap-2 mb-3">
                  <h4
                    :class="
                      selectedDoc?.id === doc.id
                        ? 'text-white'
                        : 'text-slate-800'
                    "
                    class="text-[12px] font-medium uppercase tracking-tight leading-tight flex-1"
                    :title="doc.title"
                  >
                    {{ doc.title }}
                  </h4>
                  <div
                    v-if="doc.attachmentCount > 0"
                    :class="
                      selectedDoc?.id === doc.id
                        ? 'bg-white/10 text-white'
                        : 'bg-blue-50 text-blue-600'
                    "
                    class="flex items-center gap-1 px-2 py-0.5 rounded-xl"
                  >
                    <span class="material-icons text-[10px]">attach_file</span>
                    <span class="text-[9px] font-medium">{{
                      doc.attachmentCount
                    }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-1">
                    <span
                      :class="
                        selectedDoc?.id === doc.id
                          ? 'text-slate-400'
                          : 'text-slate-500'
                      "
                      class="text-[9px] font-medium uppercase tracking-wider"
                    >
                      ID: {{ doc.number }}
                    </span>
                    <span
                      :class="
                        selectedDoc?.id === doc.id
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      "
                      class="text-[8px] font-semibold"
                    >
                      {{ doc.sender }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span
                      v-if="doc.isTakeoverEligible"
                      class="bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0"
                    >
                      Takeover
                    </span>
                    <span
                      :class="getStatusDotClass(doc.status)"
                      class="w-1.5 h-1.5 rounded-full"
                    ></span>
                    <span
                      :class="[
                        selectedDoc?.id === doc.id
                          ? getStatusTextClass(doc.status, true)
                          : getStatusTextClass(doc.status, false),
                        'text-[10px] font-medium uppercase tracking-wide',
                      ]"
                    >
                      {{ getStatusLabel(doc.status) }}
                    </span>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <!-- Main Content Area -->
        <div
          class="lg:col-span-7 relative bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col"
        >
          <Transition name="page-fast" mode="out-in">
            <!-- Document Selected View -->
            <div
              v-if="selectedDoc"
              :key="selectedDoc.id"
              class="flex-1 p-5 overflow-y-auto custom-scroll"
            >
              <div
                class="lg:col-span-12 flex flex-col overflow-auto custom-scroll"
              >
                <div
                  class="bg-slate-50 border border-slate-200 rounded-[24px] p-5 flex-1 flex flex-col overflow-hidden"
                >
                  <!-- Document Info -->
                  <div
                    class="mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <span
                        class="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-medium uppercase tracking-widest"
                      >
                        ID #{{ selectedDoc.number }}
                      </span>
                      <div class="flex items-center gap-1.5">
                        <span
                          :class="getStatusDotClass(selectedDoc.status)"
                          class="w-2 h-2 rounded-full"
                        ></span>
                        <span
                          class="text-[9px] font-medium uppercase tracking-wider"
                          :class="getStatusTextClass(selectedDoc.status, false)"
                        >
                          {{ getStatusLabel(selectedDoc.status) }}
                        </span>
                      </div>
                    </div>
                    <h2
                      class="text-[15px] font-semibold text-slate-900 leading-tight tracking-tight"
                    >
                      {{ selectedDoc.title }}
                    </h2>
                    <div class="mt-3 relative">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="material-icons text-slate-400 text-[14px]"
                          >notes</span
                        >
                        <p
                          class="text-[9px] font-medium text-slate-400 uppercase tracking-[0.2em]"
                        >
                          Description
                        </p>
                      </div>
                      <div
                        :class="
                          showFullDesc ? 'max-h-[600px]' : 'max-h-[120px]'
                        "
                        class="relative overflow-y-auto transition-all duration-300 custom-scroll"
                      >
                        <div
                          v-if="
                            selectedDoc.note && selectedDoc.note.includes('<')
                          "
                          class="text-xs text-slate-600 leading-relaxed font-medium"
                          v-html="selectedDoc.note"
                        ></div>
                        <p
                          v-else
                          class="text-xs text-slate-600 leading-relaxed font-medium"
                        >
                          {{ selectedDoc.note || "No description provided." }}
                        </p>
                        <div
                          v-if="
                            !showFullDesc &&
                            (stripHtml(selectedDoc.note)?.length > 120 ||
                              selectedDoc.note?.includes('<'))
                          "
                          class="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"
                        ></div>
                      </div>
                      <button
                        v-if="
                          stripHtml(selectedDoc.note)?.length > 120 ||
                          selectedDoc.note?.includes('<')
                        "
                        @click="showFullDesc = !showFullDesc"
                        class="mt-1 text-[10px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                      >
                        <span class="material-icons text-[12px]">{{
                          showFullDesc ? "expand_less" : "expand_more"
                        }}</span>
                        {{ showFullDesc ? "Show less" : "Read more" }}
                      </button>
                    </div>

                    <!-- Attachments -->
                    <div
                      v-if="selectedDoc.attachments?.length > 0"
                      class="mt-4 space-y-3"
                    >
                      <h4
                        class="text-[9px] font-medium text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"
                      >
                        <span class="material-icons text-[12px]"
                          >attach_file</span
                        >
                        Attachments ({{ selectedDoc.attachments.length }})
                      </h4>
                      <div class="flex flex-col gap-2">
                        <div
                          v-for="(att, index) in selectedDoc.attachments"
                          :key="att.id"
                          :class="[
                            activeAttachmentIndex === index
                              ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-600/25 scale-[1.01]'
                              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm',
                            'group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                          ]"
                        >
                          <div
                            @click="openPreviewModal(att)"
                            :class="[
                              activeAttachmentIndex === index
                                ? 'bg-white/20'
                                : 'bg-slate-50 border border-slate-200',
                              'w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 cursor-pointer',
                            ]"
                          >
                            <span
                              :class="
                                activeAttachmentIndex === index
                                  ? 'text-white'
                                  : 'text-slate-400'
                              "
                              class="material-icons text-lg transition-colors"
                            >
                              {{ getFileIcon(att.fileType) }}
                            </span>
                          </div>
                          <div
                            @click="openPreviewModal(att)"
                            class="flex-1 min-w-0 text-left cursor-pointer"
                          >
                            <p
                              :class="
                                activeAttachmentIndex === index
                                  ? 'text-white'
                                  : 'text-slate-800'
                              "
                              class="text-[11px] font-medium truncate transition-colors"
                              :title="att.displayName"
                            >
                              {{ att.displayName }}
                            </p>
                            <div class="flex items-center gap-1.5 mt-0.5">
                              <span
                                :class="
                                  activeAttachmentIndex === index
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-100 text-slate-500'
                                "
                                class="text-[8px] font-medium uppercase px-1.5 py-0.5 rounded-md"
                              >
                                {{ getFileExtension(att.fileName) }}
                              </span>
                              <span
                                :class="
                                  activeAttachmentIndex === index
                                    ? 'text-white/60'
                                    : 'text-slate-400'
                                "
                                class="text-[9px]"
                              >
                                {{ att.fileSizeFormatted }}
                              </span>
                            </div>
                          </div>
                          <button
                            @click.stop="downloadAttachment(att)"
                            :class="
                              activeAttachmentIndex === index
                                ? 'bg-white/20 hover:bg-white/30 text-white'
                                : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-400'
                            "
                            class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            title="Download file"
                          >
                            <span class="material-icons text-[14px]"
                              >download</span
                            >
                          </button>
                        </div>
                      </div>
                      <button
                        v-if="selectedDoc.attachments.length > 1"
                        @click="downloadAllAttachments"
                        :disabled="isDownloadingAll"
                        class="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-slate-700 text-[10px] font-medium uppercase tracking-wide transition-all border border-slate-200"
                      >
                        <span
                          v-if="isDownloadingAll"
                          class="material-icons text-sm animate-spin"
                        >sync</span>
                        <span v-else class="material-icons text-sm">download</span>
                        {{ isDownloadingAll ? 'Menyiapkan ZIP...' : 'Download All Files' }}
                      </button>
                    </div>

                    <!-- Document Meta -->
                    <div class="grid grid-cols-2 gap-2 mt-4">
                      <div
                        class="p-2 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <p
                          class="text-[8px] text-slate-400 font-medium uppercase tracking-widest"
                        >
                          Category
                        </p>
                        <p class="text-xs font-medium text-slate-900">
                          {{ selectedDoc.amount }}
                        </p>
                      </div>
                      <div
                        class="p-2 bg-slate-50 rounded-lg border border-slate-100"
                      >
                        <p
                          class="text-[8px] text-slate-400 font-medium uppercase tracking-widest"
                        >
                          Sender
                        </p>
                        <p class="text-xs font-medium text-slate-900">
                          {{ selectedDoc.sender }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Hybrid Steps Progress -->
                  <div class="mb-4">
                    <p
                      class="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-3"
                    >
                      Live Progress Tracking
                    </p>
                    <div class="relative">
                      <div
                        class="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200"
                      ></div>
                      <div class="space-y-4 relative">
                        <div
                          v-for="(step, idx) in selectedDoc.hybridSteps"
                          :key="idx"
                          class="flex gap-4"
                        >
                          <div class="relative z-10">
                            <div
                              :class="[
                                'w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm',
                                step.completed
                                  ? 'bg-emerald-500 text-white'
                                  : step.isSkipped
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-white text-slate-300 border-slate-200',
                              ]"
                            >
                              <span
                                class="material-icons text-[12px] font-medium"
                              >
                                {{
                                  step.completed
                                    ? "check"
                                    : step.isSkipped
                                    ? "close"
                                    : "radio_button_unchecked"
                                }}
                              </span>
                            </div>
                          </div>
                          <div class="flex-1">
                            <h5
                              class="text-[11px] font-medium uppercase tracking-tight"
                              :class="
                                step.completed
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              "
                            >
                              {{ step.name }}
                            </h5>
                            <p
                              class="text-[10px] font-medium leading-tight mt-0.5"
                              :class="step.isSkipped ? 'text-slate-900 font-semibold' : 'text-slate-400'"
                            >
                              {{
                                step.completed
                                  ? "Verification Success"
                                  : step.isSkipped
                                  ? "Cancel"
                                  : "Pending Process"
                              }}
                            </p>
                            <div
                              v-if="step.members && step.members.length > 0"
                              class="space-y-1 mt-2"
                            >
                              <div
                                v-for="(member, mIdx) in step.members"
                                :key="mIdx"
                                class="flex items-center gap-2 text-[8px] bg-white rounded-lg px-2 py-1"
                              >
                                <span
                                  class="material-icons text-[10px]"
                                  :class="
                                    member.status === 'APPROVED'
                                      ? 'text-emerald-500'
                                      : member.status === 'REJECTED'
                                      ? 'text-red-500'
                                      : ['SKIPPED', 'CANCELLED', 'CANCEL'].includes(member.status)
                                      ? 'text-slate-900'
                                      : 'text-slate-400'
                                  "
                                >
                                  {{
                                    member.status === "APPROVED"
                                      ? "check_circle"
                                      : ['REJECTED', 'SKIPPED', 'CANCELLED', 'CANCEL'].includes(member.status)
                                      ? "cancel"
                                      : "pending"
                                  }}
                                </span>
                                <span class="font-medium text-slate-700">{{
                                  member.name
                                }}</span>
                                <span
                                  v-if="member.status === 'APPROVED'"
                                  class="ml-auto text-emerald-600 font-medium"
                                  >✓</span
                                >
                                <span
                                  v-else-if="member.status === 'REJECTED'"
                                  class="ml-auto text-red-600 font-medium"
                                  >✗</span
                                >
                                <span
                                  v-else-if="['SKIPPED', 'CANCELLED', 'CANCEL'].includes(member.status)"
                                  class="ml-auto text-slate-900 font-semibold text-[8px]"
                                  >Cancel</span
                                >
                                <span
                                  v-else
                                  class="ml-auto text-blue-600 font-medium"
                                  >⏳</span
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- ✅ TAMBAH INI — Revision Notes Display -->
                  <div v-if="selectedDoc.revisionNotes" 
                      class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="material-icons text-amber-600 text-[16px]">edit_note</span>
                      </div>
                      <div class="flex-1">
                        <p class="text-[9px] font-semibold text-amber-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <span class="material-icons text-[11px]">warning</span>
                          Revision Required — Notes from Approver
                        </p>
                        <p class="text-[12px] text-amber-800 font-medium leading-relaxed">
                          {{ selectedDoc.revisionNotes }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Takeover Info Display -->
                  <div v-if="selectedDoc.takeoverInfo" 
                      class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="material-icons text-blue-600 text-[16px]">bolt</span>
                      </div>
                      <div class="flex-1">
                        <p class="text-[9px] font-semibold text-blue-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <span class="material-icons text-[11px]">info</span>
                          Taken Over
                        </p>
                        <p class="text-[12px] text-blue-800 font-medium leading-relaxed">
                          Dokumen ini telah diambil alih (takeover) oleh <strong>{{ selectedDoc.takeoverInfo.takenOverBy?.fullName || 'User' }}</strong> (Level {{ selectedDoc.takeoverInfo.takeover_level || selectedDoc.takeoverInfo.takeoverLevel }}).
                        </p>
                        <p v-if="selectedDoc.takeoverInfo.reason" class="text-[11px] text-blue-600 mt-1 italic">
                          "{{ selectedDoc.takeoverInfo.reason }}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Audit Trail Log -->
                  <div class="flex-1 flex flex-col overflow-hidden">
                    <p
                      class="text-[11px] font-medium text-blue-600 uppercase tracking-widest mb-2 px-1"
                    >
                      Audit Trail Log
                    </p>
                    <div
                      class="flex-1 overflow-y-auto custom-scroll space-y-2 pr-1"
                    >
                      <div
                        v-for="(log, lIdx) in currentAuditLogs"
                        :key="lIdx"
                        class="p-3 bg-white rounded-xl border border-slate-200 shadow-sm"
                      >
                        <div class="flex justify-between items-center mb-1">
                          <span
                            class="text-[9px] font-medium text-slate-400 uppercase"
                            >{{ log.timestamp }}</span
                          >
                        </div>
                        <p
                          class="text-[11px] font-medium text-slate-700 leading-snug"
                        >
                          {{ log.message }}
                        </p>
                      </div>
                    </div>
                  </div>


                  <!-- Action Buttons -->
                  <div
                    v-if="
                      !isSuccess && !isRejectSuccess && (selectedDoc.canApprove || selectedDoc.isTakeoverEligible)
                    "
                    class="mt-6 space-y-3"
                  >
            
                    <div class="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full">
                      <!-- Standard Approve/Revision/Reject if canApprove is true -->
                      <template v-if="selectedDoc.canApprove">
                        <!-- Revision Button -->
                        <button
                          @click="requestModification"
                          class="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-200 hover:border-blue-400 rounded-xl text-[11px] font-semibold uppercase tracking-wide transition-all active:scale-95 shadow-sm w-full sm:w-auto"
                        >
                          <span class="material-icons text-[18px]">edit_note</span>
                          <span>Revision</span>
                        </button>

                        <!-- Approve Button -->
                        <button
                          @click="handleApprove"
                          class="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 rounded-xl text-[11px] font-semibold uppercase tracking-wide transition-all active:scale-95 shadow-lg shadow-blue-500/30 w-full sm:w-auto"
                        >
                          <span class="material-icons text-[18px]">verified_user</span>
                          <span>Approve</span>
                        </button>

                        <!-- Reject Button -->
                        <button
                          @click="confirmReject"
                          class="flex items-center justify-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200 hover:border-blue-400 rounded-xl text-[11px] font-semibold uppercase tracking-wide transition-all active:scale-95 shadow-sm w-full sm:w-auto"
                        >
                          <span class="material-icons text-[18px]">close</span>
                          <span>Reject</span>
                        </button>

                        <!-- Release Takeover Button (if current user is the takeover party) -->
                        <button
                          v-if="selectedDoc.takeoverInfo && selectedDoc.takeoverInfo.takenOverBy?.id === authStore.user?.id"
                          @click="handleReleaseTakeover"
                          class="flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-blue-50 text-blue-500 border-2 border-blue-200 hover:border-blue-400 rounded-xl text-[11px] font-semibold uppercase tracking-wide transition-all active:scale-95 shadow-sm w-full sm:w-auto"
                        >
                          <span class="material-icons text-[18px]">undo</span>
                          <span>Release Takeover</span>
                        </button>
                      </template>

                      <!-- Takeover Button if user is eligible to takeover -->
                      <template v-else-if="selectedDoc.isTakeoverEligible">
                        <button
                          @click="handleTakeover"
                          class="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 rounded-xl text-[11px] font-semibold uppercase tracking-wide transition-all active:scale-95 shadow-lg shadow-blue-500/30 w-full sm:w-auto"
                        >
                          <span class="material-icons text-[18px]">bolt</span>
                          <span>Takeover (Fast-Track)</span>
                        </button>
                      </template>
                    </div>
                  </div>

                  <!-- COMMENT SECTION -->
                  <div class="mt-4 pt-4 border-t border-slate-200">
                    <div class="flex items-center justify-between mb-3">
                      <p
                        class="text-[11px] font-medium text-slate-500 uppercase tracking-widest flex items-center gap-1.5"
                      >
                        <span class="material-icons text-[13px]">chat</span>
                        Comments
                      </p>
                      <span
                        v-if="isLoadingComments"
                        class="material-icons text-[14px] text-slate-400 animate-spin"
                        >sync</span
                      >
                      <span
                        v-else
                        class="text-[9px] font-medium text-slate-300 uppercase"
                        >{{ comments.length }} komentar</span
                      >
                    </div>

                    <div
                      class="space-y-3 mb-3 max-h-[280px] overflow-y-auto custom-scroll"
                    >
                      <div
                        v-if="!isLoadingComments && comments.length === 0"
                        class="text-center py-4 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <span
                          class="material-icons text-slate-200 text-2xl block mb-1"
                          >chat_bubble_outline</span
                        >
                        <p
                          class="text-[10px] text-slate-300 font-medium uppercase"
                        >
                          No comments yet
                        </p>
                      </div>

                      <div
                        v-for="comment in comments"
                        :key="comment.id"
                        class="flex flex-col gap-2"
                      >
                        <div
                          class="p-3 bg-white rounded-xl border border-slate-100 shadow-sm"
                        >
                          <div class="flex items-start gap-2">
                            <div
                              class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            >
                              <span
                                class="text-[10px] font-medium text-blue-600"
                              >
                                {{
                                  (comment.authorName || "U")
                                    .charAt(0)
                                    .toUpperCase()
                                }}
                              </span>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div
                                class="flex items-center justify-between gap-2 mb-1"
                              >
                                <span
                                  class="text-[10px] font-medium text-slate-700 truncate"
                                  >{{ comment.authorName }}</span
                                >
                                <span
                                  class="text-[8px] text-slate-300 flex-shrink-0"
                                >
                                  {{ formatDate(comment.createdAt) }}
                                  <span v-if="comment.isEdited" class="italic">
                                    · edited</span
                                  >
                                </span>
                              </div>

                              <div
                                v-if="editingCommentId === comment.id"
                                class="flex flex-col gap-2"
                              >
                                <textarea
                                  v-model="editCommentContent"
                                  rows="2"
                                  class="w-full bg-slate-50 border border-slate-200 rounded-lg text-[11px] p-2 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                ></textarea>
                                <div class="flex gap-2">
                                  <button
                                    @click="submitEditComment(comment.id)"
                                    :disabled="
                                      isSubmittingEdit ||
                                      !editCommentContent.trim()
                                    "
                                    class="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-[10px] rounded-lg font-medium transition-all"
                                  >
                                    {{ isSubmittingEdit ? "Saving…" : "Save" }}
                                  </button>
                                  <button
                                    @click="editingCommentId = null"
                                    class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] rounded-lg font-medium transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>

                              <p
                                v-else
                                class="text-[11px] text-slate-600 leading-relaxed"
                                :class="{
                                  'italic text-slate-400': comment.isDeleted,
                                }"
                              >
                                {{ comment.content }}
                              </p>

                              <div
                                v-if="
                                  !comment.isDeleted &&
                                  editingCommentId !== comment.id
                                "
                                class="flex items-center gap-3 mt-1.5 flex-wrap"
                              >
                                <button
                                  v-if="
                                    comment.reply === null ||
                                    comment.reply === undefined
                                  "
                                  @click="
                                    replyingToId = comment.id;
                                    replyContent = '';
                                  "
                                  class="text-[10px] text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                  ↩ Reply
                                </button>
                                <span
                                  v-else
                                  class="text-[10px] text-slate-300 italic"
                                  >1 reply</span
                                >

                                <template
                                  v-if="
                                    comment.author?.id === authStore.user?.id ||
                                    authStore.user?.roles?.includes('ADMIN')
                                  "
                                >
                                  <button
                                    @click="startEditComment(comment)"
                                    class="text-[10px] text-slate-400 hover:text-slate-700 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    @click="deleteComment(comment.id)"
                                    :disabled="deletingCommentId === comment.id"
                                    class="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    {{
                                      deletingCommentId === comment.id
                                        ? "…"
                                        : "Delete"
                                    }}
                                  </button>
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="replyingToId === comment.id"
                          class="ml-8 p-3 bg-slate-50 border border-blue-200 rounded-xl flex flex-col gap-2"
                        >
                          <p class="text-[10px] font-medium text-blue-600">
                            Replying to {{ comment.authorName }}
                          </p>
                          <textarea
                            v-model="replyContent"
                            rows="2"
                            placeholder="Write a reply…"
                            class="w-full bg-white border border-slate-200 rounded-lg text-[11px] p-2 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                          ></textarea>
                          <div class="flex gap-2">
                            <button
                              @click="submitReply"
                              :disabled="
                                isSubmittingReply || !replyContent.trim()
                              "
                              class="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-[10px] rounded-lg font-medium transition-all"
                            >
                              {{
                                isSubmittingReply ? "Sending…" : "Send Reply"
                              }}
                            </button>
                            <button
                              @click="
                                replyingToId = null;
                                replyContent = '';
                              "
                              class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] rounded-lg font-medium transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        <div
                          v-if="comment.reply"
                          class="ml-8 p-3 bg-slate-50 rounded-xl border border-slate-100 border-l-2 border-l-slate-300"
                        >
                          <div class="flex items-start gap-2">
                            <div
                              class="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            >
                              <span
                                class="text-[9px] font-medium text-slate-600"
                              >
                                {{
                                  (comment.reply.author?.fullName || "U")
                                    .charAt(0)
                                    .toUpperCase()
                                }}
                              </span>
                            </div>
                            <div class="flex-1 min-w-0">
                              <div
                                class="flex items-center justify-between gap-2 mb-1"
                              >
                                <span
                                  class="text-[10px] font-medium text-slate-700"
                                  >{{
                                    comment.reply.author?.fullName || "Unknown"
                                  }}</span
                                >
                                <span class="text-[8px] text-slate-300">
                                  {{ formatDate(comment.reply.createdAt) }}
                                  <span
                                    v-if="comment.reply.isEdited"
                                    class="italic"
                                  >
                                    · edited</span
                                  >
                                </span>
                              </div>

                              <div
                                v-if="editingCommentId === comment.reply.id"
                                class="flex flex-col gap-2"
                              >
                                <textarea
                                  v-model="editCommentContent"
                                  rows="2"
                                  class="w-full bg-white border border-slate-200 rounded-lg text-[11px] p-2 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                ></textarea>
                                <div class="flex gap-2">
                                  <button
                                    @click="submitEditComment(comment.reply.id)"
                                    :disabled="isSubmittingEdit"
                                    class="px-3 py-1 bg-blue-600 text-white text-[10px] rounded-lg font-medium"
                                  >
                                    {{ isSubmittingEdit ? "Saving…" : "Save" }}
                                  </button>
                                  <button
                                    @click="editingCommentId = null"
                                    class="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] rounded-lg font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>

                              <p
                                v-else
                                class="text-[11px] text-slate-600 leading-relaxed"
                                :class="{
                                  'italic text-slate-400':
                                    comment.reply.isDeleted,
                                }"
                              >
                                {{ comment.reply.content }}
                              </p>

                              <div
                                v-if="
                                  !comment.reply.isDeleted &&
                                  editingCommentId !== comment.reply.id
                                "
                                class="flex gap-3 mt-1.5"
                              >
                                <template
                                  v-if="
                                    comment.reply.author?.id ===
                                      authStore.user?.id ||
                                    authStore.user?.roles?.includes('ADMIN')
                                  "
                                >
                                  <button
                                    @click="startEditComment(comment.reply)"
                                    class="text-[10px] text-slate-400 hover:text-slate-700 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    @click="deleteComment(comment.reply.id)"
                                    :disabled="
                                      deletingCommentId === comment.reply.id
                                    "
                                    class="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                                  >
                                    {{
                                      deletingCommentId === comment.reply.id
                                        ? "…"
                                        : "Delete"
                                    }}
                                  </button>
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Input Comment -->
                    <template v-if="!isDocumentFinalized">
                      <div v-if="isReviewer" class="space-y-2">
                        <textarea
                          v-model="newComment"
                          placeholder="Write a comment..."
                          rows="2"
                          class="w-full bg-white border border-slate-200 rounded-xl text-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium resize-none"
                        ></textarea>
                        <button
                          @click="submitComment"
                          :disabled="!newComment.trim() || isSubmittingComment"
                          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-[13px] font-medium uppercase tracking-wide transition-all"
                        >
                          <span
                            v-if="!isSubmittingComment"
                            class="material-icons text-[14px]"
                            >send</span
                          >
                          <span
                            v-else
                            class="material-icons text-[14px] animate-spin"
                            >sync</span
                          >
                          {{
                            isSubmittingComment
                              ? "Mengirim..."
                              : "Submit Comment"
                          }}
                        </button>
                      </div>
                      <div v-else class="text-center py-2">
                        <p class="text-[9px] text-slate-300 font-medium italic">
                          Only reviewers can add comments
                        </p>
                      </div>
                    </template>
                    <div
                      v-else
                      class="text-center py-2 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <span
                        class="material-icons text-slate-200 text-lg block mb-1"
                        >lock</span
                      >
                      <p class="text-[9px] text-slate-300 font-medium italic">
                        Comments are disabled for completed documents
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else
              :key="'empty'"
              class="flex-1 flex flex-col items-center justify-center text-center p-10"
            >
              <div
                class="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4"
              >
                <span class="material-icons text-4xl text-slate-200"
                  >folder_open</span
                >
              </div>
              <h3 class="text-base font-semibold text-slate-400 tracking-wide">
                {{ $t('approvals.noApprovals') }}
              </h3>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- ================================================================ -->
    <!-- MODALS & POPUPS                                                   -->
    <!-- ================================================================ -->

    <!-- ✅ Approval Success Popup — Blue Theme -->
    <Transition name="modal-fade">
      <div v-if="isSuccess"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">
          
          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 15L12.5 22.5L25 8"
                      stroke="#2563EB"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-1">Document successfully approved</p>
          </div>

          <!-- Detail Info -->
          <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-100">
            <div class="flex items-center gap-3.5 px-4 py-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-600 text-[18px]">person</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[9px] text-blue-600 font-semibold uppercase tracking-widest mb-0.5">Approved By</p>
                <p class="text-[13px] font-semibold text-slate-800 truncate">{{ approvalDetails.approverName }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3.5 px-4 py-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-600 text-[18px]">description</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[9px] text-blue-600 font-semibold uppercase tracking-widest mb-0.5">Document</p>
                <p class="text-[13px] font-semibold text-slate-800 truncate">{{ approvalDetails.documentTitle }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3.5 px-4 py-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-600 text-[18px]">schedule</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[9px] text-blue-600 font-semibold uppercase tracking-widest mb-0.5">Time</p>
                <p class="text-[13px] font-semibold text-slate-800">{{ formatDate(approvalDetails.timestamp) }}</p>
              </div>
            </div>
          </div>

          <!-- Footer Button -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="closeApproveSuccess"
                    class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 7.5L6.5 11.5L12.5 3.5"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ✅ Reject Success Popup — Blue Theme -->
    <Transition name="modal-fade">
      <div v-if="isRejectSuccess"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M8 8l14 14M22 8L8 22"
                      stroke="#2563EB"
                      stroke-width="2.5"
                      stroke-linecap="round"/>
              </svg>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-1">Document has been rejected successfully!</p>
            
          </div>

          <!-- Detail Info -->
          <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-100">
            <div class="flex items-center gap-3.5 px-4 py-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-500 text-[18px]">cancel</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[9px] text-blue-500 font-semibold uppercase tracking-widest mb-0.5">Status</p>
                <p class="text-[13px] font-semibold text-slate-800">Permanently Rejected</p>
              </div>
            </div>
            <div class="flex items-center gap-3.5 px-4 py-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-500 text-[18px]">notifications</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[9px] text-blue-500 font-semibold uppercase tracking-widest mb-0.5">Notification</p>
                <p class="text-[13px] font-semibold text-slate-800">Creator has been notified</p>
              </div>
            </div>
          </div>

          <!-- Footer Button -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="closeRejectSuccess"
                    class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 7.5L6.5 11.5L12.5 3.5"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
              OK
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- Error Popup -->
    <Transition name="modal-fade">
      <div
        v-if="isError"
        @click.self="isError = false"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden transform transition-all"
        >
          <div
            class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700"
          >
            <button
              @click="isError = false"
              class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            >
              <span class="material-icons text-2xl">close</span>
            </button>
            <div class="flex items-center gap-4">
              <div
                class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <span class="material-icons text-white text-5xl">info</span>
              </div>
              <div>
                <h2
                  class="text-2xl font-semibold text-white tracking-tight mb-1"
                >
                  ACCESS DENIED!
                </h2>
                <p class="text-white/90 text-sm font-semibold">
                  Failed to load document
                </p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <span class="material-icons text-blue-600 text-xl"
                    >warning</span
                  >
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-slate-900 mb-2">
                    Akses ditolak. Anda tidak memiliki izin.
                  </h3>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    {{
                      errorMessage ||
                      "Anda tidak memiliki izin untuk mengakses dokumen ini. Silakan hubungi administrator jika ini adalah kesalahan."
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end"
          >
            <button
              @click="isError = false"
              class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
            >
              <span class="material-icons text-sm">close</span>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Approve Popup -->
    <Transition name="modal-fade">
      <div
        v-if="showConfirmApprove"
        @click.self="showConfirmApprove = false"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[24px] shadow-2xl w-full max-w-[430px] max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        >
          <!-- Scrollable Content Area -->
          <div class="overflow-y-auto custom-scroll flex-1 px-5 pt-6 pb-2">
            <!-- Top Icon & Title -->
            <div class="flex flex-col items-center mb-3">
              <div
                class="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-2.5"
              >
                <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
                  <path
                    d="M5 15L12.5 22.5L25 8"
                    stroke="#2563EB"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <p class="text-[17px] font-semibold text-slate-900">
                Approve document?
              </p>
            </div>

            <!-- Document Summary Card -->
            <div
              class="mb-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-start gap-3"
            >
              <div
                class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <span class="material-icons text-blue-600 text-[18px]"
                  >description</span
                >
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-semibold text-slate-800 truncate mb-0.5">
                  {{ pendingApprovalDoc?.title }}
                </p>
                <p
                  class="text-[11px] text-slate-500 leading-relaxed line-clamp-2"
                >
                  {{
                    pendingApprovalDoc?.description
                      ? pendingApprovalDoc.description.substring(0, 100) +
                        (pendingApprovalDoc.description.length > 100 ? "..." : "")
                      : "No description provided."
                  }}
                </p>
              </div>
            </div>

            <!-- Approval Level Progress -->
            <div
              class="mb-3 bg-slate-50 border border-slate-200 rounded-2xl p-3"
            >
              <p
                class="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5"
              >
                Approval progress
              </p>
              <div class="flex items-start overflow-x-auto pb-1.5 custom-scroll">
                <template
                  v-for="(level, idx) in pendingApprovalDoc?.approvalLevels || []"
                  :key="idx"
                >
                  <div
                    class="flex flex-col items-center gap-1"
                    style="min-width: 65px"
                  >
                    <div
                      :class="[
                        'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold',
                        level.level < (pendingApprovalDoc?.currentLevel || 1)
                          ? 'bg-blue-600 text-white'
                          : level.level ===
                            (pendingApprovalDoc?.currentLevel || 1)
                          ? 'bg-blue-600 text-white ring-[4px] ring-blue-100'
                          : 'bg-white border border-slate-300 text-slate-400',
                      ]"
                    >
                      <svg
                        v-if="
                          level.level < (pendingApprovalDoc?.currentLevel || 1)
                        "
                        width="11"
                        height="11"
                        viewBox="0 0 13 13"
                        fill="none"
                      >
                        <path
                          d="M2 6.5L5.5 10L11 3.5"
                          stroke="white"
                          stroke-width="1.8"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span v-else>{{ level.level }}</span>
                    </div>
                    <p
                      :class="
                        level.level <= (pendingApprovalDoc?.currentLevel || 1)
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      "
                      class="text-[9px] font-semibold leading-tight text-center flex items-center gap-0.5"
                    >
                      Level {{ level.level }}
                      <span
                        v-if="
                          level.level === (pendingApprovalDoc?.currentLevel || 1)
                        "
                        class="bg-blue-100 text-blue-700 text-[7px] px-1 py-0.2 rounded-full uppercase font-bold"
                        >now</span
                      >
                    </p>
                    <p
                      class="text-[8.5px] text-slate-400 text-center leading-tight max-w-[62px] truncate"
                    >
                      {{ level.name || level.approvers?.[0]?.fullName || "—" }}
                    </p>
                  </div>
                  <div
                    v-if="
                      idx < (pendingApprovalDoc?.approvalLevels?.length || 1) - 1
                    "
                    class="flex-1 mt-3.5"
                  >
                    <div
                      :class="
                        idx + 1 < (pendingApprovalDoc?.currentLevel || 1)
                          ? 'bg-blue-500 h-[2px]'
                          : 'border-t-2 border-dashed border-slate-300'
                      "
                    ></div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Approve Notes Input -->
            <div class="mb-3">
              <label class="text-[9.5px] font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Approve Notes (Optional)</label>
              <textarea
                v-model="approveNotes"
                rows="2"
                placeholder="Provide clear reasons/instructions for approval..."
                class="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium resize-none text-slate-700"
              ></textarea>
            </div>
          </div>

          <!-- Sticky Footer Action Buttons -->
          <div class="h-px bg-slate-100 flex-shrink-0"></div>
          <div class="flex gap-2.5 px-5 py-3.5 bg-white flex-shrink-0">
            <button
              @click="showConfirmApprove = false"
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="confirmApproval"
              class="flex-[1.4] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
            >
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path
                  d="M2.5 7.5L6.5 11.5L12.5 3.5"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Approve
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ================================================================ -->
    <!-- Confirmation Revision Popup                                        -->
    <!-- ================================================================ -->
    <Transition name="modal-fade">
      <div
        v-if="showConfirmRevision"
        @click.self="showConfirmRevision = false"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[24px] shadow-2xl w-full max-w-[430px] max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        >
          <!-- Scrollable Content Area -->
          <div class="overflow-y-auto custom-scroll flex-1 px-5 pt-6 pb-2">
            <!-- Icon + Title -->
            <div class="flex flex-col items-center mb-3">
              <div
                class="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-2.5"
              >
                <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
                  <path
                    d="M15 8v9M15 20v2"
                    stroke="#2563EB"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M6.5 24.5h17L15 5.5 6.5 24.5z"
                    stroke="#2563EB"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <p class="text-[17px] font-semibold text-slate-900">
                Request revision?
              </p>
            </div>

            <!-- Document Card -->
            <div
              class="mb-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-start gap-3"
            >
              <div
                class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <span class="material-icons text-blue-600 text-[18px]"
                  >description</span
                >
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-semibold text-slate-800 truncate mb-0.5">
                  {{ pendingRevisionDoc?.title }}
                </p>
                <p
                  class="text-[11px] text-slate-500 leading-relaxed line-clamp-2"
                >
                  {{
                    pendingRevisionDoc?.description
                      ? pendingRevisionDoc.description.substring(0, 100) +
                        (pendingRevisionDoc.description.length > 100 ? "..." : "")
                      : "No description provided."
                  }}
                </p>
              </div>
            </div>

            <!-- Revision Notes Input -->
            <div class="mb-3">
              <label class="text-[9.5px] font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Revision Notes *</label>
              <textarea
                v-model="revisionNotes"
                @input="revisionNoteError = false"
                rows="2"
                placeholder="Provide clear reasons/instructions for revision..."
                :class="revisionNoteError ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20'"
                class="w-full bg-slate-50 border rounded-xl text-xs p-2.5 outline-none focus:ring-2 transition-all font-medium resize-none text-slate-700"
              ></textarea>
              <p v-if="revisionNoteError" class="text-[11px] text-red-500 mt-1 font-medium flex items-center gap-1">
                Revision notes
              </p>
            </div>
          </div>

          <!-- Sticky Footer Action Buttons -->
          <div class="h-px bg-slate-100 flex-shrink-0"></div>
          <div class="flex gap-2.5 px-5 py-3.5 bg-white flex-shrink-0">
            <button
              @click="showConfirmRevision = false"
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="confirmRevision"
              class="flex-[1.4] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
            >
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path
                  d="M2 7.5h11M9 3.5l4 4-4 4"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Send revision
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ================================================================ -->
    <!-- Confirmation Reject Popup                                          -->
    <!-- ================================================================ -->
    <Transition name="modal-fade">
      <div
        v-if="showConfirmReject"
        @click.self="showConfirmReject = false"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[24px] shadow-2xl w-full max-w-[430px] max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        >
          <!-- Scrollable Content Area -->
          <div class="overflow-y-auto custom-scroll flex-1 px-5 pt-6 pb-2">
            <!-- Icon + Title -->
            <div class="flex flex-col items-center mb-3">
              <div
                class="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-2.5"
              >
                <svg width="24" height="24" viewBox="0 0 30 30" fill="none">
                  <path
                    d="M8 8l14 14M22 8L8 22"
                    stroke="#2563EB"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <p class="text-[17px] font-semibold text-slate-900">
                Reject document?
              </p>
            </div>

            <!-- Document Card -->
            <div
              class="mb-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-start gap-3"
            >
              <div
                class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <span class="material-icons text-blue-600 text-[18px]"
                  >description</span
                >
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-semibold text-slate-800 truncate mb-0.5">
                  {{ selectedDoc?.title }}
                </p>
                <p
                  class="text-[11px] text-slate-500 leading-relaxed line-clamp-2"
                >
                  {{
                    selectedDoc?.description
                      ? selectedDoc.description.substring(0, 100) +
                        (selectedDoc.description.length > 100 ? "..." : "")
                      : "No description provided."
                  }}
                </p>
              </div>
            </div>

            <!-- Reject Notes Input -->
            <div class="mb-3">
              <label class="text-[9.5px] font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Reject Notes *</label>
              <textarea
                v-model="rejectReason"
                @input="rejectNoteError = false"
                rows="2"
                placeholder="Provide clear reasons/instructions for rejection..."
                :class="rejectNoteError ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20'"
                class="w-full bg-slate-50 border rounded-xl text-xs p-2.5 outline-none focus:ring-2 transition-all font-medium resize-none text-slate-700"
              ></textarea>
              <p v-if="rejectNoteError" class="text-[11px] text-red-500 mt-1 font-medium flex items-center gap-1">
                Reject notes
              </p>
            </div>
          </div>

          <!-- Sticky Footer Action Buttons -->
          <div class="h-px bg-slate-100 flex-shrink-0"></div>
          <div class="flex gap-2.5 px-5 py-3.5 bg-white flex-shrink-0">
            <button
              @click="showConfirmReject = false"
              class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="executeReject"
              class="flex-[1.4] py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
            >
              <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                <path
                  d="M3.5 3.5l8 8M11.5 3.5l-8 8"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              Reject
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ✅ Revision Success Popup — Blue Theme -->
    <Transition name="modal-fade">
      <div v-if="isRevisionSuccess"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 15L12.5 22.5L25 8"
                      stroke="#2563EB"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-1">Revision request successfully sent!</p>

          </div>

          <!-- Detail Info -->
          <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl divide-y divide-slate-100">
            <div class="flex items-center gap-3.5 px-4 py-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-600 text-[18px]">description</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[9px] text-blue-600 font-semibold uppercase tracking-widest mb-0.5">Document</p>
                <p class="text-[13px] font-semibold text-slate-800 truncate">{{ revisionSuccessDoc }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3.5 px-4 py-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-600 text-[18px]">info</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[9px] text-blue-600 font-semibold uppercase tracking-widest mb-0.5">Status</p>
                <p class="text-[13px] font-semibold text-slate-800">Returned to creator for revision</p>
              </div>
            </div>
            <div class="flex items-center gap-3.5 px-4 py-3">
              <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-blue-600 text-[18px]">mark_email_read</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[9px] text-blue-600 font-semibold uppercase tracking-widest mb-0.5">Note</p>
                <p class="text-[13px] font-semibold text-slate-800">Creator has been notified</p>
              </div>
            </div>
          </div>

          <!-- Footer Button -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="closeRevisionSuccess"
                    class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2.5 7.5L6.5 11.5L12.5 3.5"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
              OK
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ================================================================ -->
    <!-- Takeover Modals                                                   -->
    <!-- ================================================================ -->
    <!-- Confirmation Takeover Popup -->
    <Transition name="modal-fade">
      <div
        v-if="showConfirmTakeover"
        @click.self="showConfirmTakeover = false"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100"
        >
          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div
              class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4"
            >
              <span class="material-icons text-blue-600 text-3xl">bolt</span>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-2">
              Takeover Approval Request?
            </p>
            <p class="text-xs text-slate-500 text-center px-4 leading-relaxed">
              Anda akan mengambil alih dokumen ini dan melewati level-level di bawah Anda.
            </p>
          </div>

          <!-- Document Card -->
          <div
            class="mx-6 mb-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3.5"
          >
            <div
              class="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <span class="material-icons text-blue-600 text-[20px]">description</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-slate-800 truncate mb-1">
                {{ selectedDoc?.title }}
              </p>
              <p class="text-[11px] text-slate-500 truncate">
                Status: {{ selectedDoc?.status }} | Level: {{ selectedDoc?.currentLevel }}
              </p>
            </div>
          </div>

          <!-- Takeover Reason Input -->
          <div class="mx-6 mb-5">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-2">Alasan Takeover *</label>
            <textarea
              v-model="takeoverReason"
              rows="3"
              placeholder="Masukkan alasan pengambilan alih (minimal 10 karakter)..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium resize-none text-slate-700"
            ></textarea>
            <p class="text-[10px] mt-1" :class="takeoverReason.trim().length >= 10 ? 'text-emerald-600' : 'text-slate-400'">
              {{ takeoverReason.trim().length }} / 500 karakter (minimal 10)
            </p>
          </div>

          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button
              @click="showConfirmTakeover = false"
              class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="confirmTakeover"
              :disabled="takeoverReason.trim().length < 10 || isSubmittingTakeover"
              class="flex-[1.4] py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <span v-if="isSubmittingTakeover" class="material-icons text-sm animate-spin">sync</span>
              <span v-else class="material-icons text-sm">bolt</span>
              Takeover
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Takeover Success Popup -->
    <Transition name="modal-fade">
      <div v-if="isTakeoverSuccess"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">
          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 15L12.5 22.5L25 8"
                      stroke="#2563EB"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-1 text-center">Takeover Berhasil!</p>
          </div>

          <!-- Detail Info -->
          <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <p class="text-xs text-slate-600 leading-relaxed text-center">
              {{ takeoverSuccessMsg }}
            </p>
          </div>

          <!-- Footer Button -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="isTakeoverSuccess = false"
                    class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Release Takeover Popup -->
    <Transition name="modal-fade">
      <div
        v-if="showConfirmReleaseTakeover"
        @click.self="showConfirmReleaseTakeover = false"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100"
        >
          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div
              class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4"
            >
              <span class="material-icons text-blue-600 text-3xl">undo</span>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-2">
              Lepas Takeover Dokumen?
            </p>
            <p class="text-xs text-slate-500 text-center px-4 leading-relaxed">
              Dokumen akan dikembalikan ke level persetujuan sebelumnya.
            </p>
          </div>

          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button
              @click="showConfirmReleaseTakeover = false"
              class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              @click="confirmReleaseTakeover"
              :disabled="isSubmittingRelease"
              class="flex-[1.4] py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <span v-if="isSubmittingRelease" class="material-icons text-sm animate-spin">sync</span>
              <span v-else class="material-icons text-sm">check_circle</span>
              Lepas Takeover
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Release Takeover Success Popup -->
    <Transition name="modal-fade">
      <div v-if="isReleaseSuccess"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">
          <!-- Icon + Title -->
          <div class="flex flex-col items-center px-8 pt-9 pb-5">
            <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M5 15L12.5 22.5L25 8"
                      stroke="#2563EB"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="text-[20px] font-semibold text-slate-900 mb-1 text-center">Takeover Dilepas!</p>
          </div>

          <!-- Detail Info -->
          <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <p class="text-xs text-slate-600 leading-relaxed text-center">
              {{ releaseSuccessMsg }}
            </p>
          </div>

          <!-- Footer Button -->
          <div class="h-px bg-slate-100"></div>
          <div class="flex gap-3 px-6 py-5">
            <button @click="isReleaseSuccess = false"
                    class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Document Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showDetailModal"
        @click.self="showDetailModal = false"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      >
        <div
          class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl"
        >
          <div
            class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700"
          >
            <div class="flex-1">
              <h2
                class="font-semibold text-white flex items-center gap-2 text-xl"
              >
                <span class="material-icons">description</span>
                {{ isEditMode ? "Edit Document" : modalDoc?.title }}
              </h2>
            </div>
            <button
              @click="showDetailModal = false"
              class="text-white/70 hover:text-white transition-colors ml-4"
            >
              <span class="material-icons">close</span>
            </button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div v-if="isEditMode" class="space-y-4">
              <div>
                <label class="text-xs font-medium text-slate-700 block mb-1"
                  >Document Title *</label
                >
                <input
                  v-model="editForm.title"
                  type="text"
                  placeholder="Enter document title..."
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  minlength="5"
                />
              </div>
              <div>
                <label class="text-xs font-medium text-slate-700 block mb-1"
                  >Category *</label
                >
                <select
                  v-model="editForm.categoryId"
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  required
                >
                  <option value="" disabled>-- Select Category --</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="text-xs font-medium text-slate-700 block mb-1"
                  >Description *</label
                >
                <textarea
                  v-model="editForm.description"
                  rows="4"
                  placeholder="Enter description..."
                  class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none"
                  required
                ></textarea>
              </div>
              <div>
                <label class="text-xs font-medium text-slate-700 block mb-1"
                  >Attachments</label
                >
                <div
                  class="border-2 border-dashed border-slate-200 rounded-xl p-4"
                >
                  <label class="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      class="hidden"
                      @change="handleEditAttachments"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                    <div
                      class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium w-fit"
                    >
                      <span class="material-icons text-sm">attach_file</span>
                      Add Files
                    </div>
                  </label>
                  <div
                    v-if="editForm.attachments?.length > 0"
                    class="space-y-2 mt-3"
                  >
                    <div
                      v-for="(file, index) in editForm.attachments"
                      :key="index"
                      class="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                    >
                      <span class="text-xs font-medium text-slate-600">{{
                        file.name
                      }}</span>
                      <button
                        @click="removeEditAttachment(index)"
                        type="button"
                        class="text-slate-300 hover:text-red-500"
                      >
                        <span class="material-icons text-sm">close</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="space-y-4">
              <p class="text-sm text-slate-600">{{ modalDoc?.description }}</p>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-slate-50 rounded-xl">
                  <span class="text-xs font-medium text-slate-400"
                    >Category</span
                  >
                  <p class="text-sm font-semibold text-slate-700">
                    {{ modalDoc?.categoryInfo?.name }}
                  </p>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl">
                  <span class="text-xs font-medium text-slate-400"
                    >Creator</span
                  >
                  <p class="text-sm font-semibold text-slate-700">
                    {{ modalDoc?.creatorInfo?.fullName }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50"
          >
            <button
              @click="showDetailModal = false"
              class="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
            <button
              v-if="isEditMode"
              @click="handleSaveUpdate"
              :disabled="isUpdating"
              class="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <span v-if="!isUpdating" class="material-icons text-sm"
                >save</span
              >
              <span v-else class="material-icons text-sm animate-spin"
                >sync</span
              >
              {{ isUpdating ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirm Save Popup -->
    <Transition name="modal-fade">
      <div
        v-if="showConfirmSave"
        @click.self="showConfirmSave = false"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden"
        >
          <div
            class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700"
          >
            <button
              @click="showConfirmSave = false"
              class="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            >
              <span class="material-icons text-2xl">close</span>
            </button>
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <span class="material-icons text-white text-4xl">save</span>
              </div>
              <div>
                <h2
                  class="text-3xl font-medium italic uppercase text-white tracking-tight"
                >
                  Save Changes
                </h2>
                <p class="text-white/80 text-sm font-medium mt-1">
                  Konfirmasi perubahan
                </p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100">
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <span class="material-icons text-blue-600 text-xl"
                    >help_outline</span
                  >
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-900 mb-2">
                    Simpan perubahan dokumen ini?
                  </p>
                  <div class="flex items-center gap-2 text-xs text-slate-600">
                    <span class="material-icons text-blue-500 text-sm"
                      >description</span
                    >
                    <span class="font-medium text-slate-700">{{
                      modalDoc?.title
                    }}</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-2 pl-5">
                    {{
                      wasRevisionEdit
                        ? "Dokumen akan langsung disubmit ulang ke antrian approval."
                        : "Perubahan akan disimpan dan dokumen kembali ke status Draft."
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex gap-3 justify-end"
          >
            <button
              @click="showConfirmSave = false"
              class="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium text-sm uppercase tracking-wide transition-all"
            >
              Cancel
            </button>
            <button
              @click="executeSaveUpdate"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg"
            >
              <span class="material-icons text-sm">check_circle</span>
              Save
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Save Success Popup -->
    <Transition name="modal-fade">
      <div
        v-if="isSaveSuccess"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden"
        >
          <div
            class="px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <span class="material-icons text-white text-4xl">task_alt</span>
              </div>
              <div>
                <h2
                  class="text-3xl font-medium italic uppercase text-white tracking-tight"
                >
                  Saved!
                </h2>
                <p class="text-white/80 text-sm font-medium mt-1">
                  Dokumen berhasil diperbaiki
                </p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <div
              class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100 space-y-4"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <span class="material-icons text-blue-600 text-xl"
                    >check_circle</span
                  >
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-900 mb-1">
                    Dokumen berhasil diperbaiki!
                  </p>
                  <p class="text-xs text-slate-600">
                    <span class="font-medium text-slate-800">{{
                      savedDocTitle
                    }}</span>
                    telah disimpan.
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3 pt-3 border-t border-blue-100">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <span class="material-icons text-blue-600 text-xl"
                    >folder_special</span
                  >
                </div>
                <div>
                  <p
                    class="text-xs font-medium text-slate-700 uppercase tracking-wide mb-1"
                  >
                    Status: {{ wasRevisionEdit ? "SUBMITTED" : "DRAFT" }}
                  </p>
                  <p class="text-xs text-slate-500 leading-relaxed">
                    {{
                      wasRevisionEdit
                        ? "Dokumen telah disubmit ulang dan masuk ke antrian approval."
                        : "Dokumen sekarang ada di halaman Draft. Silakan submit ulang setelah selesai."
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end"
          >
            <button
              @click="isSaveSuccess = false"
              class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg"
            >
              <span class="material-icons text-sm">check</span>
              OK
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- File Preview Modal -->
  <Transition name="modal-fade">
    <div
      v-if="showPreviewModal"
      @click.self="closePreviewModal"
      class="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-4 bg-slate-900/70 backdrop-blur-sm"
    >
      <div
        class="bg-white shadow-2xl w-full h-full md:h-[90vh] md:max-w-5xl md:rounded-2xl rounded-none flex flex-col overflow-hidden"
      >
        <div
          class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0"
        >
          <div class="flex items-center gap-3">
            <span class="material-icons text-white text-xl">{{
              getFileIcon(previewModalType)
            }}</span>
            <div>
              <p class="text-white font-medium text-sm truncate max-w-md">
                {{ previewModalName }}
              </p>
              <p class="text-white/70 text-xs uppercase tracking-widest">
                {{ previewModalType }} preview
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="previewModalUrl"
              @click="openInNewTab(previewModalUrl)"
              title="Buka di Tab Baru (Google Chrome)"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition-all shadow-sm"
            >
              <span class="material-icons text-sm">open_in_new</span>
              <span class="hidden sm:inline">Buka di Tab Baru</span>
            </button>
            <button
              @click="closePreviewModal"
              class="text-white/80 hover:text-white transition-colors p-1"
            >
              <span class="material-icons text-2xl">close</span>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-hidden relative bg-slate-100">
          <div
            v-if="previewModalLoading"
            class="absolute inset-0 flex items-center justify-center bg-white z-10"
          >
            <div class="text-center">
              <div
                class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              ></div>
              <p class="text-sm text-slate-500 font-medium">
                Loading preview...
              </p>
            </div>
          </div>

          <div
            v-if="previewModalType === 'pdf' && previewModalUrl"
            ref="pdfMobileContainer"
            class="w-full h-full overflow-y-auto bg-slate-800 flex flex-col items-center p-4 gap-4 scroll-smooth"
          >
            <!-- Canvas elements will be injected here via PDF.js (No iframe, safe from CSP framing) -->
          </div>

          <div
            v-else-if="previewModalType === 'image' && previewModalUrl"
            class="absolute inset-0 flex items-center justify-center p-6 bg-white"
          >
            <img
              :src="previewModalUrl"
              :alt="previewModalName"
              class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>

          <div
            v-else-if="['word', 'document'].includes(previewModalType)"
            class="absolute inset-0 overflow-y-auto custom-scroll bg-white"
          >
            <div v-if="wordPreviewHtml" class="p-8">
              <div
                class="max-w-4xl mx-auto bg-white shadow rounded-lg p-10 border border-slate-100"
              >
                <div
                  v-html="wordPreviewHtml"
                  class="word-preview-content prose prose-slate max-w-none"
                ></div>
              </div>
            </div>
            <div
              v-else-if="wordPreviewError"
              class="absolute inset-0 flex items-center justify-center p-8"
            >
              <div class="text-center">
                <span class="material-icons text-red-400 text-5xl mb-3"
                  >error_outline</span
                >
                <p class="text-sm font-medium text-slate-700 mb-4">
                  {{ wordPreviewError }}
                </p>
                <button
                  @click="downloadAttachment(previewModalAttachment)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto"
                >
                  <span class="material-icons text-sm">download</span>
                  Download File
                </button>
              </div>
            </div>
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center"
            >
              <div
                class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
              ></div>
            </div>
          </div>

          <div
            v-else
            class="absolute inset-0 flex items-center justify-center bg-white"
          >
            <div class="text-center">
              <span class="material-icons text-slate-300 text-6xl mb-4"
                >insert_drive_file</span
              >
              <p class="text-sm font-medium text-slate-500 mb-6">
                Preview tidak tersedia untuk tipe file ini
              </p>
              <button
                @click="downloadAttachment(previewModalAttachment)"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto"
              >
                <span class="material-icons text-sm">download</span>
                Download File
              </button>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 flex-shrink-0"
        >
          <p class="text-xs text-slate-400 font-medium truncate max-w-xs">
            {{ previewModalName }}
          </p>
          <div class="flex items-center gap-3">
            <button
              @click="closePreviewModal"
              class="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Tutup
            </button>
            <button
              @click="downloadAttachment(previewModalAttachment)"
              class="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg"
            >
              <span class="material-icons text-sm">download</span>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import permohonanService from "@/services/permohonanService";
import { useAuthStore } from "@/stores/authStore";
import api from "@/services/api";
import mammoth from "mammoth";

// ============================================================
// ROUTER & STORE
// ============================================================
import { useLangStore } from "@/stores/langStore";
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const langStore = useLangStore();
const activeLanguage = computed(() => langStore.lang);

// ============================================================
// STATE MANAGEMENT
// ============================================================
const documents = ref([]);
const selectedDoc = ref(null);
const searchQuery = ref("");
const loading = ref(false);
const fileLoading = ref(false);
const wasRevisionEdit = ref(false);

// Word preview
const wordPreviewHtml = ref("");
const wordPreviewError = ref("");

// Success/Error States
const isSuccess = ref(false);
const isRejectSuccess = ref(false);
const isError = ref(false);
const errorMessage = ref("");
const showConfirmApprove = ref(false);
const pendingApprovalDoc = ref(null);
const approveNotes = ref("");
const approvalDetails = ref({
  approverName: "",
  documentTitle: "",
  level: 0,
  timestamp: null,
});

// Blob URL tracking
const activeBlobUrls = ref(new Set());

// Revision states
const showConfirmRevision = ref(false);
const pendingRevisionDoc = ref(null);
const revisionNotes = ref("");
const revisionNoteError = ref(false);
const isRevisionSuccess = ref(false);
const revisionSuccessDoc = ref("");

// ── NEW: Reject states ──────────────────────────────────────
const showConfirmReject = ref(false);
const rejectReason = ref("");
const rejectNoteError = ref(false);
// ────────────────────────────────────────────────────────────

// ── NEW: Takeover states ────────────────────────────────────
const showConfirmTakeover = ref(false);
const takeoverReason = ref("");
const isSubmittingTakeover = ref(false);
const isTakeoverSuccess = ref(false);
const takeoverSuccessMsg = ref("");

const showConfirmReleaseTakeover = ref(false);
const isSubmittingRelease = ref(false);
const isReleaseSuccess = ref(false);
const releaseSuccessMsg = ref("");
// ────────────────────────────────────────────────────────────

// Edit mode states
const showDetailModal = ref(false);
const modalDoc = ref(null);
const isEditMode = ref(false);
const isUpdating = ref(false);
const showConfirmSave = ref(false);
const isSaveSuccess = ref(false);
const savedDocTitle = ref("");

const draftState = ref({ documentId: null, hasChanges: false, savedAt: null });
const autoSaveWatcher = ref(null);

const editForm = ref({
  title: "",
  description: "",
  categoryId: "",
  attachments: [],
});
const categories = ref([]);

const activeFilter = ref("ALL");
const showFilterDropdown = ref(false);

// Watcher untuk mendeteksi perubahan filter dari URL query (misalnya diklik dari card Dashboard)
watch(() => route.query.status, (newStatus) => {
  if (newStatus) {
    activeFilter.value = newStatus.toUpperCase();
  } else {
    activeFilter.value = "ALL";
  }
});
const internalNote = ref("");
const approvalNotes = ref("");
const activeAttachmentIndex = ref(0);
const showFullDesc = ref(false);
const isDownloadingAll = ref(false);

// Preview modal states
const showPreviewModal = ref(false);
const previewModalUrl = ref("");
const previewModalType = ref("");
const previewModalName = ref("");
const previewModalAttachment = ref(null);
const previewModalLoading = ref(false);

// Ref for mobile PDF container and responsiveness checks
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
    previewModalLoading.value = true;
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
    
    // Scale appropriately on desktop and mobile
    const maxPageWidth = 900;
    const targetWidth = Math.min(Math.max(containerWidth - 32, 250), maxPageWidth);
    
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
    console.error("PDF render error:", err);
    wordPreviewError.value = "Gagal memuat preview PDF. Silakan gunakan tombol download.";
  } finally {
    previewModalLoading.value = false;
  }
};

const openInNewTab = (url) => {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  previewModalUrl.value = "";
  if (pdfMobileContainer.value) {
    pdfMobileContainer.value.innerHTML = "";
  }
};

// Comment states
const comments = ref([]);
const newComment = ref("");
const isSubmittingComment = ref(false);
const isLoadingComments = ref(false);

const replyingToId = ref(null);
const replyContent = ref("");
const isSubmittingReply = ref(false);

const editingCommentId = ref(null);
const editCommentContent = ref("");
const isSubmittingEdit = ref(false);
const deletingCommentId = ref(null);

// ============================================================
// COMPUTED PROPERTIES
// ============================================================
const currentUserName = computed(() => {
  const user = authStore.user;
  return (
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User"
  );
});

const canAccessApprover = computed(() => {
  const userRoles = authStore.user?.roles || [];
  return userRoles.some((r) => ["ADMIN", "APPROVER", "REVIEWER"].includes(r));
});

const isReviewer = computed(() => {
  const userRoles = authStore.user?.roles || [];
  return (
    userRoles.includes("REVIEWER") ||
    userRoles.includes("ADMIN") ||
    userRoles.includes("APPROVER")
  );
});

const isDocumentFinalized = computed(() => {
  if (!selectedDoc.value) return false;
  return ["Completed", "Approved", "Rejected"].includes(
    selectedDoc.value.status
  );
});

const filteredDocs = computed(() => {
  let docs = documents.value;

  if (activeFilter.value !== "ALL") {
    docs = docs.filter((doc) => {
      const s = doc.status;
      if (activeFilter.value === "PENDING") return s === "Submitted";
      if (activeFilter.value === "IN_REVIEW")
        return ["In Review", "In Progress"].includes(s);
      if (activeFilter.value === "APPROVED")
        return s === "Completed" || s === "Approved";
      if (activeFilter.value === "REVISION") return s === "Needs Revision";
      if (activeFilter.value === "REJECTED") return s === "Rejected";
      if (activeFilter.value === "TAKEOVER") return doc.isTakeoverEligible;
      return true;
    });
  }

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    docs = docs.filter((doc) => {
      const title = (doc.title || "").toLowerCase();
      const desc = (doc.description || "").toLowerCase();
      return title.includes(search) || desc.includes(search);
    });
  }

  return docs;
});

const statusCounts = computed(() => {
  return {
    ALL: documents.value.length,
    PENDING: documents.value.filter((d) => d.status === "Submitted").length,
    IN_REVIEW: documents.value.filter((d) =>
      ["In Review", "In Progress"].includes(d.status)
    ).length,
    APPROVED: documents.value.filter((d) =>
      ["Completed", "Approved"].includes(d.status)
    ).length,
    REVISION: documents.value.filter((d) => d.status === "Needs Revision").length,
    REJECTED: documents.value.filter((d) => d.status === "Rejected").length,
    TAKEOVER: documents.value.filter((d) => d.isTakeoverEligible).length,
  };
});

const currentAuditLogs = computed(() => {
  if (!selectedDoc.value?.approvalLevels) return [];
  const logs = [];
  selectedDoc.value.approvalLevels.forEach((level) => {
    level.approvers?.forEach((approver) => {
      if (approver.status === "APPROVED") {
        logs.push({
          timestamp: formatDate(approver.approvedAt),
          type: "SIGN",
          message: `${approver.fullName} approved at Level ${level.level}`,
          actor: approver.fullName,
        });
      } else if (approver.status === "REJECTED") {
        logs.push({
          timestamp: formatDate(approver.rejectedAt),
          type: "REJECT",
          message: `${approver.fullName} rejected at Level ${level.level}`,
          actor: approver.fullName,
        });
      }
    });
  });
  return logs.reverse();
});

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const mapStatusToDisplay = (status) => {
  const statusMap = {
    DRAFT: "Draft",
    REVIEW: "In Review",
    SUBMITTED: "Submitted",
    IN_REVIEW: "In Progress",
    "IN REVIEW": "In Progress",
    APPROVED: "Completed",
    REJECTED: "Rejected",
    REVISION: "Needs Revision",
    NEEDS_REVISION: "Needs Revision",
    CANCELLED: "Cancelled",
    PENDING: "Submitted",
    COMPLETED: "Completed",
    Draft: "Draft",
    "In Review": "In Review",
    Submitted: "Submitted",
    "In Progress": "In Progress",
    Completed: "Completed",
    Rejected: "Rejected",
    "Needs Revision": "Needs Revision",
    Approved: "Completed",
  };
  return statusMap[status] || status;
};

const formatDate = (date) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

const getFileIcon = (fileType) => {
  const iconMap = {
    pdf: "picture_as_pdf",
    image: "image",
    document: "description",
    word: "description",
    spreadsheet: "table_chart",
    video: "videocam",
    audio: "audiotrack",
  };
  return iconMap[fileType] || "insert_drive_file";
};

const determinePrimaryAttachment = (attachments) => {
  if (!attachments?.length) return null;
  return (
    attachments.find((att) => att.fileType === "pdf") ||
    attachments.find((att) => att.fileType === "image") ||
    attachments[0]
  );
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getFileExtension = (fileName) => {
  if (!fileName) return "FILE";
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
};

const stripHtml = (html) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const getStatusLabel = (status) => {
  const statusLabels = {
    Draft: "DRAFT",
    Submitted: "PENDING",
    "In Progress": "IN REVIEW",
    "In Review": "IN REVIEW",
    Completed: "APPROVED",
    Approved: "APPROVED",
    Rejected: "REJECTED",
    "Needs Revision": "REVISION",
    Cancelled: "CANCELLED",
  };
  return statusLabels[status] || status.toUpperCase();
};

const getStatusDotClass = (status) => {
  const dotClasses = {
    Draft: "bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]",
    Submitted: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]",
    "In Progress":
      "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse",
    "In Review":
      "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse",
    Completed: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    Approved: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    Rejected: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
    "Needs Revision": "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]",
    Cancelled: "bg-slate-300",
  };
  return dotClasses[status] || "bg-slate-400";
};

const getStatusTextClass = (status, isSelected) => {
  if (isSelected) {
    const selectedClasses = {
      Draft: "text-slate-300",
      Submitted: "text-blue-400",
      "In Progress": "text-amber-400",
      "In Review": "text-amber-400",
      Completed: "text-emerald-400",
      Approved: "text-emerald-400",
      Rejected: "text-red-400",
      "Needs Revision": "text-orange-400",
      Cancelled: "text-slate-300",
    };
    return selectedClasses[status] || "text-blue-400";
  }
  const normalClasses = {
    Draft: "text-slate-500",
    Submitted: "text-blue-600",
    "In Progress": "text-amber-600",
    "In Review": "text-amber-600",
    Completed: "text-emerald-600",
    Approved: "text-emerald-600",
    Rejected: "text-red-600",
    "Needs Revision": "text-orange-600",
    Cancelled: "text-slate-400",
  };
  return normalClasses[status] || "text-slate-400";
};

const cleanupBlobUrl = (url) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
    activeBlobUrls.value.delete(url);
  }
};

const cleanupAllBlobUrls = () => {
  activeBlobUrls.value.forEach((url) => URL.revokeObjectURL(url));
  activeBlobUrls.value.clear();
};

const detectFileType = (mimeType, fileName) => {
  const mime = (mimeType || "").toLowerCase();
  const name = (fileName || "").toLowerCase();
  if (mime.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/.test(name))
    return "image";
  if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (mime.includes("word") || /\.(doc|docx)$/.test(name)) return "word";
  if (mime.includes("spreadsheet") || /\.(xls|xlsx)$/.test(name))
    return "excel";
  return "document";
};

// ============================================================
// DATA FETCHING
// ============================================================
const loadDocuments = async () => {
  if (!canAccessApprover.value) {
    documents.value = [];
    return;
  }
  try {
    loading.value = true;
    const [approvalsResult, myDocsResult, takeoversResult] = await Promise.allSettled([
      permohonanService.getApprovalPending(),
      permohonanService.getMyApproval({ page: 1, limit: 100, view: 'compact', status: 'SUBMITTED,IN_REVIEW,REVISION' }),
      permohonanService.getTakeovers(),
    ]);

    const approvalsResponse =
      approvalsResult.status === "fulfilled"
        ? approvalsResult.value
        : { data: [] };
    const myDocsResponse =
      myDocsResult.status === "fulfilled" ? myDocsResult.value : { data: [] };
    const takeoversResponse =
      takeoversResult.status === "fulfilled" ? takeoversResult.value : { data: [] };
    const userId = authStore.user?.id || authStore.user?.userId;

    const isUserFinalReviewer = (doc) => {
      if (!doc.reviewers || doc.reviewers.length === 0) return false;
      return doc.reviewers.some((r) => {
        if (typeof r === "object" && r !== null) {
          return (
            String(r.id) === String(userId) ||
            String(r.userId) === String(userId)
          );
        }
        return String(r) === String(userId);
      });
    };

    const isUserAssignedApprover = (doc) => {
      if (!doc.approvalLevels) return false;
      if (isUserFinalReviewer(doc)) return false;
      return doc.approvalLevels.some((level) => {
        const isApprovalLevel =
          !level.type ||
          level.type === "APPROVAL" ||
          level.type === "APPROVE";
        if (!isApprovalLevel) return false;
        return level.approvers?.some((app) => {
          const idMatch =
            String(app.id) === String(userId) ||
            String(app.userId) === String(userId);
          const roleMatch =
            !app.role || app.role === "APPROVER" || app.role === "APPROVAL";
          return idMatch && roleMatch;
        });
      });
    };

    let approvalDocs = (approvalsResponse.data || []).filter(
      (doc) =>
        String(doc.createdBy) !== String(userId) &&
        !["DRAFT", "CANCELLED"].includes(doc.status) &&
        isUserAssignedApprover(doc)
    );
    let myDocs = (myDocsResponse.data || []).filter(
      (doc) =>
        String(doc.createdBy) !== String(userId) &&
        !["DRAFT", "CANCELLED"].includes(doc.status) &&
        isUserAssignedApprover(doc)
    );
    let takeoverDocs = (takeoversResponse.data || []).map((doc) => ({
      ...doc,
      isTakeoverEligible: true,
    }));

    const allDocs = [...approvalDocs, ...myDocs, ...takeoverDocs];
    const docMap = new Map();
    allDocs.forEach((doc) => {
      const rootKey = doc.parentId || doc.id;
      if (!docMap.has(rootKey)) {
        docMap.set(rootKey, doc);
      } else {
        const existing = docMap.get(rootKey);
        const existingRev = existing.rev || 0;
        const currentRev = doc.rev || 0;
        if (currentRev > existingRev) {
          docMap.set(rootKey, {
            ...existing,
            ...doc,
            isTakeoverEligible: existing.isTakeoverEligible || doc.isTakeoverEligible,
          });
        } else if (currentRev === existingRev) {
          if (new Date(doc.createdAt || 0) > new Date(existing.createdAt || 0)) {
            docMap.set(rootKey, {
              ...existing,
              ...doc,
              isTakeoverEligible: existing.isTakeoverEligible || doc.isTakeoverEligible,
            });
          }
        } else if (doc.isTakeoverEligible) {
          existing.isTakeoverEligible = true;
        }
      }
    });
    const uniqueDocs = Array.from(docMap.values());

    documents.value = uniqueDocs.map((doc) => {
      const attachments = (doc.attachments || []).map((att) => ({
        id: att.id,
        fileName: att.fileName || att.metadata?.originalFileName || "file",
        displayName:
          att.displayName ||
          att.metadata?.originalFileName ||
          att.fileName ||
          "file",
        fileSize: att.fileSize,
        fileSizeFormatted:
          att.fileSizeFormatted || formatFileSize(att.fileSize || 0),
        mimeType: att.mimeType,
        fileType: detectFileType(att.mimeType, att.fileName),
        downloadUrl: att.downloadUrl,
        viewUrl: att.viewUrl,
        createdAt: att.createdAt,
      }));

      const primaryAttachment = determinePrimaryAttachment(attachments);

      return {
        id: doc.id,
        title: doc.title,
        sender: doc.creatorInfo?.fullName || "Unknown",
        amount: doc.categoryInfo?.name || "N/A",
        status: mapStatusToDisplay(doc.status),
        number: doc.id.substring(0, 8).toUpperCase(),
        note: doc.description,
        description: doc.description,
        attachments,
        primaryAttachment,
        hasAttachment: attachments.length > 0,
        attachmentCount: attachments.length,
        filePreviewUrl: null,
        fileUrl: null,
        canApprove: doc._metadata?.canApprove || false,
        canEdit:
          doc.createdBy === userId &&
          ["DRAFT", "REVISION"].includes(doc.status),
        canDelete: doc.createdBy === userId && doc.status === "DRAFT",
        userLevel: doc._metadata?.userLevel,
        userStatus: doc._metadata?.userStatus,
        isCurrentLevel: doc._metadata?.isCurrentLevel || false,
        createdBy: doc.createdBy,
        createdAt: doc.createdAt,
        approvalLevels: doc.approvalLevels || [],
        currentLevel: doc.currentLevel,
        categoryInfo: doc.categoryInfo,
        creatorInfo: doc.creatorInfo,
        revisionNotes: doc.revisionNotes,
        hybridSteps: generateHybridSteps(doc),
        isTakeoverEligible: doc.isTakeoverEligible || false,
        _takeoverMeta: doc._takeoverMeta || null,
        takeoverInfo: doc.takeoverInfo || null,
        takeoverConfig: doc.takeoverConfig || null,
      };
    });
  } catch (error) {
    if (error.response?.status !== 403) {
      errorMessage.value = error.response?.data?.message || error.message;
      isError.value = true;
    }
    documents.value = [];
  } finally {
    loading.value = false;
  }
};

const generateHybridSteps = (doc) => {
  if (!doc.approvalLevels?.length)
    return [
      {
        type: "sequential",
        name: "No approval levels",
        completed: false,
        time: "N/A",
      },
    ];
  return doc.approvalLevels.map((level) => {
    const allApproved = level.approvers?.every(
      (app) => app.status === "APPROVED"
    );
    const hasPending = level.approvers?.some((app) => app.status === "PENDING");
    const isSkipped = !allApproved && level.approvers?.some(
      (app) => ["SKIPPED", "CANCELLED", "CANCEL"].includes(app.status)
    );
    return {
      type: level.type || "sequential",
      name: `Level ${level.level}`,
      completed: allApproved,
      isSkipped,
      time: allApproved ? "Completed" : isSkipped ? "Cancelled" : hasPending ? "In Progress" : "Pending",
      members: level.approvers?.map((app) => ({
        name: app.fullName,
        status: app.status,
        time: app.approvedAt ? formatDate(app.approvedAt) : "-",
      })),
    };
  });
};

const fetchFileAsBlob = async (approvalRequestId, attachmentId, fileType) => {
  let blob = null;
  try {
    const response = await api.get(
      `/approval-request/${approvalRequestId}/attachments/${attachmentId}/preview`,
      { responseType: "blob" }
    );
    blob = response.data;
  } catch (apiError) {
    const status = apiError.response?.status;
    const msg = apiError.response?.data?.message || apiError.message;
    if (status === 500 || status === 503)
      throw new Error(msg || "Layanan penyimpanan file sedang tidak tersedia.");
    if (status === 403)
      throw new Error("Anda tidak memiliki izin untuk mengakses file ini.");
    if (status === 404) throw new Error("File tidak ditemukan di server.");
    throw new Error(`Gagal memuat file: ${msg}`);
  }

  if (!blob)
    throw new Error("Data file tidak dapat diambil dari server.");

  if (fileType === "pdf") {
    const pdfBlob = new Blob([blob], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(pdfBlob);
    activeBlobUrls.value.add(blobUrl);
    return blobUrl;
  }

  if (fileType === "image") {
    const blobUrl = URL.createObjectURL(blob);
    activeBlobUrls.value.add(blobUrl);
    return blobUrl;
  }

  if (["word", "document"].includes(fileType)) {
    const headerBuffer = await blob.slice(0, 4).arrayBuffer();
    const headerBytes = new Uint8Array(headerBuffer);
    const isValidDocx = headerBytes[0] === 0x50 && headerBytes[1] === 0x4b;

    if (!isValidDocx) {
      wordPreviewError.value =
        "Format file tidak valid atau corrupt. Silakan download file.";
      wordPreviewHtml.value = "";
      return null;
    }

    try {
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      wordPreviewHtml.value = result.value;
      wordPreviewError.value = "";
      return null;
    } catch {
      wordPreviewError.value = "Gagal memuat preview. Silakan download file.";
      wordPreviewHtml.value = "";
      return null;
    }
  }

  return URL.createObjectURL(blob);
};

const loadCategories = async () => {
  try {
    const response = await permohonanService.getCategories();
    categories.value = response.data || [];
  } catch (error) {
    console.error("❌ Load categories error:", error);
  }
};

// ============================================================
// DOCUMENT SELECTION & ACTIONS
// ============================================================
const selectDocument = async (doc) => {
  try {
    activeAttachmentIndex.value = 0;
    showFullDesc.value = false;
    selectedDoc.value = doc;
    fileLoading.value = true;
    wordPreviewHtml.value = "";
    wordPreviewError.value = "";

    try {
      const response = await permohonanService.getPermohonanById(doc.id);
      const remappedAttachments = (
        response.data.attachments ||
        doc.attachments ||
        []
      ).map((att) => ({
        ...att,
        fileName: att.fileName || att.metadata?.originalFileName || "file",
        displayName:
          att.displayName ||
          att.metadata?.originalFileName ||
          att.fileName ||
          "file",
        fileType: att.fileType || detectFileType(att.mimeType, att.fileName),
        fileSizeFormatted:
          att.fileSizeFormatted || formatFileSize(att.fileSize || 0),
      }));

      const remappedPrimary =
        remappedAttachments[activeAttachmentIndex.value] ||
        remappedAttachments[0] ||
        doc.primaryAttachment;
      const originalId = doc.id;

      Object.assign(doc, {
        ...response.data,
        id: originalId,
        status: mapStatusToDisplay(response.data.status || doc.status),
        filePreviewUrl: doc.filePreviewUrl,
        fileUrl: doc.fileUrl,
        primaryAttachment: remappedPrimary,
        attachments: remappedAttachments,
        hybridSteps: generateHybridSteps(response.data),
        isTakeoverEligible: response.data.isTakeoverEligible || doc.isTakeoverEligible,
        _takeoverMeta: response.data._takeoverMeta || doc._takeoverMeta,
        takeoverInfo: response.data.takeoverInfo || doc.takeoverInfo,
        takeoverConfig: response.data.takeoverConfig || doc.takeoverConfig,
      });
    } catch (apiError) {
      console.warn(
        "⚠️ Could not fetch full document details:",
        apiError.message
      );
    }
  } catch (error) {
    if (error.response?.status !== 403) {
      errorMessage.value = error.message || "Gagal memuat dokumen";
      isError.value = true;
    }
    selectedDoc.value = null;
  } finally {
    fileLoading.value = false;
    if (selectedDoc.value?.id) await loadComments(selectedDoc.value.id);
  }
};

const openPreviewModal = async (attachment) => {
  if (!selectedDoc.value || !attachment) return;

  const idx = selectedDoc.value.attachments?.findIndex(
    (a) => a.id === attachment.id
  );
  if (idx !== -1) activeAttachmentIndex.value = idx;

  previewModalAttachment.value = attachment;
  previewModalName.value = attachment.displayName || attachment.fileName;
  previewModalType.value = attachment.fileType;
  previewModalUrl.value = "";
  wordPreviewHtml.value = "";
  wordPreviewError.value = "";
  previewModalLoading.value = true;
  showPreviewModal.value = true;

  try {
    const metaRes = await api.get(
      `/approval-request/${selectedDoc.value.id}/attachments/${attachment.id}/download`
    );
    const downloadUrl = metaRes.data?.data?.url || metaRes.data?.url;
    if (!downloadUrl) throw new Error("URL file tidak ditemukan dari server");

    if (attachment.fileType === "pdf") {
      previewModalUrl.value = downloadUrl;
      await nextTick();
      try {
        await renderPdfMobile(downloadUrl);
      } catch (pdfErr) {
        console.warn("Canvas PDF rendering failed", pdfErr);
      }
    } else if (attachment.fileType === "image") {
      previewModalUrl.value = downloadUrl;
    } else if (["word", "document"].includes(attachment.fileType)) {
      try {
        const targetFetchUrl = (import.meta.env.DEV && typeof downloadUrl === 'string')
          ? downloadUrl.replace(/^https?:\/\/[^\/]+/, '/objx-storage')
          : downloadUrl;
        const fileRes = await fetch(targetFetchUrl);
        if (fileRes.ok) {
          const blob = await fileRes.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          wordPreviewHtml.value = result.value;
        } else {
          wordPreviewError.value =
            "Format preview Word tidak didukung langsung. Silakan download file untuk membaca dokumen.";
        }
      } catch {
        wordPreviewError.value =
          "Format preview Word tidak didukung langsung. Silakan download file untuk membaca dokumen.";
      }
    } else {
      previewModalUrl.value = downloadUrl;
    }
  } catch (error) {
    previewModalUrl.value = "";
    wordPreviewError.value =
      error.message || "Gagal memuat preview file. Silakan coba download file.";
  } finally {
    previewModalLoading.value = false;
  }
};

const handleApprove = () => {
  if (!selectedDoc.value) return;
  const doc = documents.value.find((d) => d.id === selectedDoc.value.id);
  if (!doc?.canApprove) {
    errorMessage.value =
      "Anda tidak bisa approve dokumen ini pada level saat ini";
    isError.value = true;
    return;
  }
  approveNotes.value = "";
  pendingApprovalDoc.value = selectedDoc.value;
  showConfirmApprove.value = true;
};

const confirmApproval = async () => {
  if (!pendingApprovalDoc.value) return;
  try {
    showConfirmApprove.value = false;
    await permohonanService.respondToApproval(
      pendingApprovalDoc.value.id,
      "APPROVED",
      approveNotes.value.trim()
    );
    // Post note as comment to comments section if provided
    if (approveNotes.value.trim()) {
      await api.post(`/approval-requests/${pendingApprovalDoc.value.id}/comments`, {
        content: approveNotes.value.trim(),
      });
    }
    const doc = documents.value.find(
      (d) => d.id === pendingApprovalDoc.value.id
    );
    approvalDetails.value = {
      approverName: currentUserName.value,
      documentTitle: pendingApprovalDoc.value.title,
      level: doc?.userLevel || doc?.currentLevel,
      timestamp: new Date(),
    };
    isSuccess.value = true;
    await loadDocuments();
    const updatedDoc = documents.value.find((d) => d.id === pendingApprovalDoc.value.id);
    if (updatedDoc) {
      await selectDocument(updatedDoc);
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  } finally {
    pendingApprovalDoc.value = null;
  }
};

const requestModification = () => {
  if (!selectedDoc.value) return;
  const doc = documents.value.find((d) => d.id === selectedDoc.value.id);
  if (!doc?.canApprove) {
    errorMessage.value = "Anda tidak bisa meminta revisi dokumen ini";
    isError.value = true;
    return;
  }
  pendingRevisionDoc.value = selectedDoc.value;
  revisionNotes.value = "";
  revisionNoteError.value = false;
  showConfirmRevision.value = true;
};

const confirmRevision = async () => {
  if (!pendingRevisionDoc.value) return;
  if (!revisionNotes.value.trim()) {
    revisionNoteError.value = true;
    return;
  }
  try {
    showConfirmRevision.value = false;
    await permohonanService.requestRevision(
      pendingRevisionDoc.value.id,
      revisionNotes.value.trim()
    );
    // Post note as comment to comments section
    await api.post(`/approval-requests/${pendingRevisionDoc.value.id}/comments`, {
      content: revisionNotes.value.trim(),
    });
    revisionSuccessDoc.value = pendingRevisionDoc.value.title;
    isRevisionSuccess.value = true;
    await loadDocuments();
    const updatedDoc = documents.value.find((d) => d.id === pendingRevisionDoc.value.id);
    if (updatedDoc) {
      await selectDocument(updatedDoc);
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  } finally {
    pendingRevisionDoc.value = null;
  }
};

// ── NEW: Two-step reject ─────────────────────────────────────
// Step 1 — opens the modal
const confirmReject = () => {
  if (!selectedDoc.value) return;
  const doc = documents.value.find((d) => d.id === selectedDoc.value.id);
  if (!doc?.canApprove) {
    errorMessage.value = "Anda tidak bisa reject dokumen ini";
    isError.value = true;
    return;
  }
  rejectReason.value = "";
  rejectNoteError.value = false;
  showConfirmReject.value = true;
};

// Step 2 — executes after user confirms in the modal
const executeReject = async () => {
  if (!selectedDoc.value) return;
  if (!rejectReason.value.trim()) {
    rejectNoteError.value = true;
    return;
  }
  try {
    showConfirmReject.value = false;
    await permohonanService.respondToApproval(
      selectedDoc.value.id,
      "REJECTED",
      rejectReason.value.trim()
    );
    // Post note as comment to comments section
    await api.post(`/approval-requests/${selectedDoc.value.id}/comments`, {
      content: rejectReason.value.trim(),
    });
    const docId = selectedDoc.value.id;
    isRejectSuccess.value = true;
    await loadDocuments();
    const updatedDoc = documents.value.find((d) => d.id === docId);
    if (updatedDoc) {
      await selectDocument(updatedDoc);
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  }
};

const closeApproveSuccess = () => {
  isSuccess.value = false;
  // selectedDoc.value = null; // Mencegah keluar dari dokumen terpilih
};

const closeRevisionSuccess = () => {
  isRevisionSuccess.value = false;
  // selectedDoc.value = null; // Mencegah keluar dari dokumen terpilih
  internalNote.value = '';
  revisionNotes.value = '';
};

const closeRejectSuccess = () => {
  isRejectSuccess.value = false;
  // selectedDoc.value = null; // Mencegah keluar dari dokumen terpilih
};

const handleTakeover = () => {
  if (!selectedDoc.value) return;
  takeoverReason.value = "";
  showConfirmTakeover.value = true;
};

const confirmTakeover = async () => {
  if (!selectedDoc.value) return;
  if (!takeoverReason.value.trim() || takeoverReason.value.trim().length < 10) {
    errorMessage.value = "Alasan takeover wajib diisi (minimal 10 karakter)";
    isError.value = true;
    return;
  }
  try {
    isSubmittingTakeover.value = true;
    showConfirmTakeover.value = false;
    const response = await permohonanService.takeover(
      selectedDoc.value.id,
      takeoverReason.value.trim()
    );
    takeoverSuccessMsg.value = response.message || "Takeover berhasil dilakukan!";
    isTakeoverSuccess.value = true;
    await loadDocuments();
    const updatedDoc = documents.value.find((d) => d.id === selectedDoc.value.id);
    if (updatedDoc) {
      await selectDocument(updatedDoc);
    } else {
      selectedDoc.value = null;
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  } finally {
    isSubmittingTakeover.value = false;
  }
};

const handleReleaseTakeover = () => {
  if (!selectedDoc.value) return;
  showConfirmReleaseTakeover.value = true;
};

const confirmReleaseTakeover = async () => {
  if (!selectedDoc.value) return;
  try {
    isSubmittingRelease.value = true;
    showConfirmReleaseTakeover.value = false;
    const response = await permohonanService.releaseTakeover(selectedDoc.value.id);
    releaseSuccessMsg.value = response.message || "Takeover berhasil dilepas!";
    isReleaseSuccess.value = true;
    await loadDocuments();
    const updatedDoc = documents.value.find((d) => d.id === selectedDoc.value.id);
    if (updatedDoc) {
      await selectDocument(updatedDoc);
    } else {
      selectedDoc.value = null;
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  } finally {
    isSubmittingRelease.value = false;
  }
};

// ─────────────────────────────────────────────────────────────

const downloadAttachment = async (attachment) => {
  try {
    const docId = selectedDoc.value?.id;
    if (!docId || !attachment?.id)
      throw new Error("Data dokumen tidak lengkap");

    const metaRes = await api.get(
      `/approval-request/${docId}/attachments/${attachment.id}/download`
    );
    const downloadUrl = metaRes.data?.data?.url || metaRes.data?.url;
    if (!downloadUrl) throw new Error("URL unduhan tidak ditemukan");

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = attachment.fileName || attachment.displayName || "file";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    errorMessage.value = `Gagal mengunduh file: ${msg}`;
    isError.value = true;
  }
};

const downloadAllAttachments = async () => {
  if (!selectedDoc.value?.attachments?.length) return;
  if (selectedDoc.value.attachments.length === 1) {
    await downloadAttachment(selectedDoc.value.attachments[0]);
    return;
  }
  try {
    isDownloadingAll.value = true;
    const blob = await permohonanService.downloadAllAttachmentsAsZip(
      selectedDoc.value.id
    );
    const blobUrl = window.URL.createObjectURL(
      new Blob([blob], { type: 'application/zip' })
    );
    const a = document.createElement('a');
    a.href = blobUrl;
    const safeName = (selectedDoc.value.title || 'documents')
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .substring(0, 50);
    a.download = `${safeName}_attachments.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);

    console.log('✅ ZIP downloaded:', selectedDoc.value.attachments.length, 'files');
  } catch (error) {
    errorMessage.value = error.message || 'Gagal mengunduh semua file sebagai ZIP';
    isError.value = true;
  } finally {
    isDownloadingAll.value = false;
  }
};

// ============================================================
// EDIT & DELETE FUNCTIONS
// ============================================================
const canEditDocument = (doc) => {
  if (!doc) return false;
  return (
    doc.createdBy === authStore.user?.id &&
    ["DRAFT", "REVISION"].includes(doc.status)
  );
};

const openEditModal = (doc) => {
  if (!canEditDocument(doc)) return;
  modalDoc.value = doc;
  showDetailModal.value = true;
  isEditMode.value = true;

  const savedDraft = loadDraftFromStorage(doc.id);
  if (savedDraft) {
    editForm.value = {
      title: savedDraft.title,
      description: savedDraft.description || "",
      categoryId: savedDraft.categoryId || "",
      attachments: [],
    };
  } else {
    editForm.value = {
      title: doc.title,
      description: doc.description || "",
      categoryId: doc.categoryInfo?.id || doc.categoryId || "",
      attachments: [],
    };
  }

  if (categories.value.length === 0) loadCategories();
  setupAutoSaveWatcher();
};

const handleSaveUpdate = () => {
  if (!modalDoc.value) return;
  if (!editForm.value.title.trim() || editForm.value.title.trim().length < 5) {
    errorMessage.value = "Document Title wajib diisi (minimal 5 karakter)";
    isError.value = true;
    return;
  }
  if (!editForm.value.description.trim()) {
    errorMessage.value = "Description wajib diisi";
    isError.value = true;
    return;
  }
  if (!editForm.value.categoryId) {
    errorMessage.value = "Category wajib dipilih";
    isError.value = true;
    return;
  }
  showConfirmSave.value = true;
};

const executeSaveUpdate = async () => {
  showConfirmSave.value = false;
  try {
    isUpdating.value = true;
    const originalStatus = modalDoc.value.status;
    wasRevisionEdit.value = originalStatus === "Needs Revision";
    const updateData = {
      title: editForm.value.title.trim(),
      description: editForm.value.description.trim(),
      categoryId: editForm.value.categoryId,
    };
    if (originalStatus === "Needs Revision") updateData.status = "SUBMITTED";

    let updateResponse;
    if (editForm.value.attachments?.length > 0) {
      const formData = new FormData();
      formData.append("data", JSON.stringify(updateData));
      editForm.value.attachments.forEach((file) =>
        formData.append("files", file)
      );
      updateResponse = await permohonanService.updatePermohonan(
        modalDoc.value.id,
        formData
      );
    } else {
      updateResponse = await permohonanService.updatePermohonan(
        modalDoc.value.id,
        updateData
      );
    }

    if (wasRevisionEdit.value) {
      const newRevisionId = updateResponse?.data?.id;
      if (newRevisionId)
        await permohonanService.submitPermohonan(newRevisionId);
    }

    clearDraftFromStorage(modalDoc.value.id);
    savedDocTitle.value = modalDoc.value.title;
    isEditMode.value = false;
    showDetailModal.value = false;
    if (autoSaveWatcher.value) {
      autoSaveWatcher.value();
      autoSaveWatcher.value = null;
    }

    isSaveSuccess.value = true;
    await loadDocuments();
    selectedDoc.value = null;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message;
    isError.value = true;
  } finally {
    isUpdating.value = false;
  }
};

const saveDraftToStorage = () => {
  if (!modalDoc.value || !isEditMode.value) return;
  try {
    localStorage.setItem(
      `draft_doc_${modalDoc.value.id}`,
      JSON.stringify({
        documentId: modalDoc.value.id,
        title: editForm.value.title,
        description: editForm.value.description,
        categoryId: editForm.value.categoryId,
        savedAt: new Date().toISOString(),
      })
    );
    draftState.value.hasChanges = true;
    draftState.value.savedAt = new Date().toISOString();
  } catch {}
};

const loadDraftFromStorage = (documentId) => {
  try {
    return JSON.parse(localStorage.getItem(`draft_doc_${documentId}`));
  } catch {
    return null;
  }
};

const clearDraftFromStorage = (documentId) => {
  try {
    localStorage.removeItem(`draft_doc_${documentId}`);
    draftState.value.hasChanges = false;
    draftState.value.savedAt = null;
  } catch {}
};

const setupAutoSaveWatcher = () => {
  if (autoSaveWatcher.value) autoSaveWatcher.value();
  autoSaveWatcher.value = watch(editForm, () => saveDraftToStorage(), {
    deep: true,
  });
};

const handleEditAttachments = (e) => {
  const newFiles = Array.from(e.target.files);
  if (!editForm.value.attachments) editForm.value.attachments = [];
  if (editForm.value.attachments.length + newFiles.length > 10) {
    alert("❌ Maksimal 10 file!");
    e.target.value = "";
    return;
  }
  if (newFiles.some((f) => f.size > 5 * 1024 * 1024)) {
    alert("❌ File melebihi 5MB");
    e.target.value = "";
    return;
  }
  editForm.value.attachments = [...editForm.value.attachments, ...newFiles];
  e.target.value = "";
  if (modalDoc.value) saveDraftToStorage();
};

const removeEditAttachment = (index) => {
  if (!editForm.value.attachments) return;
  editForm.value.attachments.splice(index, 1);
  saveDraftToStorage();
};

// ============================================================
// COMMENT FUNCTIONS
// ============================================================
const loadComments = async (docId) => {
  if (!docId) return;
  try {
    isLoadingComments.value = true;
    const response = await api.get(`/approval-requests/${docId}/comments`);
    const rawComments = response.data?.data || response.data || [];
    comments.value = rawComments.map((c) => ({
      ...c,
      authorName: c.author?.fullName || c.authorName || "Unknown",
      content: c.content || c.comment || c.message || "",
      reply: c.reply || null,
    }));
  } catch {
    comments.value = [];
  } finally {
    isLoadingComments.value = false;
  }
};

const submitComment = async () => {
  if (!newComment.value.trim() || !selectedDoc.value) return;
  try {
    isSubmittingComment.value = true;
    await api.post(`/approval-requests/${selectedDoc.value.id}/comments`, {
      content: newComment.value.trim(),
    });
    newComment.value = "";
    await loadComments(selectedDoc.value.id);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to post a comment";
    isError.value = true;
  } finally {
    isSubmittingComment.value = false;
  }
};

const submitReply = async () => {
  if (!replyContent.value.trim() || !replyingToId.value || !selectedDoc.value)
    return;
  try {
    isSubmittingReply.value = true;
    await api.post(
      `/approval-requests/${selectedDoc.value.id}/comments/${replyingToId.value}/reply`,
      { content: replyContent.value.trim() }
    );
    replyContent.value = "";
    replyingToId.value = null;
    await loadComments(selectedDoc.value.id);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to send a reply";
    isError.value = true;
  } finally {
    isSubmittingReply.value = false;
  }
};

const startEditComment = (comment) => {
  editingCommentId.value = comment.id;
  editCommentContent.value = comment.content;
  replyingToId.value = null;
};

const submitEditComment = async (commentId) => {
  if (!editCommentContent.value.trim()) return;
  try {
    isSubmittingEdit.value = true;
    await api.patch(`/comments/${commentId}`, {
      content: editCommentContent.value.trim(),
    });
    editingCommentId.value = null;
    editCommentContent.value = "";
    await loadComments(selectedDoc.value.id);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to edit comment";
    isError.value = true;
  } finally {
    isSubmittingEdit.value = false;
  }
};

const deleteComment = async (commentId) => {
  try {
    deletingCommentId.value = commentId;
    await api.delete(`/comments/${commentId}`);
    await loadComments(selectedDoc.value.id);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message || "Failed to delete comment";
    isError.value = true;
  } finally {
    deletingCommentId.value = null;
  }
};

// ============================================================
// LIFECYCLE HOOKS
// ============================================================
onMounted(async () => {
  updateMobileState();
  window.addEventListener("resize", updateMobileState);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) showFilterDropdown.value = false;
  });
  
  if (!authStore.user?.id) {
    router.push("/login");
    return;
  }

  // Ambil filter status dari URL query jika ada
  if (route.query.status) {
    activeFilter.value = route.query.status.toUpperCase();
  }

  await loadDocuments();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateMobileState);
  cleanupAllBlobUrls();
  if (autoSaveWatcher.value) autoSaveWatcher.value();
});
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: background 0.2s;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.custom-scroll {
  scroll-behavior: smooth;
}

.page-fast-enter-active,
.page-fast-leave-active {
  transition: all 0.3s ease;
}
.page-fast-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.list-fast-enter-active {
  transition: all 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

button {
  cursor: pointer;
  user-select: none;
}
button:active {
  transform: scale(0.95);
}

/* Word preview */
.word-preview-content {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #1e293b;
}
.word-preview-content p {
  margin-bottom: 1em;
}
.word-preview-content h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.5em 0;
  color: #0f172a;
}
.word-preview-content h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5em 0;
  color: #1e293b;
}
.word-preview-content strong {
  font-weight: 700;
}
.word-preview-content ul,
.word-preview-content ol {
  margin-left: 2em;
  margin-bottom: 1em;
}
.word-preview-content ul {
  list-style-type: disc;
}
.word-preview-content ol {
  list-style-type: decimal;
}
.word-preview-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}
.word-preview-content table td,
.word-preview-content table th {
  border: 1px solid #cbd5e1;
  padding: 0.5em;
}
.word-preview-content table th {
  background-color: #f1f5f9;
  font-weight: bold;
}

/* HTML Description Table Styling */
.text-xs table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 11px;
}
.text-xs table td,
.text-xs table th {
  border: 1px solid #cbd5e1;
  padding: 4px 8px;
  text-align: left;
}
.text-xs table th {
  background-color: #1e3a5f;
  color: #ffffff;
  font-weight: bold;
}
.text-xs table tr:nth-child(even) {
  background-color: #f8fafc;
}
.text-xs h2,
.text-xs h3 {
  font-size: 12px;
  font-weight: bold;
  margin: 6px 0 4px 0;
  color: #c0392b;
}
.text-xs p {
  margin: 4px 0;
}
</style>
