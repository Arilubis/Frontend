import api from "./api";

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data.data;
};

export const updateMyProfile = async (payload) => {
  const res = await api.put("/auth/me", payload);
  return res.data.data;
};

export const changeMyPassword = async (payload) => {
  const res = await api.patch("/auth/me/change-password", payload);
  return res.data;
};

// ===== ADMIN ENDPOINTS =====

// 🔥 PERUBAHAN 1: Tambah parameter limit untuk ambil semua data
export const fetchUserList = async (params = {}) => {
  const queryParams = new URLSearchParams({
    limit: params.limit || 1000, // ✅ TAMBAH: Default ambil 1000 data
    page: params.page || 1,
    ...params
  }).toString();
  
  const res = await api.get(`/users?${queryParams}`);
  return res.data.data;
};

export const createUser = async (payload) => {
  const res = await api.post("/users", payload);
  return res.data.data;
};

export const updateUser = async (id, payload) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data.data;
};

// 🔥 PERUBAHAN 2: Tambah fungsi force delete
export const forceDeleteUser = async (id) => {
  const res = await api.delete(`/users/${id}?force=true`);
  return res.data.data;
};

// ✅ FUNGSI STATUS BARU (GANTI YANG LAMA):
export const updateUserStatus = async (id, statusNumber) => {
  const res = await api.patch(`/users/${id}/status`, { status: statusNumber });
  return res.data.data;
};

export const activateUser = async (id) => {
  return updateUserStatus(id, 1); // 1 = ACTIVE
};

export const deactivateUser = async (id) => {
  return updateUserStatus(id, 2); // 2 = INACTIVE
};

export const freezeUser = async (id) => {
  return updateUserStatus(id, 3); // 3 = FREEZE
};

export const blockedUser = async (id) => {
  return updateUserStatus(id, 4); // 4 = BLOCKED
};

// RESET PASSWORD
export const resetPassword = async (id, newPassword) => {
  const res = await api.patch(`/users/${id}/reset-password`, { newPassword });
  return res.data.data;
};

export const resetPasswordByUsername = async (username, newPassword) => {
  const res = await api.post("/auth/reset-password-by-username", { username, newPassword });
  return res.data;
};

export const verifyAndSetPassword = async ({ token, password, confirmPassword }) => {
  const res = await api.post("/auth/verify/set-password", {
    token,
    password,
    confirmPassword
  });
  return res.data;
};

export const setupPassword = async ({ token, newPassword, confirmPassword }) => {
  const res = await api.post("/auth/reset-password", {   // ← BENAR
    token,
    newPassword: newPassword,
    confirmPassword
  });
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const uploadMyAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await api.put('/auth/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const deleteMyAvatar = async () => {
  const res = await api.delete('/auth/me/avatar');
  return res.data;
};

export const deleteMyAccount = async (password) => {
  const res = await api.delete("/users/me", { data: { password } });
  return res.data;
};