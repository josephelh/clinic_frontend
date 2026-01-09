import api from "src/api/axios";

/**
 * Tooth finding from patient history (FDI notation)
 */
export interface ToothFinding {
  id: number;
  tooth_number: number;
  condition: string;
  surface?: string;
  notes?: string;
  created_at: string;
}

/**
 * Patient interface matching backend serializer exactly
 * Backend fields: first_name, last_name, full_name, cin, phone, insurance_type, insurance_id
 */
export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string; // Read-only computed field from backend
  
  // Medical Safety Hub (NEW)
  gender?: 'M' | 'F';
  date_of_birth?: string;
  age?: number; // Read-only computed property from backend
  medical_alerts?: string; // CRITICAL: Surgery-grade safety info
  allergies?: string; // CRITICAL: Surgery-grade safety info
  is_high_risk?: boolean;
  
  // Privacy & Contact
  cin?: string; // Encrypted field - National ID
  phone?: string;
  insurance_type?: 'AMO' | 'MUTUELLE' | 'MUTUELLE_FAR' | 'NONE';
  insurance_id?: string; // Encrypted field
  
  // Clinical History
  findings?: ToothFinding[]; // FDI tooth history
  created_at?: string;
}

/**
 * Backend response structure
 */
interface PatientResponse {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  
  // Medical Safety Hub
  gender?: string;
  date_of_birth?: string;
  age?: number;
  medical_alerts?: string;
  allergies?: string;
  is_high_risk?: boolean;
  
  // Privacy & Contact
  cin?: string;
  phone?: string;
  insurance_type?: string;
  insurance_id?: string;
  
  // Clinical History
  findings?: ToothFinding[];
  created_at?: string;
}

/**
 * Create patient payload (only writable fields)
 */
export interface CreatePatientPayload {
  first_name: string;
  last_name: string;
  
  // Medical Safety Hub
  gender?: 'M' | 'F';
  date_of_birth?: string;
  medical_alerts?: string;
  allergies?: string;
  is_high_risk?: boolean;
  
  // Privacy & Contact
  cin?: string;
  phone?: string;
  insurance_type?: 'AMO' | 'MUTUELLE' | 'MUTUELLE_FAR' | 'NONE';
  insurance_id?: string;
}

export const patientService = {
  /**
   * Get patients with pagination and search
   */
  getPatients: async (search?: string, page: number = 1): Promise<{ data: Patient[]; totalCount: number }> => {
    try {
      const params: any = { page };
      if (search) params.search = search;
      
      const response = await api.get<any>("/medical/patients/", { params });
      
      // Handle Pagination (DRF returns { count: N, results: [...] })
      const rawData = response.data.results ? response.data.results : response.data;
      const totalCount = response.data.count || (Array.isArray(response.data) ? response.data.length : 0);

      // Ensure data is an array before mapping
      if (!Array.isArray(rawData)) {
         console.warn("Unexpected API response format:", rawData);
         return { data: [], totalCount: 0 };
      }

      const patients = rawData.map((p: any) => ({
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        full_name: p.full_name,
        
        // Medical Safety Hub
        gender: p.gender as Patient['gender'],
        date_of_birth: p.date_of_birth,
        age: p.age,
        medical_alerts: p.medical_alerts,
        allergies: p.allergies,
        is_high_risk: p.is_high_risk,
        
        // Privacy & Contact
        cin: p.cin,
        phone: p.phone,
        insurance_type: p.insurance_type as Patient['insurance_type'],
        insurance_id: p.insurance_id,
        
        // Clinical History
        findings: p.findings || [],
        created_at: p.created_at,
      }));

      return { data: patients, totalCount };

    } catch (error: any) {
      console.error("Failed to fetch patients:", error.response?.data || error.message);
      return { data: [], totalCount: 0 };
    }
  },

  /**
   * Get a specific patient by ID with full details
   */
  getPatientById: async (id: number): Promise<Patient | null> => {
    try {
      const { data } = await api.get<PatientResponse>(`/medical/patients/${id}/`);

      return {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: data.full_name,
        
        // Medical Safety Hub
        gender: data.gender as Patient['gender'],
        date_of_birth: data.date_of_birth,
        age: data.age,
        medical_alerts: data.medical_alerts,
        allergies: data.allergies,
        is_high_risk: data.is_high_risk,
        
        // Privacy & Contact
        cin: data.cin,
        phone: data.phone,
        insurance_type: data.insurance_type as Patient['insurance_type'],
        insurance_id: data.insurance_id,
        
        // Clinical History
        findings: data.findings || [],
        created_at: data.created_at,
      };
    } catch (error: any) {
      console.error("Failed to fetch patient:", error.response?.data || error.message);
      return null;
    }
  },

  /**
   * Create a new patient
   */
  createPatient: async (payload: CreatePatientPayload): Promise<Patient | null> => {
    try {
      const { data } = await api.post<PatientResponse>("/medical/patients/", payload);
      
      return {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: data.full_name,
        
        // Medical Safety Hub
        gender: data.gender as Patient['gender'],
        date_of_birth: data.date_of_birth,
        age: data.age,
        medical_alerts: data.medical_alerts,
        allergies: data.allergies,
        is_high_risk: data.is_high_risk,
        
        // Privacy & Contact
        cin: data.cin,
        phone: data.phone,
        insurance_type: data.insurance_type as Patient['insurance_type'],
        insurance_id: data.insurance_id,
        
        // Clinical History
        findings: data.findings || [],
        created_at: data.created_at,
      };
    } catch (error: any) {
      console.error("Failed to create patient:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Update an existing patient
   */
  updatePatient: async (id: number, payload: Partial<CreatePatientPayload>): Promise<Patient | null> => {
    try {
      const { data } = await api.patch<PatientResponse>(`/medical/patients/${id}/`, payload);
      
      return {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: data.full_name,
        
        // Medical Safety Hub
        gender: data.gender as Patient['gender'],
        date_of_birth: data.date_of_birth,
        age: data.age,
        medical_alerts: data.medical_alerts,
        allergies: data.allergies,
        is_high_risk: data.is_high_risk,
        
        // Privacy & Contact
        cin: data.cin,
        phone: data.phone,
        insurance_type: data.insurance_type as Patient['insurance_type'],
        insurance_id: data.insurance_id,
        
        // Clinical History
        findings: data.findings || [],
        created_at: data.created_at,
      };
    } catch (error: any) {
      console.error("Failed to update patient:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete a patient
   */
  deletePatient: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/medical/patients/${id}/`);
      return true;
    } catch (error: any) {
      console.error("Failed to delete patient:", error.response?.data || error.message);
      return false;
    }
  },
};
