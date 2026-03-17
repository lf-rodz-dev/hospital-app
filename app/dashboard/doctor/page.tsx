'use client';

import FilterDoctor from "@/app/components/doctor/filter-doctor";
import TableDoctors from "@/app/components/doctor/table-doctors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import {useSearchParams} from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage =   Number(searchParams.get("currentPage")) || 1;
  const status = searchParams.get("status");
  
  return (
    <main className="grid gap-4 min-h-dvh space-y-6 p-6 bg-slate-200">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Personal Médico</CardTitle>
            <CardDescription>Registra, filtra y edita la información del personal médico de acuerdo a tus necesidades.</CardDescription>
          </CardHeader>
          <CardContent>
            <FilterDoctor/>
            <TableDoctors query={query} currentPage={currentPage} status={status || undefined}/>
          </CardContent>
        </Card>
    </main>
  );
}
