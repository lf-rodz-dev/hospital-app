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
{/*Leer y modificar los parametros de la url*/}
import { useSearchParams, usePathname, useRouter } from "next/navigation";
{/*Evitar que se ejecute la busqueda con cada tecleo*/}
import { useDebouncedCallback } from "use-debounce";
{/*Referencia directa del input*/}
import { useRef } from "react";

const FilterPatient = () => {
  {/*Lee los parametros actuales de la url*/}
  const searchParams = useSearchParams();
  {/*Obtiene la ruta actual (/patient)*/}
  const pathname = usePathname();
  {/*Permite cambiar la url sin recargar la página*/}
  const { replace } = useRouter();
  {/*Permite acceder directamente al input (sin necesidad de useState)*/}
  const inputRef = useRef<HTMLInputElement>(null);

  {/*Busqueda con useDebouncedCallback, recibimos el valor de busqueda atravez del input*/}
  const handleSearch = useDebouncedCallback((term: string) => {
    {/*Clona los parametros actuales de la url
      new URLSearchParams es para leer, agregar, quitar y codificar url
      (creamos una copia editable de los parametros)*/}
    const params = new URLSearchParams(searchParams);
    {/*Si el filtro es cambiado vuelve a la pagina 1*/}
    params.set("page", "1");

    {/*Si el usuario escribe algo se manda query=algo y si no hay nada query se elimina*/}
    term ? params.set("query", term) : params.delete("query");
    {/*Cambia la url sin recargar*/}
    replace(`${pathname}?${params.toString()}`);
    {/*Espeta 3 ms antes de recargar*/}
  }, 300);

  {/*Recibimos el valor que viene del select*/}
  const handleStatusFilter = (value: string) => {
    {/*Clonamos los parametros actuales de la url*/}
    const params = new URLSearchParams(searchParams);
    {/*Si el filtro cambia volvemos a la pagina 1*/}
    params.set("page", "1");

    {/*Si el valor del filtro es all eliminamos el parametro status, si no insertamos
      a los parametros status=algo*/}
    value === "all" ? params.delete("status") : params.set("status", value);
    {/*Cambiamos la url sin recargar*/}
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    {/*Si el input tiene contenido vacia su contenido*/}
    if (inputRef.current) inputRef.current.value = "";
    {/*Cambiar la url a una sin filtros*/}
    replace(`${pathname}?page=1`);
  };
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder="Buscar por nombre o contacto..."
          onChange={(e) => handleSearch(e.target.value)}
          /*?? significa que si es null usa lo de la derecha*/
          defaultValue={searchParams.get("query") ?? ""}
          className="pl-10"
        />
      </div>

      <Select
        onValueChange={handleStatusFilter}
        value={searchParams.get("status") ?? "all"}
      >
        <SelectTrigger className="w-full md:w-50">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Estatus paciente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los Estatus</SelectItem>
          <SelectItem value="true">Activo</SelectItem>
          <SelectItem value="false">Inactivo</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleClearFilters}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FilterPatient;
