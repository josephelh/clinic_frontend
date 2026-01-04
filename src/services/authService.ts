import api from "src/api/axios";
import { useAuthStore } from "src/store/useAuthStore";
import { LoginCredentials, LoginResponse } from "src/types/auth";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<void> => {
    try {
      // If login is strictly on localhost:8000 (Public Schema),
      // we ensure the call goes there.
      const response = await api.post<LoginResponse>(
        "/auth/login/",
        credentials
      );

      // Store the flat response directly into Zustand
      useAuthStore.getState().setAuth(response.data);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.detail ||
        "Nom d'utilisateur ou mot de passe incorrect";
      throw new Error(errorMsg);
    }
  },

  logout: () => {
    authService.logout();
  },
};
