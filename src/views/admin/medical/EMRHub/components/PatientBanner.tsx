import React from "react";
import { useMedicalStore } from "src/store/useMedicalStore";

export const PatientBanner = () => {
  const { emrData, isLoading, isReadOnly } = useMedicalStore();
  const patient = emrData.patient;

  if (isLoading || !patient) return <div className="p-4 bg-white rounded-xl shadow-sm animate-pulse h-20">Loading Patient Data...</div>;

  // Safety Hub Logic
  const alerts = patient.medical_alerts ? patient.medical_alerts.split(',') : [];
  const allergies = patient.allergies ? patient.allergies.split(',') : [];

  return (
    <div className="w-full rounded-[20px] bg-white p-4 shadow-sm dark:bg-navy-800 dark:shadow-none">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
        
        {/* Left: Patient Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-brand-500 text-xl font-bold text-white">
            {patient.first_name?.charAt(0) || "P"}
          </div>
          <div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              {patient.full_name}
            </h4>
            <div className="flex gap-2 text-sm font-medium text-gray-600">
              <span>{patient.age ? `${patient.age} ans` : "Âge inconnu"}</span>
              <span>•</span>
              <span>{patient.gender === 'M' ? 'Homme' : 'Femme'}</span>
            </div>
          </div>
        </div>

        {/* Middle: Safety Hub */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {patient.is_high_risk && (
            <span className="animate-pulse rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600 border border-red-200">
              ⚠️ HIGH RISK
            </span>
          )}
          
          {allergies.map((allergy, i) => (
            <span key={i} className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600 border border-orange-100">
              Allergie: {allergy}
            </span>
          ))}

          {alerts.map((alert, i) => (
             <span key={i} className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-600 border border-yellow-100">
               {alert}
             </span>
          ))}

          {allergies.length === 0 && alerts.length === 0 && !patient.is_high_risk && (
             <span className="text-xs text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                ✅ Patient sain (RAS)
             </span>
          )}
        </div>

        {/* Right: Session Status */}
        <div className="flex items-center">
          {isReadOnly ? (
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600">
              🔒 Mode Lecture Seule
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-600">
              🟢 Session Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
