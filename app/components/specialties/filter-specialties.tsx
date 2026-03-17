import { RotateCcw, Search } from "lucide-react";
import { Input } from "../ui/input";
import CreateSpecialtie from "./create-specialtie";
{/*useSearchParams= leer parametros usePathname=cambiar parametros useRouter=cambiar la url*/}
import {useSearchParams, usePathname, useRouter} from 'next/navigation'
{/*Obtener los datos sin necesidad de recargar*/}
import {useDebouncedCallback} from 'use-debounce'
{/*Hacer referencia del input*/}
import {useRef} from 'react'
import { Button } from "../ui/button";


const FilterSpecialties = () => {

  {/*Obtener los parametros actuales de la url*/}
  const searchParams = useSearchParams();
  {/*Obtener la ruta actual /specialties/*/}
  const pathname = usePathname()
  {/*Cambiar la url*/}
  const {replace} = useRouter();
  {/*Hacer referencia al input de busqueda*/}
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {

    {/*Copia editable de la url*/}
    const params = new URLSearchParams(searchParams);

    {/*Si la pagina cambia el filtro se actualiza*/}
    params.set('page', '1');

    {/*Si existe una busqueda cambia query por el termino y si no elimina query*/}
    term ? params.set('query', term) : params.delete('query');

    {/*Reemplazar la url de los parametros con la busqueda*/}
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleClearFilters = () => {
    if(inputRef.current) inputRef.current.value = '';
    replace(`${pathname}?page=1`);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        <Input
          ref={inputRef}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar por nombre o consultorio..."
          className="pl-10"
        />
      </div>
      <Button variant="outline" onClick={handleClearFilters}> 
        <RotateCcw className="h-4 w-4" />
      </Button>
      <CreateSpecialtie/>
    </div>
  );
};

export default FilterSpecialties;
