import React, { useState, useMemo } from "react";
import { ToothActionModal } from "./ToothActionModal";
import { useMedicalStore } from "src/store/useMedicalStore";
import { ToothFinding } from "src/services/medicalService";

// --- ANATOMICAL PATHS ---
// These paths mimic the professional look of Incisors, Canines, Premolars, and Molars.
const PATHS = {
  // Detailed Incisor - Tapered root, flat edge
  INCISOR: "M10,2 L20,2 L22,10 L21,35 C21,45 18,55 15,58 C12,55 9,45 9,35 L8,10 Z M12,6 L18,6",
  
  // Detailed Canine - Pointed "Cusp" and long curved root
  CANINE: "M15,1 L24,10 L23,35 C23,52 15,60 15,60 C15,60 7,52 7,35 L6,10 Z M13,12 Q15,8 17,12",
  
  // Detailed Premolar - Two small cusps at the top, rounded body
  PREMOLAR: "M8,5 Q11,2 15,5 Q19,2 22,5 L24,35 C24,50 20,58 15,58 C10,58 6,50 6,35 Z M10,12 L20,12",
  
  // Detailed Molar - The "Classic" multi-root look from your image
  MOLAR: "M5,8 Q10,4 15,8 Q20,4 25,8 L27,30 C27,45 23,55 20,45 L18,35 L12,35 L10,45 C7,55 3,45 3,30 Z M8,12 Q15,8 22,12 M10,25 L20,25",
};
// Helper to determine which shape to use based on FDI number
const getToothShape = (id: number) => {
  const lastDigit = id % 10;
  if (lastDigit <= 2) return PATHS.INCISOR;
  if (lastDigit === 3) return PATHS.CANINE;
  if (lastDigit <= 5) return PATHS.PREMOLAR;
  return PATHS.MOLAR;
};

const CONDITION_COLORS: Record<string, string> = {
  CARIES: "fill-red-500 stroke-red-700",
  MISSING: "fill-gray-100 stroke-gray-300 opacity-30",
  FILLING: "fill-blue-400 stroke-blue-600",
  CROWN: "fill-yellow-500 stroke-yellow-700",
  ROOT_CANAL: "fill-purple-500 stroke-purple-700",
};

export const ToothChartContainer = () => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { emrData } = useMedicalStore();

  const findingMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (emrData.patient?.findings) {
      emrData.patient.findings.forEach((f: ToothFinding) => {
        const color = CONDITION_COLORS[f.condition];
        if (color) map[f.tooth_number] = color;
      });
    }
    return map;
  }, [emrData.patient]);

  const handleToothClick = (toothId: number) => {
    setSelectedTooth(toothId);
    setIsModalOpen(true);
  };

  const renderTooth = (id: number, isLower: boolean) => {
    const colorClass = findingMap[id] || "fill-white stroke-gray-400";
    const pathData = getToothShape(id);
    
    return (
      <div 
        key={id}
        className="flex flex-col items-center justify-center gap-1 cursor-pointer group"
        onClick={() => handleToothClick(id)}
      >
        {/* Number on top for Upper, bottom for Lower to match image */}
        {!isLower && <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-500">{id}</span>}
        
        <svg 
          width="40" 
          height="60" 
          viewBox="0 0 30 60" 
          className={`transition-all duration-200 transform 
            ${isLower ? "" : "rotate-180"} 
            ${colorClass} group-hover:stroke-brand-500 group-hover:scale-105`}
        >
          <path d={pathData} strokeWidth="1.5" />
        </svg>

        {isLower && <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand-500">{id}</span>}
      </div>
    );
  };

  // Quadrants logic
  const Q1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const Q2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const Q4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const Q3 = [31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <div className="flex flex-col items-center justify-center w-full bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-sm">
      
      {/* Legend */}
      <div className="mb-10 flex flex-wrap justify-center gap-6 text-xs font-bold text-gray-500">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Carie</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> Obturation</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Couronne</div>
        <div className="flex items-center gap-2 text-gray-300"><div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm"></div> Absente</div>
      </div>

      <div className="relative flex flex-col gap-4 border-gray-100 p-4">
        
        {/* Vertical & Horizontal Crosshairs (Medical Look) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 -translate-y-1/2"></div>

        {/* Upper Jaw Row */}
        <div className="flex gap-4 mb-4">
          <div className="flex gap-1">{Q1.map(id => renderTooth(id, false))}</div>
          <div className="flex gap-1">{Q2.map(id => renderTooth(id, false))}</div>
        </div>

        {/* Lower Jaw Row */}
        <div className="flex gap-4 mt-4">
          <div className="flex gap-1">{Q4.map(id => renderTooth(id, true))}</div>
          <div className="flex gap-1">{Q3.map(id => renderTooth(id, true))}</div>
        </div>
      </div>

      <ToothActionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        toothNumber={selectedTooth}
      />
    </div>
  );
};