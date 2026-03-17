"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/app/lib/utils";
import { fetchDoctorsAppointment } from "@/app/actions/schedule_appointment";
import { fetchDoctorsResponse, Doctor } from "@/app/lib/schedule_appointment/schema";

type Props = {
  id_specialty: string | null;
  selectedDoctor: string | null;
  onDoctorSelect: (doctor: Doctor) => void;
};

const StepDoctor = ({ id_specialty, selectedDoctor, onDoctorSelect }: Props) => {
  const { data, isLoading, error } = useQuery<fetchDoctorsResponse>({
    queryKey: ["doctors-appointment", id_specialty],
    queryFn: () => fetchDoctorsAppointment(id_specialty),
    enabled: !!id_specialty,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando doctores...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error al cargar doctores</CardTitle>
          <CardDescription>
            {data?.message || "Ocurrió un error al obtener los doctores"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay doctores disponibles</CardTitle>
          <CardDescription>
            No se encontraron doctores para esta especialidad
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Seleccione un Doctor</CardTitle>
        <CardDescription>Elige el doctor para tu consulta.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((doctor) => (
            <button
              type="button"
              key={doctor.id_doctor}
              onClick={() => onDoctorSelect(doctor)}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:border-primary hover:bg-primary/5",
                selectedDoctor === doctor.id_doctor
                  ? "border-primary bg-primary/10"
                  : "border-muted",
              )}
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {doctor.doctor_name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{doctor.doctor_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Consultorio: {doctor.office_number}
                </p>
                <p className="text-sm text-muted-foreground">
                  Horario: {doctor.start_time} - {doctor.end_time}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepDoctor;