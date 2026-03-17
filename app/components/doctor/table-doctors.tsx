"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { fetchDoctors } from "../../actions/doctor";
import { useQuery } from "@tanstack/react-query";
import PaginationComponent from "../pagination";
import { InvoiceTableDoctorSkeleton } from "./skeletons";
import { Button } from "../ui/button";
import { MoreHorizontalIcon, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import RegisterDoctor from "./register-doctor";
import EditDoctor from "./edit-doctor";

type Doctor = {
  id_user: string;
  name: string;
  email: string;
  phone: string;
  rol: string;
  date: string;
  status: boolean;
  has_doctor_record: number;
};

type FetchDoctorsResponse = {
  success: boolean;
  data: Doctor[];
  totalPages: number;
  message?: string | null;
};

type Props = {
  query: string;
  currentPage: number;
  status?: string;
};

const TableDoctors = ({ query, currentPage, status }: Props) => {
  const { data, isLoading } = useQuery<FetchDoctorsResponse>({
    queryKey: ["doctors", query, currentPage, status],
    queryFn: () => fetchDoctors(query, currentPage, status),
    placeholderData: (previusData) => previusData,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (isLoading) {
    return <InvoiceTableDoctorSkeleton />;
  }

  if (!data || !data.success) {
    return (
      <div className="text-center py-8 text-red-500">
        {data?.message || "Error al cargar doctores."}
      </div>
    );
  }

  const doctors = data.data;
  const totalPages = data.totalPages;

  const handleNewClick = (id: string) => {
    setSelectedId(id);
    setShowNewDialog(true);
  };

  const handleEditClick = (id: string) => {
    setSelectedId(id);
    setShowEditDialog(true);
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estatus Doctor</TableHead>
              <TableHead>Estatus Registro</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <TableRow key={doctor.id_user}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{doctor.email}</p>
                      <p>{doctor.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        doctor.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {doctor.status ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        doctor.has_doctor_record
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {doctor.has_doctor_record ? "Registrado" : "Sin registro"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {!doctor.has_doctor_record && (
                          <DropdownMenuItem
                            onSelect={() => handleNewClick(doctor.id_user)}
                          >
                            <Plus />
                            Registrar
                          </DropdownMenuItem>
                        )}
                        {!!doctor.has_doctor_record && (
                          <DropdownMenuItem
                            onSelect={() => handleEditClick(doctor.id_user)}
                          >
                            <Pencil />
                            Editar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedId && (
        <>
          <RegisterDoctor
            id={selectedId}
            open={showNewDialog}
            onOpenChange={setShowNewDialog}
          />
          <EditDoctor
            id={selectedId}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
        </>
      )}
      {totalPages > 0 && <PaginationComponent totalPages={totalPages} />}
    </>
  );
};

export default TableDoctors;
