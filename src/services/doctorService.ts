import api from "src/api/axios";

export interface DoctorResource {
  id: number;
  username: string;
  full_name?: string;
  color?: string; // We can assign a color per doctor
}

export const doctorService = {
  getClinicDoctors: async (): Promise<DoctorResource[]> => {
    // This calls your tenant-aware user endpoint
    const { data } = await api.get("/auth/users/?role=DOCTOR");
    return data.map((d: any, index: number) => ({
      id: d.id,
      username: d.username,
      full_name: d.full_name || d.username,
      // Assign specific colors for the UI
      color: index === 0 ? "#422afb" : "#01b574",
    }));
  },
};
