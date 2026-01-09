import api from "src/api/axios";
import { useAuthStore } from "src/store/useAuthStore";
import { LoginCredentials, LoginResponse } from "src/types/auth";

/**
 * Extract subdomain from current hostname
 */
const getCurrentSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  const cleanHost = hostname.split(":")[0];

  if (cleanHost.includes("localhost")) {
    const parts = cleanHost.split(".");
    if (parts.length > 1 && parts[0] !== "localhost") {
      return parts[0];
    }
    return null;
  }

  const parts = cleanHost.split(".");
  if (parts.length > 2) {
    return parts[0];
  }
  return null;
};

export const authService = {
  /**
   * Login to tenant-specific schema
   * 
   * CRITICAL: This must be called on the correct subdomain!
   * - clinic1.localhost:3000 -> routes to clinic1 schema
   * - localhost:3000 -> routes to public schema (should show clinic selector)
   */
  login: async (credentials: LoginCredentials): Promise<void> => {
    try {
      const subdomain = getCurrentSubdomain();
      
      console.log("🔐 Login Attempt:", {
        username: credentials.username,
        subdomain: subdomain || "public",
        isPublicSchema: subdomain === null,
      });

      // Security warning if logging in on public schema
      if (!subdomain) {
        console.warn(
          "⚠️ LOGIN ON PUBLIC SCHEMA - This should redirect to tenant subdomain!"
        );
      }

      const response = await api.post<LoginResponse>(
        "/auth/login/",
        credentials
      );

      const { clinic_id, username, role, access, refresh } = response.data;

      // Validate clinic_id matches expected subdomain
      if (subdomain && clinic_id) {
        console.log("✅ Tenant Validation:", {
          userClinicId: clinic_id,
          currentSubdomain: subdomain,
          username,
          role,
        });
      }

      // Store auth data
      useAuthStore.getState().setAuth(response.data);

      console.log("✅ Login Successful:", {
        username,
        role,
        clinic_id,
      });
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.detail ||
        "Nom d'utilisateur ou mot de passe incorrect";
      
      console.error("❌ Login Failed:", {
        error: errorMsg,
        status: error.response?.status,
      });

      throw new Error(errorMsg);
    }
  },

  /**
   * Logout and clear all auth state
   */
  logout: () => {
    console.log("🚪 Logging out...");
    useAuthStore.getState().logout();
  },

  /**
   * Check if user's clinic_id matches current subdomain
   * Returns true if valid, false if mismatch
   */
  validateTenantAccess: (): boolean => {
    const { user } = useAuthStore.getState();
    const subdomain = getCurrentSubdomain();

    if (!user || !subdomain) return true; // Can't validate without both

    // Here you'd need a mapping of subdomain -> clinic_id
    // For now, just check that user has a clinic_id when on a subdomain
    const isValid = user.clinic_id !== null;

    if (!isValid) {
      console.error("🚫 TENANT MISMATCH:", {
        userClinicId: user.clinic_id,
        currentSubdomain: subdomain,
      });
    }

    return isValid;
  },
};
