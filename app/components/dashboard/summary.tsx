"use client";

import { Contact, Stethoscope, Users, UserStar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchSummary } from "@/app/actions/dashboard";
import { InvoiceCardSkeleton } from "./skeletons";

const Summary = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users-summary"],
    queryFn: fetchSummary,
  });

  if (isLoading || !data) {
    return <InvoiceCardSkeleton />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Total de Usuarios
          </CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Contact size={20} className="text-blue-800" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-rows-2 gap-1">
            <p className="text-4xl font-bold pb-2">{data.total_users}</p>
            <span className="px-2 py-1 h-8 rounded-lg bg-green-100 text-green-800">
              Activos: {data.activos}
            </span>
            <span className="px-2 py-1 h-8 rounded-lg bg-red-100 text-red-800">
              Inactivos: {data.inactivos}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-medium">Pacientes</CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users size={20} className="text-blue-800" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-rows-2 gap-1">
            <p className="text-4xl font-bold pb-2">{data.total_patients}</p>
            <span className="px-2 py-1 h-8 rounded-lg bg-green-100 text-green-800">
              Activos: {data.active_patients}
            </span>
            <span className="px-2 py-1 h-8 rounded-lg bg-red-100 text-red-800">
              Inactivos: {data.inactive_patients}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-medium">Doctores</CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Stethoscope size={20} className="text-blue-800" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-rows-2 gap-1">
            <p className="text-4xl font-bold pb-2">{data.total_doctors}</p>
            <span className="px-2 py-1 h-8 rounded-lg bg-green-100 text-green-800">
              Activos: {data.active_doctors}
            </span>
            <span className="px-2 py-1 h-8 rounded-lg bg-red-100 text-red-800">
              Inactivos: {data.inactive_doctors}
            </span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-medium">Administradores</CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserStar size={20} className="text-blue-800" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-rows-2 gap-1">
            <p className="text-4xl font-bold pb-2">{data.total_admins}</p>
            <span className="px-2 py-1 h-8 rounded-lg bg-green-100 text-green-800">
              Activos: {data.active_admins}
            </span>
            <span className="px-2 py-1 h-8 rounded-lg bg-red-100 text-red-800">
              Inactivos: {data.inactive_admins}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
