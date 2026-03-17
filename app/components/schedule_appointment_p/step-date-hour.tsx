"use client";

import { CalendarDays, Clock } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar } from "../ui/calendar";
import {
  parseDaysAvailable,
  isDayAvailable,
  generateTimeSlots,
  getDayName,
} from "@/app/lib/schedule_appointment/utils";
import { Appointment } from "@/app/lib/schedule_appointment/schema";
import { fetchDoctorAppointmentById } from "@/app/actions/schedule_appointment";
import { fetchOccupiedAppointmentTimes } from "@/app/actions/schedule_appointment";
import { cn } from "@/app/lib/utils";

type Props = {
  selectedDoctorId: string | null;
  appointment: Appointment;
  onAppointmentChange: (appointment: Appointment) => void;
};

const StepDateHour = ({
  selectedDoctorId,
  appointment,
  onAppointmentChange,
}: Props) => {
  // Consultar datos del doctor
  const { data: doctorData, isLoading } = useQuery({
    queryKey: ["doctor", selectedDoctorId],
    queryFn: () => fetchDoctorAppointmentById(selectedDoctorId || ""),
    enabled: !!selectedDoctorId,
  });

  // Consultar horarios ocupados cuando se selecciona una fecha
  const { data: occupiedTimesData } = useQuery({
    queryKey: ["occupiedTimes", selectedDoctorId, appointment.selectedDate],
    queryFn: () => {
      if (!appointment.selectedDate) return Promise.resolve(null);
      const dateString = appointment.selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      return fetchOccupiedAppointmentTimes(selectedDoctorId || "", dateString);
    },
    enabled: !!selectedDoctorId && !!appointment.selectedDate,
  });

  const selectedDoctor = doctorData?.data;
  const occupiedTimes = occupiedTimesData?.occupiedTimes || [];

  // Parsear los días disponibles del doctor
  const availableDays = useMemo(() => {
    if (!selectedDoctor) return [];
    return parseDaysAvailable(selectedDoctor.days_available);
  }, [selectedDoctor]);

  // Generar los slots de tiempo disponibles
  const timeSlots = useMemo(() => {
    if (!selectedDoctor) return [];
    return generateTimeSlots(
      selectedDoctor.start_time,
      selectedDoctor.end_time,
      30
    );
  }, [selectedDoctor]);

  // Función para verificar si una hora ya pasó
  const isTimePassed = (timeString: string, selectedDate: Date | null): boolean => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const selectedDateObj = new Date(selectedDate);
    
    // Si la fecha seleccionada es hoy
    if (selectedDateObj.toDateString() === now.toDateString()) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      
      // Si la hora ya pasó, deshabilitar
      return slotTime <= now;
    }
    
    // Si es una fecha futura, no está pasada
    return false;
  };

  // Filtrar slots que NO están ocupados y que NO han pasado
  const availableTimeSlots = useMemo(() => {
    return timeSlots.filter(
      (slot) => 
        !occupiedTimes.includes(slot) && 
        !isTimePassed(slot, appointment.selectedDate)
    );
  }, [timeSlots, occupiedTimes, appointment.selectedDate]);

  // Obtener nombres de días disponibles
  const availableDayNames = useMemo(() => {
    return availableDays.map((day) => getDayName(day));
  }, [availableDays]);

  // Validador de día para el calendario
  const isDayDisabled = (date: Date): boolean => {
    if (!selectedDoctor) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Deshabilitar días pasados
    if (date < today) return true;

    // Deshabilitar días no disponibles
    return !isDayAvailable(date, availableDays);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onAppointmentChange({
        ...appointment,
        selectedDate: date,
        selectedTime: null, // Reset tiempo cuando cambia la fecha
      });
    }
  };

  const handleTimeSelect = (time: string) => {
    onAppointmentChange({
      ...appointment,
      selectedTime: time,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando información del doctor...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!selectedDoctor) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Selecciona un doctor primero</CardTitle>
          <CardDescription>
            Necesitas seleccionar un doctor para continuar con la cita.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      {/* Card con información del doctor */}
      <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg">{selectedDoctor.name}</CardTitle>
          <CardDescription>
            Consultorio: {selectedDoctor.office_number || "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Horario de atención:
              </p>
              <p className="text-sm">
                {selectedDoctor.start_time} - {selectedDoctor.end_time}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Días disponibles:
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {availableDayNames.map((day) => (
                  <span
                    key={day}
                    className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendario y Horarios */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Seleccione la Fecha
            </CardTitle>
            <CardDescription>
              Elige un día disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={appointment.selectedDate ?? undefined}
              onSelect={handleDateSelect}
              disabled={isDayDisabled}
              captionLayout="dropdown"
              className="rounded-lg border w-full"
            />
            {appointment.selectedDate && (
              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Fecha seleccionada:
                </p>
                <p className="font-semibold">
                  {appointment.selectedDate.toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selector de Horarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Selecciona una hora
            </CardTitle>
            <CardDescription>
              {appointment.selectedDate
                ? "Elige un horario disponible"
                : "Primero selecciona una fecha"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!appointment.selectedDate ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Selecciona una fecha para ver los horarios disponibles</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isOccupied = occupiedTimes.includes(time);
                      const isPassed = isTimePassed(time, appointment.selectedDate);
                      const isSelected = appointment.selectedTime === time;

                      return (
                        <button
                          key={time}
                          onClick={() => !isOccupied && !isPassed && handleTimeSelect(time)}
                          disabled={isOccupied || isPassed}
                          className={cn(
                            "p-2 rounded-lg border-2 text-sm font-medium transition-all",
                            isOccupied || isPassed
                              ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed dark:border-red-900 dark:bg-red-950"
                              : "hover:border-primary hover:bg-primary/5",
                            isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : !isOccupied && !isPassed && "border-muted text-foreground"
                          )}
                          title={isOccupied ? "Horario ocupado" : isPassed ? "Hora ya pasada" : ""}
                        >
                          {time}
                          {(isOccupied || isPassed) && (
                            <span className="text-xs ml-1">✕</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay horarios disponibles para esta fecha
                  </p>
                )}

                {appointment.selectedTime && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✓ Cita agendada para las {appointment.selectedTime}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StepDateHour;