"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import FilterUsers from "@/app/components/user/filter-users";
import TableUsers from "@/app/components/user/table-users";
import { Suspense } from "react";

const UserContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const rol = searchParams.get("rol");
  const status = searchParams.get("status");

  return (
    <main className="grid gap-4 min-h-dvh space-y-6 p-6 bg-slate-200">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>
            Agrega, busca y filtra usuarios según tus necesidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FilterUsers />
          <TableUsers
            query={query}
            currentPage={currentPage}
            rol={rol || undefined}
            status={status || undefined}
          />
        </CardContent>
      </Card>
    </main>
  );
};

function Page() {
  return (
    <main className="grid gap-4 min-h-dvh space-y-6 p-6 bg-slate-200">
      <Suspense fallback={<div>Cargando...</div>}>
        <UserContent />
      </Suspense>
    </main>
  );
}

export default Page;
