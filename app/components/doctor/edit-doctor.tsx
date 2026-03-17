"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDoctorById,
  fetchSpecialtiesSelect,
  fetchNameDoctor,
  updateDoctor,
} from "@/app/actions/doctor";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  DoctorFormSchema,
  type DoctorFormData,
  type UpdateDoctorPayload,
  type Specialty,
} from "@/app/lib/doctor/schema";

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type DayWeek = {
  id: string;
  label: string;
};

const EditDoctor = ({ id, open, onOpenChange }: Props) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dayWeek] = useState<DayWeek[]>([
    { id: "lunes", label: "Lunes" },
    { id: "martes", label: "Martes" },
    { id: "miercoles", label: "Miércoles" },
    { id: "jueves", label: "Jueves" },
    { id: "viernes", label: "Viernes" },
    { id: "sabado", label: "Sábado" },
    { id: "domingo", label: "Domingo" },
  ]);

  const queryClient = useQueryClient();

  const {
    control,
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<DoctorFormData>({
    resolver: zodResolver(DoctorFormSchema),
  });

  const selectedSpecialtyId = watch("specialty");

  const { data: specialtiesData } = useQuery({
    queryKey: ["specialties-select"],
    queryFn: fetchSpecialtiesSelect,
    enabled: open,
  });

  const { data: nameData } = useQuery({
    queryKey: ["doctor-name", id],
    queryFn: () => fetchNameDoctor(id),
    enabled: open && !!id,
  });

  const { data: doctorResponse, isLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => fetchDoctorById(id),
    enabled: open && !!id,
  });

  const doctor = doctorResponse?.data;

  const { mutate: submitUpdate } = useMutation({
    mutationFn: updateDoctor,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Doctor actualizado exitosamente");
        queryClient.invalidateQueries({ queryKey: ["doctors"] });
        reset();
        setSelectedDays([]);
        onOpenChange(false);
      } else {
        toast.error(response.message || "Error al actualizar el doctor");
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al actualizar el doctor",
      );
    },
  });

  useEffect(() => {
    if (open && doctor) {
      const daysArray = doctor.days_available
        .split(",")
        .map((day: string) => day.trim());

      reset({
        specialty: doctor.id_specialtie,
        rfc: doctor.rfc,
        cedulaNumber: doctor.cedula_number,
        startTime: doctor.start_time,
        endTime: doctor.end_time,
        daysAvailable: daysArray,
      });

      setSelectedDays(daysArray);
    }
  }, [open, doctor, reset]);

  const doctorName = nameData?.name ?? "";
  const specialties: Specialty[] = specialtiesData?.data ?? [];

  const selectedSpecialty: Specialty | undefined = specialties.find(
    (spec) => spec.id_specialtie === selectedSpecialtyId,
  );

  const handleDayChange = (day: string, checked: boolean) => {
    const newDays = checked
      ? [...selectedDays, day]
      : selectedDays.filter((d) => d !== day);
    setSelectedDays(newDays);

    setValue("daysAvailable", newDays, {
      shouldValidate: true,
    });
  };

  const onSubmit = (data: DoctorFormData) => {
    if (!doctor?.id_doctor) {
      toast.error("Error: No se encontró el ID del doctor");
      return;
    }

    const payload = {
      id_doctor: doctor.id_doctor,
      id_specialtie: data.specialty,
      rfc: data.rfc,
      cedula_number: data.cedulaNumber,
      start_time: data.startTime,
      end_time: data.endTime,
      days_available: data.daysAvailable,
      office_number: selectedSpecialty?.office_number ?? "",
    };

    submitUpdate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Médico</DialogTitle>
          <DialogDescription>
            Actualiza la información profesional del doctor en el sistema.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        ) : doctor ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <Field>
                  <FieldLabel>Nombre</FieldLabel>
                  <Input disabled value={doctorName} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>
                      RFC{" "}
                      {errors.rfc && <span className="text-red-500">*</span>}
                    </FieldLabel>
                    <Input {...register("rfc")} placeholder="ABC123456XYZ" />
                    {errors.rfc && (
                      <span className="text-red-500 text-sm">
                        {errors.rfc.message}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>
                      Cédula Profesional{" "}
                      {errors.cedulaNumber && (
                        <span className="text-red-500">*</span>
                      )}
                    </FieldLabel>
                    <Input
                      {...register("cedulaNumber")}
                      placeholder="12345678"
                    />
                    {errors.cedulaNumber && (
                      <span className="text-red-500 text-sm">
                        {errors.cedulaNumber.message}
                      </span>
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel>
                    Días Disponibles
                    {errors.daysAvailable && (
                      <span className="text-red-500">*</span>
                    )}
                  </FieldLabel>
                  <Input type="hidden" {...register("daysAvailable")} />
                  {errors.daysAvailable && (
                    <span className="text-red-500 text-sm">
                      {errors.daysAvailable.message}
                    </span>
                  )}
                  <div className="grid grid-cols-4 gap-3">
                    {dayWeek.map((dia) => (
                      <div key={dia.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={dia.id}
                          checked={selectedDays.includes(dia.id)}
                          onCheckedChange={(checked) =>
                            handleDayChange(dia.id, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={dia.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {dia.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedDays.length > 0 && (
                    <p className="text-xs text-green-600 mt-2">
                      Días seleccionados: {selectedDays.join(", ")}
                    </p>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>
                      Hora de Inicio
                      {errors.startTime && (
                        <span className="text-red-500">*</span>
                      )}
                    </FieldLabel>
                    <Input type="time" {...register("startTime")} />
                    {errors.startTime && (
                      <span className="text-red-500 text-sm">
                        {errors.startTime.message}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>
                      Hora de Salida
                      {errors.endTime && (
                        <span className="text-red-500">*</span>
                      )}
                    </FieldLabel>
                    <Input type="time" {...register("endTime")} />
                    {errors.endTime && (
                      <span className="text-red-500 text-sm">
                        {errors.endTime.message}
                      </span>
                    )}
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>
                      Especialidad
                      {errors.specialty && (
                        <span className="text-red-500">*</span>
                      )}
                    </FieldLabel>
                    <Controller
                      name="specialty"
                      control={control}
                      render={({ field }) => (
                        <Select
                          key={`specialty-${field.value}`}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona Especialidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Especialidades</SelectLabel>
                              {specialties.map((specialty) => (
                                <SelectItem
                                  key={specialty.id_specialtie}
                                  value={specialty.id_specialtie}
                                >
                                  {specialty.name_specialtie}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.specialty && (
                      <span className="text-red-500 text-sm">
                        {errors.specialty.message}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Consultorio</FieldLabel>
                    <Input
                      disabled
                      value={selectedSpecialty?.office_number ?? ""}
                      placeholder="Se llena automáticamente"
                    />
                  </Field>
                </div>

                <div className="flex gap-2 justify-end mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </FieldSet>
            </FieldGroup>
          </form>
        ) : (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">No se encontraron datos.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDoctor;
