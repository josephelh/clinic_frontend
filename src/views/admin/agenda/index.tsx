import { useEffect, useState, useRef } from "react";
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
  DragEventArgs,
  ResizeEventArgs,
} from "@syncfusion/ej2-react-schedule";
import Card from "components/card";
import {
  appointmentService,
  Appointment,
} from "src/services/appointmentService";
import { doctorService, DoctorResource } from "src/services/doctorService";
import { patientService, Patient } from "src/services/patientService";
import { QuickInfoTemplate } from "./components/QuickInfoTemplate";
import { EditorTemplate } from "components/editorTemplate";
import Loader from "src/components/loader/Loader";
import { useAuthStore } from "src/store/useAuthStore";

const AgendaView = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorResource[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const scheduleObj = useRef<ScheduleComponent>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [docData, patientResponse, appData] = await Promise.all([
          doctorService.getClinicDoctors(),
          patientService.getPatients(), // Used for dropdowns? Note: Only first 20 will load.
          appointmentService.getAppointments(),
        ]);

        let finalAppointments = appData;
        let finalDoctors = docData;
        const patientData = patientResponse.data;

        if (user?.role === 'DOCTOR') {
            const currentDoctor = docData.find(d => d.username === user.username);
            if (currentDoctor) {
                // Filter appointments for this doctor only
                finalAppointments = appData.filter(app => app.doctor === currentDoctor.id);
                // Determine if we should only show the current doctor in the resource view
                finalDoctors = [currentDoctor];
            }
        }

        // CRITICAL: Ensure all appointments have valid doctor IDs and Dates
        // Filter out appointments without doctor assignment
        const validAppointments = finalAppointments
          .filter(app => app.doctor != null)
          .map(app => {
            const start = app.StartTime instanceof Date ? app.StartTime : new Date(app.StartTime);
            let end = app.EndTime instanceof Date ? app.EndTime : new Date(app.EndTime);

            // Fix invalid data where EndTime < StartTime (Common seeding error)
            if (end <= start) {
                console.warn(`⚠️ Fixing invalid appointment duration for ID ${app.Id}: EndTime was before StartTime.`);
                end = new Date(start.getTime() + 30 * 60000); // Add 30 minutes
            }

            return {
                ...app,
                StartTime: start,
                EndTime: end,
                IsAllDay: false // Force vertical grid rendering
            };
          });
        
        console.log('📅 Appointments loaded:', validAppointments.length);
        console.log('👨‍⚕️ Doctors loaded:', finalDoctors.map(d => ({ id: d.id, name: d.full_name })));
        
        setAppointments(validAppointments);
        setDoctors(finalDoctors);
        setPatients(patientData);
      } catch (err) {
        console.error("Connection Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
        loadData();
    }
  }, [user]);

  // Handle Drag & Drop
  const onDragStop = async (args: DragEventArgs) => {
    if (!args.data) return;
    
    const updatedData = args.data as Appointment; // Contains updated StartTime/EndTime
    
    // Note: args.data in Syncfusion DragEventArgs usually contains the updated event object.
    
    // Optimistic Update
    const updatedList = appointments.map(app => 
        app.Id === updatedData.Id ? { ...app, StartTime: updatedData.StartTime, EndTime: updatedData.EndTime, doctor: updatedData.doctor } : app
    );
    setAppointments(updatedList);

    try {
        if (!updatedData.Id) throw new Error("No appointment ID");
        await appointmentService.updateAppointment(updatedData.Id, {
            StartTime: updatedData.StartTime,
            EndTime: updatedData.EndTime,
            doctor: updatedData.doctor
        });
    } catch (err) {
        console.error("Failed to update appointment on drag", err);
        const originalData = await appointmentService.getAppointments();
        setAppointments(originalData); 
    }
  };

  // Handle Resize
  const onResizeStop = async (args: ResizeEventArgs) => {
    if (!args.data) return;
    
    const updatedData = args.data as Appointment;
    
     // Optimistic Update
     const updatedList = appointments.map(app => 
        app.Id === updatedData.Id ? { ...app, StartTime: updatedData.StartTime, EndTime: updatedData.EndTime } : app
    );
    setAppointments(updatedList);

    try {
        if (!updatedData.Id) throw new Error("No appointment ID");
        await appointmentService.updateAppointment(updatedData.Id, {
            StartTime: updatedData.StartTime,
            EndTime: updatedData.EndTime
        });
    } catch (err) {
        console.error("Failed to update appointment on resize", err);
        const originalData = await appointmentService.getAppointments();
        setAppointments(originalData); 
    }
  };

  // Handle Editor Save
  const handleEditorSave = async (data: any) => {
    const isNew = !data.Id;
    
    try {
        if (isNew) {
            await appointmentService.createAppointment(data);
            const allApps = await appointmentService.getAppointments();
            setAppointments(allApps);
        } else {
            await appointmentService.updateAppointment(data.Id, data);
            setAppointments(prev => prev.map(app => app.Id === data.Id ? { ...app, ...data } : app));
        }

        if (scheduleObj.current) {
            scheduleObj.current.closeEditor();
        }
    } catch (err) {
        console.error("Failed to save appointment", err);
        alert("Erreur lors de l'enregistrement");
    }
  };

  const handleEditorCancel = () => {
    if (scheduleObj.current) {
        scheduleObj.current.closeEditor();
    }
  };

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
          ref={scheduleObj}
          width="100%"
          height="100%"
          startHour="08:00"
          endHour="18:00"
          currentView="WorkWeek"
          
          selectedDate={new Date()}
          eventSettings={{ 
            dataSource: appointments,
            fields: {
              id: 'Id',
              subject: { name: 'Subject' },
              startTime: { name: 'StartTime' },
              endTime: { name: 'EndTime' },
              description: { name: 'Description' }
            }
          }}
          dragStop={onDragStop}
          resizeStop={onResizeStop}

          group={{ 
            resources: ['Doctors']
          }}
          quickInfoTemplates={{ content: (props: any) => <QuickInfoTemplate {...props} /> }}
          editorFooterTemplate={() => <div />} 
          editorTemplate={(props: any) => (
            <EditorTemplate 
              {...props} 
              patients={patients} 
              doctors={doctors}
              userRole={user?.role}
              onSave={handleEditorSave}
              onCancel={handleEditorCancel}
              setPatients={setPatients}
            />
          )}
        >
          <ResourcesDirective>
            <ResourceDirective
              field="doctor"
              title="Médecin"
              name="Doctors"
              allowMultiple={false}
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
