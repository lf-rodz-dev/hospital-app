"use client";

import { Dialog, DialogClose, DialogFooter, DialogHeader } from "../ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Ban, Plus } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createSpecialty } from "@/app/actions/specialtie";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  SpecialtySchema,
  type SpecialtyFormData,
} from "../../lib/specialty/schema";

const CreateSpecialtie = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SpecialtyFormData>({
    resolver: zodResolver(SpecialtySchema),
  });

  const mutation = useMutation({
    mutationFn: (data: SpecialtyFormData) => createSpecialty(data),
    onMutate: () => {
      toast.loading("Creando especialidad...", { id: "create-specialty" });
    },
    onSuccess: (result) => {
      toast.dismiss("create-specialty");
      if (result.success) {
        toast.success("Especialidad creada exitosamente");
        queryClient.invalidateQueries({ queryKey: ["specialties"] });
        reset();
        setOpen(false);
      }else{
        toast.error(result.message || "Error al crear especialidad")
      }
    },
    onError: (error: Error) => {
      toast.dismiss("create-specialty");
      toast.error("Error inesperado");
    },
  });

  const onSubmit = (data: SpecialtyFormData) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Nuevo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Especialidad Médica</DialogTitle>
          <DialogDescription>
            Introduce la información de la nueva especialidad médica.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel>Nombre de Especialidad:</FieldLabel>
                <Input
                  {...register("name_specialtie")}
                  placeholder="Ej: Cardiología, Neurología, Pediatría, etc."
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
                  placeholder="Ejemplo: C-1, C-2, C-3, etc."
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
              <Button variant="secondary" type="button" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpecialtie;
