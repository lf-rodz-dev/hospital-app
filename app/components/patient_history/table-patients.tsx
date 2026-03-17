"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
{
  /*La funcion que trae los pacientes desde el backend*/
}
import { fetchPatients } from "@/app/actions/patients_history";
{
  /*Componente interactivo para cambiar la paginacion*/
}
import PaginationComponent from "../pagination";
{
  /*Hook para traer datos y mantenerlos sincronizados*/
}
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontalIcon, Pencil, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import RegisterPatient from "./register-patient";
import EditPatient from "./edit-patient";
import { InvoiceTablePatientSkeleton } from "./skeletons";

type User = {
  id_user: string;
  name: string;
  email: string;
  phone: string;
  rol: string;
  date: string;
  status: boolean;
  has_patient_record: number;
};

type FetchUsersResponse = {
  success: boolean;
  data: User[];
  totalPages: number;
  message?: string | null;
};

type Props = {
  query: string;
  currentPage: number;
  status?: string;
};

{
  /*Pasamos desde el componente padre (la pagina principal en la que se montan todos los componentes) las props*/
}
const TablePatients = ({ query, currentPage, status }: Props) => {
  {
    /*Desestructuramos el hook useQuery: data es el array de datos de usuarios con rol
  paciente que obtenemos de la consulta y isLoading es para saber si la pagina esta cargando o no*/
  }
  const { data, isLoading } = useQuery<FetchUsersResponse>({
    queryKey: ["patients", query, currentPage, status], // queryKey que si cambia query, currentPage o estatus vuelve a pedir los datos
    queryFn: () => fetchPatients(query, currentPage, status), //queryFn invoca la funcion que consulta los datos al backend aplicando los filtros
    placeholderData: (previousData) => previousData, //Muestra los datos anteriores mientras trae los nuevos, evitando el "parpoadeo" de carga
  });

  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  {
    /*Si la pagina sigue cargando muestra un mensaje*/
  }
  if (isLoading) {
    return <InvoiceTablePatientSkeleton />;
  }

  {
    /*Si los datos no se obtuvieron muestra un error*/
  }
  if (!data || !data.success) {
    return (
      <div className="text-center py-8 text-red-500">
        {data?.message || "Error al cargar pacientes"}
      </div>
    );
  }

  {
    /*Constante que guarda el array de objetos con los datos de los usuarios*/
  }
  const users = data.data;
  {
    /*Guarda la cantidad total de paginas*/
  }
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
              <TableHead>Estatus Paciente</TableHead>
              <TableHead>Estatus Registro</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id_user}>
                  <TableCell className="font-medium">{user.name}</TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <p>{user.email}</p>
                      <p className="text-gray-500">{user.phone}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        user.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        user.has_patient_record
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.has_patient_record ? "Registrado" : "Sin registro"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40" align="center">
                        {!user.has_patient_record && (
                          <DropdownMenuItem
                            onSelect={() => handleNewClick(user.id_user)}
                          >
                            <Plus />
                            Registrar
                          </DropdownMenuItem>
                        )}
                        {!!user.has_patient_record && (
                          <DropdownMenuItem
                            onSelect={() => handleEditClick(user.id_user)}
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
          <RegisterPatient
            open={showNewDialog}
            onOpenChange={setShowNewDialog}
            id={selectedId}
          />
          <EditPatient
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            id={selectedId}
          />
        </>
      )}

      {/*Si el total de paginas es mayor a 1 muestra el componente de paginacion*/}
      {totalPages > 0 && <PaginationComponent totalPages={totalPages} />}
    </>
  );
};

export default TablePatients;
