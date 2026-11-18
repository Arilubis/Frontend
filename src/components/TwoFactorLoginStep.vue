<template>
  <div>
    <!-- ═══════════ MODE: VERIFIKASI KODE ═══════════ -->
    <template v-if="mode === 'verify'">
      <div class="mb-8">
        <div class="hidden md:flex items-center gap-2 mb-2">
          <div class="h-[2px] w-6 bg-slate-300"></div>
          <span class="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{{ $t('login.secureAccess') }}</span>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-blue-400 shadow-lg shadow-slate-900/10">
            <span class="material-icons text-[22px]">verified_user</span>
          </div>
        </div>
        <h2 class="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-tight">
          {{ $t('twoFactor.verify.title') }}
        </h2>
        <p class="text-[13px] text-slate-500 font-normal mt-2 leading-relaxed">
          {{ useBackup ? $t('twoFactor.verify.backupDesc') : $t('twoFactor.verify.desc') }}
        </p>
      </div>

      <!-- Terkunci -->
      <transition name="tf-slide">
        <div v-if="lockedLeft > 0" class="mb-5 p-4 rounded-2xl text-[11px] font-bold flex items-start gap-3 border shadow-sm bg-amber-50 text-amber-700 border-amber-100">
          <span class="material-icons text-[18px] flex-shrink-0">lock_clock</span>
          <div class="font-medium">
            <p class="font-bold text-[12px] text-amber-800">{{ $t('twoFactor.verify.lockedTitle') }}</p>
            <p class="mt-0.5 text-[11px] font-medium text-amber-700">{{ $t('twoFactor.verify.lockedDesc').replace('{t}', lockedLabel) }}</p>
          </div>
        </div>
      </transition>

      <form @submit.prevent="submitVerify" class="space-y-5">
        <div :class="{ 'tf-shake': shake }">
          <input
            ref="codeInput"
            v-model="code"
            :inputmode="useBackup ? 'text' : 'numeric'"
            autocomplete="one-time-code"
            :maxlength="useBackup ? 16 : 7"
            :disabled="submitting || lockedLeft > 0"
            :placeholder="useBackup ? $t('twoFactor.verify.backupPlaceholder') : $t('twoFactor.verify.placeholder')"
            @input="onCodeInput"
            :class="[
              'w-full px-6 py-4 bg-slate-100 border rounded-xl transition-all outline-none focus:bg-white text-center font-medium text-slate-800 placeholder:text-slate-300',
              useBackup ? 'text-base tracking-[0.2em] uppercase' : 'text-xl tracking-[0.4em] placeholder:tracking-[0.4em]',
              error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-slate-900'
            ]"
          />
          <transition name="tf-slide">
            <p v-if="error" class="text-[10px] text-rose-500 font-medium mt-2 ml-1 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0"></span>{{ error }}
            </p>
          </transition>
        </div>

        <button
          type="submit"
          :disabled="submitting || lockedLeft > 0 || !code.trim()"
          class="w-full relative py-4 rounded-xl font-medium text-[13px] tracking-wide transition-all bg-slate-900 text-white shadow-lg hover:bg-slate-700 active:scale-[0.98] overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span class="relative z-10 flex items-center justify-center gap-3">
            <span v-if="submitting" class="flex items-center gap-3">
              <span class="tf-spinner"></span>{{ $t('twoFactor.verify.verifying') }}
            </span>
            <span v-else>{{ $t('twoFactor.verify.submit') }}</span>
          </span>
        </button>

        <div class="flex flex-col items-center gap-3 pt-1">
          <button type="button" @click="toggleBackup" :disabled="submitting"
            class="text-[12px] text-slate-500 hover:text-slate-900 transition-colors font-medium">
            {{ useBackup ? $t('twoFactor.verify.useApp') : $t('twoFactor.verify.useBackup') }}
          </button>
          <button type="button" @click="$emit('cancel')" :disabled="submitting"
            class="text-[11px] text-slate-400 hover:text-slate-700 transition-colors font-normal flex items-center gap-1">
            <span class="material-icons text-[14px]">arrow_back</span>{{ $t('twoFactor.verify.back') }}
          </button>
        </div>
      </form>

      <p class="mt-8 text-[10px] text-slate-400 text-center leading-relaxed">{{ $t('twoFactor.verify.help') }}</p>
    </template>

    <!-- ═══════════ MODE: SETUP PAKSA ═══════════ -->
    <template v-else>
      <div class="mb-6">
        <div class="hidden md:flex items-center gap-2 mb-2">
          <div class="h-[2px] w-6 bg-slate-300"></div>
          <span class="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{{ $t('login.secureAccess') }}</span>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-blue-400 shadow-lg shadow-slate-900/10">
            <span class="material-icons text-[22px]">shield</span>
          </div>
        </div>
        <h2 class="text-2xl font-semibold text-slate-900 tracking-tight leading-tight">
          {{ $t('twoFactor.setup.forcedTitle') }}
        </h2>
        <p class="text-[13px] text-slate-500 font-normal mt-2 leading-relaxed">
          {{ $t('twoFactor.setup.forcedDesc') }}
        </p>
      </div>

      <TwoFactorSetupFlow
        :setup-token="setupToken"
        stacked
        show-cancel
        @completed="(r) => $emit('authenticated', r.user)"
        @cancel="$emit('cancel')"
        @token-invalid="(msg) => $emit('cancel', msg)"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import TwoFactorSetupFlow from "./TwoFactorSetupFlow.vue";
import { verifyTwoFactorLogin, parseApiError } from "@/services/twoFactor";
import { useLangStore } from "@/stores/langStore";

const props = defineProps({
  mode: { type: String, default: "verify" }, // 'verify' | 'setup'
  challengeToken: { type: String, default: "" },
  setupToken: { type: String, default: "" },
});
// authenticated(user): sesi sudah dibuat backend (cookie). cancel(message?): kembali ke form login.
const emit = defineEmits(["authenticated", "cancel"]);

const code = ref("");
const error = ref("");
const submitting = ref(false);
const useBackup = ref(false);
const shake = ref(false);
const codeInput = ref(null);

// ── hitung mundur saat terkunci ──
const lockedLeft = ref(0);
let lockTimer = null;

const lockedLabel = computed(() => {
  const m = Math.floor(lockedLeft.value / 60);
  const s = lockedLeft.value % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
});

function startLock(err) {
  let seconds = 0;
  if (err.retryAfter) seconds = Math.ceil((new Date(err.retryAfter).getTime() - Date.now()) / 1000);
  if (!seconds || seconds < 0) seconds = (err.remainingMinutes || 15) * 60;
  lockedLeft.value = seconds;
  clearInterval(lockTimer);
  lockTimer = setInterval(() => {
    if (lockedLeft.value > 0) lockedLeft.value -= 1;
    if (lockedLeft.value <= 0) {
      clearInterval(lockTimer);
      error.value = "";
    }
  }, 1000);
}

function triggerShake() {
  shake.value = true;
  setTimeout(() => (shake.value = false), 500);
}

function onCodeInput() {
  error.value = "";
  if (useBackup.value) {
    code.value = code.value.toUpperCase();
    return;
  }
  const digits = code.value.replace(/\D/g, "").slice(0, 6);
  code.value = digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits;
  if (digits.length === 6) submitVerify(); // auto-submit untuk kode 6 digit
}

function toggleBackup() {
  useBackup.value = !useBackup.value;
  code.value = "";
  error.value = "";
  nextTick(() => codeInput.value?.focus());
}

async function submitVerify() {
  if (submitting.value || lockedLeft.value > 0) return;
  if (!code.value.trim()) {
    error.value = useLangStore().t("twoFactor.verify.codeRequired");
    return;
  }
  submitting.value = true;
  error.value = "";
  try {
    const { user } = await verifyTwoFactorLogin(props.challengeToken, code.value.trim());
    emit("authenticated", user);
  } catch (e) {
    const err = parseApiError(e);
    switch (err.code) {
      case "TWO_FACTOR_TOKEN_INVALID":
      case "ACCOUNT_NOT_ACTIVE":
        emit("cancel", err.message); // token kedaluwarsa / akun tidak aktif → ulang dari login
        return;
      case "TWO_FACTOR_LOCKED":
        startLock(err);
        error.value = "";
        break;
      default:
        error.value = err.message;
    }
    triggerShake();
    code.value = "";
    await nextTick();
    codeInput.value?.focus();
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  if (props.mode === "verify") nextTick(() => codeInput.value?.focus());
});
onBeforeUnmount(() => clearInterval(lockTimer));
</script>

<style scoped>
.tf-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: tf-spin 0.6s linear infinite;
}
@keyframes tf-spin { to { transform: rotate(360deg); } }

@keyframes tf-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
.tf-shake { animation: tf-shake 0.2s ease-in-out 0s 2; }

.tf-slide-enter-active, .tf-slide-leave-active { transition: all 0.4s ease; }
.tf-slide-enter-from { opacity: 0; transform: translateY(10px); }
.tf-slide-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
