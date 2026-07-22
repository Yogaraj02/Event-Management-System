import API from "../api/axios";

export const userService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/users${query ? `?${query}` : ""}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await API.get(`/users/${id}`);
    return res.data;
  },
  update: async (id, userData) => {
    const res = await API.put(`/users/${id}`, userData);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/users/${id}`);
    return res.data;
  },
};
