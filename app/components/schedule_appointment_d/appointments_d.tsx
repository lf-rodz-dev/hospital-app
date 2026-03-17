"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  AlertCircle,
  Loader,
  CheckCircle2,
  XCircle,
  MoreHorizontalIcon,
  List,
  Clipboard,
  Eye,
  Pencil,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchAppointmentsDoctor } from "@/app/actions/appointment_history";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { useState } from "react";
import CancelAppointment from "./cancel-appointment";
import CompletedAppointment from "./completed-appointment";
import UnassistedAppointment from "./unassisted-appointment";
import RescheduleAppointment from "./reschedule-appointment";
import PeriodFilter from "../period-filter";
import CreateRecipe from "./create-recipe";
import {
  Appointment,
  DateRange,
  PeriodType,
} from "@/app/lib/schedule_appointment/types";
import EditRecipe from "./edit-recipe";
import RecipeViewer from "./recipe-viewer";

const AppointmentsD = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompletedDialog, setShowCompletedDialog] = useState(false);
  const [showUnassistedDialog, setShowUnassistedDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [period, setPeriod] = useState<PeriodType>("week");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
  const [showEditRecipe, setShowEditRecipe] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [showRecipePreview, setShowRecipePreview] = useState(false);
  const { data: session } = useSession();

  // Obtener fecha de hoy en formato YYYY-MM-DD
  const getLocalDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString();

  const { data, isLoading } = useQuery({
    queryKey: [
      "appointments-doctor",
      session?.user?.id,
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () =>
      fetchAppointmentsDoctor(
        session?.user?.id || "",
        dateRange.startDate || todayStr,
        dateRange.endDate || dateRange.startDate || todayStr,
      ),
    enabled: !!session?.user?.id,
  });

  // Obtener las citas de forma segura
  const appointments = data?.data ?? [];

  // Separar citas activas y pasadas
  const separateAppointments = (appointments: Appointment[]) => {
    return appointments.reduce(
      (acc, apt) => {
        const isFutureOrToday = apt.date >= todayStr;
        const isPending = apt.status === "pendiente";

        if (isFutureOrToday && isPending) {
          acc.active.push(apt);
        } else {
          acc.past.push(apt);
        }

        return acc;
      },
      { active: [] as Appointment[], past: [] as Appointment[] },
    );
  };

  const { active, past } = separateAppointments(appointments);

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

  const getEstadoIcon = (status: string) => {
    switch (status) {
      case "pendiente":
        return <Clock className="size-4 text-yellow-600 shrink-0" />;
      case "completada":
        return <CheckCircle2 className="size-4 text-green-600 shrink-0" />;
      case "sin asistencia":
        return <XCircle className="size-4 text-gray-600 shrink-0" />;
      case "cancelada":
        return <AlertCircle className="size-4 text-red-600 shrink-0" />;
      default:
        return <Clock className="size-4 text-yellow-600 shrink-0" />;
    }
  };

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

  const handlePeriodChange = (
    newPeriod: PeriodType,
    newDateRange: DateRange,
  ) => {
    setPeriod(newPeriod);
    setDateRange(newDateRange);
  };

  const handleCancel = (id: string) => {
    setSelectedId(id);
    setShowCancelDialog(true);
  };

  const handleCompleted = (id: string) => {
    setSelectedId(id);
    setShowCompletedDialog(true);
  };

  const handleUnassisted = (id: string) => {
    setSelectedId(id);
    setShowUnassistedDialog(true);
  };

  const handleReschedule = (id: string) => {
    setSelectedId(id);
    setShowRescheduleDialog(true);
  };

  const handleCreateRecipe = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRecipeDialog(true);
  };

  const handleEditRecipe = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditRecipe(true);
  }

  const handleViewRecipe = (appointmentId: string) => {
    setAppointmentId(appointmentId);
    setShowRecipePreview(true);
  };

  const renderAppointmentCard = (appointment: Appointment, isPast: boolean) => (
    <Card
      key={appointment.id_appointment}
      className="hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {getEstadoIcon(appointment.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">
                  {appointment.id_appointment}
                </span>
                {getEstadoBadge(appointment.status)}
              </div>
              <h3 className="font-medium mt-1 truncate">
                {appointment.patient_name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Stethoscope className="size-3.5" />
                <span>{appointment.doctor_name}</span>
                <span className="mx-1">•</span>
                <span>{appointment.name_specialtie}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  <span>{formatTime(appointment.time)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  <span>Consultorio {appointment.office_number}</span>
                </div>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <List />
                  Estatus
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      disabled={isPast}
                      onSelect={() =>
                        handleCompleted(appointment.id_appointment)
                      }
                    >
                      <CheckCircle2 className="size-4 text-green-600 shrink-0" />{" "}
                      Completada
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={isPast}
                      onSelect={() =>
                        handleReschedule(appointment.id_appointment)
                      }
                    >
                      <Clock className="size-4 text-yellow-600 shrink-0" />{" "}
                      Reagendar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={isPast}
                      onSelect={() => handleCancel(appointment.id_appointment)}
                    >
                      <XCircle className="size-4 text-red-600 shrink-0" />{" "}
                      Cancelar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={isPast}
                      onSelect={() =>
                        handleUnassisted(appointment.id_appointment)
                      }
                    >
                      <XCircle className="size-4 text-gray-600 shrink-0" />
                      Sin Asistencia
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Clipboard />
                  Receta
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {appointment.has_recipe_record === 0 && (
                      <DropdownMenuItem
                        onSelect={() => handleCreateRecipe(appointment)}
                      >
                        <Plus />
                        Crear
                      </DropdownMenuItem>
                    )}

                    {appointment.has_recipe_record === 1 && (
                      <>
                        <DropdownMenuItem onSelect={() => handleEditRecipe(appointment)}>
                          <Pencil />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleViewRecipe(appointment.id_appointment)}>
                          <Eye/>
                          Ver
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Filtro de períodos */}
      <PeriodFilter
        currentPeriod={period}
        dateRange={dateRange}
        onPeriodChange={handlePeriodChange}
      />

      <Tabs defaultValue="activas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activas" className="gap-2">
            <Calendar className="size-4" />
            Citas Activas {active.length}
          </TabsTrigger>
          <TabsTrigger value="pasadas" className="gap-2">
            <Calendar className="size-4" />
            Citas Pasadas {past.length}
          </TabsTrigger>
        </TabsList>

        {/* Citas Activas */}
        <TabsContent value="activas" className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-6 w-6 animate-spin mr-2" />
              <span className="text-gray-500">Cargando citas...</span>
            </div>
          ) : active.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No tienes citas activas programadas.
              </AlertDescription>
            </Alert>
          ) : (
            active.map((appointment) =>
              renderAppointmentCard(appointment, false),
            )
          )}
        </TabsContent>

        {/* Citas Pasadas */}
        <TabsContent value="pasadas" className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-6 w-6 animate-spin mr-2" />
              <span className="text-gray-500">Cargando citas...</span>
            </div>
          ) : past.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No tienes citas pasadas.</AlertDescription>
            </Alert>
          ) : (
            past.map((appointment) => renderAppointmentCard(appointment, true))
          )}
        </TabsContent>
      </Tabs>

      {selectedId && (
        <>
          <CancelAppointment
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            id={selectedId}
          />
          <CompletedAppointment
            open={showCompletedDialog}
            onOpenChange={setShowCompletedDialog}
            id={selectedId}
          />
          <UnassistedAppointment
            open={showUnassistedDialog}
            onOpenChange={setShowUnassistedDialog}
            id={selectedId}
          />
          <RescheduleAppointment
            id={selectedId}
            open={showRescheduleDialog}
            onOpenChange={setShowRescheduleDialog}
          />
        </>
      )}
      {selectedAppointment && (
        <>
        <CreateRecipe
          open={showRecipeDialog}
          onOpenChange={setShowRecipeDialog}
          appointment={selectedAppointment}
        />
        <EditRecipe open={showEditRecipe} onOpenChange={setShowEditRecipe} appointment={selectedAppointment}/>
        </>
      )}
      {appointmentId && (
        <RecipeViewer open={showRecipePreview} onOpenChange={setShowRecipePreview} appointmentId={appointmentId}/>
      )}
    </>
  );
};

export default AppointmentsD;
