"use client";

import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogFooter, DialogHeader } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
{
  /*useQuery = Traer los datos y mantenerlos sincronizados
  useQueryClient = invalidar query*/
}
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
{
  /*Action server para traer los dato del back*/
}
import { fetchSpecialtyById } from "../../actions/specialtie";
import { updateSpecialty } from "../../actions/specialtie";
import {
  SpecialtySchema,
  type UpdateSpecialtyData,
  type SpecialtyFormData,
} from "../../lib/specialty/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Ban } from "lucide-react";

type Specialty = {
  id_specialtie: string;
  name_specialtie: string;
  description: string;
  office_number: string;
  created_at: string;
};

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EditSpecialty = ({ id, open, onOpenChange }: Props) => {
  {
    /*Uso de queryClient para invalidar query*/
  }
  const queryClient = useQueryClient();

  //manejo de formularios con zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SpecialtyFormData>({
    resolver: zodResolver(SpecialtySchema),
  });

  {
    /*Obtener los datos y mostrarlos*/
  }
  const { data: specialty, isLoading } = useQuery({
    queryKey: ["specialty", id],
    queryFn: () => fetchSpecialtyById(id),
    enabled: open && !!id,
    staleTime: 0,
  });

  //Despues de obtener los datos cargarlos en el formulario
  useEffect(() => {
    if (open && specialty) {
      reset({
        name_specialtie: specialty.name_specialtie,
        description: specialty.description,
        office_number: specialty.office_number,
      });
    }

    if (!open) {
      reset(); // limpia el formulario al cerrar
    }
  }, [open, specialty, reset]);

  {
    /*Uso de mutation para cambiar los datos*/
  }
  const mutation = useMutation({
    //uso de action server para ejecutar la actualizacion
    mutationFn: (data: UpdateSpecialtyData) => updateSpecialty(data),
    //ejecuta una notificacion de carga antes de mandar la peticion
    onMutate: () => {
      toast.loading("Actualizando especialidad...", { id: "update-specialty" });
    },
    //verifica la respuesta del servidor para mostrar una notificacion
    onSuccess: (result) => {
      toast.dismiss("update-specialty");

      if (result.success) {
        toast.success("Especialidad actualizada con exito");

        //Los datos mutaron, entonces los datos son viejos, trae los nuevos
        queryClient.invalidateQueries({ queryKey: ["specialty", id] });
        queryClient.invalidateQueries({ queryKey: ["specialties"] });

        //Cerrar modal
        onOpenChange(false);
      } else {
        toast.error(result.message || "Error al actualizar especialidad");
      }
    },
    onError: () => {
      toast.dismiss("update-specialty");
      toast.error("Error inesperado");
    },
  });

  const onSubmit = (data: SpecialtyFormData) => {
    mutation.mutate({ id, ...data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Especialidad Médica</DialogTitle>
          <DialogDescription>
            Modifica la información de la especialidad médica.
          </DialogDescription>
        </DialogHeader>

        {/* ✅ Agregar loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        ) : specialty ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <Field>
                  <FieldLabel>Nombre de Especialidad:</FieldLabel>
                  <Input
                    {...register("name_specialtie")}
                    placeholder="Ej: Cardiología, Neurología, Pediatria"
                  />
                  {errors.name_specialtie && (
                    <div className="flex gap-2 items-center rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-800">
                      <Ban size={15} />
                      {errors.name_specialtie.message}
                    </div>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Descripción:</FieldLabel>
                  <Textarea
                    {...register("description")}
                    placeholder="Ingresa datos relevantes de la especialidad médica..."
                  />
                  {errors.description && (
                    <div className="flex gap-2 items-center rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-800">
                      <Ban size={15} />
                      {errors.description.message}
                    </div>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Consultorio Asignado:</FieldLabel>
                  <Input
                    {...register("office_number")}
                    placeholder="Ej: C-1, C-2, C-3, etc."
                  />
                  {errors.office_number && (
                    <div className="flex gap-2 items-center rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-800">
                      <Ban size={15} />
                      {errors.office_number.message}
                    </div>
                  )}
                </Field>
              </FieldSet>
            </FieldGroup>
            <DialogFooter className="sm:justify-end mt-6">
              <DialogClose asChild>
                <Button variant="secondary" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Actualizar</Button>
            </DialogFooter>
          </form>
        ) : (
          <p className="text-muted-foreground">
            No se encontró la especialidad
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditSpecialty;
