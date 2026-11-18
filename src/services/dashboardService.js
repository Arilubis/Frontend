import api from "./api";

// Get dashboard statistics
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data.data;
};

// Get document flow chart data
export const getDocumentFlowChart = async (period = 'week') => {
  const res = await api.get(`/dashboard/chart?period=${period}`);
  return res.data.data;
};

// Get activity logs
export const getActivityLogs = async (params = {}) => {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...params
  }).toString();
  
  const res = await api.get(`/dashboard/activities?${queryParams}`);
  return res.data;
};

export default {
  getDashboardStats,
  getDocumentFlowChart,
  getActivityLogs
};