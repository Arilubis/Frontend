<template>
  <div class="space-y-5">
    <div class="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
      <div class="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-600">
        <span class="material-icons text-[20px]">key</span>
      </div>
      <div>
        <h4 class="text-[13px] font-semibold text-amber-900">{{ $t('twoFactor.backup.title') }}</h4>
        <p class="text-[11px] text-amber-700 leading-relaxed font-normal mt-0.5">
          {{ $t('twoFactor.backup.desc') }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div
        v-for="c in codes"
        :key="c"
        class="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-[13px] tracking-wider text-slate-800 select-all"
      >
        {{ c }}
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        @click="copyAll"
        class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-medium hover:bg-slate-50 transition-all"
      >
        <span class="material-icons text-[16px]">{{ copied ? 'check' : 'content_copy' }}</span>
        {{ copied ? $t('twoFactor.setup.copied') : $t('twoFactor.backup.copyAll') }}
      </button>
      <button
        type="button"
        @click="download"
        class="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-medium hover:bg-slate-50 transition-all"
      >
        <span class="material-icons text-[16px]">download</span>
        {{ $t('twoFactor.backup.download') }}
      </button>
    </div>

    <label class="flex items-start gap-3 cursor-pointer select-none">
      <input type="checkbox" v-model="saved" class="mt-0.5 w-4 h-4 accent-slate-900 rounded" />
      <span class="text-[12px] text-slate-600 font-normal leading-snug">{{ $t('twoFactor.backup.confirm') }}</span>
    </label>

    <button
      type="button"
      :disabled="!saved"
      @click="$emit('done')"
      class="w-full py-3.5 rounded-xl font-medium text-[13px] tracking-wide bg-slate-900 text-white shadow-lg hover:bg-slate-700 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
    >
      {{ $t('twoFactor.backup.continue') }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  codes: { type: Array, required: true },
});
defineEmits(["done"]);

const saved = ref(false);
const copied = ref(false);

async function copyAll() {
  const text = props.codes.join("\n");
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback untuk konteks non-HTTPS
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

function download() {
  const header = "Authorix - 2FA Backup Codes\nSetiap kode hanya berlaku satu kali.\n\n";
  const blob = new Blob([header + props.codes.join("\n") + "\n"], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "authorix-2fa-backup-codes.txt";
  a.click();
  URL.revokeObjectURL(url);
}
</script>
