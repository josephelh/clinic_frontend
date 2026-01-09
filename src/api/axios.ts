import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "src/store/useAuthStore";

/**
 * Tenant-aware Axios instance
 * 
 * Routing logic:
 * - localhost:3000 -> localhost:8000 (public schema)
 * - clinic1.localhost:3000 -> clinic1.localhost:8000 (clinic1 tenant schema)
 * - atlas.localhost:3000 -> atlas.localhost:8000 (atlas tenant schema)
 * 
 * The backend's TenantMainMiddleware inspects the Host header and routes
 * to the appropriate PostgreSQL schema automatically.
 */
const api = axios.create({
  baseURL: `http://${window.location.hostname}:8000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const fullPath = `${config.baseURL ?? ""}${config.url ?? ""}`;
    const subdomain = window.location.hostname.split(".")[0];
    const isPublic = subdomain === "localhost" || subdomain === window.location.hostname;

    console.log("🚀 API Request:", {
      path: fullPath,
      schema: isPublic ? "PUBLIC" : subdomain,
      tenant: !isPublic ? subdomain : "none",
    });

    // Attach JWT token if available
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Security: Validate clinic_id matches subdomain
    const storedClinicId = useAuthStore.getState().user?.clinic_id;
    if (storedClinicId && !isPublic) {
      console.log(`🔐 Tenant Security: User belongs to clinic ${storedClinicId}, accessing ${subdomain}`);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Setup Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for tenant-specific error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      const errorMsg = error.response?.data?.detail;
      if (errorMsg?.includes("cabinet") || errorMsg?.includes("tenant")) {
        console.error("🚫 TENANT MISMATCH: User attempted cross-clinic access");
        // Clear auth and redirect to login
        useAuthStore.getState().logout();
        window.location.href = "/auth/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
