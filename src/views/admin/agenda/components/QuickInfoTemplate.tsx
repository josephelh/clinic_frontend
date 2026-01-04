export const QuickInfoTemplate = (props: any) => {
  return (
    <div className="p-4">
      <h5 className="text-lg font-bold text-navy-700">{props.Subject}</h5>
      <p className="text-sm text-gray-600">Patient: {props.patient_name}</p>
      <p className="text-sm font-bold text-brand-500">Dent FDI: {props.tooth_number || 'N/A'}</p>
      <div className="mt-2 text-xs text-gray-400">Dr. {props.doctor_name}</div>
    </div>
  );
};