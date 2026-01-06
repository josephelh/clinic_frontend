import api from "src/api/axios";

export interface Patient {
  id: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  insurance_type?: string; // AMO, Mutuelle, Private
  email?: string;
  date_of_birth?: string;
  gender?: string;
}

export const patientService = {
  // Get all patients or search by name
  getPatients: async (search?: string): Promise<Patient[]> => {
    try {
      const params = search ? { search } : {};
      const { data } = await api.get<any[]>("/medical/patients/", { params });

      return data.map((p: any) => ({
        id: p.id,
        full_name: p.full_name || p.name || "",
        phone_number: p.phone_number || p.phone || "",
        insurance_type: p.insurance_type || p.insurance || "Private",
        email: p.email || "",
        date_of_birth: p.date_of_birth || p.dob || "",
        gender: p.gender || "",
      }));
    } catch (error) {
      console.error("Failed to fetch patients", error);
      return [];
    }
  },

  // Get a specific patient by ID
  getPatientById: async (id: string): Promise<Patient | null> => {
    try {
      const { data } = await api.get<any>(`/medical/patients/${id}/`);

      return {
        id: data.id,
        full_name: data.full_name || data.name || "",
        phone: data.phone_number || data.phone || "",
        insurance_type: data.insurance_type || data.insurance || "Private",
        email: data.email || "",
        date_of_birth: data.date_of_birth || data.dob || "",
        gender: data.gender || "",
      };
    } catch (error) {
      console.error("Failed to fetch patient", error);
      return null;
    }
  },

  // Create a new patient
  createPatient: async (payload: Partial<Patient>): Promise<Patient | null> => {
    try {
      const { data } = await api.post<any>(
        "/medical/patients/create/",
        payload
      );
      return {
        id: data.id,
        full_name: data.full_name || data.name || "",
        phone: data.phone || "",
        insurance_type: data.insurance_type || data.insurance || "Private",
        // date_of_birth: data.date_of_birth || data.dob || "",
        gender: data.gender || "",
      };
    } catch (error) {
      console.error("Failed to create patient", error);
      return null;
    }
  },
};
