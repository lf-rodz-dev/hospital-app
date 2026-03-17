"use client";

import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPatientById,
  fetchInfoPatient,
  updatePatient,
} from "../../actions/patients_history";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PatientFormData,
  PatientFormSchema,
  UpdatePatientData,
} from "@/app/lib/patient_history/schema";
import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

const EditPatient = ({ id, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(PatientFormSchema),
    mode: "onBlur",
  });

  const { data } = useQuery({
    queryKey: ["patient-name", id],
    queryFn: () => fetchInfoPatient(id),
    enabled: open && !!id,
  });

  const infoPatient = data?.data;

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    // Si viene en formato ISO, extrae solo YYYY-MM-DD
    return dateString.split("T")[0];
  };

  const { data: patientData, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => fetchPatientById(id),
    enabled: open && !!id,
  });

  useEffect(() => {
    if (open && patientData?.success && patientData?.data) {
      const patient = patientData.data;

      reset({
        weight: patient.weight || "",
        height: patient.height || "",
        bloodType: patient.blood_type,
        allergies: patient.allergies || "",
        emergencyContact: patient.emergency_contact || "",
        medicalHistory: patient.medical_history || "",
      });
    }
  }, [open, patientData, reset]);

  const mutation = useMutation({
    mutationFn: (data: UpdatePatientData) => updatePatient(data),
    onMutate: () => {
      toast.loading("Actualizando historial medicó del paciente...", {
        id: "update-patient",
      });
    },
    onSuccess: (result) => {
      toast.dismiss("update-patient");
      if (result.success) {
        toast.success("Historial medicó del paciente actualizado con exito.");

        queryClient.invalidateQueries({ queryKey: ["patients"] });

        handleClose();
      } else {
        toast.dismiss("update-patient");
        toast.error(
          result.message ||
            "Error al actualizar historial medicó del paciente.",
        );
      }
    },
    onError: (error: Error) => {
      toast.dismiss("update-patient");
      toast.error("Error inesperado: " + error.message);
    },
  });

  const onSubmit = (data: PatientFormData) => {
    mutation.mutate({ id, ...data });
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Historia Médico</DialogTitle>
          <DialogDescription>
            Actualiza la información médica del paciente.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        ) : patientData ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <Field>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input disabled value={infoPatient?.name || ""} />
                </Field>

                {/* Fecha de Nacimiento */}
                <Field>
                  <FieldLabel>Fecha de Nacimient</FieldLabel>
                  <Input
                    type="date"
                    disabled
                    value={formatDateForInput(infoPatient?.birthDate) || ""}
                  />
                </Field>

                {/* Grid: NSS, Edad, Género */}
                <div className="grid grid-cols-4 gap-4">
                  <Field className="col-span-2">
                    <FieldLabel>NSS</FieldLabel>
                    <Input
                      type="text"
                      disabled
                      value={infoPatient?.nss || ""}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Edad</FieldLabel>
                    <Input
                      type="number"
                      disabled
                      value={infoPatient?.age || ""}
                    />
                  </Field>

                  {/* Género con Controller */}
                  <Field>
                    <FieldLabel>Género</FieldLabel>
                    <Input disabled value={infoPatient?.gender || ""} />
                  </Field>
                </div>

                {/* Grid: Peso, Altura, Tipo Sanguíneo */}
                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel>
                      Peso (kg){" "}
                      {errors.weight && <span className="text-red-500">*</span>}
                    </FieldLabel>
                    <Input
                      type="text"
                      placeholder="Ej: 68"
                      {...register("weight")}
                    />
                    {errors.weight && (
                      <span className="text-red-500 text-sm">
                        {errors.weight.message}
                      </span>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>
                      Altura (cm){" "}
                      {errors.height && <span className="text-red-500">*</span>}
                    </FieldLabel>
                    <Input
                      type="text"
                      placeholder="Ej: 174"
                      {...register("height")}
                    />
                    {errors.height && (
                      <span className="text-red-500 text-sm">
                        {errors.height.message}
                      </span>
                    )}
                  </Field>

                  {/* Tipo Sanguíneo con Controller */}
                  <Field>
                    <FieldLabel>
                      Tipo Sanguíneo:{" "}
                      {errors.bloodType && (
                        <span className="text-red-500">*</span>
                      )}
                    </FieldLabel>

                    <Controller
                      name="bloodType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          key={`bloodType-${field.value}`}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Tipo</SelectLabel>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bloodType && (
                      <span className="text-red-500 text-sm">
                        {errors.bloodType.message}
                      </span>
                    )}
                  </Field>
                </div>

                {/* Alergias */}
                <Field>
                  <FieldLabel>
                    Alergias:{" "}
                    {errors.allergies && (
                      <span className="text-red-500">*</span>
                    )}
                  </FieldLabel>
                  <Textarea
                    placeholder="Ej: Penicilina, Polen, Mariscos (o escriba Ninguna)"
                    {...register("allergies")}
                  />
                  {errors.allergies && (
                    <span className="text-red-500 text-sm">
                      {errors.allergies.message}
                    </span>
                  )}
                </Field>

                {/* Contacto de Emergencia */}
                <Field>
                  <FieldLabel>
                    Contacto de Emergencia:{" "}
                    {errors.emergencyContact && (
                      <span className="text-red-500">*</span>
                    )}
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Ej: Maria Rodriguez - +52 311 554 2879"
                    {...register("emergencyContact")}
                  />
                  {errors.emergencyContact && (
                    <span className="text-red-500 text-sm">
                      {errors.emergencyContact.message}
                    </span>
                  )}
                </Field>

                {/* Historial Médico */}
                <Field>
                  <FieldLabel>
                    Historial Médico:{" "}
                    {errors.medicalHistory && (
                      <span className="text-red-500">*</span>
                    )}
                  </FieldLabel>
                  <Textarea
                    placeholder="Ej: Hipertensión, Diabetes, Operaciones anteriores"
                    {...register("medicalHistory")}
                  />
                  {errors.medicalHistory && (
                    <span className="text-red-500 text-sm">
                      {errors.medicalHistory.message}
                    </span>
                  )}
                </Field>
              </FieldSet>
            </FieldGroup>

            <DialogFooter className="sm:justify-end mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleClose()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Cargando..." : "Guardar"}
              </Button>
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

export default EditPatient;
