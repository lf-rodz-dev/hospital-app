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
import { useTopSpecialties } from "@/app/hooks/useTopSpecialties";
import { Skeleton } from "@/app/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export function TopSpecialties() {
  const { data, isLoading, isError, error } = useTopSpecialties();

  // Transformar datos para el gráfico
  const chartData = data?.data?.map((specialty) => ({
    name: specialty.name_specialtie,
    pacientes: specialty.total_doctors,
    id: specialty.id_specialtie,
  })) || [];

  // Estado de carga
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Médicos por Especialidad
          </h3>
          <p className="text-sm text-muted-foreground">
            Top 5 especialidades con más médicos asignados
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
              Error al cargar especialidades
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
            Médicos por Especialidad
          </h3>
          <p className="text-sm text-muted-foreground">
            No hay datos disponibles en este momento
          </p>
        </div>
      </Card>
    );
  }

  // Renderizar gráfico
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Médicos por Especialidad
        </h3>
        <p className="text-sm text-muted-foreground">
          Top 5 especialidades con más médicos asignados
        </p>
      </div>
      <div className="h-[300px] w-full"> {/* Contenedor para asegurar el height */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            // 1. Reducimos los márgenes laterales a casi cero
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }} 
          >
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={70}
              // 2. Eliminamos el espacio extra a los lados de las barras
              padding={{ left: 10, right: 10 }} 
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              // 3. Ocultamos el label si ocupa mucho espacio o usamos hide={true} si no es crítico
              width={40}
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="pacientes"
              fill="hsl(var(--accent))"
              radius={[4, 4, 0, 0]}
              // 4. Ajustamos el ancho de las barras para que no se vean tan delgadas
              barSize={40} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}