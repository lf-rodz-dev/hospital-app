"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  User,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelAppointment, fetchAppointmentById } from "@/app/actions/appointment_history";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AppointmentInfo = ({ id, open, onOpenChange }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["appointment-info", id],
    queryFn: () => fetchAppointmentById(id),
    enabled: !!id && open,
  });

  const appointment = data?.data;

  const formatDate = (dateString: string) => {
    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  const getEstadoBadge = (status: string) => {
    const badgeConfig: Record<string, { color: string; label: string }> = {
      pendiente: { color: "bg-yellow-100 text-yellow-800", label: "Pendiente" },
      completada: { color: "bg-green-100 text-green-800", label: "Completada" },
      "sin asistencia": {
        color: "bg-gray-100 text-gray-800",
        label: "Sin asistencia",
      },
      cancelada: { color: "bg-red-100 text-red-800", label: "Cancelada" },
    };

    const config = badgeConfig[status] || badgeConfig.pendiente;
    return <Badge className={`${config.color} text-xs`}>{config.label}</Badge>;
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => cancelAppointment(id),
    onMutate: () => {
      toast.loading("Cancelando cita...", { id: "cancel-appointment" });
    },
    onSuccess: (result) => {
      toast.dismiss("cancel-appointment");
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({queryKey: ["appointments-patient"]})
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.dismiss("cancel-appointment");
      toast.error(error.message);
    },
  });

  const handleCancelAppointment = () => {
    if (!appointment) return;

    // Prevenir cancelar si ya está cancelada
    if (appointment.status === "cancelada") {
      toast.error("Esta cita ya está cancelada");
      return;
    }

    mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        {/* DialogHeader y DialogTitle SIEMPRE presentes */}
        <DialogHeader>
          <DialogTitle>Cita</DialogTitle>
          <DialogDescription>
            Información completa de la cita.
          </DialogDescription>
        </DialogHeader>

        {/* Contenido condicional */}
        {isLoading ? (
          <p className="text-center py-8">Cargando información...</p>
        ) : !appointment ? (
          <p className="text-center py-8 text-red-600">
            No se encontró la cita
          </p>
        ) : (
          <article className="flex flex-col gap-4">
            <section className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {appointment.id_appointment}
              </span>
              {getEstadoBadge(appointment.status)}
            </section>

            <section className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Paciente</p>
                <p className="font-medium">{appointment.patient_name}</p>
              </div>
            </section>

            <section className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Stethoscope className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Doctor</p>
                <p className="font-medium">{appointment.doctor_name}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.name_specialtie}
                </p>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="size-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium text-sm">
                    {formatDate(appointment.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="size-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Hora</p>
                  <p className="font-medium">{formatTime(appointment.time)}</p>
                </div>
              </div>
            </section>

            <section className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Consultorio</p>
                <p className="font-medium">
                  {appointment.office_number}
                </p>
              </div>
            </section>
          </article>
        )}

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Salir</Button>
          </DialogClose>
          <Button
            className="bg-red-600 hover:bg-red-700"
            disabled={
              isPending ||
              isLoading ||
              !appointment ||
              appointment.status === "cancelada"
            }
            onClick={handleCancelAppointment}
          >
            <XCircle className="size-4 mr-2" />
            {isPending ? "Cancelando..." : "Cancelar Cita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentInfo;