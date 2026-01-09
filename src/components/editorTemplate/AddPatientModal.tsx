import React, { useState } from "react";
import { Patient, patientService, CreatePatientPayload } from "src/services/patientService";
import { IoCloseCircle } from "react-icons/io5"; // Assuming similar icon exists or I'll just use text

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated: (patient: Patient) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  onClose,
  onPatientCreated,
}) => {
  const [formData, setFormData] = useState<CreatePatientPayload>({
    first_name: "",
    last_name: "",
    phone: "",
    cin: "",
    insurance_type: "NONE",
    insurance_id: "",
    // Medical Safety Hub
    gender: undefined,
    date_of_birth: "",
    medical_alerts: "",
    allergies: "",
    is_high_risk: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      setError("First name and last name are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const newPatient = await patientService.createPatient(formData);

    if (newPatient) {
      onPatientCreated(newPatient);
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        cin: "",
        insurance_type: "NONE",
        insurance_id: "",
        // Medical Safety Hub
        gender: undefined,
        date_of_birth: "",
        medical_alerts: "",
        allergies: "",
        is_high_risk: false,
      });
      onClose();
    } else {
      setError("Erreur lors de la création du patient.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-navy-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-700 dark:text-white">
            Nouveau Patient
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-navy-700 dark:text-white"
          >
            <IoCloseCircle size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className=" flex">
            <div>
            <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
              First Name
            </label>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Ex: John Doe"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
            />
            <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
              Last Name
            </label>
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Ex: John Doe"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
            />
          </div>
          </div>

          {/* Gender & Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
                Genre
              </label>
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
                Date de naissance
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth || ""}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
              Téléphone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="06..."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
              CIN (Optionnel)
            </label>
            <input
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              placeholder="CIN..."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
            />
          </div>

          {/* Medical Safety Hub - CRITICAL SECTION */}
          <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-900/20">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-700 dark:text-orange-400">
              <span className="text-lg">⚠️</span>
              Informations Médicales (Sécurité Chirurgicale)
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
                  Alertes Médicales
                </label>
                <textarea
                  name="medical_alerts"
                  value={formData.medical_alerts || ""}
                  onChange={handleChange}
                  placeholder="Ex: Diabète, Hypertension, Pacemaker..."
                  rows={2}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 dark:bg-navy-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies || ""}
                  onChange={handleChange}
                  placeholder="Ex: Pénicilline, Latex, Anesthésiques..."
                  rows={2}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 dark:bg-navy-900 dark:text-white"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_high_risk"
                  checked={formData.is_high_risk || false}
                  onChange={(e) => setFormData({ ...formData, is_high_risk: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label className="text-sm font-medium text-navy-700 dark:text-white">
                  Patient à Haut Risque
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
                Assurance
              </label>
              <select
                name="insurance_type"
                value={formData.insurance_type}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
              >
                <option value="NONE">Aucune</option>
                <option value="AMO">AMO</option>
                <option value="MUTUELLE">Mutuelle</option>
                <option value="MUTUELLE_FAR">Mutuelle FAR</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-navy-700 dark:text-white">
                N° Assurance
              </label>
              <input
                name="insurance_id"
                value={formData.insurance_id}
                onChange={handleChange}
                placeholder="N° Assurance (optionnel)"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:bg-navy-900 dark:text-white"
              />
            </div>
          </div>

          

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-navy-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Création..." : "Ajouter Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
