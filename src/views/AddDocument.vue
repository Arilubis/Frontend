<template>
  <div class="min-h-screen bg-[#F1F5F9] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 font-sans text-slate-900 transition-all duration-300">
    <div class="max-w-[1440px] mx-auto">
      
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">Add Request</h1>
        </div>
      </div>

      <!-- ✅ SUBMIT SUCCESS POP-UP -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSubmitSuccess"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div v-if="showSubmitSuccess" class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

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
                <p class="text-[20px] font-semibold text-slate-900 mb-1">Success!</p>
              </div>

              <!-- Info Card -->
              <div class="mx-6 mb-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                <span class="material-icons text-blue-600 text-3xl mb-2 block">verified</span>
                <p class="text-[13px] font-semibold text-slate-900 mb-1">
                  Document successfully created and submitted for approval!
                </p>
              </div>

              <!-- Footer Buttons -->
              <div class="h-px bg-slate-100"></div>
              <div class="flex gap-3 px-6 py-5">
                <button
                  @click="handleCancelSubmit"
                  :disabled="isCancelling"
                  class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                  <span v-if="isCancelling" class="animate-spin w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full"></span>
                  {{ isCancelling ? 'Cancelling...' : 'Cancel' }}
                </button>
                <button
                  @click="handleSubmitSuccessClose"
                  :disabled="isCancelling"
                  class="flex-[1.4] py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
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
          </Transition>
        </div>
      </Transition>

      <!-- ✅ CONFIRM DRAFT POP-UP -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showConfirmDraft"
            @click.self="showConfirmDraft = false"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div v-if="showConfirmDraft" class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

              <!-- Icon + Title -->
              <div class="flex flex-col items-center px-8 pt-9 pb-5">
                <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <span class="material-icons text-blue-600 text-3xl">help_outline</span>
                </div>
                <p class="text-[20px] font-semibold text-slate-900 mb-1">Unsaved Changes</p>
              </div>

              <!-- Info Card -->
              <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-icons text-blue-600 text-[18px]">warning</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-[13px] font-semibold text-slate-800 mb-2">You have unsaved changes.</p>
                    <ul class="text-[11px] text-slate-500 space-y-1 list-disc list-inside leading-relaxed">
                      <li>Click <strong class="text-slate-700">SAVE DRAFT</strong> to save your changes</li>
                      <li>Click <strong class="text-slate-700">DISCARD</strong> to leave without saving</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="h-px bg-slate-100"></div>
              <div class="flex gap-3 px-6 py-5">
                <button @click="handleCancelDraft"
                        class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all">
                  Discard
                </button>
                <button @click="handleSaveDraft"
                        class="flex-[1.4] py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                  <span class="material-icons text-[16px]">save</span>
                  Save Draft
                </button>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>

      <!-- ✅ DRAFT SAVED SUCCESS POP-UP -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDraftSaved"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div v-if="showDraftSaved" class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

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
                <p class="text-[20px] font-semibold text-slate-900 mb-1">Draft Saved!</p>
              </div>

              <!-- Info Card -->
              <div class="mx-6 mb-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                <span class="material-icons text-blue-600 text-3xl mb-2 block">save</span>
                <p class="text-[13px] font-semibold text-slate-900 mb-1">Draft saved successfully!</p>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                  You can continue editing from the Drafts page at any time.
                </p>
              </div>

              <!-- Footer Button -->
              <div class="h-px bg-slate-100"></div>
              <div class="flex gap-3 px-6 py-5">
                <button @click="handleDraftSavedClose"
                        class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                  <span class="material-icons text-[16px]">description</span>
                  View Drafts
                </button>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>

      <!-- ✅ DRAFT SUBMITTED CONFIRMATION POP-UP -->
      <Transition 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDraftSavedConfirm" 
             class="fixed inset-0 z-[110] flex items-center justify-center p-4" 
             style="background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(12px);">
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in transform"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div v-if="showDraftSavedConfirm" class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden">
              <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span class="material-icons text-white text-4xl">task_alt</span>
                  </div>
                  <div>
                    <h2 class="text-3xl font-semibold italic uppercase text-white tracking-tight">
                      Submitted!
                    </h2>
                  </div>
                </div>
              </div>
              <div class="p-8">
                <div class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100 text-center">
                  <span class="material-icons text-blue-600 text-5xl mb-3 block">inventory_2</span>
                  <p class="text-sm font-semibold text-slate-900 mb-2">
                    Your document has been submitted.
                  </p>
                  <p class="text-xs text-slate-600">
                    The document has been saved to <strong>Draft</strong>. You can review or continue editing it from the Drafts page.
                  </p>
                </div>
              </div>
              <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex gap-3 justify-end">
                <button @click="handleDraftConfirmClose" 
                        class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                  <span class="material-icons text-sm">check_circle</span>
                  OK
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- ✅ VALIDATION ERROR POP-UP -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showError"
            @click.self="showError = false"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div v-if="showError" class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

              <!-- Icon + Title -->
              <div class="flex flex-col items-center px-8 pt-9 pb-5">
                <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <span class="material-icons text-blue-600 text-3xl">warning</span>
                </div>
                <p class="text-[20px] font-semibold text-slate-900 mb-1">Validation Error</p>
                <p class="text-[12px] text-slate-400 font-medium">Please fix the following</p>
              </div>

              <!-- Info Card -->
              <div class="mx-6 mb-5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span class="material-icons text-blue-600 text-[18px]">info</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-[13px] font-medium text-slate-800 leading-relaxed">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="h-px bg-slate-100"></div>
              <div class="flex gap-3 px-6 py-5">
                <button @click="showError = false"
                        class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3.5 3.5l8 8M11.5 3.5l-8 8" stroke="white" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Close
                </button>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDiscardConfirm"
            class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div v-if="showDiscardConfirm" class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">

              <!-- Icon + Title -->
              <div class="flex flex-col items-center px-8 pt-9 pb-5">
                <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <span class="material-icons text-blue-600 text-3xl">delete_sweep</span>
                </div>
                <p class="text-[20px] font-semibold text-slate-900 mb-1">Discard Changes?</p>
                <p class="text-[12px] text-slate-400 font-medium">Your unsaved changes will be lost</p>
              </div>

              <!-- Info Card -->
              <div class="mx-6 mb-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                <span class="material-icons text-blue-600 text-3xl mb-2 block">delete_forever</span>
                <p class="text-[13px] font-semibold text-slate-900 mb-1">Your changes have been discarded.</p>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                  All unsaved changes have been removed. You will be redirected to the documents page.
                </p>
              </div>

              <!-- Footer -->
              <div class="h-px bg-slate-100"></div>
              <div class="flex gap-3 px-6 py-5">
                <button @click="handleDiscardConfirmClose"
                        class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                  <span class="material-icons text-[16px]">arrow_forward</span>
                  Got It
                </button>
              </div>

            </div>
          </Transition>
        </div>
      </Transition>

      <!-- ✅ SUBMIT CONFIRM POP-UP -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSubmitConfirm"
            class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div v-if="showSubmitConfirm" class="bg-white rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-slate-100">
              <!-- Icon + Title -->
              <div class="flex flex-col items-center px-8 pt-9 pb-5">
                <div class="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M5 10L15 20L25 5"
                          stroke="#2563EB"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"/>
                  </svg>
                </div>
                <p class="text-[20px] font-semibold text-slate-900 mb-1">Submitted!</p>
              </div>
              <!-- Info Card -->
              <div class="mx-6 mb-5 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                <span class="material-icons text-blue-600 text-3xl mb-2 block">mark_email_read</span>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                  Your document is now in the approval queue. You can track its status from the <strong class="text-slate-700">My Requests</strong> page.
                </p>
              </div>
              <!-- Footer Button -->
              <div class="h-px bg-slate-100"></div>
              <div class="flex gap-3 px-6 py-5">
                <button @click="handleSubmitConfirmClose"
                        class="flex-1 py-3.5 rounded-[14px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M2.5 7.5L6.5 11.5L12.5 3.5"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"/>
                  </svg>
                  View My Requests
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCancelConfirm"
            class="fixed inset-0 z-[110] flex items-center justify-center p-4"
            style="background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px);">
          <Transition
            enter-active-class="transition duration-300 ease-out transform"
            enter-from-class="opacity-0 scale-90 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
          >
            <div v-if="showCancelConfirm" class="bg-white rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden">
              <div class="relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-blue-700">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span class="material-icons text-white text-4xl">cancel</span>
                  </div>
                  <div>
                    <h2 class="text-3xl font-semibold italic uppercase text-white tracking-tight">
                      Cancelled
                    </h2>
                  </div>
                </div>
              </div>
              <div class="p-8">
                <div class="bg-blue-50 rounded-2xl p-5 border-2 border-blue-100 text-center">
                  <span class="material-icons text-blue-600 text-5xl mb-3 block">unpublished</span>
                  <p class="text-sm font-semibold text-slate-900 mb-2">
                    Your document request has been cancelled.
                  </p>
                  <p class="text-xs text-slate-500">
                    The request has been removed from the approval queue. You can create a new request anytime.
                  </p>
                </div>
              </div>
              <div class="bg-slate-50 px-8 py-5 border-t border-slate-100 flex gap-3 justify-end">
                <button @click="handleCancelConfirmClose"
                        class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm uppercase tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                  <span class="material-icons text-sm">add_circle</span>
                  Create New Request
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- =====================================================
           ✅ PERUBAHAN UI: Loading State — pakai pattern v-if/v-else 
           ===================================================== -->
      <div v-if="isPureBasicUser && isLoadingData" class="bg-white rounded-[24px] p-12 shadow-sm border border-slate-200 text-center">
        <div class="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-[13px] text-slate-500 font-medium">Loading form data...</p>
      </div>

      <!-- =====================================================
           ✅ PERUBAHAN UI: Main Form — styling 
           ===================================================== -->
      <div v-if="isPureBasicUser && !isLoadingData" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Side - Basic Info & Attachments -->
        <div class="lg:col-span-2 space-y-6">

          <!-- =====================================================
               ✅ PERUBAHAN UI: Card Basic Info
               - rounded-[32px] → rounded-[24px]
               - border-none → border border-slate-200
               - text-[10px] → text-[11px], font-black → font-bold
               ===================================================== -->
          <div class="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
            <h2 class="text-[11px] font-semibold uppercase tracking-widest text-blue-600 mb-5 flex items-center gap-2">
              <span class="material-icons text-sm">edit_note</span> Basic Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Document Title -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-medium uppercase text-slate-500 ml-1">Title *</label>
                <input 
                  v-model="form.title" 
                  type="text" 
                  placeholder="title..." 
                  :class="[
                    'w-full px-4 py-2.5 rounded-xl text-[13px] font-normal focus:ring-2 outline-none transition-all',
                    errors.title 
                      ? 'bg-red-50 border-2 border-red-500 focus:ring-red-500' 
                      : 'bg-slate-50 border border-slate-200 focus:bg-white focus:ring-blue-500'
                  ]"
                  @input="errors.title = false"
                />
                <p v-if="errors.title" class="text-red-500 text-[10px] font-medium ml-1 flex items-center gap-1">
                  <span>⚠️</span> Judul wajib diisi (min 5 karakter)
                </p>
              </div>

              <!-- Category -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-medium uppercase text-slate-500 ml-1">Category *</label>
                <select 
                  v-model="form.category" 
                  :class="[
                    'w-full px-4 py-2.5 rounded-xl text-[13px] font-normal outline-none focus:ring-2 cursor-pointer',
                    errors.category 
                      ? 'bg-red-50 border-2 border-red-500 focus:ring-red-500' 
                      : 'bg-slate-50 border border-slate-200 focus:bg-white focus:ring-blue-500'
                  ]"
                  @change="errors.category = false"
                >
                  <option value="">-- Select Category --</option>
                  <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
                <p v-if="errors.category" class="text-red-500 text-[10px] font-medium ml-1 flex items-center gap-1">
                  <span>⚠️</span> Kategori wajib dipilih
                </p>
              </div>

              <!-- Description -->
              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="text-[11px] font-medium uppercase text-slate-500 ml-1">Description *</label>
                <textarea 
                  v-model="form.description" 
                  rows="3" 
                  :class="[
                    'w-full px-4 py-2.5 rounded-xl text-[13px] font-medium focus:ring-2 outline-none transition-all',
                    errors.description 
                      ? 'bg-red-50 border-2 border-red-500 focus:ring-red-500' 
                      : 'bg-slate-50 border border-slate-200 focus:bg-white focus:ring-blue-500'
                  ]"
                  placeholder="description (min 10 characters)..."
                  @input="errors.description = false"
                ></textarea>
                <p v-if="errors.description" class="text-red-500 text-[10px] font-medium ml-1 flex items-center gap-1">
                  <span>⚠️</span> Deskripsi wajib diisi (min 10 karakter)
                </p>
              </div>
            </div>
          </div>

          <!-- =====================================================
               ✅ PERUBAHAN UI: Card Attachments
               - rounded-[32px] → rounded-[24px]
               - border-none → border border-slate-200
               - Upload area: h-24 → h-28, border lebih visible
               ===================================================== -->
          <div class="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
            <h2 class="text-[11px] font-semibold uppercase tracking-widest text-blue-600 mb-5 flex items-center gap-2">
              <span class="material-icons text-sm">attach_file</span> Attachments (Optional)
            </h2>
            
            <div class="flex flex-col md:flex-row gap-4">
              <label class="flex-shrink-0 w-full md:w-1/3 cursor-pointer group">
                <input type="file" multiple class="hidden" @change="handleFiles" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
                <div class="h-28 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all flex flex-col items-center justify-center">
                  <span class="material-icons text-blue-500 text-2xl mb-1">cloud_upload</span>
                  <p class="text-[11px] font-medium uppercase text-slate-500">Add Files</p>
                  <p class="text-[9px] text-slate-400 mt-1 uppercase font-normal tracking-tighter">Max 5MB per file</p>
                </div>
              </label>

              <div class="flex-1 min-h-[112px] bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
                <p v-if="!form.attachments.length" class="text-[11px] text-slate-400 italic text-center mt-8">No files attached yet</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div v-for="(file, index) in form.attachments" :key="index" 
                    class="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
                    <div class="flex items-center gap-2 overflow-hidden">
                      <span class="material-icons text-blue-500 text-sm flex-shrink-0">description</span>
                      <div class="flex flex-col overflow-hidden">
                        <span class="text-[11px] font-medium text-slate-600 truncate">{{ file.name }}</span>
                        <span class="text-[9px] text-slate-400 font-normal uppercase">{{ formatFileSize(file.size) }}</span>
                        <!-- Progress bar — tetap dari logic saya -->
                        <div v-if="isUploadingFiles && uploadFileProgress[index]" class="mt-1">
                          <div class="w-full bg-slate-100 rounded-full h-1">
                            <div 
                              class="bg-blue-500 h-1 rounded-full transition-all duration-300"
                              :style="{ width: uploadFileProgress[index].progress + '%' }"
                            />
                          </div>
                          <span class="text-[8px] text-blue-500 font-normal">
                            {{ uploadFileProgress[index].done ? '✅ Uploaded' : uploadFileProgress[index].progress + '%' }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button @click="removeFile(index)" class="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <span class="material-icons text-sm">close</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 font-medium italic mt-3 flex items-center gap-1">
            </p>
          </div>
        </div>

        <!-- Right Side - Approval Flow -->
        <div class="space-y-6 lg:sticky lg:top-6 h-fit">

          <!-- =====================================================
               ✅ PERUBAHAN UI: Card Approval Path
               - rounded-[32px] → rounded-[24px]
               - border-none → border border-slate-200
               - Dot lebih besar: w-3 h-3 → w-3.5 h-3.5
               - Text sizing
               ===================================================== -->
          <div class="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h2 class="text-[11px] font-semibold uppercase tracking-widest text-slate-900">Approval Path *</h2>
                <p class="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                  {{ approvalLevels.length }} Levels Active
                </p>
              </div>
              <button 
                @click="addApprovalLevel" 
                class="p-2 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-90"
              >
                <span class="material-icons text-sm">add</span>
              </button>
            </div>

            <!-- Approval Levels List -->
            <div class="space-y-0">
              <div v-for="(level, index) in approvalLevels" :key="level.id" 
                   class="relative pl-6 border-l-2 border-slate-100 pb-6 last:pb-2">
                <div class="absolute -left-[7px] top-0 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
                
                <div class="flex justify-between items-center mb-2">
                  <span class="text-[10px] font-medium text-blue-600 uppercase tracking-widest">
                    Level {{ index + 1 }}
                  </span>
                  <button 
                    @click="deleteApprovalLevel(level.id)" 
                    :disabled="approvalLevels.length === 1"
                    class="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span class="material-icons text-[18px]">cancel</span>
                  </button>
                </div>

                <div class="bg-slate-50/50 rounded-xl border border-slate-100 p-1 hover:border-blue-200 transition-colors">
                  <ApprovalLevel
                    :level-id="level.id"
                    :level-index="index"
                    :reviewers="level.reviewers"
                    :approver-list="approverList"
                    :other-levels-reviewers="approvalLevels.filter(l => l.id !== level.id).flatMap(l => l.reviewers)"
                    @update:reviewers="updateLevelReviewers(level.id, $event)"
                  />
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="approvalLevels.length === 0" class="py-8 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                <span class="material-icons text-slate-200 text-3xl mb-1">schema</span>
                <p class="text-[10px] text-slate-300 font-normal uppercase tracking-widest">No review level added</p>
              </div>
            </div>

            <!-- Reviewer Information -->
            <div class="mt-4 pt-5 border-t border-dashed border-slate-200">
              <div class="flex items-center gap-2 mb-1">
                <span class="material-icons text-[14px] text-blue-500">rate_review</span>
                <label class="text-[11px] font-semibold uppercase text-slate-900 tracking-wider">
                  Reviewer (Optional)
                </label>
              </div>
              <p class="text-[9px] text-slate-400 font-normal uppercase tracking-wide mb-3">
                Select users who will review the document before approval
              </p>

              <div class="relative">
                <div class="relative">
                  <span class="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  <input 
                    type="text"
                    v-model="searchQueryReviewer"
                    @focus="isReviewerDropdownOpen = true"
                    @blur="closeReviewerDropdownDelayed"
                    placeholder="Search reviewer..."
                    class="w-full pl-12 pr-4 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-normal uppercase outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-600"
                  />
                </div>

                <!-- Dropdown Search Results -->
                <div v-if="isReviewerDropdownOpen" class="absolute z-[60] w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-[200px] overflow-y-auto">
                  <div 
                    v-for="user in filteredReviewerList" 
                    :key="user.id"
                    @mousedown="form.reviewer = [...form.reviewer, user.id]; searchQueryReviewer = ''"
                    class="px-4 py-3 text-[11px] font-medium text-slate-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div class="flex flex-col">
                      <span class="font-bold uppercase tracking-wide">{{ user.name }}</span>
                      <span class="text-[9px] text-slate-400 font-normal mt-0.5">{{ user.position || 'No Position' }}</span>
                    </div>
                  </div>
                  <div v-if="filteredReviewerList.length === 0" class="px-4 py-3 text-[11px] text-slate-400 italic">
                    No matches found
                  </div>
                </div>
              </div>

              <!-- Preview reviewer yang sudah dipilih — multi tag -->
              <div v-if="form.reviewer.length > 0" 
                  class="mt-2 flex flex-wrap gap-2">
                <div 
                  v-for="reviewerId in form.reviewer" 
                  :key="reviewerId"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <span class="material-icons text-blue-500 text-[14px]">person_check</span>
                  <span class="text-[10px] font-medium text-blue-700">
                    {{ reviewerList.find(r => r.id === reviewerId)?.name || '' }}
                  </span>
                  <button 
                    @click="form.reviewer = form.reviewer.filter(id => id !== reviewerId)"
                    class="ml-1 text-blue-300 hover:text-red-500 transition-colors"
                    type="button"
                  >
                    <span class="material-icons text-[12px]">close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- =====================================================
               ✅ PERUBAHAN UI: Buttons — 2 tombol terpisah (dari teman)
               - Tombol "Send" → memanggil submitForm() milik saya
               - Tombol "Save as Draft" → memanggil saveDraft() milik saya
               ===================================================== -->
          <div class="flex flex-col gap-3">
            <!-- Submit / Send Button -->
            <button 
              @click="submitForm" 
              :disabled="isSubmitting || isUploadingFiles"
              class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-2xl text-[11px] font-semibold uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 group"
            >
              <span v-if="isSubmitting || isUploadingFiles" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <template v-else>
                <span>Execute & Send</span>
                <span class="material-icons text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">rocket_launch</span>
              </template>
            </button>

            
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue"; 
import ApprovalLevel from "../components/ApprovalLevel.vue";
import permohonanService from "@/services/permohonanService";
import ObjxSDK from '@/lib/objx-sdk';
import categoryService from "@/services/categoryService";
import approverService from "@/services/approverService";
import { useRouter } from "vue-router";
import { onBeforeRouteLeave } from 'vue-router'; 

const getSDK = () => {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;
  if (!gatewayUrl) {
    console.warn('⚠️ VITE_GATEWAY_URL tidak diset, fitur upload tidak tersedia');
    return null;
  }
  return new ObjxSDK({ gatewayUrl });
};

const router = useRouter();
let nextLevelId = 2;

// ✅ TAMBAH: Get current user dan check pure user
const currentUser = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
});

// ✅ FIX: Izinkan akses jika user MEMILIKI role USER (apapun role lainnya)
const isPureBasicUser = computed(() => {
  const roles = (currentUser.value.roles || []).map(r => r.toUpperCase());

  if (roles.length === 0 && currentUser.value.role) {
    const r = currentUser.value.role.toUpperCase();
    return r === 'USER' || r === 'REQUESTER';
  }

  return roles.includes('USER') || roles.includes('REQUESTER');
});

const isSubmitting = ref(false);
const isLoadingData = ref(true);
const isUploadingFiles = ref(false);
const uploadFileProgress = ref([]);

const errors = ref({
  title: false,
  category: false,
  description: false
});

const showSubmitSuccess = ref(false);
const showConfirmDraft = ref(false);
const showDraftSaved = ref(false); 
const showDraftSavedConfirm = ref(false);
const showError = ref(false); 
const errorMessage = ref(''); 

const showDiscardConfirm = ref(false);     
const showSubmitConfirm = ref(false);      
const showCancelConfirm = ref(false);     

// Data lists dari backend
const categoryList = ref([]);
const approverList = ref([]);
const reviewerList = ref([]);
const searchQueryReviewer = ref("");
const isReviewerDropdownOpen = ref(false);

const closeReviewerDropdownDelayed = () => {
  setTimeout(() => {
    isReviewerDropdownOpen.value = false;
  }, 200);
};

// Filtered reviewer list based on search query
const filteredReviewerList = computed(() => {
  const query = searchQueryReviewer.value.toLowerCase().trim();
  const available = reviewerList.value.filter(
    user => !form.value.reviewer.includes(user.id)
  );
  if (!query) return available;
  return available.filter(user =>
    user.name.toLowerCase().includes(query) ||
    (user.position && user.position.toLowerCase().includes(query))
  );
});

// ✅ PERBAIKAN: Level default
const approvalLevels = ref([
  { id: 1, reviewers: [] }
]);

const form = ref({
  title: "",
  category: "",
  description: "",
  reviewer: [],
  attachments: [],
  files: [] 
});

const hasUnsavedChanges = ref(false);
const isLeavingPage = ref(false);
const createdApprovalRequestId = ref(null); 

// ✅ Load data dari backend
const loadInitialData = async () => {
  try {
    isLoadingData.value = true;
    
    console.log('🔄 Loading initial data...');
    
    // Load categories
    try {
      const categoriesResponse = await categoryService.getCategories();
      categoryList.value = categoriesResponse.data || [];
      console.log('✅ Categories loaded:', categoryList.value.length);
    } catch (catError) {
      console.error('⚠️ Failed to load categories:', catError);
      categoryList.value = [];
    }
    
    // Load approver
    try {
      const approversResponse = await approverService.getApprovers();
      
      approverList.value = (approversResponse.data || []).map(user => ({
        id: user.id,
        name: user.name || user.fullName || user.username,
        position: user.position || user.jabatan || '-',
        role: user.role || (Array.isArray(user.roles) ? user.roles[0] : 'APPROVER')
      }));
      
      console.log('✅ Approvers loaded:', approverList.value.length);
      if (approverList.value.length > 0) {
        console.log('📊 Sample approver:', approverList.value[0]);
      }
    } catch (appError) {
      console.error('⚠️ Failed to load approvers:', appError);
      approverList.value = [];
    }
    
    // Load reviewers
    try {
      const reviewersResponse = await approverService.getReviewers();
      
      reviewerList.value = (reviewersResponse.data || []).map(user => ({
        id: user.id,
        name: user.name || user.fullName || user.username,
        position: user.position || user.jabatan || '-',
        role: user.role || (Array.isArray(user.roles) ? user.roles[0] : 'REVIEWER')
      }));
      
      console.log('✅ Reviewers loaded:', reviewerList.value.length);
      if (reviewerList.value.length > 0) {
        console.log('📊 Sample reviewer:', reviewerList.value[0]);
      }
    } catch (revError) {
      console.error('⚠️ Failed to load reviewers:', revError);
      reviewerList.value = [];
    }
    
    console.log('✅ All data loaded successfully');
    
  } catch (error) {
    console.error('❌ Load data error:', error);
    
    if (error.isPermissionError) {
      alert('⚠️ Akses ditolak. Anda tidak memiliki izin untuk melihat data ini.');
    } else if (error.code === 'ECONNREFUSED') {
      alert('⚠️ Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.');
    } else if (error.response?.status === 401) {
      alert('⚠️ Sesi Anda telah berakhir. Silakan login kembali.');
    } else {
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      console.error('❌ Error details:', errorMsg);
      
      if (categoryList.value.length === 0 && approverList.value.length === 0 && reviewerList.value.length === 0) {
        alert('⚠️ Gagal memuat data: ' + errorMsg);
      }
    }
  } finally {
    isLoadingData.value = false;
  }
};

// ✅ Update reviewers untuk level tertentu
const updateLevelReviewers = (levelId, newReviewers) => {
  const level = approvalLevels.value.find(l => l.id === levelId);
  if (level) {
    level.reviewers = newReviewers;
    console.log(`✅ Updated Level ${levelId} reviewers:`, newReviewers);
  }
};

// ✅ Update type untuk level tertentu
const updateLevelType = (levelId, newType) => {
  const level = approvalLevels.value.find(l => l.id === levelId);
  if (level) {
    level.type = newType;
    console.log(`✅ Updated Level ${levelId} type:`, newType);
  }
};

// Validasi form
const validateForm = () => {
  let isValid = true;
  errors.value = {
    title: false,
    category: false,
    description: false
  };

  if (!form.value.title || form.value.title.trim().length < 5) {
    errors.value.title = true;
    isValid = false;
  }

  if (!form.value.category) {
    errors.value.category = true;
    isValid = false;
  }

  if (!form.value.description || form.value.description.trim().length < 10) {
    errors.value.description = true;
    isValid = false;
  }

  if (approvalLevels.value.length === 0) {
    errorMessage.value = 'Minimal harus ada 1 level approval!';
    showError.value = true;
    return false;
  }

  for (let i = 0; i < approvalLevels.value.length; i++) {
    const level = approvalLevels.value[i];
    if (!level.reviewers || level.reviewers.length === 0) {
      errorMessage.value = `Level ${i + 1} harus memiliki minimal 1 approver!`;
      showError.value = true;
      return false;
    }
  }

  if (!isValid) {
    errorMessage.value = 'Mohon lengkapi semua field yang wajib diisi!';
    showError.value = true;
  }

  return isValid;
};

// FUNGSI BARU: Upload semua file ke Objx, return array object_ids
const uploadFilesToObjx = async (approvalRequestId) => {
  if (!form.value.files || form.value.files.length === 0) {
    return [];
  }

  const sdk = getSDK(); // ← ambil SDK di sini
  if (!sdk) {
    console.warn('⚠️ SDK tidak tersedia, skip upload');
    return [];
  }


  isUploadingFiles.value = true;
  const results = [];

  try {
    for (let i = 0; i < form.value.files.length; i++) {
      const file = form.value.files[i];

      console.log(`Uploading [${i + 1}/${form.value.files.length}]: ${file.name}`);

      // Step 1: Hitung checksum dulu
      const checksum = await ObjxSDK._checksum(file);

      // Step 2: Minta presigned URL dari backend kita (bukan gateway langsung)
      const uploadRequest = await permohonanService.requestAttachmentUpload(
        approvalRequestId,
        {
          name:     file.name,
          size:     file.size,
          type:     file.type || 'application/octet-stream',
          checksum: checksum
        }
      );

      console.log('Full uploadRequest response:', JSON.stringify(uploadRequest, null, 2));
      console.log('uploadRequest.data:', uploadRequest.data);
      console.log('bucket_id:', uploadRequest.data?.bucket_id);
      console.log('upload_init_url:', uploadRequest.data?.upload_init_url);
      console.log('path:', uploadRequest.data?.path);

      const uploadInitUrl = uploadRequest.data.upload_init_url;
      const bucketId      = uploadRequest.data.bucket_id || null;
      const path          = uploadRequest.data.path || uploadRequest.data._meta?.path || '';

      // Step 3: Upload langsung ke Go storage pakai URL dari backend
      const uploader = new window._ObjxUploaderInternal(uploadInitUrl, null);
      const uploadResult = await uploader.upload(
        file,
        bucketId,
        path,
        (percent) => {
          if (uploadFileProgress.value[i] !== undefined) {
            uploadFileProgress.value[i].progress = percent;
          }
        },
        checksum
      );
      console.log('Upload result from Go:', uploadResult);

      if (uploadFileProgress.value[i] !== undefined) {
        uploadFileProgress.value[i].progress = 100;
        uploadFileProgress.value[i].done = true;
      }

      // Ambil object_id dari hasil upload Go backend
      const objectId = uploadResult?.object_id || uploadResult?.id || '';

      // Panggil confirm-upload ke backend Express
      await permohonanService.confirmAttachmentUpload(approvalRequestId, {
        objectId: objectId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        hash:     checksum,
        path:     uploadRequest.data._meta?.path || ''
      });

      // Ambil bucket_id dari semua kemungkinan sumber
      const resolvedBucketId = bucketId 
        || uploadResult?.bucket_id 
        || uploadRequest.data?.bucket_id
        || import.meta.env.VITE_OBJX_BUCKET_ID
        || 'a9c4a4f9-2c1e-410e-b43f-a9068bb1c154';
        

      console.log('📦 Resolved bucket_id:', resolvedBucketId);

      if (sdk) {
        sdk.gateway.post('/save-metadata', {
          object_id: objectId,
          filename:  file.name,
          bucket_id: resolvedBucketId,
          hash:      checksum,
        })
        .then(() => {
          console.log('✅ Metadata saved to Objx Gateway');
        })
        .catch((metaErr) => {
          console.warn('⚠️ save-metadata gagal (non-critical):', metaErr.message);
        });
      }
      results.push({
        objectId: objectId,
        filename: file.name,
        size:     file.size,
        hash:     checksum,
        path:     uploadRequest.data._meta?.path || ''
      });

      console.log(`Done & confirmed: ${file.name}`);
    }

    return results;

  } catch (error) {
    console.error('Upload to Objx failed:', error);
    throw new Error('Gagal upload file: ' + error.message);
  } finally {
    isUploadingFiles.value = false;
  }
};

// Updated submitForm function dengan FormData untuk mengirim file
const submitForm = async () => {
  if (!validateForm()) return;

  try {
    isSubmitting.value = true;

    const requestData = {
      title:       form.value.title.trim(),
      description: form.value.description.trim(),
      categoryId:  form.value.category,
      flowType:    'SEQUENTIAL',
      approvalLevels: approvalLevels.value
        .filter(level => level.reviewers.length > 0)
        .map((level, index) => ({
          level:     index + 1,
          type:      'PARALLEL', // Hardcoded as PARALLEL (multi-approver support)
          approvers: level.reviewers
        })),
      reviewers: form.value.reviewer,
    };

    console.log('Step 1: Creating document...');
    const response = await permohonanService.createPermohonan(requestData);
    const approvalRequestId = response.data.id;
    console.log('Step 1 done. ID:', approvalRequestId);

    // ✅ FIX: Simpan ID SEGERA setelah dokumen dibuat, sebelum upload
    createdApprovalRequestId.value = approvalRequestId;

    // Step 2: Upload file
    if (form.value.files && form.value.files.length > 0) {
      console.log('Step 2: Uploading files with ID:', approvalRequestId);
      await uploadFilesToObjx(approvalRequestId);
      console.log('Step 2 done.');
    }

    hasUnsavedChanges.value = false;
    // ✅ FIX: JANGAN set isLeavingPage = true di sini
    // isLeavingPage hanya di-set setelah user klik OK (konfirmasi)
    showSubmitSuccess.value = true;

  } catch (error) {
    console.error('Submit error:', error);
    
    // ✅ FIX: Kalau submit gagal di tengah jalan, hapus dokumen yang sudah terbuat
    if (createdApprovalRequestId.value) {
      try {
        await permohonanService.cancelPermohonan(createdApprovalRequestId.value);
        console.log('✅ Rollback: dokumen dihapus karena submit gagal');
      } catch (deleteErr) {
        console.warn('⚠️ Rollback gagal:', deleteErr.message);
      }
      createdApprovalRequestId.value = null;
    }
    
    errorMessage.value = error.response?.data?.message || error.message || 'Gagal membuat dokumen';
    showError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmitSuccessClose = () => {
  showSubmitSuccess.value = false;
  showSubmitConfirm.value = true; 
};

const isCancelling = ref(false);

const handleCancelSubmit = async () => {
  if (isCancelling.value) return;
  try {
    isCancelling.value = true;
    if (createdApprovalRequestId.value) {
      console.log('🗑️ Membatalkan dokumen:', createdApprovalRequestId.value);
      await permohonanService.cancelPermohonan(createdApprovalRequestId.value);
      console.log('✅ Dokumen berhasil dibatalkan:', createdApprovalRequestId.value);
    }
    createdApprovalRequestId.value = null;
    showSubmitSuccess.value = false;
    hasUnsavedChanges.value = false;
    isLeavingPage.value = false;
    showCancelConfirm.value = true; // ✅ tampilkan konfirmasi cancel
  } catch (error) {
    console.error('❌ Gagal membatalkan dokumen:', error);
    errorMessage.value =
      `Failed to cancel document: ${error.response?.data?.message || error.message}. ` +
      `Please delete manually from the documents page.`;
    showSubmitSuccess.value = false;
    showError.value = true;
    createdApprovalRequestId.value = null;
  } finally {
    isCancelling.value = false;
  }
};

const handleDiscardConfirmClose = () => {
  showDiscardConfirm.value = false;
  isLeavingPage.value = true;
  router.push("/view-document");
};

const handleSubmitConfirmClose = () => {
  showSubmitConfirm.value = false;
  hasUnsavedChanges.value = false;
  isLeavingPage.value = true;
  router.push("/view-document?refresh=true");
};

const handleCancelConfirmClose = () => {
  showCancelConfirm.value = false;
  router.push("/add-document"); // kembali ke form kosong
};

const addApprovalLevel = () => {
  // Level 2+ default PARALLEL
  approvalLevels.value.push({ 
    id: nextLevelId++, 
    type: 'parallel', 
    reviewers: [] 
  });
  
  console.log(`✅ Added Level ${approvalLevels.value.length} (PARALLEL)`);
};

const deleteApprovalLevel = (id) => {
  if (approvalLevels.value.length === 1) {
    alert("❌ Minimal harus ada 1 level approval!");
    return;
  }
  approvalLevels.value = approvalLevels.value.filter(l => l.id !== id);
  console.log(`✅ Deleted level ${id}, remaining: ${approvalLevels.value.length}`);
};

// File Management (preview only)
const handleFiles = (e) => {
  const newFiles = Array.from(e.target.files);
  
  if (form.value.attachments.length + newFiles.length > 10) {
    errorMessage.value = 'Maksimal 10 file!';
    showError.value = true;
    return;
  }
  
  const allowedTypes = ['.pdf','.doc','.docx','.xls','.xlsx','.jpg','.jpeg','.png'];
  const invalidType = newFiles.find(f => 
    !allowedTypes.some(ext => f.name.toLowerCase().endsWith(ext))
  );
  if (invalidType) {
    errorMessage.value = ` Format file tidak didukung: ${invalidType.name}`;
    showError.value = true;
    return;
  }
  
  form.value.attachments = [...form.value.attachments, ...newFiles];
  form.value.files = [...form.value.files, ...newFiles];
  
  uploadFileProgress.value = [
    ...uploadFileProgress.value,
    ...newFiles.map(f => ({ name: f.name, progress: 0, done: false, objectId: null }))
  ];
  
  console.log('📎 Files staged for Objx upload:', newFiles.map(f => f.name));
};

const removeFile = (index) => {
  form.value.attachments.splice(index, 1);
  form.value.files.splice(index, 1);
  uploadFileProgress.value.splice(index, 1);
  console.log('📎 File removed. Remaining files:', form.value.files.length);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const goBack = () => {
  if (hasUnsavedChanges.value) {
    showConfirmDraft.value = true;
  } else {
    router.push("/view-document");
  }
};

const handleCancelDraft = () => {
  showConfirmDraft.value = false;
  showDiscardConfirm.value = true;
};

const handleSaveDraft = async () => {
  showConfirmDraft.value = false;
  await saveDraft();
};

const saveDraft = async () => {
  try {
    isSubmitting.value = true;

    // ✅ VALIDASI 1: Title minimal 3 karakter
    if (!form.value.title || form.value.title.trim().length < 3) {
      errorMessage.value = '❌ Judul minimal 3 karakter untuk menyimpan draft!';
      showError.value = true;
      isSubmitting.value = false;
      return;
    }

    // ✅ VALIDASI 2: Category wajib dipilih
    if (!form.value.category) {
      errorMessage.value = '❌ Kategori wajib dipilih untuk menyimpan draft!';
      showError.value = true;
      isSubmitting.value = false;
      return;
    }

    // ✅ VALIDASI 3: Minimal 1 approval level dengan approver
    const validLevels = approvalLevels.value.filter(
      level => level.reviewers && level.reviewers.length > 0
    );

    if (validLevels.length === 0) {
      errorMessage.value = '❌ Minimal harus ada 1 level approval dengan approver...';

      showError.value = true;
      isSubmitting.value = false;
      return;
    }

    const draftData = {
      title: form.value.title.trim(),
      description: form.value.description?.trim() || "",
      categoryId: form.value.category,
      approvalType: "SEQUENTIAL",
      approvalLevels: validLevels.map((level, index) => ({
        level: index + 1,
        type: 'PARALLEL', // Hardcoded as PARALLEL
        approvers: level.reviewers
      })),
      reviewers: form.value.reviewer,
    };

    console.log("📤 Saving DRAFT with files:", {
      data: draftData,
      filesCount: form.value.files.length
    });
    
    const response = await permohonanService.createDraft(draftData);
    const draftId = response.data?.id || response.id;
    console.log('✅ Draft created with ID:', draftId);
    // Upload file pakai ID draft yang sudah ada
    if (form.value.files && form.value.files.length > 0 && draftId) {
      console.log('🚀 Uploading files to Objx with draft ID:', draftId);
      await uploadFilesToObjx(draftId);
    }

    console.log("✅ Draft saved successfully:", response);
    
    hasUnsavedChanges.value = false;
    isLeavingPage.value = true;

    // ✅ Tampilkan popup success, lalu popup konfirmasi
    showDraftSaved.value = true;
    
  } catch (error) {
    console.error("❌ Save draft error:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    
    errorMessage.value = error.response?.data?.message 
      || error.response?.data?.errors?.[0]?.message
      || error.message 
      || 'Terjadi kesalahan saat menyimpan draft';
    
    showError.value = true;
    
  } finally {
    isSubmitting.value = false;
  }
};

const handleDraftSavedClose = () => {
  showDraftSaved.value = false;
  // After closing the first draft popup, show the confirmation popup
  showDraftSavedConfirm.value = true;
};

const handleDraftConfirmClose = () => {
  showDraftSavedConfirm.value = false;
  router.push("/drafts");
};

const setupFormWatcher = () => {
  watch(
    () => ({
      form: form.value,
      approvalLevels: approvalLevels.value
    }),
    () => {
      hasUnsavedChanges.value = true;
    },
    { deep: true }
  );
};

// ✅ TAMBAHAN: Global error handler untuk debugging
window.addEventListener('unhandledrejection', (event) => {
  console.error('🔥 Unhandled promise rejection:', event.reason);
});

onMounted(() => {
  if (!isPureBasicUser.value) {
    const userRoles = currentUser.value.roles || [];
    const isAdmin = userRoles.includes('ADMIN');
    router.push(isAdmin ? '/admin/dashboard' : '/dashboard');
    return;
  }
  
  loadInitialData();
  setupFormWatcher();
});

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value && !isLeavingPage.value) {
    showConfirmDraft.value = true;
    
    const unwatch = watch(showConfirmDraft, (newVal) => {
      if (!newVal && isLeavingPage.value) {
        unwatch();
        next(); // ← hanya dipanggil sekali di sini
      } else if (!newVal && !isLeavingPage.value) {
        unwatch();
        next(false); // ← batalkan navigasi jika user discard
      }
    });
    
    return; 
  } else {
    next();
  }
});
</script> 


