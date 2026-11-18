import api from "./api";

export const loginUser = (username, password) => {
  return api.post("/auth/login", {
    username,
    password
  });
};

export const logoutUser = () => {
  // jika backend ada endpoint logout yang membersihkan cookie/session
  return api.post("/auth/logout");
};

export const resetPasswordRequest = (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const getMe = async () => {
  return api.get("/auth/me");
};

