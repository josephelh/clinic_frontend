import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "components/card";
import Pagination from "components/pagination";
import { MdAdd, MdSearch, MdPhone, MdLocationOn, MdViewModule, MdViewList } from "react-icons/md";
import { Patient, patientService } from "src/services/patientService";
import { AddPatientModal } from "src/components/editorTemplate/AddPatientModal";

type ViewMode = "card" | "list";

const PatientsView = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    // Debounce search could be added here, but for now direct call
    const timer = setTimeout(() => {
      loadPatients();
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const { data, totalCount } = await patientService.getPatients(searchTerm, currentPage);
      setPatients(data);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handlePatientCreated = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
    setIsModalOpen(false);
  };


  const getInsuranceLabel = (type?: string) => {
    const labels: Record<string, string> = {
      NONE: "Aucune",
      AMO: "AMO",
      MUTUELLE: "Mutuelle",
      MUTUELLE_FAR: "Mutuelle FAR",
    };
    return labels[type || "NONE"] || "Aucune";
  };

  const getInsuranceBadgeColor = (type?: string) => {
    const colors: Record<string, string> = {
      NONE: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
      AMO: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      MUTUELLE: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      MUTUELLE_FAR: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[type || "NONE"] || colors.NONE;
  };

  return (
    <div className="mt-3 h-full">
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientCreated={handlePatientCreated}
      />

      {/* Header Card */}
      <Card extra="mb-5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
              Patients
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {totalCount} patient{totalCount !== 1 ? "s" : ""}
            </p>

          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-200 p-1 dark:border-white/10">
              <button
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition ${
                  viewMode === "card"
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-800"
                }`}
              >
                <MdViewModule className="h-5 w-5" />
                Cartes
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition ${
                  viewMode === "list"
                    ? "bg-brand-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-800"
                }`}
              >
                <MdViewList className="h-5 w-5" />
                Liste
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300"
            >
              <MdAdd className="h-5 w-5" />
              Nouveau Patient
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MdSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Rechercher par nom, téléphone, ou CIN..."
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </Card>

      {/* Patients List */}
      {loading ? (
        <Card extra="p-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Chargement...</span>
          </div>
        </Card>
      ) : patients.length === 0 ? (
        <Card extra="p-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? "Aucun patient trouvé" : "Aucun patient enregistré"}
            </p>

            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                Ajouter votre premier patient
              </button>
            )}
          </div>
        </Card>
      ) : viewMode === "list" ? (
        /* List View */
        <Card extra="pb-6 overflow-x-auto">
          <div className="overflow-x-scroll xl:overflow-x-hidden">
            <table className="w-full">
              <thead>
                <tr className="!border-px !border-gray-400">
                  <th className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                    <p className="text-sm font-bold text-gray-600 dark:text-white">PATIENT</p>
                  </th>
                  <th className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                    <p className="text-sm font-bold text-gray-600 dark:text-white">TÉLÉPHONE</p>
                  </th>
                  <th className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                    <p className="text-sm font-bold text-gray-600 dark:text-white">CIN</p>
                  </th>
                  <th className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                    <p className="text-sm font-bold text-gray-600 dark:text-white">ASSURANCE</p>
                  </th>
                  <th className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                    <p className="text-sm font-bold text-gray-600 dark:text-white">DIAGNOSTICS</p>
                  </th>
                  <th className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start">
                    <p className="text-sm font-bold text-gray-600 dark:text-white">ACTIONS</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-700"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <td className="min-w-[200px] border-white/0 py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {patient.full_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="min-w-[140px] border-white/0 py-3 pr-4">
                      {patient.phone ? (
                        <div className="flex items-center gap-2">
                          <MdPhone className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-navy-700 dark:text-white">{patient.phone}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )}
                    </td>
                    <td className="min-w-[80px] border-white/0 py-3 pr-4">
                      {patient.age ? (
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium text-navy-700 dark:text-white">{patient.age} ans</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )}
                    </td>
                    <td className="min-w-[120px] border-white/0 py-3 pr-4">
                      {patient.cin ? (
                        <p className="text-sm text-navy-700 dark:text-white">
                          {patient.cin.substring(0, 4)}***
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )}
                    </td>
                    <td className="min-w-[140px] border-white/0 py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getInsuranceBadgeColor(
                          patient.insurance_type
                        )}`}
                      >
                        {getInsuranceLabel(patient.insurance_type)}
                      </span>
                    </td>
                    <td className="min-w-[160px] border-white/0 py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {patient.is_high_risk && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700 dark:bg-red-900 dark:text-red-300">
                            ⚠️ RISQUE
                          </span>
                        )}
                        {patient.medical_alerts && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                            🏥 Alertes
                          </span>
                        )}
                        {patient.allergies && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                            🚨 Allergies
                          </span>
                        )}
                        {!patient.is_high_risk && !patient.medical_alerts && !patient.allergies && (
                          <p className="text-sm text-gray-400">-</p>
                        )}
                      </div>
                    </td>
                    <td className="min-w-[120px] border-white/0 py-3 pr-4">
                      {patient.findings && patient.findings.length > 0 ? (
                        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                          {patient.findings.length}
                        </span>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )}
                    </td>
                    <td className="min-w-[100px] border-white/0 py-3 pr-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(patient);
                        }}
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                      >
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {patients.map((patient) => (
            <Card
              key={patient.id}
              extra="cursor-pointer transition hover:shadow-xl"
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="p-5">
                {/* Patient Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
                      {patient.first_name[0]}{patient.last_name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy-700 dark:text-white">
                        {patient.full_name}
                      </h3>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${getInsuranceBadgeColor(
                          patient.insurance_type
                        )}`}
                      >
                        {getInsuranceLabel(patient.insurance_type)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="mt-4 space-y-2">
                  {patient.age && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Âge:</span>
                      <span>{patient.age} ans</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MdPhone className="h-4 w-4" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  {patient.cin && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MdLocationOn className="h-4 w-4" />
                      <span>CIN: {patient.cin.substring(0, 4)}***</span>
                    </div>
                  )}
                </div>

                {/* Medical Status - CRITICAL SECTION */}
                {(patient.is_high_risk || patient.medical_alerts || patient.allergies) && (
                  <div className="mt-4 space-y-2 rounded-lg border-2 border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-900/20">
                    {patient.is_high_risk && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span className="text-sm font-bold text-red-700 dark:text-red-400">Patient à Haut Risque</span>
                      </div>
                    )}
                    {patient.medical_alerts && (
                      <div className="text-sm">
                        <span className="font-medium text-orange-700 dark:text-orange-400">Alertes: </span>
                        <span className="text-navy-700 dark:text-white">{patient.medical_alerts}</span>
                      </div>
                    )}
                    {patient.allergies && (
                      <div className="text-sm">
                        <span className="font-medium text-orange-700 dark:text-orange-400">Allergies: </span>
                        <span className="text-navy-700 dark:text-white">{patient.allergies}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Findings Count */}
                {patient.findings && patient.findings.length > 0 && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-navy-900">
                    <p className="text-sm font-medium text-navy-700 dark:text-white">
                      {patient.findings.length} diagnostic{patient.findings.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {!loading && patients.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / PAGE_SIZE)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Patient Detail Modal (Simple for now) */}
      {selectedPatient && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedPatient(null)}
        >
          <Card
            extra="w-full max-w-2xl mx-4"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
                    {selectedPatient.first_name[0]}{selectedPatient.last_name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
                      {selectedPatient.full_name}
                    </h2>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${getInsuranceBadgeColor(
                        selectedPatient.insurance_type
                      )}`}
                    >
                      {getInsuranceLabel(selectedPatient.insurance_type)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Prénom</p>
                  <p className="mt-1 text-base text-navy-700 dark:text-white">{selectedPatient.first_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nom</p>
                  <p className="mt-1 text-base text-navy-700 dark:text-white">{selectedPatient.last_name}</p>
                </div>
                {selectedPatient.age && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Âge</p>
                    <p className="mt-1 text-base font-semibold text-navy-700 dark:text-white">{selectedPatient.age} ans</p>
                  </div>
                )}
                {selectedPatient.gender && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Genre</p>
                    <p className="mt-1 text-base text-navy-700 dark:text-white">{selectedPatient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                  </div>
                )}
                {selectedPatient.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Téléphone</p>
                    <p className="mt-1 text-base text-navy-700 dark:text-white">{selectedPatient.phone}</p>
                  </div>
                )}
                {selectedPatient.cin && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CIN</p>
                    <p className="mt-1 text-base text-navy-700 dark:text-white">{selectedPatient.cin}</p>
                  </div>
                )}
                {selectedPatient.insurance_id && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">N° Assurance</p>
                    <p className="mt-1 text-base text-navy-700 dark:text-white">{selectedPatient.insurance_id}</p>
                  </div>
                )}
              </div>

              {/* Medical Safety Section - CRITICAL */}
              {(selectedPatient.is_high_risk || selectedPatient.medical_alerts || selectedPatient.allergies) && (
                <div className="mt-6 rounded-lg border-2 border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-900/20">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-orange-700 dark:text-orange-400">
                    <span className="text-xl">⚠️</span>
                    Informations Médicales Critiques
                  </h3>
                  <div className="space-y-3">
                    {selectedPatient.is_high_risk && (
                      <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                        <p className="font-bold text-red-700 dark:text-red-400">🚨 PATIENT À HAUT RISQUE</p>
                      </div>
                    )}
                    {selectedPatient.medical_alerts && (
                      <div>
                        <p className="text-sm font-bold text-orange-700 dark:text-orange-400">Alertes Médicales:</p>
                        <p className="mt-1 text-base text-navy-700 dark:text-white">{selectedPatient.medical_alerts}</p>
                      </div>
                    )}
                    {selectedPatient.allergies && (
                      <div>
                        <p className="text-sm font-bold text-orange-700 dark:text-orange-400">Allergies:</p>
                        <p className="mt-1 text-base text-navy-700 dark:text-white">{selectedPatient.allergies}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedPatient.findings && selectedPatient.findings.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-navy-700 dark:text-white">Diagnostics</h3>
                  <div className="mt-3 space-y-2">
                    {selectedPatient.findings.map((finding, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-gray-50 p-3 dark:bg-navy-900"
                      >
                        <p className="text-sm text-navy-700 dark:text-white">
                          Dent {finding.tooth_number}: {finding.condition}
                          {finding.surface && ` (${finding.surface})`}
                        </p>
                        {finding.notes && (
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{finding.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Fermer
                </button>
                <button
                  className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                  onClick={() => {
                    navigate(`/admin/patients/${selectedPatient.id}/emr`);
                  }}
                >
                  Voir Dossier
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientsView;
