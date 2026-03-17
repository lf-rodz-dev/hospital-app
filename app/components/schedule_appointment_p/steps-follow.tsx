"use client";

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/app/lib/utils";
import { Button } from "../ui/button";
import StepSpecialty from "./step-specialty";
import StepDoctor from "./step-doctor";
import StepDateHour from "./step-date-hour";
import StepConfirmation from "./step-confirmation";
import {
  Doctor,
  Patient,
  Appointment,
  Specialty,
} from "@/app/lib/schedule_appointment/schema";
import { useMutation } from "@tanstack/react-query";
import { createAppointment } from "@/app/actions/schedule_appointment";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

const StepsFollow = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Datos del Paciente (obtenido de la sesión)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [patient, setPatient] = useState<Patient>();

  // Datos de la Especialidad
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(
    null,
  );
  const [specialty, setSpecialty] = useState<Specialty>();

  // Datos del Doctor
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [doctor, setDoctor] = useState<Doctor>();

  // Estado para la cita
  const [appointment, setAppointment] = useState<Appointment>({
    selectedDate: null,
    selectedTime: null,
  });

  // Pasos actualizados (sin Paciente)
  const [steps] = useState([
    { num: 1, title: "Especialidad", icon: GraduationCap },
    { num: 2, title: "Doctor", icon: Stethoscope },
    { num: 3, title: "Fecha y Hora", icon: CalendarDays },
    { num: 4, title: "Confirmacion", icon: CheckCircle2 },
  ]);

  // ✅ Efecto para obtener id_user de la sesión al cargar
  useEffect(() => {
    if (session?.user?.id) {
      setSelectedPatientId(session.user.id);
      // Aquí puedes cargar los datos del paciente si es necesario
      setPatient({
        id_user: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        // Agrega más campos según tu schema de Patient
      } as Patient);
      setIsLoading(false);
    }
  }, [session]);

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return selectedSpecialtyId !== null;
      case 2:
        return selectedDoctorId !== null;
      case 3:
        return (
          appointment.selectedDate !== null && appointment.selectedTime !== null
        );
      default:
        return true;
    }
  };

  const handleFormer = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSpecialtySelect = (specialty: Specialty) => {
    setSelectedSpecialtyId(specialty.id_specialtie);
    setSpecialty(specialty);
  };

  const handleDoctorSlect = (doctor: Doctor) => {
    setSelectedDoctorId(doctor.id_doctor);
    setDoctor(doctor);
  };

  const handleAppointmentChange = (updatedAppointment: Appointment) => {
    setAppointment(updatedAppointment);
  };

  const mutation = useMutation({
    mutationFn: createAppointment,
    onMutate: () => {
      toast.loading("Agendando cita...", { id: "create-appointment" });
    },
    onSuccess: (result) => {
      toast.dismiss("create-appointment");

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/dating_history");
      } else {
        toast.error(result.message || "Error desconocido");
      }
    },
    onError: () => {
      toast.dismiss("create-appointment");
      toast.error("Error inesperado al crear la cita");
    },
  });

  const handleScheduleAppointment = () => {
    if (
      !selectedPatientId ||
      !selectedSpecialtyId ||
      !selectedDoctorId ||
      !appointment.selectedDate ||
      !appointment.selectedTime
    ) {
      return;
    }

    mutation.mutate({
      id_user: selectedPatientId,
      id_specialty: selectedSpecialtyId,
      id_doctor: selectedDoctorId,
      date: appointment.selectedDate
        .toISOString()
        .split("T")[0], // YYYY-MM-DD
      time: appointment.selectedTime,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Cargando...</div>;
  }

  return (
    <>
      {/* Indicador de pasos */}
      <div className="flex items-center justify-center overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div key={step.num} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
                  currentStep === step.num
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep > step.num
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {currentStep > step.num ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm font-medium text-center",
                  currentStep >= step.num
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-20 mx-2",
                  currentStep > step.num
                    ? "bg-primary"
                    : "bg-muted-foreground/30",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Contenido de los pasos */}
      <div>
        {currentStep === 1 && (
          <StepSpecialty
            selectedSpecialty={selectedSpecialtyId}
            onSpecialtySelect={handleSpecialtySelect}
          />
        )}

        {currentStep === 2 && (
          <StepDoctor
            id_specialty={selectedSpecialtyId}
            selectedDoctor={selectedDoctorId}
            onDoctorSelect={handleDoctorSlect}
          />
        )}

        {currentStep === 3 && (
          <StepDateHour
            selectedDoctorId={selectedDoctorId}
            appointment={appointment}
            onAppointmentChange={handleAppointmentChange}
          />
        )}

        {currentStep === 4 && patient && specialty && doctor && (
          <StepConfirmation
            patient={patient}
            specialty={specialty}
            doctor={doctor}
            appointment={appointment}
          />
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex items-center justify-around mt-8">
        <Button
          variant="outline"
          onClick={handleFormer}
          disabled={currentStep === 1}
          className="gap-2 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceedToNext()}
            className="gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            className="gap-2 bg-green-600 hover:bg-green-700" 
            onClick={handleScheduleAppointment}
            disabled={mutation.isPending}
          >
            <CheckCircle2 className="h-4 w-4" />
            {mutation.isPending ? "Agendando..." : "Agendar Cita"}
          </Button>
        )}
      </div>
    </>
  );
};

export default StepsFollow;