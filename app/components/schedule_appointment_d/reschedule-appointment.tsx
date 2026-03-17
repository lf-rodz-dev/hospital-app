"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Clock, CalendarDays } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar } from "../ui/calendar";
import {
  parseDaysAvailable,
  isDayAvailable,
  generateTimeSlots,
} from "@/app/lib/schedule_appointment/utils";
import {
  fetchDoctorAppointmentById,
  fetchOccupiedAppointmentTimes,
} from "@/app/actions/schedule_appointment";
import {
  rescheduleAppointment,
  getDoctorIdByUserId
} from "../../actions/appointment_history";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const RescheduleAppointment = ({ id, open, onOpenChange }: Props) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  // Obtener el id_doctor del id_user
  useEffect(() => {
    const fetchDoctorId = async () => {
      if (session?.user?.id && open) {
        const result = await getDoctorIdByUserId(session.user.id);
        if (result.success && result.id_doctor) {
          setDoctorId(result.id_doctor);
        } else {
          toast.error("No se pudo obtener la información del doctor");
        }
      }
    };

    fetchDoctorId();
  }, [session?.user?.id, open]);

  // Consultar datos del doctor
  const { data: doctorData, isLoading: isDoctorLoading } = useQuery({
    queryKey: ["doctor-reschedule", doctorId],
    queryFn: () => fetchDoctorAppointmentById(doctorId || ""),
    enabled: !!doctorId && open,
  });

  // Consultar horarios ocupados
  const { data: occupiedTimesData } = useQuery({
    queryKey: ["occupiedTimes-reschedule", doctorId, selectedDate],
    queryFn: () => {
      if (!selectedDate) return Promise.resolve(null);
      const dateString = selectedDate.toISOString().split("T")[0];
      return fetchOccupiedAppointmentTimes(doctorId || "", dateString);
    },
    enabled: !!doctorId && !!selectedDate && open,
  });

  const selectedDoctor = doctorData?.data;
  const occupiedTimes = occupiedTimesData?.occupiedTimes || [];

  const availableDays = useMemo(() => {
    if (!selectedDoctor) return [];
    return parseDaysAvailable(selectedDoctor.days_available);
  }, [selectedDoctor]);

  const timeSlots = useMemo(() => {
    if (!selectedDoctor) return [];
    return generateTimeSlots(
      selectedDoctor.start_time,
      selectedDoctor.end_time,
      30,
    );
  }, [selectedDoctor]);

  const isTimePassed = (
    timeString: string,
    selectedDate: Date | undefined,
  ): boolean => {
    if (!selectedDate) return false;

    const now = new Date();
    const selectedDateObj = new Date(selectedDate);

    if (selectedDateObj.toDateString() === now.toDateString()) {
      const [hours, minutes] = timeString.split(":").map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      return slotTime <= now;
    }

    return false;
  };

  const availableTimeSlots = useMemo(() => {
    return timeSlots.filter(
      (slot) =>
        !occupiedTimes.includes(slot) && !isTimePassed(slot, selectedDate),
    );
  }, [timeSlots, occupiedTimes, selectedDate]);

  const isDayDisabled = (date: Date): boolean => {
    if (!selectedDoctor) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;

    return !isDayAvailable(date, availableDays);
  };

  const mutation = useMutation({
    mutationFn: () =>
      rescheduleAppointment({
        id_appointment: id,
        date: selectedDate!.toISOString().split("T")[0],
        time: selectedTime!,
      }),
    onMutate: () => {
      toast.loading("Reagendando cita...", { id: "reschedule" });
    },
    onSuccess: (result) => {
      toast.dismiss("reschedule");
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({
          queryKey: ["appointments-doctor"],
        });
        onOpenChange(false);
        setSelectedDate(undefined);
        setSelectedTime(null);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.dismiss("reschedule");
      toast.error(error.message);
    },
  });

  const canReschedule = selectedDate && selectedTime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reagendar Cita</DialogTitle>
          <DialogDescription>
            Selecciona una nueva fecha y hora para tu cita.
          </DialogDescription>
        </DialogHeader>

        {isDoctorLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Cargando información...</p>
          </div>
        ) : !selectedDoctor ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">
              No se pudo cargar la información del doctor
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedDoctor.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="text-muted-foreground">
                    Consultorio: {selectedDoctor.office_number}
                  </p>
                  <p className="text-muted-foreground">
                    Horario: {selectedDoctor.start_time} -{" "}
                    {selectedDoctor.end_time}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Fecha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDayDisabled}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedDate ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Selecciona una fecha primero
                    </p>
                  ) : availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => {
                        const isOccupied = occupiedTimes.includes(time);
                        const isPassed = isTimePassed(time, selectedDate);
                        const isSelected = selectedTime === time;

                        return (
                          <button
                            key={time}
                            onClick={() =>
                              !isOccupied && !isPassed && setSelectedTime(time)
                            }
                            disabled={isOccupied || isPassed}
                            className={cn(
                              "p-2 rounded border text-sm font-medium transition-all",
                              isOccupied || isPassed
                                ? "border-red-200 bg-red-50 text-red-400 cursor-not-allowed"
                                : "hover:border-primary hover:bg-primary/5",
                              isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : !isOccupied && !isPassed && "border-muted",
                            )}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay horarios disponibles
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {selectedDate && selectedTime && (
              <Card className="bg-green-50 dark:bg-green-950 border-green-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    ✓ Nueva fecha: {selectedDate.toLocaleDateString("es-ES")} a
                    las {selectedTime}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            className="bg-yellow-600 hover:bg-yellow-700"
            onClick={() => mutation.mutate()}
            disabled={!canReschedule || mutation.isPending}
          >
            <Clock className="h-4 w-4 mr-2" />
            {mutation.isPending ? "Reagendando..." : "Reagendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleAppointment;
