import { create } from "zustand";
import { persist } from "zustand/middleware";
import { medicalService, Patient, TreatmentStep } from "src/services/medicalService";

interface MedicalState {
  activeAppointmentId: string | null;
  currentPatientId: string | null;
  isReadOnly: boolean;
  
  // Data Cache (Single Source of Truth)
  emrData: {
    patient: Patient | null;
    treatments: TreatmentStep[];
  };
  isLoading: boolean;
  error: string | null;

  startSession: (patientId: string, appointmentId: string | null) => void;
  clearSession: () => void;
  fetchEMRData: () => Promise<void>; // Fetches data for currentPatientId
  triggerRefresh: () => void;
}

export const useMedicalStore = create<MedicalState>()(
  persist(
    (set, get) => ({
      activeAppointmentId: null,
      currentPatientId: null,
      isReadOnly: true,
      
      emrData: {
        patient: null,
        treatments: [],
      },
      isLoading: false,
      error: null,

      startSession: (patientId, appointmentId) => {
        set({
          currentPatientId: patientId,
          activeAppointmentId: appointmentId,
          isReadOnly: appointmentId === null,
        });
        // Immediately trigger fetch when session starts
        get().fetchEMRData();
      },

      clearSession: () => {
        set({
          activeAppointmentId: null,
          currentPatientId: null,
          isReadOnly: true,
          emrData: { patient: null, treatments: [] },
          error: null
        });
      },

      fetchEMRData: async () => {
        const { currentPatientId } = get();
        if (!currentPatientId) return;

        set({ isLoading: true, error: null });
        try {
          const data = await medicalService.getPatientEMRContext(currentPatientId);
          set({
            emrData: {
              patient: data.patient,
              treatments: data.treatments,
            },
            isLoading: false,
          });
        } catch (err) {
          console.error("Store Fetch Error:", err);
          set({ isLoading: false, error: "Failed to load EMR data" });
        }
      },

      triggerRefresh: () => {
         get().fetchEMRData();
      }
    }),
    {
      name: "medical-session-storage",
      partialize: (state) => ({ 
        // Only persist session IDs, NOT the heavy data cache to ensure fresh data on reload
        activeAppointmentId: state.activeAppointmentId,
        currentPatientId: state.currentPatientId,
        isReadOnly: state.isReadOnly 
      }),
    }
  )
);

