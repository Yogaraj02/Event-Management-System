import API from "../api/axios";

export const reportService = {
  getDashboardStats: async () => {
    const res = await API.get("/reports/dashboard");
    return res.data;
  },
  getEventStats: async () => {
    const res = await API.get("/reports/events");
    return res.data;
  },
};
