"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
{
  /*Consulta para traer los clientes del back con server actions*/
}
import { fetchSpecialties } from "@/app/actions/specialtie";
{
  /*Componente de paginacion*/
}
import PaginationComponent from "../pagination";
{
  /*Hook para traer los datos y mantenerlos sincronizados*/
}
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DeleteSpecialty from "./delete-specialty";
import { Button } from "../ui/button";
import { MoreHorizontalIcon, Pencil, Trash } from "lucide-react";
import EditSpecialty from "./edit-specialty";
import { InvoiceTableSpecialtySkeleton } from "./skeletons";

type Specialty = {
  id_specialtie: string;
  name_specialtie: string;
  description: string;
  office_number: string;
  created_at: string;
};

type FetchSpecialtiesResponse = {
  success: boolean;
  data: Specialty[];
  totalPages: number;
  message?: string | null;
};

type Props = {
  query: string;
  currentPage: number;
};

const TableSpecialties = ({ query, currentPage }: Props) => {
  const { data, isLoading } = useQuery<FetchSpecialtiesResponse>({
    queryKey: ["specialties", query, currentPage], //Vuelve a pedir los datos si los parametros cambian
    queryFn: () => fetchSpecialties(query, currentPage), //Invoca la funcion de consulta y manda las props al back para filtros
    placeholderData: (previousData) => previousData, //Muestra los datos anteriores mientras los nuevos aparecen, evitando recargar
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEditClick = (id: string) => {
    setSelectedId(id);
    setShowEditDialog(true);
  }

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteDialog(true);
  };

  {
    /*Muestra esto si la pagina esta cargando*/
  }
  if (isLoading) {
    return <InvoiceTableSpecialtySkeleton/>;
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
    /*Guarda en esta constante el array con los datos obtenidos*/
  }
  const specialties = data.data;

  {
    /*Guarda en esta constante las paginas totales obtenidas en el back*/
  }
  const totalPages = data.totalPages;

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripcion</TableHead>
              <TableHead>Consultorio</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialties.length > 0 ? (
              specialties.map((specialty) => (
                <TableRow key={specialty.id_specialtie}>
                  <TableCell>{specialty.name_specialtie}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="truncate cursor-help">
                            {specialty.description}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{specialty.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      {specialty.office_number}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(specialty.created_at).toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => handleEditClick(specialty.id_specialtie)}>
                          <Pencil /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleDeleteClick(specialty.id_specialtie)
                          }
                        >
                          <Trash /> Eliminar
                        </DropdownMenuItem>
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
          <EditSpecialty
            id={selectedId}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
          <DeleteSpecialty
            id={selectedId}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          />
        </>
      )}
      {totalPages > 0 && <PaginationComponent totalPages={totalPages} />}
    </>
  );
};

export default TableSpecialties;
