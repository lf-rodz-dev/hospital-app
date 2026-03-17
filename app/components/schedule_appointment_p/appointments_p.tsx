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
  MoreHorizontal,
  List,
  Clipboard,
  Eye,
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
import { fetchAppointmentsPatient } from "@/app/actions/appointment_history";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import AppointmentInfo from "./appointment-info";
import { useState, useEffect } from "react";
import PeriodFilter from "../period-filter";
import RecipeViewer from "../schedule_appointment_d/recipe-viewer";

interface Appointment {
  id_appointment: string;
  id_user: string;
  id_specialty: string;
  id_doctor: string;
  date: string;
  time: string;
  status: "pendiente" | "completada" | "sin asistencia" | "cancelada";
  patient_name: string;
  doctor_name: string;
  name_specialtie: string;
  office_number: string;
  created_at: string;
  updated_at: string;
}

type PeriodType = "day" | "week" | "month";

interface DateRange {
  startDate: string;
  endDate: string;
}

const AppointmentsP = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const { data: session } = useSession();
  const [period, setPeriod] = useState<PeriodType>("week");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [showRecipePreview, setShowRecipePreview] = useState(false);

  // 🔹 SINCRONIZACIÓN DEL FILTRO (FIX)
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      setStartDate(dateRange.startDate);
      setEndDate(dateRange.endDate);
    }
  }, [dateRange]);

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
    queryKey: ["appointments-patient", session?.user?.id, startDate, endDate],
    queryFn: () =>
      fetchAppointmentsPatient(
        session?.user?.id || "",
        startDate || todayStr,
        endDate || startDate || todayStr,
      ),
    enabled: !!session?.user?.id,
  });

  const appointments = data?.data ?? [];

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
    return timeString.substring(0, 5);
  };

  const handlePeriodChange = (
    newPeriod: PeriodType,
    newDateRange: DateRange,
  ) => {
    setPeriod(newPeriod);
    setDateRange(newDateRange);
  };

  const handleClick = (id: string) => {
    setSelectedId(id);
    setShowDialog(true);
  };

  const handleViewRecipe = (appointmentId: string) => {
    setAppointmentId(appointmentId);
    setShowRecipePreview(true);
  };

  const renderAppointmentCard = (appointment: Appointment) => (
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
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <List /> Estatus
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() => handleClick(appointment.id_appointment)}
                  >
                    <XCircle className="size-4 text-red-600 shrink-0" />{" "}
                    Cancelar cita
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Clipboard /> Receta
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() =>
                      handleViewRecipe(appointment.id_appointment)
                    }
                  >
                    <Eye /> Ver
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
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
            active.map((appointment) => renderAppointmentCard(appointment))
          )}
        </TabsContent>

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
            past.map((appointment) => renderAppointmentCard(appointment))
          )}
        </TabsContent>
      </Tabs>

      {selectedId && (
        <AppointmentInfo
          id={selectedId}
          open={showDialog}
          onOpenChange={setShowDialog}
        />
      )}
      {appointmentId && (
        <RecipeViewer
          open={showRecipePreview}
          onOpenChange={setShowRecipePreview}
          appointmentId={appointmentId}
        />
      )}
    </>
  );
};

export default AppointmentsP;
