import api from "src/api/axios";

/**
 * Treatment step for appointments
 */
export interface TreatmentStep {
  id?: number;
  tooth_number: number;
  step_type: 'diagnosis' | 'cleaning' | 'filling' | 'root_canal' | 'extraction' | 'crown' | 'followup' | 'other';
  step_type_display?: string;
  description?: string;
  
  // Cost tracking (NEW - for billing)
  price?: string; // DecimalField from backend comes as string
  
  status: 'pending' | 'completed' | 'cancelled';
  status_display?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Appointment interface matching backend serializer
 * Backend fields: Subject, StartTime, EndTime (capitalized for Syncfusion)
 */
export interface Appointment {
  // Syncfusion Scheduler requires 'Id' (capitalized)
  Id?: number;
  
  // Backend fields (capitalized for Syncfusion compatibility)
  Subject: string;
  StartTime: string | Date;
  EndTime: string | Date;
  Description?: string;
  Status?: string;
  CategoryColor?: string;
  
  // Foreign keys
  patient?: number; // Patient ID (backend uses lowercase)
  doctor?: number; // Doctor ID
  
  // Read-only fields from backend
  patient_name?: string;
  patient_phone?: string;
  doctor_name?: string;
  
  // Tooth tracking
  tooth_number?: number | null; // FDI Notation (11-18, 21-28, etc.)
  treatment_steps?: TreatmentStep[];
}

/**
 * Backend response structure
 */
interface AppointmentResponse {
  id: number;
  Subject: string;
  StartTime: string;
  EndTime: string;
  Description?: string;
  Status?: string;
  CategoryColor?: string;
  patient?: number;
  patient_name?: string;
  patient_phone?: string;
  doctor?: number;
  doctor_name?: string;
  tooth_number?: number | null;
  treatment_steps?: TreatmentStep[];
}

export const appointmentService = {
  /**
   * Fetch all appointments from backend
   */
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data } = await api.get<AppointmentResponse[]>("/medical/appointments/");

      return data.map((app) => ({
        // Map backend 'id' to Syncfusion 'Id' (capitalized)
        Id: app.id,
        
        // Backend already uses capitalized field names for Syncfusion
        Subject: app.Subject || app.patient_name || "Consultation",
        StartTime: new Date(app.StartTime),
        EndTime: new Date(app.EndTime),
        Description: app.Description || "",
        Status: app.Status || "Confirmé",
        CategoryColor: app.CategoryColor || "#0077BE",
        
        // Foreign keys
        patient: app.patient,
        doctor: app.doctor, // This MUST match the ResourceDirective field
        
        // Read-only fields
        doctor_name: app.doctor_name,
        patient_name: app.patient_name,
        patient_phone: app.patient_phone,
        
        // Tooth tracking
        tooth_number: app.tooth_number,
        treatment_steps: app.treatment_steps || [],
      }));
    } catch (error: any) {
      console.error("Failed to fetch appointments:", error.response?.data || error.message);
      return [];
    }
  },

  /**
   * Get a single appointment by ID
   */
  getAppointmentById: async (id: number): Promise<Appointment | null> => {
    try {
      const { data } = await api.get<AppointmentResponse>(`/medical/appointments/${id}/`);
      
      return {
        Id: data.id,
        Subject: data.Subject,
        StartTime: new Date(data.StartTime),
        EndTime: new Date(data.EndTime),
        Description: data.Description || "",
        Status: data.Status || "Confirmé",
        CategoryColor: data.CategoryColor,
        patient: data.patient,
        doctor: data.doctor,
        doctor_name: data.doctor_name,
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        tooth_number: data.tooth_number,
        treatment_steps: data.treatment_steps || [],
      };
    } catch (error: any) {
      console.error("Failed to fetch appointment:", error.response?.data || error.message);
      return null;
    }
  },

  /**
   * Create new appointment
   */
  createAppointment: async (payload: Partial<Appointment>): Promise<Appointment | null> => {
    try {
      // Transform payload to match backend expectations
      const backendPayload = {
        Subject: payload.Subject,
        StartTime: payload.StartTime,
        EndTime: payload.EndTime,
        Description: payload.Description || "",
        Status: payload.Status || "Confirmé",
        CategoryColor: payload.CategoryColor || "#0077BE",
        patient: payload.patient,
        doctor: payload.doctor,
        tooth_number: payload.tooth_number || null,
      };

      const { data } = await api.post<AppointmentResponse>("/medical/appointments/", backendPayload);
      
      return {
        Id: data.id,
        Subject: data.Subject,
        StartTime: new Date(data.StartTime),
        EndTime: new Date(data.EndTime),
        Description: data.Description,
        Status: data.Status,
        CategoryColor: data.CategoryColor,
        patient: data.patient,
        doctor: data.doctor,
        doctor_name: data.doctor_name,
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        tooth_number: data.tooth_number,
        treatment_steps: data.treatment_steps || [],
      };
    } catch (error: any) {
      console.error("Failed to create appointment:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Update existing appointment (for drag & drop, resize, edit)
   */
  updateAppointment: async (id: number, payload: Partial<Appointment>): Promise<Appointment | null> => {
    try {
      // Transform payload to match backend expectations
      const backendPayload: any = {};
      
      if (payload.Subject !== undefined) backendPayload.Subject = payload.Subject;
      if (payload.StartTime !== undefined) backendPayload.StartTime = payload.StartTime;
      if (payload.EndTime !== undefined) backendPayload.EndTime = payload.EndTime;
      if (payload.Description !== undefined) backendPayload.Description = payload.Description;
      if (payload.Status !== undefined) backendPayload.Status = payload.Status;
      if (payload.CategoryColor !== undefined) backendPayload.CategoryColor = payload.CategoryColor;
      if (payload.patient !== undefined) backendPayload.patient = payload.patient;
      if (payload.doctor !== undefined) backendPayload.doctor = payload.doctor;
      if (payload.tooth_number !== undefined) backendPayload.tooth_number = payload.tooth_number;

      const { data } = await api.patch<AppointmentResponse>(`/medical/appointments/${id}/`, backendPayload);
      
      return {
        Id: data.id,
        Subject: data.Subject,
        StartTime: new Date(data.StartTime),
        EndTime: new Date(data.EndTime),
        Description: data.Description,
        Status: data.Status,
        CategoryColor: data.CategoryColor,
        patient: data.patient,
        doctor: data.doctor,
        doctor_name: data.doctor_name,
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        tooth_number: data.tooth_number,
        treatment_steps: data.treatment_steps || [],
      };
    } catch (error: any) {
      console.error("Failed to update appointment:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete appointment
   */
  deleteAppointment: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/medical/appointments/${id}/`);
      return true;
    } catch (error: any) {
      console.error("Failed to delete appointment:", error.response?.data || error.message);
      return false;
    }
  },
};
