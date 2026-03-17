import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export const InvoiceTableDoctorSkeleton = () => {
  return (
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
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
        <TableRowDoctorSkeleton />
      </TableBody>
    </Table>
  );
};

export const TableRowDoctorSkeleton = () => {
  return (
    <TableRow className="h-[56.8px]">
      <TableCell className="w-[365.5px]">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>
      <TableCell className="w-77.5">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>
      <TableCell className="w-57.5">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>
      <TableCell className="w-62.5">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>
      <TableCell className="w-38.5">
        <Skeleton className="h-4 w-2/5" />
      </TableCell>
    </TableRow>
  );
};
