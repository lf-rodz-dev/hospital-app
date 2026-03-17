"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchSpecialtiesAppointment } from "../../actions/schedule_appointment";
import { cn } from "@/app/lib/utils";
import { FetchSpecialtiesResponse, Specialty } from "@/app/lib/schedule_appointment/schema";
import { GraduationCap } from "lucide-react";

type Props = {
  selectedSpecialty: string | null;
  onSpecialtySelect: (specialtyId: Specialty) => void;
};

const StepSpecialty = ({ selectedSpecialty, onSpecialtySelect }: Props) => {
  const { data, isLoading } = useQuery<FetchSpecialtiesResponse>({
    queryKey: ["specialties-appointment"],
    queryFn: fetchSpecialtiesAppointment,
  });

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Seleccione una Especialidad</CardTitle>
        <CardDescription>
          Seleccione el área medica para la consulta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center text-muted-foreground py-8">
            Cargando especialidades...
          </div>
        )}

        {!isLoading && (!data?.data || data.data.length === 0) && (
          <div className="text-center text-muted-foreground py-8">
            No se encontraron especialidades.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data?.data.map((specialty) => (
            <button
              type="button"
              key={specialty.id_specialtie}
              onClick={() => onSpecialtySelect(specialty)}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-primary hover:bg-primary/5",
                selectedSpecialty === specialty.id_specialtie
                  ? "border-primary bg-primary/10"
                  : "border-muted",
              )}
            >
              <div className="grid place-items-center h-12 w-12 rounded-full bg-primary/10">
                <GraduationCap />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{specialty.name_specialtie}</h3>
                <p className="text-sm text-muted-foreground">
                  {specialty.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepSpecialty;