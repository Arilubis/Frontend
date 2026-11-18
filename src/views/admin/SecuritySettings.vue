<template>
  <div class="min-h-screen bg-[#F1F5F9] px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 text-slate-900 transition-all duration-300">
    <div class="max-w-[1440px] mx-auto">

      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900 tracking-tight">{{ $t('twoFactor.admin.title') }}</h1>
          <p class="text-slate-500 text-[13px] font-normal">{{ $t('twoFactor.admin.subtitle') }}</p>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-600 font-medium">{{ $t('common.loading') }}</p>
        </div>
      </div>

      <!-- ERROR -->
      <div v-else-if="loadError" class="bg-white border border-red-100 rounded-xl p-6 text-center max-w-lg mx-auto mt-4">
        <span class="material-icons text-red-500 text-4xl mb-3">error_outline</span>
        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ $t('common.error') }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ loadError }}</p>
        <button @click="loadAll" class="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-all">
          {{ $t('twoFactor.admin.retry') }}
        </button>
      </div>

      <template v-else>
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-4">

          <!-- ═══════════ KARTU KEBIJAKAN ═══════════ -->
          <div class="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-7">
            <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span class="material-icons text-slate-400">security</span>
              <h3 class="text-[16px] font-semibold text-slate-900">{{ $t('twoFactor.admin.policyTitle') }}</h3>
            </div>

            <!-- MODE -->
            <div class="space-y-3">
              <label class="text-[11px] font-medium text-slate-400 uppercase tracking-widest px-1">
                {{ $t('twoFactor.admin.modeLabel') }}
              </label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  v-for="m in modes" :key="m.id" type="button"
                  @click="form.mode = m.id"
                  class="group flex items-start gap-3.5 p-4 rounded-2xl border-2 text-left transition-all duration-300 relative outline-none overflow-hidden"
                  :class="form.mode === m.id
                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500/20'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-200'"
                >
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                       :class="form.mode === m.id ? 'bg-blue-50 ' + m.color : 'bg-white text-slate-400'">
                    <span class="material-icons text-[20px]">{{ m.icon }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-800">{{ $t('twoFactor.admin.modes.' + m.id) }}</p>
                    <p class="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">{{ $t('twoFactor.admin.modeDesc.' + m.id) }}</p>
                  </div>
                  <div v-if="form.mode === m.id"
                       class="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-white flex-shrink-0">
                    <span class="material-icons text-[13px]">check</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- CAKUPAN (hanya Mandatory) -->
            <transition name="sec-expand">
              <div v-if="form.mode === 'MANDATORY'" class="space-y-6">
                <div class="space-y-3">
                  <label class="text-[11px] font-medium text-slate-400 uppercase tracking-widest px-1">
                    {{ $t('twoFactor.admin.scopeLabel') }}
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      v-for="s in scopes" :key="s.id" type="button"
                      @click="form.scope = s.id"
                      class="flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all outline-none"
                      :class="form.scope === s.id
                        ? 'border-slate-800 bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'"
                    >
                      <span class="material-icons text-[20px]" :class="form.scope === s.id ? 'text-blue-400' : 'text-slate-400'">{{ s.icon }}</span>
                      <div class="min-w-0">
                        <p class="text-[13px] font-medium truncate" :class="form.scope === s.id ? 'text-white' : 'text-slate-700'">{{ $t('twoFactor.admin.scopes.' + s.id) }}</p>
                        <p class="text-[10px] font-normal leading-snug" :class="form.scope === s.id ? 'text-zinc-400' : 'text-slate-400'">
                          {{ $t('twoFactor.admin.scopeDesc.' + s.id) }}
                        </p>
                      </div>
                    </button>
                  </div>
                  <p v-if="!form.scope" class="text-[11px] text-amber-600 font-medium px-1 flex items-center gap-1.5">
                    <span class="material-icons text-[14px]">info</span>{{ $t('twoFactor.admin.scopeRequired') }}
                  </p>
                </div>

                <!-- BY ROLE -->
                <div v-if="form.scope === 'BY_ROLE'" class="space-y-3">
                  <label class="text-[11px] font-medium text-slate-400 uppercase tracking-widest px-1">
                    {{ $t('twoFactor.admin.rolesLabel') }}
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="r in allRoles" :key="r" type="button"
                      @click="toggleRole(r)"
                      class="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[12px] font-medium transition-all outline-none"
                      :class="form.roles.includes(r)
                        ? 'border-blue-500 bg-blue-50/60 text-blue-700 ring-1 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'"
                    >
                      <span class="material-icons text-[16px]">{{ form.roles.includes(r) ? 'check_circle' : 'radio_button_unchecked' }}</span>
                      {{ r }}
                    </button>
                  </div>
                  <p v-if="form.roles.length === 0" class="text-[11px] text-amber-600 font-medium px-1 flex items-center gap-1.5">
                    <span class="material-icons text-[14px]">info</span>{{ $t('twoFactor.admin.rolesRequired') }}
                  </p>
                </div>

                <!-- SELECTED USERS -->
                <div v-if="form.scope === 'SELECTED_USERS'" class="space-y-3">
                  <div class="flex items-center justify-between px-1">
                    <label class="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                      {{ $t('twoFactor.admin.usersLabel') }}
                      <span class="ml-1 normal-case tracking-normal text-slate-500">· {{ form.userIds.length }} {{ $t('twoFactor.admin.usersSelected') }}</span>
                    </label>
                    <button v-if="form.userIds.length" type="button" @click="form.userIds = []"
                            class="text-[11px] text-slate-400 hover:text-rose-500 transition-colors">
                      {{ $t('twoFactor.admin.clearSelection') }}
                    </button>
                  </div>

                  <div v-if="selectedUserObjs.length" class="flex flex-wrap gap-1.5">
                    <span v-for="u in selectedUserObjs" :key="u.id"
                          class="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-slate-900 text-white text-[11px] font-medium">
                      {{ u.name }}
                      <button type="button" @click="toggleUser(u.id)"
                              class="w-4 h-4 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors">
                        <span class="material-icons text-[11px]">close</span>
                      </button>
                    </span>
                  </div>

                  <div v-if="usersError" class="p-3 rounded-xl text-[12px] font-medium border bg-rose-50 text-rose-600 border-rose-100 flex items-center justify-between gap-3">
                    <span>{{ usersError }}</span>
                    <button type="button" @click="loadUsers" class="underline">{{ $t('twoFactor.admin.retry') }}</button>
                  </div>

                  <template v-else>
                    <div class="relative">
                      <span class="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                      <input v-model="userSearch" type="text" :placeholder="$t('twoFactor.admin.usersSearch')"
                             class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal outline-none focus:bg-white focus:border-blue-500 transition-all" />
                    </div>

                    <div class="border border-slate-200 rounded-xl overflow-hidden">
                      <div v-if="usersLoading" class="p-6 text-center text-[12px] text-slate-500">{{ $t('common.loading') }}</div>
                      <div v-else-if="filteredUsers.length === 0" class="p-6 text-center text-[12px] text-slate-400">{{ $t('twoFactor.admin.usersEmpty') }}</div>
                      <ul v-else class="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        <li v-for="u in filteredUsers" :key="u.id">
                          <button type="button" @click="toggleUser(u.id)"
                                  class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50"
                                  :class="form.userIds.includes(u.id) ? 'bg-blue-50/40' : ''">
                            <span class="material-icons text-[20px]"
                                  :class="form.userIds.includes(u.id) ? 'text-blue-600' : 'text-slate-300'">
                              {{ form.userIds.includes(u.id) ? 'check_box' : 'check_box_outline_blank' }}
                            </span>
                            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[12px] font-semibold text-slate-600 flex-shrink-0">
                              {{ u.name.charAt(0).toUpperCase() }}
                            </div>
                            <div class="flex-1 min-w-0">
                              <p class="text-[13px] font-medium text-slate-800 truncate">{{ u.name }}</p>
                              <p class="text-[11px] text-slate-400 truncate">{{ u.username }}<span v-if="u.email"> · {{ u.email }}</span></p>
                            </div>
                            <div class="hidden sm:flex gap-1 flex-shrink-0">
                              <span v-for="r in u.roles" :key="r"
                                    class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[9px] font-semibold uppercase tracking-wider">{{ r }}</span>
                            </div>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </template>

                  <p v-if="form.userIds.length === 0" class="text-[11px] text-amber-600 font-medium px-1 flex items-center gap-1.5">
                    <span class="material-icons text-[14px]">info</span>{{ $t('twoFactor.admin.usersRequired') }}
                  </p>
                </div>
              </div>
            </transition>

            <!-- FOOTER -->
            <div class="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-100">
              <button
                @click="requestSave"
                :disabled="!canSave || saving"
                class="mt-5 bg-slate-900 text-white px-8 py-3 rounded-xl font-medium text-[12px] hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="saving" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ saving ? $t('twoFactor.admin.saving') : $t('twoFactor.admin.save') }}
              </button>
              <button
                v-if="isDirty" @click="syncForm(policy)" :disabled="saving"
                class="mt-5 px-6 py-3 text-slate-400 font-normal text-[12px] hover:text-slate-600 transition-all"
              >
                {{ $t('twoFactor.admin.reset') }}
              </button>
              <span v-if="isDirty" class="mt-5 ml-auto flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                {{ lang === 'id' ? 'Ada perubahan belum disimpan' : 'Unsaved changes' }}
              </span>
            </div>
          </div>

          <!-- ═══════════ KARTU DAMPAK ═══════════ -->
          <div class="xl:col-span-4">
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 xl:sticky xl:top-4 space-y-5">
              <h5 class="text-[11px] font-medium uppercase tracking-widest text-slate-400">{{ $t('twoFactor.admin.impactTitle') }}</h5>

              <div class="flex items-start gap-3">
                <span class="material-icons text-[20px] mt-0.5" :class="impactIconColor">{{ impactIcon }}</span>
                <p class="text-[12px] text-slate-600 font-normal leading-relaxed">{{ impactText }}</p>
              </div>

              <div v-if="form.mode === 'MANDATORY'" class="flex items-start gap-3">
                <span class="material-icons text-[20px] mt-0.5 text-amber-500">schedule</span>
                <p class="text-[12px] text-slate-600 font-normal leading-relaxed">{{ $t('twoFactor.admin.impactSession') }}</p>
              </div>

              <div v-if="policy?.updatedAt" class="pt-4 border-t border-slate-200/70">
                <p class="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{{ $t('twoFactor.admin.lastUpdated') }}</p>
                <p class="text-[12px] font-medium text-slate-700 mt-1">{{ formatDate(policy.updatedAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════ RESET 2FA USER ═══════════ -->
        <div class="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-5">
          <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span class="material-icons text-slate-400">lock_reset</span>
            <div>
              <h3 class="text-[16px] font-semibold text-slate-900">{{ $t('twoFactor.admin.resetTitle') }}</h3>
              <p class="text-[12px] text-slate-500 font-normal mt-0.5">{{ $t('twoFactor.admin.resetDesc') }}</p>
            </div>
          </div>

          <div class="relative max-w-xl">
            <span class="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input v-model="resetSearch" type="text" :placeholder="$t('twoFactor.admin.resetSearch')"
                   class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal outline-none focus:bg-white focus:border-blue-500 transition-all" />
          </div>

          <div v-if="resetSearch.trim()" class="border border-slate-200 rounded-xl overflow-hidden max-w-3xl">
            <div v-if="resetUsers.length === 0" class="p-6 text-center text-[12px] text-slate-400">{{ $t('twoFactor.admin.usersEmpty') }}</div>
            <ul v-else class="max-h-72 overflow-y-auto divide-y divide-slate-100">
              <li v-for="u in resetUsers" :key="u.id" class="flex items-center gap-3 px-4 py-2.5">
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[12px] font-semibold text-slate-600 flex-shrink-0">
                  {{ u.name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[13px] font-medium text-slate-800 truncate">{{ u.name }}</p>
                  <p class="text-[11px] text-slate-400 truncate">{{ u.username }}<span v-if="u.email"> · {{ u.email }}</span></p>
                </div>
                <button @click="resetTarget = u"
                        class="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-[11px] font-medium hover:bg-rose-50 transition-all flex-shrink-0">
                  <span class="material-icons text-[15px]">restart_alt</span>{{ $t('twoFactor.admin.resetButton') }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </template>

      <!-- MODAL: konfirmasi simpan kebijakan -->
      <transition name="sec-modal">
        <div v-if="showSaveConfirm" @click.self="showSaveConfirm = false"
             class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] overflow-hidden border border-slate-100">
            <div class="flex flex-col items-center px-8 pt-9 pb-5">
              <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 border"
                   :class="form.mode === 'DISABLED' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-700'">
                <span class="material-icons text-3xl">{{ form.mode === 'DISABLED' ? 'warning' : 'security' }}</span>
              </div>
              <p class="text-[20px] font-semibold text-slate-900 mb-2">{{ $t('twoFactor.admin.confirmTitle') }}</p>
              <p class="text-xs text-slate-500 text-center leading-relaxed font-normal px-2">{{ impactText }}</p>
              <p v-if="form.mode === 'MANDATORY'" class="text-xs text-slate-500 text-center leading-relaxed font-normal px-2 mt-2">
                {{ $t('twoFactor.admin.impactSession') }}
              </p>
            </div>
            <div class="h-px bg-slate-100"></div>
            <div class="flex gap-3 px-6 py-5">
              <button @click="showSaveConfirm = false"
                      class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all">
                {{ $t('twoFactor.admin.confirmCancel') }}
              </button>
              <button @click="doSave"
                      class="flex-[1.4] py-3.5 rounded-[14px] bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10">
                <span class="material-icons text-sm">check</span>{{ $t('twoFactor.admin.confirmYes') }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- MODAL: konfirmasi reset 2FA user -->
      <transition name="sec-modal">
        <div v-if="resetTarget" @click.self="!resetting && (resetTarget = null)"
             class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] overflow-hidden border border-slate-100">
            <div class="flex flex-col items-center px-8 pt-9 pb-5">
              <div class="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mb-4 text-rose-600">
                <span class="material-icons text-3xl">lock_reset</span>
              </div>
              <p class="text-[20px] font-semibold text-slate-900 mb-1">{{ $t('twoFactor.admin.resetConfirmTitle') }}</p>
              <p class="text-[13px] font-medium text-slate-700 mb-2">{{ resetTarget.name }}</p>
              <p class="text-xs text-slate-500 text-center leading-relaxed font-normal px-2">{{ $t('twoFactor.admin.resetConfirmDesc') }}</p>
            </div>
            <div class="h-px bg-slate-100"></div>
            <div class="flex gap-3 px-6 py-5">
              <button @click="resetTarget = null" :disabled="resetting"
                      class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all disabled:opacity-50">
                {{ $t('twoFactor.admin.confirmCancel') }}
              </button>
              <button @click="doReset" :disabled="resetting"
                      class="flex-[1.4] py-3.5 rounded-[14px] bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-60 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/10">
                <span v-if="resetting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else class="material-icons text-sm">restart_alt</span>
                {{ $t('twoFactor.admin.resetButton') }}
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Toast -->
      <transition name="sec-toast">
        <div v-if="toast.show"
             :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'"
             class="fixed bottom-6 right-6 text-white px-6 py-4 rounded-xl shadow-lg z-[110] flex items-center gap-3 max-w-sm">
          <span class="material-icons text-[20px]">{{ toast.type === 'success' ? 'check_circle' : 'error' }}</span>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import {
  getTwoFactorPolicy,
  updateTwoFactorPolicy,
  resetUserTwoFactor,
  parseApiError,
} from "@/services/twoFactor";
import { fetchUserList } from "@/services/user";
import { useLangStore } from "@/stores/langStore";

const langStore = useLangStore();
const t = (k) => langStore.t(k);
const lang = computed(() => langStore.lang);

// ── konfigurasi opsi ──
const modes = [
  { id: "DISABLED",  icon: "block",     color: "text-slate-500" },
  { id: "OPTIONAL",  icon: "toggle_on", color: "text-blue-600" },
  { id: "MANDATORY", icon: "lock",      color: "text-emerald-600" },
];
const scopes = [
  { id: "ALL_USERS",      icon: "group" },
  { id: "SELECTED_USERS", icon: "person_pin" },
  { id: "BY_ROLE",        icon: "assignment_ind" },
];
const allRoles = ["ADMIN", "USER", "APPROVER", "REVIEWER"];

// ── state ──
const loading = ref(true);
const loadError = ref("");
const policy = ref(null);
const form = reactive({ mode: "DISABLED", scope: null, roles: [], userIds: [] });

const users = ref([]);
const usersLoading = ref(false);
const usersError = ref("");
const userSearch = ref("");

const saving = ref(false);
const showSaveConfirm = ref(false);

const resetSearch = ref("");
const resetTarget = ref(null);
const resetting = ref(false);

const toast = reactive({ show: false, message: "", type: "success" });
let toastTimer = null;
function showToast(message, type = "success") {
  clearTimeout(toastTimer);
  Object.assign(toast, { show: true, message, type });
  toastTimer = setTimeout(() => (toast.show = false), 3500);
}

// ── data ──
function syncForm(p) {
  form.mode = p.mode;
  form.scope = p.scope || null;
  form.roles = [...(p.roles || [])];
  form.userIds = [...(p.userIds || [])];
}

async function loadUsers() {
  usersLoading.value = true;
  usersError.value = "";
  try {
    const response = await fetchUserList({ limit: 1000 });
    const raw = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
    users.value = raw.map((u) => ({
      id: u.id,
      name: u.fullName || u.name || u.username || "-",
      username: u.username || "",
      email: u.email || "",
      roles: Array.isArray(u.roles) && u.roles.length ? u.roles.map((r) => String(r).toUpperCase()) : [String(u.role || "USER").toUpperCase()],
    }));
  } catch (e) {
    usersError.value = t("twoFactor.admin.usersLoadFailed");
  } finally {
    usersLoading.value = false;
  }
}

async function loadAll() {
  loading.value = true;
  loadError.value = "";
  try {
    policy.value = await getTwoFactorPolicy();
    syncForm(policy.value);
  } catch (e) {
    loadError.value = t("twoFactor.admin.loadFailed");
    loading.value = false;
    return;
  }
  loading.value = false;
  loadUsers(); // non-blocking: gagal load user tidak menghalangi pengaturan mode
}

// ── helper pilihan ──
function toggleRole(r) {
  const i = form.roles.indexOf(r);
  if (i >= 0) form.roles.splice(i, 1);
  else form.roles.push(r);
}
function toggleUser(id) {
  const i = form.userIds.indexOf(id);
  if (i >= 0) form.userIds.splice(i, 1);
  else form.userIds.push(id);
}

const userMap = computed(() => Object.fromEntries(users.value.map((u) => [u.id, u])));

const selectedUserObjs = computed(() =>
  form.userIds.map((id) => {
    if (userMap.value[id]) return userMap.value[id];
    const fromPolicy = policy.value?.selectedUsers?.find((u) => u.id === id);
    return { id, name: fromPolicy?.fullName || fromPolicy?.username || id };
  })
);

function matches(u, q) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return [u.name, u.username, u.email].some((v) => (v || "").toLowerCase().includes(s));
}
const filteredUsers = computed(() => users.value.filter((u) => matches(u, userSearch.value)).slice(0, 200));
const resetUsers = computed(() => users.value.filter((u) => matches(u, resetSearch.value)).slice(0, 50));

// ── validasi & dirty ──
const isValid = computed(() => {
  if (form.mode !== "MANDATORY") return true;
  if (!form.scope) return false;
  if (form.scope === "BY_ROLE") return form.roles.length > 0;
  if (form.scope === "SELECTED_USERS") return form.userIds.length > 0;
  return true;
});

function normalize(src) {
  if (src.mode !== "MANDATORY") return { mode: src.mode };
  const base = { mode: "MANDATORY", scope: src.scope || null };
  if (src.scope === "BY_ROLE") base.roles = [...(src.roles || [])].sort();
  if (src.scope === "SELECTED_USERS") base.userIds = [...(src.userIds || [])].sort();
  return base;
}
const isDirty = computed(() =>
  !!policy.value && JSON.stringify(normalize(form)) !== JSON.stringify(normalize(policy.value))
);
const canSave = computed(() => isDirty.value && isValid.value);

// Hanya kirim field yang relevan dengan mode & cakupan
function buildPayload() {
  if (form.mode !== "MANDATORY") return { mode: form.mode };
  if (form.scope === "ALL_USERS") return { mode: "MANDATORY", scope: "ALL_USERS" };
  if (form.scope === "BY_ROLE") return { mode: "MANDATORY", scope: "BY_ROLE", roles: [...form.roles] };
  return { mode: "MANDATORY", scope: "SELECTED_USERS", userIds: [...form.userIds] };
}

// ── teks dampak ──
const impactKey = computed(() => (form.mode === "MANDATORY" ? form.scope || "ALL_USERS" : form.mode));
const impactText = computed(() => t("twoFactor.admin.impact." + impactKey.value));
const impactIcon = computed(() => ({ DISABLED: "info", OPTIONAL: "toggle_on" }[form.mode] || "lock"));
const impactIconColor = computed(
  () => ({ DISABLED: "text-slate-400", OPTIONAL: "text-blue-500" }[form.mode] || "text-emerald-500")
);

function formatDate(iso) {
  return new Date(iso).toLocaleString(lang.value === "id" ? "id-ID" : "en-US", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ── simpan ──
function requestSave() {
  if (!canSave.value) return;
  // Konfirmasi untuk perubahan berdampak luas (Mandatory / Disabled)
  if (form.mode === "OPTIONAL") doSave();
  else showSaveConfirm.value = true;
}

async function doSave() {
  showSaveConfirm.value = false;
  saving.value = true;
  try {
    policy.value = await updateTwoFactorPolicy(buildPayload());
    syncForm(policy.value);
    showToast(t("twoFactor.admin.saveOk"));
  } catch (e) {
    const err = parseApiError(e);
    const extra = err.missing?.length ? ` (${err.missing.join(", ")})` : "";
    showToast((err.message || t("twoFactor.admin.saveFailed")) + extra, "error");
  } finally {
    saving.value = false;
  }
}

// ── reset 2FA user ──
async function doReset() {
  if (!resetTarget.value) return;
  resetting.value = true;
  try {
    await resetUserTwoFactor(resetTarget.value.id);
    showToast(t("twoFactor.admin.resetOk"));
    resetTarget.value = null;
  } catch (e) {
    showToast(parseApiError(e).message || t("twoFactor.admin.resetFailed"), "error");
  } finally {
    resetting.value = false;
  }
}

onMounted(loadAll);
</script>

<style scoped>
.sec-toast-enter-active { transition: all 0.3s ease-out; }
.sec-toast-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.sec-toast-enter-from, .sec-toast-leave-to { transform: translateX(20px); opacity: 0; }

.sec-modal-enter-active, .sec-modal-leave-active { transition: opacity 0.3s ease; }
.sec-modal-enter-from, .sec-modal-leave-to { opacity: 0; }

.sec-expand-enter-active, .sec-expand-leave-active { transition: all 0.3s ease; }
.sec-expand-enter-from, .sec-expand-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
