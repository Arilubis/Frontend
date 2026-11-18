// src/services/twoFactor.js
// Semua panggilan API 2FA (TOTP) + helper pembaca error.
import api from "./api";

/**
 * Backend menaruh kode error spesifik 2FA di `data[0].code`
 * (bukan `errors[0].code`, yang hanya berisi "ERROR").
 * Error rate-limit (429) menaruh kodenya di `errors[0].code`.
 */
export function parseApiError(err) {
  const res = err?.response;
  const body = res?.data ?? {};
  const detail = Array.isArray(body.data) ? body.data[0] : undefined;
  const first = detail ?? body.errors?.[0] ?? {};
  return {
    status: res?.status ?? 0,
    code: first.code ?? "UNKNOWN",
    message: first.message ?? body.message ?? err?.message ?? "Terjadi kesalahan",
    remainingAttempts: detail?.remainingAttempts,
    remainingMinutes: detail?.remainingMinutes,
    retryAfter: detail?.retryAfter,
    missing: detail?.missing,
  };
}

/**
 * Menentukan langkah 2FA dari `data` response POST /auth/login.
 * Kontrak backend (auth.controller.login):
 *   - 2FA diperlukan : { twoFactorRequired: true, method: "TOTP", challengeToken }
 *   - wajib enroll   : { twoFactorSetupRequired: true, setupToken }
 *   - login biasa    : { user }
 * Deteksi utama memakai KEBERADAAN TOKEN (paling andal), flag dipakai sebagai cadangan.
 * @returns {"verify"|"setup"|null}
 */
export function detectTwoFactorStage(payload) {
  if (!payload || payload.user) return null;
  if (payload.challengeToken || payload.twoFactorRequired) return "verify";
  if (payload.setupToken || payload.twoFactorSetupRequired) return "setup";
  return null;
}

// ── LOGIN ────────────────────────────────────────────────────────────────
export const verifyTwoFactorLogin = async (challengeToken, code) => {
  const res = await api.post("/auth/2fa/verify", { challengeToken, code });
  return res.data.data; // { user }
};

// ── SETUP (setupToken = enrollment paksa saat login; tanpa token = self-service)
export const setupInit = async (setupToken) => {
  const res = await api.post("/auth/2fa/setup/init", setupToken ? { setupToken } : {});
  return res.data.data; // { secret, otpauthUrl, qrCodeDataUrl, expiresInSeconds }
};

export const setupConfirm = async (code, setupToken) => {
  const res = await api.post(
    "/auth/2fa/setup/confirm",
    setupToken ? { setupToken, code } : { code }
  );
  return res.data.data; // { backupCodes, user? }
};

// ── SELF-SERVICE ─────────────────────────────────────────────────────────
export const getTwoFactorStatus = async () => {
  const res = await api.get("/auth/2fa/status");
  return res.data.data;
};

export const disableTwoFactor = async (password, code) => {
  const res = await api.post("/auth/2fa/disable", { password, code });
  return res.data;
};

export const regenerateBackupCodes = async (password, code) => {
  const res = await api.post("/auth/2fa/backup-codes/regenerate", { password, code });
  return res.data.data; // { backupCodes }
};

// ── ADMIN ────────────────────────────────────────────────────────────────
export const getTwoFactorPolicy = async () => {
  const res = await api.get("/auth/2fa/admin/policy");
  return res.data.data;
};

export const updateTwoFactorPolicy = async (payload) => {
  const res = await api.put("/auth/2fa/admin/policy", payload);
  return res.data.data;
};

export const resetUserTwoFactor = async (userId) => {
  const res = await api.post(`/auth/2fa/admin/users/${userId}/reset`);
  return res.data;
};
