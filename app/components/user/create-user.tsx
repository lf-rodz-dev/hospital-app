"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UserFormData, UserFormSchema } from "../../lib/user/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/app/actions/user";
import { toast } from "sonner";

export const CreateUser = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

const {
  register,
  handleSubmit,
  control,
  watch,
  setValue,
  formState: { errors },
  reset,
} = useForm<UserFormData>({
  resolver: zodResolver(UserFormSchema),
  mode: "onBlur",
  defaultValues: {
    userStatus: true,
    userRol: "",
    birthDate: "",
    age: "",
    nss: "",
    gender: null,
  },
});

  const selectedRol = watch("userRol");
  const birthDate = watch("birthDate");

  useEffect(() => {
    if (!birthDate) return;

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    setValue("age", age.toString());
  }, [birthDate, setValue]);

  const mutation = useMutation({
    mutationFn: (data: UserFormData) => createUser(data),
    onMutate: () => {
      toast.loading("Creando usuario...", { id: "create-user" });
    },
    onSuccess: (result) => {
      toast.dismiss("create-user");
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["users-summary"] });
        handleClose();
      } else {
        toast.dismiss("create-user");
        toast.error(result.message);
      }
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer">
          <PlusIcon className="h-4 w-4" /> Nuevo
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Creación de Usuario</DialogTitle>
          <DialogDescription>
            Por favor, introduzca los datos del nuevo usuario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel>
                  Nombre{" "}
                  {errors.userName && <span className="text-red-500">*</span>}
                </FieldLabel>
                <Input
                  type="text"
                  {...register("userName")}
                  placeholder="Juan Algo"
                />
                {errors.userName && (
                  <span className="text-red-500 text-sm">
                    {errors.userName.message}
                  </span>
                )}
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>
                    Correo{" "}
                    {errors.userEmail && (
                      <span className="text-red-500">*</span>
                    )}
                  </FieldLabel>
                  <Input
                    type="email"
                    {...register("userEmail")}
                    placeholder="ejemplo@correo.com"
                  />
                  {errors.userEmail && (
                    <span className="text-red-500 text-sm">
                      {errors.userEmail.message}
                    </span>
                  )}
                </Field>
                <Field>
                  <FieldLabel>
                    Teléfono{" "}
                    {errors.userPhone && (
                      <span className="text-red-500">*</span>
                    )}
                  </FieldLabel>
                  <Input
                    type="text"
                    {...register("userPhone")}
                    placeholder="+52 311 257 8891"
                  />
                  {errors.userPhone && (
                    <span className="text-red-500 text-sm">
                      {errors.userPhone.message}
                    </span>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>
                    Ciudad{" "}
                    {errors.userCity && <span className="text-red-500">*</span>}
                  </FieldLabel>
                  <Input
                    type="text"
                    {...register("userCity")}
                    placeholder="Tepic"
                  />
                  {errors.userCity && (
                    <span className="text-red-500 text-sm">
                      {errors.userCity.message}
                    </span>
                  )}
                </Field>
                <Field>
                  <FieldLabel>
                    Estado{" "}
                    {errors.userState && (
                      <span className="text-red-500">*</span>
                    )}
                  </FieldLabel>
                  <Input
                    type="text"
                    {...register("userState")}
                    placeholder="Nayarit"
                  />
                  {errors.userState && (
                    <span className="text-red-500 text-sm">
                      {errors.userState.message}
                    </span>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel>
                  Dirección{" "}
                  {errors.userAddress && (
                    <span className="text-red-500">*</span>
                  )}
                </FieldLabel>
                <Input
                  type="text"
                  {...register("userAddress")}
                  placeholder="Colonia, calle, número"
                />
                {errors.userAddress && (
                  <span className="text-red-500 text-sm">
                    {errors.userAddress.message}
                  </span>
                )}
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>
                    Rol{" "}
                    {errors.userRol && <span className="text-red-500">*</span>}
                  </FieldLabel>
                  <Controller
                    name="userRol"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="rol" className="w-full">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paciente">Paciente</SelectItem>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                          <SelectItem value="Administrador">
                            Administrador
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.userRol && (
                    <span className="text-red-500 text-sm">
                      {errors.userRol.message}
                    </span>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Estatus</FieldLabel>
                  <Controller
                    name="userStatus"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2 items-center pt-2">
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-800">
                          Inactivo
                        </span>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-800">
                          Activo
                        </span>
                      </div>
                    )}
                  />
                </Field>
              </div>
              {selectedRol === "Paciente" && (
                <>
                  <section className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Fecha de Nacimiento</FieldLabel>
                      <Input type="date" {...register("birthDate")} />
                      {errors.birthDate && (
                        <span className="text-red-500 text-sm">
                          {errors.birthDate.message}
                        </span>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>Edad</FieldLabel>
                      <Input
                        type="number"
                        placeholder="Ej: 35"
                        disabled
                        {...register("age")}
                      />
                      {errors.age && (
                        <span className="text-red-500 text-sm">
                          {errors.age.message}
                        </span>
                      )}
                    </Field>
                  </section>
                  <section className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>NSS</FieldLabel>
                      <Input
                        type="text"
                        placeholder="Ej: 12345678901"
                        {...register("nss")}
                      />
                      {errors.nss && (
                        <span className="text-red-500 text-sm">
                          {errors.nss.message}
                        </span>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel>Genero</FieldLabel>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona Género" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Géneros</SelectLabel>
                                <SelectItem value="Masculino">
                                  Masculino
                                </SelectItem>
                                <SelectItem value="Femenino">
                                  Femenino
                                </SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.gender && (
                        <span className="text-red-500 text-sm">
                          {errors.gender.message}
                        </span>
                      )}
                    </Field>
                  </section>
                </>
              )}
              <Field>
                <FieldLabel>
                  Contraseña{" "}
                  {errors.userPassword && (
                    <span className="text-red-500">*</span>
                  )}
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  {...register("userPassword")}
                  placeholder="*******"
                />
                {errors.userPassword && (
                  <span className="text-red-500 text-sm">
                    {errors.userPassword.message}
                  </span>
                )}
              </Field>
            </FieldSet>
          </FieldGroup>

          <DialogFooter className="sm:justify-end mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => handleClose()}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
