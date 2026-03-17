"use client";

import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";
import { Button } from "../ui/button";
import StepPatient from "./step-patient";
import StepDateHour from "./step-date-hour";
import StepConfirmation from "./step-confirmation";
import {
  Doctor,
  Patient,
  Appointment,
  Specialty,
} from "@/app/lib/schedule_appointment/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  createAppointment, 
  fetchDoctorInfoById,
  fetchDoctorsAppointment,
  fetchSpecialtiesAppointment 
} from "@/app/actions/schedule_appointment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface SpecialtiesResponse {
  success: boolean;
  data: Specialty[];
}

interface DoctorsResponse {
  success: boolean;
  data: Doctor[];
}

const StepsFollow = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Estados del formulario
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  
  const [appointment, setAppointment] = useState<Appointment>({
    selectedDate: null,
    selectedTime: null,
  });

  const steps = [
    { num: 1, title: "Paciente", icon: Users },
    { num: 2, title: "Fecha y Hora", icon: CalendarDays },
    { num: 3, title: "Confirmación", icon: CheckCircle2 },
  ];

  // Cargar info del doctor al iniciar
  useEffect(() => {
    if (!session?.user?.id) return;

    const loadDoctorInfo = async () => {
      const result = await fetchDoctorInfoById(session.user.id);
      if (result.success) {
        setSelectedDoctorId(result.id_doctor);
        setSelectedSpecialtyId(result.id_specialtie);
      }
    };

    loadDoctorInfo();
  }, [session?.user?.id]);

  // Cargar especialidad completa cuando se obtiene el ID
  const { data: specialties } = useQuery<SpecialtiesResponse>({
    queryKey: ["specialties-appointment"],
    queryFn: fetchSpecialtiesAppointment,
    enabled: !!selectedSpecialtyId,
  });

  useEffect(() => {
    if (specialties?.data && selectedSpecialtyId) {
      const found = specialties.data.find(
        (s: Specialty) => s.id_specialtie === selectedSpecialtyId
      );
      if (found) setSpecialty(found);
    }
  }, [specialties, selectedSpecialtyId]);

  // Cargar doctor completo cuando se obtiene el ID
  const { data: doctors } = useQuery<DoctorsResponse>({
    queryKey: ["doctors-appointment", selectedSpecialtyId],
    queryFn: () => fetchDoctorsAppointment(selectedSpecialtyId),
    enabled: !!selectedSpecialtyId,
  });

  useEffect(() => {
    if (doctors?.data && selectedDoctorId) {
      const found = doctors.data.find((d: Doctor) => d.id_doctor === selectedDoctorId);
      if (found) setDoctor(found);
    }
  }, [doctors, selectedDoctorId]);

  // Validar si puede avanzar al siguiente paso
  const canProceedToNext = (): boolean => {
    if (currentStep === 1) return selectedPatientId !== null;
    if (currentStep === 2)
      return appointment.selectedDate !== null && appointment.selectedTime !== null;
    return true;
  };

  // Navegación
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 3) setCurrentStep(currentStep + 1);
  };

  // Handlers de selección
  const handlePatientSelect = (selectedPatient: Patient) => {
    setSelectedPatientId(selectedPatient.id_user);
    setPatient(selectedPatient);
  };

  // Agendar cita
  const mutation = useMutation({
    mutationFn: createAppointment,
    onMutate: () => {
      toast.loading("Agendando cita...", { id: "create-appointment" });
    },
    onSuccess: (result) => {
      toast.dismiss("create-appointment");

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/patient_appointments");
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
      !selectedDoctorId ||
      !selectedSpecialtyId ||
      !appointment.selectedDate ||
      !appointment.selectedTime
    ) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    mutation.mutate({
      id_user: selectedPatientId,
      id_specialty: selectedSpecialtyId,
      id_doctor: selectedDoctorId,
      date: appointment.selectedDate.toISOString().split("T")[0],
      time: appointment.selectedTime,
    });
  };

  return (
    <>
      {/* Indicador de pasos */}
      <div className="flex items-center justify-center overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div key={step.num} className="flex items-center shrink-0">
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
                  currentStep > step.num ? "bg-primary" : "bg-muted-foreground/30",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Contenido de los pasos */}
      <div>
        {currentStep === 1 && (
          <StepPatient
            selectedPatient={selectedPatientId}
            onPatientSelect={handlePatientSelect}
          />
        )}

        {currentStep === 2 && (
          <StepDateHour
            selectedDoctorId={selectedDoctorId}
            appointment={appointment}
            onAppointmentChange={setAppointment}
          />
        )}

        {currentStep === 3 && patient && specialty && doctor && (
          <StepConfirmation
            patient={patient}
            specialty={specialty}
            doctor={doctor}
            appointment={appointment}
          />
        )}

        {currentStep === 3 && (!patient || !specialty || !doctor) && (
          <div className="text-center py-8 text-muted-foreground">
            Cargando información de confirmación...
          </div>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex items-center justify-around mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {currentStep < 3 ? (
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
            disabled={!patient || !specialty || !doctor}
          >
            <CheckCircle2 className="h-4 w-4" />
            Agendar Cita
          </Button>
        )}
      </div>
    </>
  );
};

export default StepsFollow;