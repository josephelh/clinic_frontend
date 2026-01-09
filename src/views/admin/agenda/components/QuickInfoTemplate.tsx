import { useNavigate } from "react-router-dom";

// Status color mapping for Morocco clinic workflow
const statusColorMap: { [key: string]: string } = {
  "Confirmé": "bg-green-100 text-green-800",
  "En salle d'attente": "bg-blue-100 text-blue-800",
  "Au fauteuil": "bg-yellow-100 text-yellow-800",
  "Terminé": "bg-gray-100 text-gray-800",
  "Waiting": "bg-blue-100 text-blue-800",
  "In-Progress": "bg-yellow-100 text-yellow-800",
  "Completed": "bg-green-100 text-green-800",
};

// Insurance type color badges
const insuranceBadgeMap: { [key: string]: string } = {
  "AMO": "bg-purple-100 text-purple-800",
  "Mutuelle": "bg-orange-100 text-orange-800",
  "Private": "bg-pink-100 text-pink-800",
};

export const QuickInfoTemplate = (props: any) => {
  const navigate = useNavigate();
  const status = props.Status || props.status || "Confirmé";
  const statusClass = statusColorMap[status] || "bg-gray-100 text-gray-800";
  
  const insurance = props.insurance_type || props.Insurance || "N/A";
  const insuranceClass = insuranceBadgeMap[insurance] || "bg-gray-100 text-gray-800";

  // Decrypt phone number if encrypted (basic placeholder)
  const phoneNumber = props.patient_phone || props.phone || "N/A";
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Header with Patient Name and Insurance Badge */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-lg font-bold text-navy-700">{props.patient_name || props.Subject || "Patient"}</h5>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${insuranceClass}`}>
          {insurance}
        </span>
      </div>

      {/* Contact Quick-Action with WhatsApp */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="text-gray-600 font-medium">📱</span>
        <a 
          href={`https://wa.me/${phoneNumber.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-500 hover:underline font-semibold"
        >
          {phoneNumber}
        </a>
        <span className="text-green-600 ml-1">💬</span>
      </div>

      {/* Clinical Focus - FDI Tooth Number */}
      {props.tooth_number && (
        <div className="mb-3 p-2 bg-blue-50 rounded border-l-4 border-brand-500">
          <p className="text-sm font-bold text-brand-600">
            Dent: {props.tooth_number}
          </p>
        </div>
      )}

      {/* Procedure/Subject */}
      <p className="text-sm text-gray-700 mb-3">
        <span className="font-semibold">Traitement:</span> {props.Subject || "Consultation"}
      </p>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}>
          {status}
        </span>
        <span className="text-xs text-gray-400">Dr. {props.doctor_name || "Non assigné"}</span>
      </div>

      <button
        onClick={() => {
          navigate(`/admin/patients/${props.patient}/emr`, {
            state: { appointmentId: props.Id },
          });
        }}
        className="w-full bg-brand-500 text-white rounded-xl h-[48px] font-bold mt-4"
      >
        Démarrer la Séance
      </button>
    </div>
  );
};