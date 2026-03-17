import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export const InvoiceTableSpecialtySkeleton = () => {
  return (
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
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
        <TableRowSpecialtySkeleton/>
      </TableBody>
    </Table>
  );
};

const TableRowSpecialtySkeleton = () => {
  return (
    <TableRow>
      <TableCell className="h-12.25 w-49.25">
        <Skeleton className="h-4 w-1/2" />
      </TableCell>
      <TableCell className="h-12.25 w-[453.5px]">
        <Skeleton className="h-4 w-full" />
      </TableCell>
      <TableCell className="h-12.25 w-50.75">
        <Skeleton className="h-4 w-1/3"/>
      </TableCell>
      <TableCell className="h-12.25 w-72.75">
        <Skeleton className="h-4 w-1/4"/>
      </TableCell>
      <TableCell className="h-12.25 w-41.75">
        <Skeleton className="h-4 w-1/4"/>
      </TableCell>
    </TableRow>
  );
};
