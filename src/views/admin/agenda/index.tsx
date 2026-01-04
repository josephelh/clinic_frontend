import { useEffect, useState } from "react";
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  ResourcesDirective,
  ResourceDirective,
  Resize,
  DragAndDrop,
  View,
} from "@syncfusion/ej2-react-schedule";
import Card from "components/card";
import {
  appointmentService,
  Appointment,
} from "src/services/appointmentService";
import { doctorService, DoctorResource } from "src/services/doctorService";
import { QuickInfoTemplate } from "./components/QuickInfoTemplate";
import { EditorTemplate } from "components/editorTemplate";
import Loader from "src/components/loader/Loader";

const AgendaView = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appData, docData] = await Promise.all([
          appointmentService.getAppointments(),
          // Now that we fixed the backend, this won't 404
          doctorService.getClinicDoctors(),
        ]);

        setAppointments(appData);
        setDoctors(docData);
      } catch (err) {
        console.error("Connection Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading)
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
     <div className="mt-3 h-full">
      <Card extra="w-full h-[calc(100vh-150px)] p-4">
        <ScheduleComponent
          width="100%"
          height="100%"
          currentView="Week"
          selectedDate={new Date()} // Shows current date
          eventSettings={{ 
            dataSource: appointments,
            fields: {
                id: 'Id',
                subject: { name: 'Subject' },
                startTime: { name: 'StartTime' },
                endTime: { name: 'EndTime' },
                resourceId: 'doctor' // Matches the 'doctor' ID in appointments
            }
          }}
          group={{ resources: ['Doctors'] }}
          quickInfoTemplates={{ content: QuickInfoTemplate }}
          editorTemplate={EditorTemplate}
        >
          <ResourcesDirective>
            <ResourceDirective
              field="doctor"
              title="Médecin"
              name="Doctors"
              dataSource={doctors}
              idField="id"
              textField="full_name"
              colorField="color"
            />
          </ResourcesDirective>
          <ViewsDirective>
            <ViewDirective option="Day" />
            <ViewDirective option="WorkWeek" />
            <ViewDirective option="Month" />
          </ViewsDirective>
          <Inject services={[Day, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
        </ScheduleComponent>
      </Card>
    </div>
  );
};

export default AgendaView;
