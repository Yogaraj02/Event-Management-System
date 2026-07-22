import API from "../api/axios";

export const authService = {
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
  },
  register: async (name, email, password, phone) => {
    const res = await API.post("/auth/register", { name, email, password, phone });
    return res.data;
  },
  logout: async () => {
    const res = await API.post("/auth/logout");
    return res.data;
  },
  getProfile: async () => {
    const res = await API.get("/auth/profile");
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await API.put("/auth/profile", data);
    return res.data;
  },
};
