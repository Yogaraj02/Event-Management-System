import API from "../api/axios";

export const eventService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/events${query ? `?${query}` : ""}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await API.get(`/events/${id}`);
    return res.data;
  },
  create: async (eventData) => {
    const res = await API.post("/events", eventData);
    return res.data;
  },
  update: async (id, eventData) => {
    const res = await API.put(`/events/${id}`, eventData);
    return res.data;
  },
  delete: async (id) => {
    const res = await API.delete(`/events/${id}`);
    return res.data;
  },
};
