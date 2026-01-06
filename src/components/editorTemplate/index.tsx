import { useState, useEffect } from "react";
import { Patient } from "src/services/patientService";
import { DoctorResource } from "src/services/doctorService";
import { AddPatientModal } from "./AddPatientModal";

// Valid FDI Tooth Numbers: 11-18, 21-28, 31-38, 41-48
const FDI_TOOTH_NUMBERS = [
  ...Array.from({ length: 8 }, (_, i) => 11 + i), // 11-18
  ...Array.from({ length: 8 }, (_, i) => 21 + i), // 21-28
  ...Array.from({ length: 8 }, (_, i) => 31 + i), // 31-38
  ...Array.from({ length: 8 }, (_, i) => 41 + i), // 41-48
];

const PROCEDURES_MOROCCAN = [
  "Consultation",
  "Détartrage (Scaling)",
  "Extraction",
  "Traitement de canal (Endo)",
  "Prothèse (Crown/Bridge)",
  "Détection Caries",
  "Nettoyage",
  "Détartrage Professionnel",
  "Autre",
];

const STATUS_WORKFLOW = [
  "Confirmé",
  "En salle d'attente",
  "Au fauteuil",
  "Terminé",
];

interface EditorTemplateProps {
  // Syncfusion Props
  StartTime?: Date;
  EndTime?: Date;
  Subject?: string;
  Description?: string;
  Status?: string;
  Id?: number;
  [key: string]: any;

  // Custom Props passed via wrapper
  patients?: Patient[];
  doctors?: DoctorResource[];
  userRole?: string;
  onSave?: (data: any) => void;
  onCancel?: () => void;
  setPatients?: (patients: Patient[]) => void;
}

export const EditorTemplate = (props: EditorTemplateProps) => {
  const [formData, setFormData] = useState({
    Id: props.Id,
    Subject: props.Subject || "",
    patient_name: props.patient_name || "", 
    PatientId: props.PatientId || "", 
    doctor: props.doctor || props.resourceId || (props.doctors?.length === 1 ? props.doctors[0].id : "") || "",
    Status: props.Status || "Confirmé",
    Description: props.Description || "",
    StartTime: props.StartTime || new Date(),
    EndTime: props.EndTime || new Date(),
    tooth_number: props.tooth_number || "",
    multiple_teeth: props.multiple_teeth || false,
    insurance_type: props.insurance_type || "Private",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPatientList, setShowPatientList] = useState(false);
  
  // Try to find initial patient name if ID exists but name doesn't (or vice versa)
  useEffect(() => {
    if (props.PatientId && props.patients) {
        const p = props.patients.find(pt => pt.id === props.PatientId);
        if (p) setSearchTerm(p.full_name);
    } else if (props.patient_name) {
        setSearchTerm(props.patient_name);
        // Try to reverse lookup ID?
        const p = props.patients?.find(pt => pt.full_name === props.patient_name);
        if (p) setFormData(prev => ({ ...prev, PatientId: p.id }));
    }
  }, [props.PatientId, props.patient_name, props.patients]);


  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatientSelect = (patient: Patient) => {
    setSearchTerm(patient.full_name);
    setFormData((prev) => ({
      ...prev,
      PatientId: patient.id,
      patient_name: patient.full_name,
      Subject: prev.Subject || "Consultation", // Default subject
      insurance_type: patient.insurance_type || "Private",
    }));
    setShowPatientList(false);
  };

  const handlePatientCreated = (newPatient: Patient) => {
    if (props.setPatients) {
        props.setPatients([...(props.patients || []), newPatient]);
    }
    handlePatientSelect(newPatient);
  };

  const currentPatients = (props.patients || []).filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const onSaveClick = () => {
    if (props.onSave) {
        props.onSave(formData);
    }
  };

  const onCancelClick = () => {
      if (props.onCancel) props.onCancel();
  };

  return (
    <div className="bg-white dark:bg-navy-800 p-4 rounded-lg h-full overflow-y-auto custom-editor-wrapper">
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientCreated={handlePatientCreated}
      />
      
      <div className="grid grid-cols-1 gap-4">
        {/* Patient Selection with Add Button */}
        <div className="relative">
          <label className="text-sm font-bold text-navy-700 mb-2 block dark:text-white">
            Patient
          </label>
          <div className="flex gap-2">
            <div className="relative w-full">
                <input
                    type="text"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
                    placeholder="Rechercher un patient..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowPatientList(true);
                    }}
                    onFocus={() => setShowPatientList(true)}
                    // On blur handling is tricky with click inside list, usually use a click outside handler or delay
                    onBlur={() => setTimeout(() => setShowPatientList(false), 200)}
                />
                {showPatientList && searchTerm && (
                    <div className="absolute top-full left-0 z-10 w-full max-h-40 overflow-y-auto rounded border border-gray-200 bg-white shadow-lg dark:bg-navy-800 dark:border-navy-700">
                        {currentPatients.length > 0 ? (
                            currentPatients.map(p => (
                                <div 
                                    key={p.id}
                                    className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-navy-700 text-sm"
                                    onClick={() => handlePatientSelect(p)}
                                >
                                    {p.full_name} <span className="text-xs text-gray-500">({p.phone})</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">Aucun patient trouvé</div>
                        )}
                    </div>
                )}
            </div>
            <button
              type="button"
              title="Ajouter un nouveau patient"
              className="flex items-center justify-center rounded bg-brand-500 px-3 text-white hover:bg-brand-600"
              onClick={() => setIsModalOpen(true)}
            >
              +
            </button>
          </div>
        </div>

        {/* Treatment/Subject */}
        <div>
          <label className="text-sm font-bold text-navy-700 mb-2 block dark:text-white">
            Traitement
          </label>
          <select
            value={formData.Subject}
            onChange={(e) => handleChange("Subject", e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
          >
            <option value="">Sélectionner...</option>
            {PROCEDURES_MOROCCAN.map((proc) => (
              <option key={proc} value={proc}>
                {proc}
              </option>
            ))}
          </select>
        </div>

         {/* Tooth & Multiple */}
         <div className="grid grid-cols-2 gap-4 items-end">
            <div>
                <label className="text-sm font-bold text-navy-700 mb-2 block dark:text-white">
                    Dent (FDI)
                </label>
                <select
                    value={formData.tooth_number}
                    onChange={(e) => handleChange("tooth_number", e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
                >
                    <option value="">N/A</option>
                    {FDI_TOOTH_NUMBERS.map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2 mb-3">
                <input
                    type="checkbox"
                    checked={formData.multiple_teeth}
                    onChange={(e) => handleChange("multiple_teeth", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-navy-700 dark:text-white">Plusieurs dents</span>
            </div>
        </div>

        {/* Doctor */}
        <div>
          <label className="text-sm font-bold text-navy-700 mb-2 block dark:text-white">
            Médecin
          </label>
          <select
            value={formData.doctor}
            onChange={(e) => handleChange("doctor", e.target.value)}
            disabled={props.userRole === "doctor"}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white disabled:opacity-50"
          >
             <option value="">Sélectionner...</option>
            {(props.doctors || []).map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.full_name || doc.username}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-bold text-navy-700 mb-2 block dark:text-white">
                    Début
                </label>
                <input
                    type="datetime-local"
                    value={formData.StartTime ? new Date(new Date(formData.StartTime).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ""}
                    onChange={(e) => handleChange("StartTime", new Date(e.target.value))}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
                />
            </div>
            <div>
                <label className="text-sm font-bold text-navy-700 mb-2 block dark:text-white">
                    Fin
                </label>
                <input
                    type="datetime-local"
                    value={formData.EndTime ? new Date(new Date(formData.EndTime).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ""}
                    onChange={(e) => handleChange("EndTime", new Date(e.target.value))}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
                />
            </div>
        </div>

        {/* Status */}
         <div>
          <label className="text-sm font-bold text-navy-700 mb-2 block dark:text-white">
            Statut
          </label>
          <select
            value={formData.Status}
            onChange={(e) => handleChange("Status", e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
          >
            {STATUS_WORKFLOW.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
         <div>
          <label className="text-sm font-bold text-navy-700 mb-2 block dark:text-white">
            Notes
          </label>
          <textarea
            rows={3}
            value={formData.Description}
            onChange={(e) => handleChange("Description", e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
          />
        </div>

        {/* Custom Actions (Save/Cancel) */}
        <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-navy-700">
            {props.onCancel && (
                <button 
                    onClick={onCancelClick}
                    className="rounded px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-navy-700"
                >
                    Annuler
                </button>
            )}
            <button 
                onClick={onSaveClick}
                className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
                Enregistrer
            </button>
        </div>
      </div>
    </div>
  );
};
      