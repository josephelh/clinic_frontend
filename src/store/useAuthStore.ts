import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthUser } from "src/types/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (response: import("src/types/auth").LoginResponse) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setAuth: (data) => {
        console.log("💾 Storing auth data:", {
          username: data.username,
          role: data.role,
          clinic_id: data.clinic_id,
        });

        set({
          user: {
            username: data.username,
            role: data.role,
            clinic_id: data.clinic_id,
          },
          token: data.access,
          refreshToken: data.refresh,
          isAuthenticated: true,
        });

        // Store clinic_id for tenant validation
        localStorage.setItem("clinic_id", data.clinic_id.toString());
      },
      logout: () => {
        console.log("🚪 Clearing auth state...");
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        
        // Clear all auth-related localStorage
        localStorage.removeItem("surgery-auth-storage");
        localStorage.removeItem("clinic_id");
        localStorage.removeItem("clinic_subdomain");
        
        console.log("✅ Logout complete");
      },
    }),
    {
      name: "surgery-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        console.log("♻️ Rehydrating auth state from localStorage...");
        state?.setHasHydrated(true);
      },
    }
  )
);
