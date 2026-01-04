import api from "src/api/axios";

export interface Appointment {
  Id: number;
  Subject: string;
  StartTime: string | Date;
  EndTime: string | Date;
  IsAllDay?: boolean;
  Description?: string;
  Status?: string;
  PatientId?: string; // Link to Patient EMR
  ToothNumber?: number; // FDI Notation (e.g., 11, 48)
  doctor?: number; // Doctor ID for resource mapping
  patient_name?: string;
  doctor_name?: string;
  tooth_number?: number;
}

export const appointmentService = {
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data } = await api.get<any[]>("/medical/appointments/");

      return data.map((app) => ({
        // Map DRF 'id' to Syncfusion 'Id'
        Id: app.id,
        // Match the UPPERCASE fields from your Django Serializer
        Subject: app.Subject || app.patient_name || "Consultation",
        StartTime: new Date(app.StartTime), // FIXED: app.start_time was undefined
        EndTime: new Date(app.EndTime), // FIXED: app.end_time was undefined
        Description: app.Description || "",
        Status: app.Status || "Scheduled",
        doctor: app.doctor, // This ID must match the Doctor Resource ID
        patient_name: app.patient_name,
        patient_phone: app.patient_phone,
        tooth_number: app.tooth_number,
      }));
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      return [];
    }
  },

  // Sync back to Django after Drag & Drop or Resize
  updateAppointment: async (id: number, payload: Partial<Appointment>) => {
    return await api.patch(`/medical/appointments/${id}/`, payload);
  },

  createAppointment: async (payload: Appointment) => {
    return await api.post("/medical/appointments/", payload);
  },
};
