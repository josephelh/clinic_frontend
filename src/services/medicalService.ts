import api from "src/api/axios";
import { useMedicalStore } from "src/store/useMedicalStore";
import { Patient, ToothFinding } from "./patientService";

// Re-export types for convenience
export type { Patient, ToothFinding };

export interface TreatmentStep {
  id: number;
  tooth_number: number;
  step_type: string;
  step_type_display: string;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  status_display: string;
  price: string; // Decimal comes as string often
  created_at: string;
  appointment: number; // Linked appointment ID
}

export interface EMRContext {
  patient: Patient;
  treatments: TreatmentStep[];
}

export const medicalService = {
  /**
   * Fetch full EMR context: Patient details (with Findings) and Treatment History
   */
  getPatientEMRContext: async (patientId: string): Promise<EMRContext> => {
    try {
      // 1. Fetch Patient Details (includes 'findings' via serializer)
      const patientPromise = api.get<Patient>(`/medical/patients/${patientId}/`);

      // 2. Fetch Treatment History (filtered by patient)
      // Note: Backend must support ?patient={id} filter on this endpoint
      const treatmentPromise = api.get<TreatmentStep[]>(`/medical/treatments/?patient=${patientId}`);

      const [patientRes, treatmentRes] = await Promise.all([
        patientPromise,
        treatmentPromise,
      ]);

      return {
        patient: patientRes.data,
        treatments: treatmentRes.data,
      };
    } catch (error) {
      console.error("❌ Failed to fetch EMR Context:", error);
      throw error;
    }
  },

  /**
   * Add a new Tooth Finding (Diagnosis/Condition)
   * Automatically links to the active session (appointment)
   */
  addToothFinding: async (data: Partial<ToothFinding> & { tooth_number: number; condition: string }) => {
    const { activeAppointmentId, currentPatientId } = useMedicalStore.getState();
    
    if (!currentPatientId) {
      throw new Error("Cannot add finding: No patient selected.");
    }

    // Ensure we send tooth_number as integer
    const payload = {
      ...data,
      tooth_number: Number(data.tooth_number),
      patient: currentPatientId, // Backend requires this
      // Link to session if active
      found_in: activeAppointmentId ? activeAppointmentId : null, 
    };

    console.log("🦷 Adding Tooth Finding:", payload);
    return api.post("/medical/findings/", payload);
  },

  /**
   * Add a new Treatment Step (Action)
   * CRITICAL: Must be linked to an Appointment
   */
  addTreatmentStep: async (data: Partial<TreatmentStep> & { tooth_number: number; step_type: string }) => {
    const { activeAppointmentId } = useMedicalStore.getState();

    if (!activeAppointmentId) {
      throw new Error("Cannot add treatment step: No active session (Appointment ID is missing).");
    }

    const payload = {
      ...data,
      tooth_number: Number(data.tooth_number),
      appointment: activeAppointmentId, // Link is mandatory for TreatmentStep
    };

    console.log("💉 Adding Treatment Step:", payload);
    return api.post("/medical/treatments/", payload);
  },
};

export default medicalService;
