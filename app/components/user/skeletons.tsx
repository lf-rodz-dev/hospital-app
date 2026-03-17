import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

export const InvoceTableSkeleton = () => {
  return (
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
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </TableBody>
      </Table>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell className="h-14.25 w-76.5">
        <Skeleton className="h-4 w-3/4" />
      </TableCell>

      <TableCell className="h-14.25 w-90">
        <div className="grid grid-rows-2 gap-1">
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </TableCell>

      <TableCell className="h-14.25 w-56.5">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>

      <TableCell className="h-14.25 w-55.5">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>

      <TableCell className="h-14.25 w-39">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>

      <TableCell className="text-center h-14.25 w-31">
        <div className="grid place-items-center">
          <Skeleton className="h-4 w-1/2" />
        </div>
      </TableCell>
    </TableRow>
  );
};
