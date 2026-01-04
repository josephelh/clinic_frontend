import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "src/store/useAuthStore";

const api = axios.create({
  // This automatically uses the current host (localhost or atlas.localhost)
  baseURL: `http://${window.location.hostname}:8000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const fullPath = `${config.baseURL ?? ""}${config.url ?? ""}`;
    console.log("🚀 API Request starting to:", fullPath);

    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Setup Error:", error);
    return Promise.reject(error);
  }
);

export default api;
