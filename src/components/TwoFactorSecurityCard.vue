<template>
  <!-- Disembunyikan bila admin mematikan 2FA (mode DISABLED) -->
  <div
    v-if="loading || loadError || status?.available"
    data-testid="two-factor-card"
    :class="standalone
      ? 'bg-white rounded-[24px] shadow-sm border border-slate-200 p-6 md:p-8'
      : 'bg-slate-50 rounded-2xl border border-slate-100 p-6'"
  >
    <!-- Header -->
    <div class="flex items-start gap-4">
      <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
           :class="status?.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'">
        <span class="material-icons text-[22px]">{{ status?.enabled ? 'verified_user' : 'shield' }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h4 class="text-[14px] font-semibold text-slate-900">{{ $t('twoFactor.card.title') }}</h4>
          <span v-if="status"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border"
                :class="status.enabled
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-200'">
            {{ status.enabled ? $t('twoFactor.card.active') : $t('twoFactor.card.inactive') }}
          </span>
          <span v-if="status?.required"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border bg-amber-50 text-amber-600 border-amber-100">
            {{ $t('twoFactor.card.required') }}
          </span>
        </div>
        <p class="text-[12px] text-slate-500 font-normal mt-1 leading-relaxed">{{ $t('twoFactor.card.desc') }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-6 flex items-center gap-3 text-[12px] text-slate-500">
      <div class="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
      {{ $t('common.loading') }}
    </div>

    <!-- Gagal load -->
    <div v-else-if="loadError" class="mt-6 flex items-center gap-3">
      <p class="text-[12px] text-rose-600 font-medium flex-1">{{ loadError }}</p>
      <button @click="load" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-[12px] font-medium hover:bg-slate-800 transition-all">
        {{ $t('common.retry') }}
      </button>
    </div>

    <template v-else-if="status">
      <!-- SETUP INLINE -->
      <div v-if="settingUp" class="mt-6 bg-white border border-slate-200 rounded-2xl p-5">
        <TwoFactorSetupFlow show-cancel @completed="onSetupCompleted" @cancel="settingUp = false" />
      </div>

      <template v-else>
        <!-- BELUM AKTIF -->
        <div v-if="!status.enabled" class="mt-6 space-y-4">
          <div v-if="status.required"
               class="p-4 rounded-2xl text-[12px] font-medium flex items-start gap-3 border bg-amber-50 text-amber-700 border-amber-100">
            <span class="material-icons text-[18px] flex-shrink-0">info</span>
            <span>{{ $t('twoFactor.card.requiredNotEnabled') }}</span>
          </div>
          <button
            @click="settingUp = true"
            class="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium text-[12px] hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
          >
            <span class="material-icons text-[16px]">qr_code_2</span>
            {{ $t('twoFactor.card.enable') }}
          </button>
        </div>

        <!-- SUDAH AKTIF -->
        <div v-else class="mt-6 space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="bg-white border border-slate-100 rounded-xl p-4">
              <p class="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{{ $t('twoFactor.card.since') }}</p>
              <p class="text-[13px] font-medium text-slate-800 mt-1">{{ enabledAtLabel }}</p>
            </div>
            <div class="bg-white border border-slate-100 rounded-xl p-4">
              <p class="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{{ $t('twoFactor.card.backupLeft') }}</p>
              <p class="text-[13px] font-medium mt-1" :class="status.backupCodesRemaining <= 2 ? 'text-amber-600' : 'text-slate-800'">
                {{ status.backupCodesRemaining }} / 10
              </p>
            </div>
          </div>

          <div v-if="status.backupCodesRemaining <= 2"
               class="p-3.5 rounded-xl text-[12px] font-medium flex items-start gap-2.5 border bg-amber-50 text-amber-700 border-amber-100">
            <span class="material-icons text-[16px] flex-shrink-0">warning_amber</span>
            <span>{{ $t('twoFactor.card.lowBackup') }}</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              @click="openConfirm('regen')"
              class="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-[12px] font-medium hover:bg-slate-100 transition-all"
            >
              <span class="material-icons text-[16px]">autorenew</span>{{ $t('twoFactor.card.regen') }}
            </button>
            <button
              v-if="status.canDisable"
              @click="openConfirm('disable')"
              class="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-rose-200 bg-white text-rose-600 text-[12px] font-medium hover:bg-rose-50 transition-all"
            >
              <span class="material-icons text-[16px]">block</span>{{ $t('twoFactor.card.disable') }}
            </button>
          </div>

          <p v-if="!status.canDisable" class="text-[11px] text-slate-400 font-normal flex items-center gap-1.5">
            <span class="material-icons text-[14px]">lock</span>{{ $t('twoFactor.card.cannotDisable') }}
          </p>
        </div>
      </template>
    </template>

    <!-- MODAL: konfirmasi identitas / backup code baru -->
    <transition name="tf-modal">
      <div
        v-if="modal.open"
        @click.self="closeModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div class="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] overflow-hidden border border-slate-100">
          <!-- hasil: backup code baru -->
          <div v-if="newCodes" class="p-7">
            <BackupCodesPanel :codes="newCodes" @done="closeModal" />
          </div>

          <!-- form konfirmasi -->
          <form v-else @submit.prevent="submitConfirm">
            <div class="flex flex-col items-center px-8 pt-8 pb-4">
              <div class="w-14 h-14 rounded-full flex items-center justify-center mb-4 border"
                   :class="modal.type === 'disable' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-700'">
                <span class="material-icons text-2xl">{{ modal.type === 'disable' ? 'block' : 'autorenew' }}</span>
              </div>
              <p class="text-[18px] font-semibold text-slate-900 mb-1.5">{{ $t('twoFactor.confirm.title') }}</p>
              <p class="text-xs text-slate-500 text-center leading-relaxed font-normal px-2">
                {{ modal.type === 'disable' ? $t('twoFactor.confirm.disableDesc') : $t('twoFactor.confirm.regenDesc') }}
              </p>
            </div>

            <div class="px-8 pb-5 space-y-4">
              <div class="space-y-1.5">
                <label class="text-[11px] font-medium text-slate-400 uppercase tracking-widest px-1">{{ $t('twoFactor.confirm.password') }}</label>
                <div class="relative">
                  <input
                    :type="modal.showPassword ? 'text' : 'password'"
                    v-model="modal.password"
                    autocomplete="current-password"
                    class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal outline-none focus:bg-white focus:border-blue-500 transition-all"
                  />
                  <button type="button" @click="modal.showPassword = !modal.showPassword"
                          class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <span class="material-icons text-[20px]">{{ modal.showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-[11px] font-medium text-slate-400 uppercase tracking-widest px-1">{{ $t('twoFactor.confirm.code') }}</label>
                <input
                  v-model="modal.code"
                  autocomplete="one-time-code"
                  maxlength="16"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium tracking-[0.2em] outline-none focus:bg-white focus:border-blue-500 transition-all"
                />
              </div>

              <p v-if="modal.error" class="text-[11px] text-rose-500 font-medium flex items-start gap-1.5">
                <span class="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0 mt-1"></span>{{ modal.error }}
              </p>
            </div>

            <div class="h-px bg-slate-100"></div>
            <div class="flex gap-3 px-6 py-5">
              <button type="button" @click="closeModal" :disabled="modal.submitting"
                class="flex-1 py-3.5 rounded-[14px] border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 transition-all disabled:opacity-50">
                {{ $t('twoFactor.confirm.cancel') }}
              </button>
              <button type="submit" :disabled="modal.submitting"
                class="flex-[1.4] py-3.5 rounded-[14px] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 shadow-lg"
                :class="modal.type === 'disable' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10'">
                <span v-if="modal.submitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ modal.type === 'disable' ? $t('twoFactor.confirm.disableAction') : $t('twoFactor.confirm.regenAction') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import TwoFactorSetupFlow from "./TwoFactorSetupFlow.vue";
import BackupCodesPanel from "./BackupCodesPanel.vue";
import {
  getTwoFactorStatus,
  disableTwoFactor,
  regenerateBackupCodes,
  parseApiError,
} from "@/services/twoFactor";
import { useLangStore } from "@/stores/langStore";

defineProps({
  // true = tampil sebagai kartu putih mandiri (mis. di halaman Akun Saya)
  standalone: { type: Boolean, default: false },
});
const emit = defineEmits(["toast"]);
const langStore = useLangStore();
const t = (k) => langStore.t(k);

const loading = ref(true);
const loadError = ref("");
const status = ref(null);
const settingUp = ref(false);
const newCodes = ref(null);

const modal = reactive({
  open: false,
  type: "disable", // 'disable' | 'regen'
  password: "",
  code: "",
  showPassword: false,
  submitting: false,
  error: "",
});

const enabledAtLabel = computed(() => {
  if (!status.value?.enabledAt) return "-";
  return new Date(status.value.enabledAt).toLocaleDateString(
    langStore.lang === "id" ? "id-ID" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );
});

async function load() {
  loading.value = true;
  loadError.value = "";
  try {
    status.value = await getTwoFactorStatus();
  } catch (e) {
    loadError.value = t("twoFactor.card.loadFailed");
  } finally {
    loading.value = false;
  }
}

async function onSetupCompleted() {
  settingUp.value = false;
  emit("toast", { message: t("twoFactor.card.enabledOk"), type: "success" });
  await load();
}

function openConfirm(type) {
  Object.assign(modal, {
    open: true, type, password: "", code: "", showPassword: false, submitting: false, error: "",
  });
  newCodes.value = null;
}

function closeModal() {
  if (modal.submitting) return;
  modal.open = false;
  newCodes.value = null;
}

async function submitConfirm() {
  if (!modal.password || !modal.code.trim()) {
    modal.error = t("twoFactor.confirm.fieldsRequired");
    return;
  }
  modal.submitting = true;
  modal.error = "";
  try {
    if (modal.type === "disable") {
      await disableTwoFactor(modal.password, modal.code.trim());
      modal.open = false;
      emit("toast", { message: t("twoFactor.card.disabledOk"), type: "success" });
    } else {
      const res = await regenerateBackupCodes(modal.password, modal.code.trim());
      newCodes.value = res.backupCodes; // modal berpindah ke panel backup code
      emit("toast", { message: t("twoFactor.card.regenOk"), type: "success" });
    }
    await load();
  } catch (e) {
    const err = parseApiError(e);
    modal.error = err.message;
    if (err.code === "TWO_FACTOR_MANDATORY" || err.code === "TWO_FACTOR_NOT_ENABLED") await load();
  } finally {
    modal.submitting = false;
  }
}

onMounted(load);
</script>

<style scoped>
.tf-modal-enter-active, .tf-modal-leave-active { transition: opacity 0.3s ease; }
.tf-modal-enter-from, .tf-modal-leave-to { opacity: 0; }
</style>
