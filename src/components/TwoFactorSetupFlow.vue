<template>
  <div>
    <!-- LANGKAH 3: Backup code -->
    <BackupCodesPanel
      v-if="backupCodes"
      :codes="backupCodes"
      @done="$emit('completed', { user: resultUser, backupCodes })"
    />

    <!-- Memuat QR -->
    <div v-else-if="loading" class="py-12 flex flex-col items-center gap-3">
      <div class="w-8 h-8 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
      <p class="text-[12px] text-slate-500">{{ $t('twoFactor.setup.preparing') }}</p>
    </div>

    <!-- Gagal init -->
    <div v-else-if="initError" class="space-y-4">
      <div class="p-4 rounded-2xl text-[12px] font-medium flex items-start gap-3 border bg-rose-50 text-rose-600 border-rose-100">
        <span class="material-icons text-[18px]">error_outline</span>
        <span>{{ initError }}</span>
      </div>
      <div class="flex gap-2">
        <button type="button" @click="init" class="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[12px] font-medium hover:bg-slate-800 transition-all">
          {{ $t('common.retry') }}
        </button>
        <button v-if="showCancel" type="button" @click="$emit('cancel')" class="px-5 py-2.5 rounded-xl text-slate-500 text-[12px] hover:text-slate-700 transition-all">
          {{ $t('twoFactor.setup.cancel') }}
        </button>
      </div>
    </div>

    <!-- LANGKAH 1 & 2: QR + kode -->
    <div v-else-if="qr" class="space-y-6">
      <div>
        <p class="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-3">1 · {{ $t('twoFactor.setup.chooseApp') }}</p>

        <!-- Pilihan aplikasi Authenticator -->
        <div class="grid grid-cols-2 gap-2 mb-4" role="tablist">
          <button
            v-for="a in apps" :key="a.id" type="button" role="tab"
            :aria-selected="appChoice === a.id"
            :data-app="a.id"
            @click="appChoice = a.id"
            class="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border-2 text-left transition-all outline-none"
            :class="appChoice === a.id
              ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20'
              : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-200'"
          >
            <span class="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-black flex-shrink-0"
                  :class="appChoice === a.id ? 'bg-slate-900 text-blue-400' : 'bg-white text-slate-400 border border-slate-200'">
              {{ a.letter }}
            </span>
            <span class="text-[12px] font-semibold text-slate-800 leading-tight">{{ $t('twoFactor.setup.apps.' + a.id + '.name') }}</span>
          </button>
        </div>

        <!-- Langkah sesuai aplikasi terpilih -->
        <ol class="space-y-1.5 mb-3" data-testid="app-steps">
          <li v-for="n in 3" :key="n" class="flex items-start gap-2.5 text-[12px] text-slate-600 font-normal leading-relaxed">
            <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">{{ n }}</span>
            <span>{{ $t('twoFactor.setup.apps.' + appChoice + '.s' + n) }}</span>
          </li>
        </ol>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-[11px] text-slate-400">
          <span>{{ $t('twoFactor.setup.getApp') }}</span>
          <a :href="currentApp.android" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors">
            <span class="material-icons text-[14px]">android</span>Android
          </a>
          <a :href="currentApp.ios" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors">
            <span class="material-icons text-[14px]">phone_iphone</span>iOS
          </a>
        </div>

        <div class="flex flex-col items-center gap-5" :class="stacked ? '' : 'sm:flex-row sm:items-start'">
          <div class="relative flex-shrink-0">
            <img
              :src="qr.qrCodeDataUrl"
              alt="QR Code 2FA"
              class="w-44 h-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
              :class="{ 'opacity-20 blur-[2px]': expired }"
            />
            <div v-if="expired" class="absolute inset-0 flex items-center justify-center">
              <button type="button" @click="init" class="px-4 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-medium shadow-lg">
                {{ $t('twoFactor.setup.newQr') }}
              </button>
            </div>
          </div>

          <div class="flex-1 w-full min-w-0 space-y-3" :class="stacked ? 'text-center' : ''">
            <p class="text-[10px] text-slate-400 font-medium">{{ $t('twoFactor.setup.sameQr') }}</p>
            <p class="text-[11px] text-slate-500 font-normal">{{ $t('twoFactor.setup.manual') }}</p>
            <div class="flex items-center gap-2 text-left">
              <code class="flex-1 min-w-0 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-mono text-slate-700 tracking-wider break-all select-all">
                {{ formattedSecret }}
              </code>
              <button
                type="button"
                @click="copySecret"
                class="flex-shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[11px] font-medium hover:bg-slate-50 transition-all"
              >
                <span class="material-icons text-[15px]">{{ secretCopied ? 'check' : 'content_copy' }}</span>
                {{ secretCopied ? $t('twoFactor.setup.copied') : $t('twoFactor.setup.copy') }}
              </button>
            </div>
            <p class="text-[10px] text-slate-400 leading-snug">{{ $t('twoFactor.setup.apps.' + appChoice + '.manualHint') }}</p>
            <a :href="qr.otpauthUrl" class="md:hidden inline-flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
              <span class="material-icons text-[14px]">open_in_new</span>{{ $t('twoFactor.setup.openInApp') }}
            </a>
            <p v-if="expired" class="text-[11px] text-rose-500 font-medium">{{ $t('twoFactor.setup.expired') }}</p>
            <p v-else class="text-[10px] text-slate-400">
              {{ $t('twoFactor.setup.expiresIn').replace('{t}', countdownLabel) }}
            </p>
          </div>
        </div>
      </div>

      <div class="h-px bg-slate-100"></div>

      <form @submit.prevent="confirm" class="space-y-3">
        <div>
          <p class="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1">2 · {{ $t('twoFactor.setup.step2') }}</p>
          <p class="text-[12px] text-slate-500 font-normal leading-relaxed">{{ $t('twoFactor.setup.step2Desc') }}</p>
        </div>

        <input
          ref="codeInput"
          v-model="code"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="7"
          :disabled="submitting || expired"
          :placeholder="$t('twoFactor.verify.placeholder')"
          @input="onCodeInput"
          :class="[
            'w-full px-6 py-4 bg-slate-100 border rounded-xl transition-all outline-none focus:bg-white text-center text-xl font-medium tracking-[0.4em] text-slate-800 placeholder:text-slate-300 placeholder:tracking-[0.4em]',
            error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-slate-900'
          ]"
        />

        <transition name="tf-fade">
          <p v-if="error" class="text-[11px] text-rose-500 font-medium flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0"></span>{{ error }}
          </p>
        </transition>

        <div class="flex items-center gap-3 pt-1">
          <button
            type="submit"
            :disabled="submitting || expired || !isSixDigits"
            class="flex-1 py-3.5 rounded-xl font-medium text-[13px] tracking-wide bg-slate-900 text-white shadow-lg hover:bg-slate-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            <span v-if="submitting" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ submitting ? $t('twoFactor.setup.activating') : $t('twoFactor.setup.activate') }}
          </button>
          <button
            v-if="showCancel"
            type="button"
            @click="$emit('cancel')"
            :disabled="submitting"
            class="px-5 py-3.5 text-slate-400 text-[12px] hover:text-slate-600 transition-all"
          >
            {{ $t('twoFactor.setup.cancel') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import BackupCodesPanel from "./BackupCodesPanel.vue";
import { setupInit, setupConfirm, parseApiError } from "@/services/twoFactor";

const props = defineProps({
  // Ada = enrollment paksa saat login (belum punya sesi). Kosong = self-service.
  setupToken: { type: String, default: "" },
  showCancel: { type: Boolean, default: false },
  // true = QR di atas & kunci manual selebar penuh (untuk kolom sempit seperti halaman login)
  stacked: { type: Boolean, default: false },
});
// completed: backup code sudah dikonfirmasi user. expiredToken: setupToken tidak valid lagi.
const emit = defineEmits(["completed", "cancel", "token-invalid"]);

// Google & Microsoft Authenticator memakai standar TOTP yang sama → QR sama; pilihan ini hanya mengubah panduan.
const apps = [
  {
    id: "google", letter: "G",
    android: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
    ios: "https://apps.apple.com/app/google-authenticator/id388497605",
  },
  {
    id: "microsoft", letter: "M",
    android: "https://play.google.com/store/apps/details?id=com.azure.authenticator",
    ios: "https://apps.apple.com/app/microsoft-authenticator/id983156458",
  },
];
const appChoice = ref(localStorage.getItem("tf_app") === "microsoft" ? "microsoft" : "google");
const currentApp = computed(() => apps.find((a) => a.id === appChoice.value));
watch(appChoice, (v) => localStorage.setItem("tf_app", v));

const loading = ref(true);
const initError = ref("");
const qr = ref(null);
const code = ref("");
const error = ref("");
const submitting = ref(false);
const backupCodes = ref(null);
const resultUser = ref(null);
const secretCopied = ref(false);
const codeInput = ref(null);

const secondsLeft = ref(0);
let timer = null;

const expired = computed(() => !!qr.value && secondsLeft.value <= 0);
const isSixDigits = computed(() => /^\d{3}\s?\d{3}$/.test(code.value.trim()));
const formattedSecret = computed(() =>
  (qr.value?.secret || "").replace(/(.{4})/g, "$1 ").trim()
);
const countdownLabel = computed(() => {
  const m = Math.floor(secondsLeft.value / 60);
  const s = secondsLeft.value % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
});

function startTimer(seconds) {
  clearInterval(timer);
  secondsLeft.value = seconds;
  timer = setInterval(() => {
    if (secondsLeft.value > 0) secondsLeft.value -= 1;
    else clearInterval(timer);
  }, 1000);
}

async function init() {
  loading.value = true;
  initError.value = "";
  error.value = "";
  code.value = "";
  try {
    qr.value = await setupInit(props.setupToken || undefined);
    startTimer(qr.value.expiresInSeconds || 600);
    await nextTick();
    codeInput.value?.focus();
  } catch (e) {
    const err = parseApiError(e);
    qr.value = null;
    if (err.code === "TWO_FACTOR_TOKEN_INVALID") return emit("token-invalid", err.message);
    initError.value = err.message;
  } finally {
    loading.value = false;
  }
}

function onCodeInput() {
  error.value = "";
  // hanya angka + satu spasi opsional di tengah
  const digits = code.value.replace(/\D/g, "").slice(0, 6);
  code.value = digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits;
  if (digits.length === 6) confirm();
}

async function confirm() {
  if (submitting.value || !isSixDigits.value || expired.value) return;
  submitting.value = true;
  error.value = "";
  try {
    const res = await setupConfirm(code.value.trim(), props.setupToken || undefined);
    resultUser.value = res.user || null;
    clearInterval(timer);
    backupCodes.value = res.backupCodes;
  } catch (e) {
    const err = parseApiError(e);
    if (err.code === "TWO_FACTOR_TOKEN_INVALID") return emit("token-invalid", err.message);
    if (err.code === "TWO_FACTOR_SETUP_EXPIRED") {
      secondsLeft.value = 0; // tampilkan tombol "Buat QR baru"
      error.value = err.message;
    } else {
      // TWO_FACTOR_INVALID / TWO_FACTOR_LOCKED / lainnya: pesan backend sudah memuat sisa percobaan
      error.value = err.message;
    }
    code.value = "";
    await nextTick();
    codeInput.value?.focus();
  } finally {
    submitting.value = false;
  }
}

async function copySecret() {
  try {
    await navigator.clipboard.writeText(qr.value.secret);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = qr.value.secret;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  secretCopied.value = true;
  setTimeout(() => (secretCopied.value = false), 2000);
}

onMounted(init);
onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.tf-fade-enter-active, .tf-fade-leave-active { transition: all 0.3s ease; }
.tf-fade-enter-from, .tf-fade-leave-to { opacity: 0; transform: translateY(4px); }
</style>
