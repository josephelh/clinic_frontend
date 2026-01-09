import React, { useState } from "react";
import { useMedicalStore } from "src/store/useMedicalStore";
import { medicalService } from "src/services/medicalService";
import { MdClose, MdCheck, MdOutlineMedicalServices, MdWarning } from "react-icons/md";

interface ToothActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothNumber: number | null;
}

export const ToothActionModal = ({ isOpen, onClose, toothNumber }: ToothActionModalProps) => {
  const [activeTab, setActiveTab] = useState("findings");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentPatientId, triggerRefresh } = useMedicalStore();

  if (!isOpen || !toothNumber) return null;

  const handleFindingClick = async (condition: string, label: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!currentPatientId) return;

      await medicalService.addToothFinding({
        tooth_number: toothNumber,
        condition: condition,
        notes: `Quick find: ${label}`
      });
      
      triggerRefresh(); // Refresh UI
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error saving finding");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTreatmentClick = async (stepType: string, label: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
        await medicalService.addTreatmentStep({
            tooth_number: toothNumber,
            step_type: stepType,
            description: `Quick action: ${label}`,
            status: 'pending' // Default to pending
        });
        
        triggerRefresh(); // Refresh UI
        onClose();
    } catch (error) {
        console.error(error);
        alert("Error creating treatment. Is a session active?");
    } finally {
        setIsSubmitting(false);
    }
  };

  const findings = [
    { id: "CARIES", label: "Carie (Red)", color: "bg-red-500", icon: <MdWarning /> },
    { id: "MISSING", label: "Absente (Blue)", color: "bg-blue-500", icon: <MdClose /> },
    { id: "FILLING", label: "Obturation (Gray)", color: "bg-gray-500", icon: <MdCheck /> },
    { id: "CROWN", label: "Couronne (Yellow)", color: "bg-yellow-500", icon: <MdOutlineMedicalServices /> },
    { id: "ROOT_CANAL", label: "Dévitalisée", color: "bg-purple-500", icon: <MdOutlineMedicalServices /> },
    { id: "IMPLANT", label: "Implant", color: "bg-green-500", icon: <MdCheck /> },
  ];

  const treatments = [
    { id: "extraction", label: "Extraction" },
    { id: "cleaning", label: "Détartrage" },
    { id: "filling", label: "Obturation (Comp.)" },
    { id: "root_canal", label: "Traitement Canal" },
    { id: "crown", label: "Pose Couronne" },
    { id: "diagnosis", label: "Examen / Radio" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-navy-800 transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Dent {toothNumber}
          </h2>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-500"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 mb-6 space-x-2 bg-gray-100 dark:bg-navy-700 rounded-xl">
          <button
            onClick={() => setActiveTab("findings")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === "findings"
                ? "bg-white text-brand-500 shadow-sm dark:bg-navy-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Diagnostic (Findings)
          </button>
          <button
            onClick={() => setActiveTab("treatments")}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === "treatments"
                ? "bg-white text-brand-500 shadow-sm dark:bg-navy-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Actes (Treatments)
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px] relative">
          
          {/* Loading Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
               <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          )}

          {activeTab === "findings" && (
            <div className={`grid grid-cols-2 gap-4 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
              {findings.map((f) => (
                <button
                  key={f.id}
                  disabled={isSubmitting}
                  onClick={() => handleFindingClick(f.id, f.label)}
                  className="flex flex-col items-center justify-center p-4 gap-3 rounded-xl border-2 border-transparent bg-gray-50 hover:border-brand-500 hover:bg-brand-50 dark:bg-navy-700 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className={`w-12 h-12 rounded-full ${f.color} text-white flex items-center justify-center text-xl shadow-md`}>
                    {f.icon}
                  </div>
                  <span className="font-bold text-navy-700 dark:text-white group-hover:text-brand-600">
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {activeTab === "treatments" && (
            <div className={`grid grid-cols-2 gap-4 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
              {treatments.map((t) => (
                <button
                  key={t.id}
                  disabled={isSubmitting}
                  onClick={() => handleTreatmentClick(t.id, t.label)}
                  className="flex items-center justify-start px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-brand-500 hover:text-white hover:border-transparent dark:bg-navy-700 dark:border-navy-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-bold text-lg">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
