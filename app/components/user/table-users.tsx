"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { fetchUsers } from "@/app/actions/user";
import { DeleteUser } from "./delete-user";
import EditUser from "./edit-user";
import PaginationComponent from "../pagination";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontalIcon, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { InvoceTableSkeleton } from "@/app/components/user/skeletons";

type Props = {
  query: string;
  currentPage: number;
  rol?: string;
  status?: string;
};

const TableUsers = ({ query, currentPage, rol, status }: Props) => {
  // Estado para controlar los diálogos
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Obtener datos de usuarios
  const { data, isLoading } = useQuery({
    queryKey: ["users", query, currentPage, rol, status],
    queryFn: () => fetchUsers(query, currentPage, rol, status),
    placeholderData: (previousData) => previousData,
  });

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return <InvoceTableSkeleton />;
  }

  // Mostrar error si falla
  if (!data || !data.success) {
    return (
      <div className="text-center py-8 text-red-500">
        {data?.message || "Error al cargar usuarios"}
      </div>
    );
  }

  // Obtener usuarios y páginas totales
  const users = data.data;
  const totalPages = data.totalPages;

  // Función para abrir diálogo de edición
  const handleEditClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowEditDialog(true);
  };

  // Función para abrir diálogo de eliminación
  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteDialog(true);
  };

  return (
    <>
      {/* Tabla de usuarios */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead>Estatus</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id_user}>
                  {/* Nombre */}
                  <TableCell className="font-medium">{user.name}</TableCell>

                  {/* Contacto */}
                  <TableCell>
                    <div className="text-sm">
                      <p>{user.email}</p>
                      <p className="text-gray-500">{user.phone}</p>
                    </div>
                  </TableCell>

                  {/* Rol */}
                  <TableCell>
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      {user.rol}
                    </span>
                  </TableCell>

                  {/* Fecha de registro */}
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("es-MX")}
                  </TableCell>

                  {/* Status */}
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

                  {/* Acciones */}
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => handleEditClick(user.id_user)}
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDeleteClick(user.id_user)}
                        >
                          <Trash className="h-4 w-4" />
                          Eliminar
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

      {/* Diálogos de edición y eliminación */}
      {selectedUserId && (
        <>
          <EditUser
            userId={selectedUserId}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
          <DeleteUser
            userId={selectedUserId}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          />
        </>
      )}

      {/* Paginación */}
      {totalPages > 1 && <PaginationComponent totalPages={totalPages} />}
    </>
  );
};

export default TableUsers;