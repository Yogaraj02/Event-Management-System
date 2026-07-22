import API from "../api/axios";

export const registrationService = {
  register: async (eventId) => {
    const res = await API.post(`/registrations/${eventId}`);
    return res.data;
  },
  cancel: async (eventId) => {
    const res = await API.delete(`/registrations/${eventId}`);
    return res.data;
  },
  getMyRegistrations: async () => {
    const res = await API.get("/registrations/my");
    return res.data;
  },
  getAllParticipants: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/registrations/all${query ? `?${query}` : ""}`);
    return res.data;
  },
  getEventParticipants: async (eventId) => {
    const res = await API.get(`/registrations/event/${eventId}`);
    return res.data;
  },
  updateParticipant: async (userId, data) => {
    const res = await API.put(`/registrations/participant/${userId}`, data);
    return res.data;
  },
  removeFromEvent: async (registrationId) => {
    const res = await API.delete(`/registrations/${registrationId}/remove`);
    return res.data;
  },
  deleteParticipant: async (userId) => {
    const res = await API.delete(`/registrations/participant/${userId}`);
    return res.data;
  },
};
