"use client";

{/*Hooks para saber en que ruta estamos y leer los parametros de la url*/}
import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/app/components/ui/pagination";
{/*Funcion auxiliar que decide que numero de pagina mostrar*/}
import { generatePagination } from "@/app/lib/utils";

{/*Recibe el total de paginas como Props desde la tabla*/}
export default function PaginationComponent({
  totalPages,
}: {
  totalPages: number;
}) {
  {/*Para saber la ruta actual con la url*/}
  const pathname = usePathname();
  {/*Para saber los parametros actuales de la url*/}
  const searchParams = useSearchParams();
  {/*Obtiene la pagina actual y si no hay por defecto es 1*/}
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    {/*Hacer una copia editable de los parametros*/}
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          {currentPage <= 1 ? (
            <span className="pointer-events-none opacity-50">
              <PaginationPrevious />
            </span>
          ) : (
            <PaginationPrevious href={createPageURL(currentPage - 1)} />
          )}
        </PaginationItem>

        {/* Page Numbers */}
        {allPages.map((page, index) => (
          <PaginationItem key={`${page}-${index}`}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          {currentPage >= totalPages ? (
            <span className="pointer-events-none opacity-50">
              <PaginationNext />
            </span>
          ) : (
            <PaginationNext href={createPageURL(currentPage + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
