"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { fetchPatientsAppointment } from "../../actions/schedule_appointment";
import { FetchPatientsResponse, Patient } from "../../lib/schedule_appointment/schema";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/app/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useRef } from "react";
import PaginationComponent from "../pagination";

interface Props {
  selectedPatient: string | null;
  onPatientSelect: (patient: Patient) => void;
}

const StepPatient = ({
  selectedPatient,
  onPatientSelect,
}: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading } = useQuery<FetchPatientsResponse>({
    queryKey: ["patients-appointment", query, currentPage],
    queryFn: () => fetchPatientsAppointment(query, currentPage),
  });

  const totalPages = data?.totalPages || 0;

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    term ? params.set("query", term) : params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Seleccione el Paciente</CardTitle>
        <CardDescription>
          Busca y selecciona al paciente para agendar la cita.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative flex-1 mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          <Input
            ref={inputRef}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nombre o nss..."
            className="pl-10"
          />
        </div>

        {isLoading && (
          <div className="text-center text-muted-foreground py-8">
            Cargando pacientes...
          </div>
        )}

        {!isLoading && (!data?.data || data.data.length === 0) && (
          <div className="text-center text-muted-foreground py-8">
            No se encontraron pacientes
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data.map((patient) => (
            <button
              type="button"
              key={patient.id_user}
              onClick={() => onPatientSelect(patient)}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:border-primary hover:bg-primary/5",
                selectedPatient === patient.id_user
                  ? "border-primary bg-primary/10"
                  : "border-muted",
              )}
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Correo: {patient.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Teléfono: {patient.phone}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {totalPages > 0 && <PaginationComponent totalPages={totalPages} />}
      </CardFooter>
    </Card>
  );
};

export default StepPatient;