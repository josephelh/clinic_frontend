export const EditorTemplate = (props: any) => {
  return (
    <div className="p-5 grid grid-cols-1 gap-4">
      <div>
        <label className="text-sm font-bold text-navy-700">Sujet</label>
        <input id="Subject" name="Subject" className="e-field e-input w-full" defaultValue={props.Subject} />
      </div>
      <div>
        <label className="text-sm font-bold text-navy-700">Dent (FDI)</label>
        <input id="tooth_number" name="tooth_number" className="e-field e-input w-full" defaultValue={props.tooth_number} type="number" />
      </div>
      <div>
        <label className="text-sm font-bold text-navy-700">Médecin</label>
        <select id="doctor" name="doctor" className="e-field e-input w-full" defaultValue={props.doctor}>
           {/* This will be populated dynamically in the next step */}
           <option value={props.doctor}>Médecin Actuel</option>
        </select>
      </div>
    </div>
  );
};