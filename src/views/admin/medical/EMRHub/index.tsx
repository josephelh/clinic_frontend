import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Card from "src/components/card";
import { useMedicalStore } from "src/store/useMedicalStore";
import { PatientBanner } from "src/views/admin/medical/EMRHub/components/PatientBanner";
import { ToothChartContainer } from "src/views/admin/medical/EMRHub/components/ToothChartContainer";
import { ClinicalTimeline } from "src/views/admin/medical/EMRHub/components/ClinicalTimeline";

const EMRHub = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const { startSession } = useMedicalStore();
  
  // Extract appointmentId from router state
  const appointmentId = location.state?.appointmentId || null;

  useEffect(() => {
    if (patientId) {
      console.log("🏥 Starting Medical Session for:", patientId);
      startSession(patientId, appointmentId);
    }
  }, [patientId, appointmentId, startSession]);

  return (
    <div className="flex w-full flex-col gap-5 pt-5">
      {/* Top: Patient Safety & Status Banner */}
      <div className="w-full">
        <PatientBanner />
      </div>

      {/* Main Clinical Grid - optimized for 10-inch tablets */}
      <div className="grid h-full grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: Interactive Tooth Chart (FDI) */}
        <div className="col-span-1 lg:col-span-8 h-full">
          <Card extra="h-full w-full p-4 overflow-hidden">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Odontogramme (FDI)
            </h4>
            <ToothChartContainer />
          </Card>
        </div>

        {/* Right: History & Actions */}
        <div className="col-span-1 lg:col-span-4 h-full">
          <Card extra="h-full w-full p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Chronologie
              </h4>
            </div>
            <ClinicalTimeline />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EMRHub;
