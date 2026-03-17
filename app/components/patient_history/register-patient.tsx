import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
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
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import {
  fetchInfoPatient,
  registerPatient,
} from "@/app/actions/patients_history";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PatientFormSchema,
  type PatientFormData,
} from "@/app/lib/patient_history/schema";
import { toast } from "sonner";

type Props = {
  id: string; // Este es el id_user
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

const RegisterPatient = ({ id, open, onOpenChange }: Props) => {
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
}

  const mutation = useMutation({
    mutationFn: (data: PatientFormData) => registerPatient(data, id), // ← Pasar id como id_user
    onMutate: () => {
      toast.loading("Registrando historial médico del paciente...", {
        id: "register-patient",
      });
    },
    onSuccess: (result) => {
      toast.dismiss("register-patient");
      if (result.success) {
        toast.success("Historial médico del paciente registrado con éxito");
        queryClient.invalidateQueries({ queryKey: ["patients"] });
        handleClose();
      } else {
        toast.error(
          result.message ||
            "Error al registrar el historial médico del paciente",
        );
      }
    },
    onError: (error: Error) => {
      toast.dismiss("register-patient");
      toast.error("Error inesperado: " + error.message);
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registro de Historia Médico</DialogTitle>
          <DialogDescription>
            Ingresa información médica del paciente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              {/* Nombre (deshabilitado) */}
              <Field>
                <FieldLabel>Nombre</FieldLabel>
                <Input disabled value={infoPatient?.name || ""}/>
              </Field>

              {/* Fecha de Nacimiento */}
              <Field>
                <FieldLabel>Fecha de Nacimient</FieldLabel>
                <Input type="date" disabled value={formatDateForInput(infoPatient?.birthDate) || ""}/>
              </Field>

              {/* Grid: NSS, Edad, Género */}
              <div className="grid grid-cols-4 gap-4">
                <Field className="col-span-2">
                  <FieldLabel>NSS</FieldLabel>
                  <Input type="text" disabled value={infoPatient?.nss || ""}/>
                </Field>

                <Field>
                  <FieldLabel>Edad</FieldLabel>
                  <Input type="number" disabled value={infoPatient?.age || ""}/>
                </Field>

                {/* Género con Controller */}
                <Field>
                  <FieldLabel>Género</FieldLabel>
                  <Input disabled value={infoPatient?.gender || ""}/>
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
                        value={field.value || ""}
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
                  {errors.allergies && <span className="text-red-500">*</span>}
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterPatient;
