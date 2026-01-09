import api from "src/api/axios";

/**
 * Doctor/User interface for clinic staff
 * Based on backend users.User model
 */
export interface Doctor {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string; // Read-only computed field
  role: 'DOCTOR' | 'ASSISTANT' | 'ADMIN';
}

/**
 * Doctor resource for Syncfusion Scheduler
 */
export interface DoctorResource {
  id: number;
  username: string;
  full_name?: string;
  color?: string; // Assign a color per doctor for calendar
}

/**
 * Backend response structure
 */
interface DoctorResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
}

export const doctorService = {
  /**
   * Get all doctors for Syncfusion Scheduler resource grouping
   * This calls the tenant-aware user endpoint
   */
  getClinicDoctors: async (): Promise<DoctorResource[]> => {
    try {
      const { data } = await api.get<DoctorResponse[]>("/auth/users/?role=DOCTOR");
      
      return data.map((d, index) => ({
        id: d.id,
        username: d.username,
        full_name: d.full_name || d.username,
        // Assign specific colors for the calendar UI
        color: index === 0 ? "#422afb" : index === 1 ? "#01b574" : "#ff6b6b",
      }));
    } catch (error: any) {
      console.error("Failed to fetch clinic doctors:", error.response?.data || error.message);
      return [];
    }
  },

  /**
   * Get all doctors in the current clinic (full details)
   */
  getDoctors: async (): Promise<Doctor[]> => {
    try {
      const { data } = await api.get<DoctorResponse[]>("/auth/users/");

      // Filter to only include doctors (not assistants)
      return data
        .filter((user) => user.role === 'DOCTOR')
        .map((d) => ({
          id: d.id,
          username: d.username,
          first_name: d.first_name,
          last_name: d.last_name,
          full_name: d.full_name,
          role: d.role as Doctor['role'],
        }));
    } catch (error: any) {
      console.error("Failed to fetch doctors:", error.response?.data || error.message);
      return [];
    }
  },

  /**
   * Get all clinic staff (doctors + assistants + admins)
   */
  getAllStaff: async (): Promise<Doctor[]> => {
    try {
      const { data } = await api.get<DoctorResponse[]>("/auth/users/");

      return data.map((d) => ({
        id: d.id,
        username: d.username,
        first_name: d.first_name,
        last_name: d.last_name,
        full_name: d.full_name,
        role: d.role as Doctor['role'],
      }));
    } catch (error: any) {
      console.error("Failed to fetch staff:", error.response?.data || error.message);
      return [];
    }
  },

  /**
   * Get a specific doctor/user by ID
   */
  getDoctorById: async (id: number): Promise<Doctor | null> => {
    try {
      const { data } = await api.get<DoctorResponse>(`/auth/users/${id}/`);

      return {
        id: data.id,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: data.full_name,
        role: data.role as Doctor['role'],
      };
    } catch (error: any) {
      console.error("Failed to fetch doctor:", error.response?.data || error.message);
      return null;
    }
  },
};
