import React, { useMemo, ReactNode } from "react";
import { MdSearch, MdMedicalServices, MdHistory } from "react-icons/md";
import { useMedicalStore } from "src/store/useMedicalStore";
import { TreatmentStep, ToothFinding } from "src/services/medicalService";

interface TimelineItem {
  id: string; // Composite ID
  type: "finding" | "treatment";
  date: Date;
  title: string;
  description: string;
  tooth?: number;
  status: "completed" | "pending" | "info";
  icon: ReactNode;
}

export const ClinicalTimeline = () => {
  const { emrData, isLoading } = useMedicalStore();

  const items = useMemo(() => {
    const timelineItems: TimelineItem[] = [];
    const { patient, treatments } = emrData;

    if (!patient) return [];

    // 1. Process Findings
    if (patient.findings) {
      patient.findings.forEach((f: ToothFinding) => {
        timelineItems.push({
          id: `f-${f.id}`,
          type: "finding",
          date: new Date(f.created_at),
          title: `Diagnostic: Dent ${f.tooth_number}`,
          description: `${f.condition} - ${f.notes || ''}`,
          tooth: f.tooth_number,
          status: "info",
          icon: <MdSearch className="h-5 w-5 text-white" />
        });
      });
    }

    // 2. Process Treatments
    if (treatments) {
      treatments.forEach((t: TreatmentStep) => {
        timelineItems.push({
          id: `t-${t.id}`,
          type: "treatment",
          date: new Date(t.created_at),
          title: `${t.step_type_display || t.step_type} Dent ${t.tooth_number}`,
          description: t.description,
          tooth: t.tooth_number,
          status: t.status === 'completed' ? 'completed' : 'pending',
          icon: <MdMedicalServices className="h-5 w-5 text-white" />
        });
      });
    }

    // 3. Sort Newest First
    return timelineItems.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [emrData]);


  if (isLoading) {
     return (
        <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
        </div>
     );
  }

  if (!emrData.patient) {
    return <div className="p-4 text-center text-gray-500">Chargement des données...</div>;
  }

  if (items.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center p-8 text-gray-400">
              <MdHistory className="text-4xl mb-2" />
              <p>Aucun historique médical trouvé.</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4 w-full">
           {/* Timeline Line & Icon */}
           <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-navy-800 ${
                  item.type === 'finding' ? 'bg-orange-400' : 
                  item.status === 'completed' ? 'bg-green-500' : 'bg-brand-500'
              } shadow-sm`}>
                 {item.icon}
              </div>
              {/* Line connector (unless last item) */}
              {index !== items.length - 1 && (
                  <div className="h-full w-[2px] bg-gray-200 dark:bg-navy-700 my-1"></div>
              )}
           </div>

           {/* Content Card */}
           <div className="flex flex-col pb-6 w-full">
              <div className="flex justify-between items-start">
                  <h5 className="text-base font-bold text-navy-700 dark:text-white">
                      {item.title}
                  </h5>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">
                       {item.date.toLocaleDateString('fr-FR')}
                  </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                 {item.description || "Aucune note."}
              </p>
              {item.type === 'treatment' && (
                 <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-md font-bold ${
                        item.status === 'completed' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                        {item.status === 'completed' ? 'COMPLÉTÉ' : 'PLANIFIÉ'}
                    </span>
                 </div>
              )}
           </div>
        </div>
      ))}
    </div>
  );
};
