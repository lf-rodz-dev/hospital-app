'use client';

import FilterSpecialties from "@/app/components/specialties/filter-specialties";
import TableSpecialties from "@/app/components/specialties/table-specialties";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
{/*Obtener los parametros de la url*/}
import {useSearchParams} from 'next/navigation'

export default function Page() {
  {/*obtener los parametros de la url*/}
  const searchParams = useSearchParams();
  {/*obtener la consulta dentro de los parametros*/}
  const query = searchParams.get('query') || '';
  {/*obtener la pagian dentro de los parametros*/}
  const currentPage = Number(searchParams.get('page')) || 1;
  return (
    <main className="grid gap-4 min-h-dvh space-y-6 p-6 bg-slate-200">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Especialidades Medicas</CardTitle>
            <CardDescription>
              Crea, filtra, edita y elimina especialidades medicas de acuerdo a
              tus necesidades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FilterSpecialties/>
            <TableSpecialties query={query} currentPage={currentPage}/>
          </CardContent>
        </Card>
    </main>
  );
}
