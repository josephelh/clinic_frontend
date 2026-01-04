export interface LoginCredentials {
  username: string; // Changed from email
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  role: "DOCTOR" | "ASSISTANT" | "ADMIN";
  clinic_id: number;
  username: string;
}

// Internal User state for Zustand
export interface AuthUser {
  username: string;
  role: "DOCTOR" | "ASSISTANT" | "ADMIN";
  clinic_id: number;
}
