'use client';

import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { CreateUser } from "@/app/components/user/create-user";
import { Filter, Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useRef } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import ClearFilters from "./clear-filters";


const FilterUsers = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    term ? params.set("query", term) : params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleRolFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    value === "all" ? params.delete("rol") : params.set("rol", value);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    value === "all" ? params.delete("status") : params.set("status", value);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    if (inputRef.current) inputRef.current.value = "";
    replace(`${pathname}?page=1`);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          <Input
            ref={inputRef}
            placeholder="Buscar por nombre o contacto..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("query") ?? ""}
            className="pl-10"
          />
        </div>

        <Select onValueChange={handleRolFilter} value={searchParams.get("rol") ?? "all"}>
          <SelectTrigger className="w-full md:w-50">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Roles</SelectItem>
            <SelectItem value="Paciente">Paciente</SelectItem>
            <SelectItem value="Doctor">Doctor</SelectItem>
            <SelectItem value="Administrador">Administrador</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleStatusFilter} value={searchParams.get("status") ?? "all"}>
          <SelectTrigger className="w-full md:w-45">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Estatus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estatus</SelectItem>
            <SelectItem value="true">Activo</SelectItem>
            <SelectItem value="false">Inactivo</SelectItem>
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <ClearFilters handleClearFilters={handleClearFilters} />
          </TooltipTrigger>
          <TooltipContent>Limpiar filtros</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <CreateUser/>
          </TooltipTrigger>
          <TooltipContent>Crear usuario</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default FilterUsers;