"use client";

import { Card } from "@/app/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTopDoctors } from "@/app/hooks/useTopDoctors";
import { Skeleton } from "@/app/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface Doctor {
  id_doctor: string;
  doctor_name: string;
  name_specialtie: string;
  total_appointments: number;
}

export function TopDoctors() {
  const { data, isLoading, isError, error } = useTopDoctors();

  // Transformar datos para el gráfico
  const chartData = data?.data?.map((doctor: Doctor) => ({
    id: doctor.id_doctor,
    name: doctor.doctor_name,
    specialty: doctor.name_specialtie,
    appointments: doctor.total_appointments,
  })) || [];

  // Estado de carga
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Médicos más solicitados
          </h3>
          <p className="text-sm text-muted-foreground">
            Top 5 médicos con más citas del mes actual
          </p>
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </Card>
    );
  }

  // Estado de error
  if (isError) {
    return (
      <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              Error al cargar médicos
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {error instanceof Error
                ? error.message
                : "Error desconocido. Intenta nuevamente."}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Estado vacío
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Médicos más solicitados
          </h3>
          <p className="text-sm text-muted-foreground">
            No hay datos disponibles en este momento
          </p>
        </div>
      </Card>
    );
  }

  // Renderizar gráfico HORIZONTAL
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Médicos más solicitados
        </h3>
        <p className="text-sm text-muted-foreground">
          Top 5 médicos con más citas del mes actual
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          // Si querías que las barras estuvieran "paradas" (verticales), 
          // usa layout="horizontal" e invierte los tipos en XAxis e YAxis.
          // Aquí te dejo la versión para que las barras estén PARADAS:
          layout="horizontal" 
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          {/* Eje X: Ahora es la categoría (Nombres de médicos) */}
          <XAxis
            type="category"
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          {/* Eje Y: Ahora es el número (Cantidad de citas) */}
          <YAxis
            type="number"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-sm">{data.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {data.specialty}
                    </p>
                    <p className="text-sm font-medium text-accent">
                      {data.appointments} citas
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="appointments"
            fill="hsl(var(--accent))"
            // Radio en la parte superior de la barra [top-left, top-right, bottom-right, bottom-left]
            radius={[8, 8, 0, 0]} 
            isAnimationActive={true}
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}