"use client";
{/*Le dice a next.js que este componente se va a renderizar en el navegador*/}

import FilterPatient from "@/app/components/patient_history/filter-patient";
import TablePatients from "@/app/components/patient_history/table-patients";
{
  /*Hook para obtener las query dentro de la url*/
}
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Suspense } from "react";

function PatientHistoryContent() {
  {
    /*Obtiene los parametros actuales de la url*/
  }
  const searchParams = useSearchParams();
  {
    /*Lee el parametro ?query= de la url*/
  }
  const query = searchParams.get("query") || "";
  {
    /*Obtiene el parametro ?page= y lo combierte a numero*/
  }
  const currentPage = Number(searchParams.get("page")) || 1;
  {
    /*Lee el parametro ?status= de la url*/
  }
  const status = searchParams.get("status");
  return (
    <main className="grid gap-4 min-h-dvh space-y-6 p-6 bg-slate-200">
        <Card>
          <CardHeader>
            <CardTitle>Historial Médico de Pacientes</CardTitle>
            <CardDescription>
              Registra, filtra, edita y exporta el historial medico de pacientes
              de acuerdo a tus necesidades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FilterPatient />
            {/*Pasa como props los valores obtenidos de los parametros al componente tabla*/}
            <TablePatients
              query={query}
              currentPage={currentPage}
              status={status || undefined}
            />
          </CardContent>
        </Card>
    </main>
  );
}

export default function Page() {
  return (
    <main className="grid gap-4 min-h-dvh space-y-6 p-6 bg-slate-200">
      <Suspense fallback={<div>Cargando...</div>}>
        <PatientHistoryContent />
      </Suspense>
    </main>
  );
}