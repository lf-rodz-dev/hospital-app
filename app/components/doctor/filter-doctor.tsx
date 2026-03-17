"use client";

import { Filter, RotateCcw, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {useSearchParams, usePathname, useRouter} from 'next/navigation'
import {useDebouncedCallback} from 'use-debounce'
import {useRef} from 'react'

const FilterDoctor = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    term ? params.set("query", term) : params.delete("query");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleStatusFilter = (value: string) => {

    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    value === "all" ? params.delete("status") : params.set("status", value)

    replace(`${pathname}?${params.toString()}`);
  }

  const handlerClearFilters = () => {
    if(inputRef.current) inputRef.current.value = "";
    replace(`${pathname}?page=1`);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        <Input
        ref={inputRef}
        onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar por nombre o contacto..."
          className="pl-10"
        />
      </div>

      <Select onValueChange={handleStatusFilter} value={searchParams.get("status") ?? "all"}>
        <SelectTrigger className="w-full md:w-50">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Estatus Doctores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los Estatus</SelectItem>
          <SelectItem value="true">Activo</SelectItem>
          <SelectItem value="false">Inactivo</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handlerClearFilters}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FilterDoctor;
