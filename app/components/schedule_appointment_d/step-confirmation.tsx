"use client";

import {
  Appointment,
  Doctor,
  Patient,
  Specialty,
} from "@/app/lib/schedule_appointment/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  CalendarDays,
  CheckCircle2,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

type Props = {
  patient: Patient;
  specialty: Specialty;
  doctor: Doctor;
  appointment: Appointment;
};

const StepConfirmation = ({
  patient,
  specialty,
  doctor,
  appointment,
}: Props) => {
  if (!patient || !specialty || !doctor) return null;

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <section aria-labelledby="confirmation-title">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle
            id="confirmation-title"
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            Confirmar Cita
          </CardTitle>
          <CardDescription>
            Revisa los detalles de tu cita antes de agendarla.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Paciente */}
            <article className="rounded-xl border p-4">
              <header className="mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-primary" />
                  Paciente
                </h3>
              </header>

              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Correo: {patient.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Teléfono: {patient.phone}
                  </p>
                </div>
              </div>
            </article>

            {/* Doctor */}
            <article className="rounded-xl border p-4">
              <header className="mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  Doctor
                </h3>
              </header>

              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {doctor.doctor_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{doctor.doctor_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Consultorio: {doctor.office_number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Horario: {doctor.start_time} - {doctor.end_time}
                  </p>
                </div>
              </div>
            </article>

            {/* Fecha y Hora */}
            <article className="rounded-xl border p-4">
              <header className="mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Fecha y Hora
                </h3>
              </header>

              {appointment.selectedDate && appointment.selectedTime ? (
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-primary/10"
                    aria-hidden
                  >
                    <span className="text-2xl font-bold text-primary">
                      {appointment.selectedDate.getDate()}
                    </span>
                    <span className="text-xs text-primary">
                      {meses[
                        appointment.selectedDate.getMonth()
                      ].slice(0, 3)}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium capitalize">
                      {appointment.selectedDate.toLocaleDateString("es-MX", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {appointment.selectedTime}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No se ha seleccionado fecha u hora
                </p>
              )}
            </article>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default StepConfirmation;