import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

const api = axios.create({
  baseURL: endPoint,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("_au_ad") || localStorage.getItem("_au_pr");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
