"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
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
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { EditUserFormData, EditUserFormSchema } from "@/app/lib/user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserById, updateUser } from "@/app/actions/user";
import { toast } from "sonner";

interface EditUserProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditUser = ({ userId, open, onOpenChange }: EditUserProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(EditUserFormSchema),
    mode: "onBlur",
    defaultValues: {
      userStatus: true,
      userRol: "",
      birthDate: "",
      age: "",
      nss: "",
      gender: null,
      userPassword: "",
    },
  });

  const selectedRol = watch("userRol");
  const birthDate = watch("birthDate");

  // calcular edad automáticamente
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

  // limpiar datos médicos si cambia el rol
  useEffect(() => {
    if (selectedRol !== "Paciente") {
      setValue("birthDate", "");
      setValue("age", "");
      setValue("nss", "");
      setValue("gender", null);
    }
  }, [selectedRol, setValue]);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: open && !!userId,
    select: (response) => response?.data,
  });

  // cargar datos del usuario
  useEffect(() => {
    if (!user) return;

    reset({
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      userCity: user.city,
      userState: user.state,
      userAddress: user.address,
      userRol: user.rol,
      userStatus: user.status,
      userPassword: "",
      birthDate: user.birth_date ? user.birth_date.split("T")[0] : "",
      age: user.age || "",
      nss: user.nss || "",
      gender: user.gender || null,
    });
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: EditUserFormData) => updateUser(userId, data),
    onMutate: () => {
      toast.loading("Actualizando usuario...", { id: "update-user" });
    },
    onSuccess: (result) => {
      toast.dismiss("update-user");

      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        handleClose();
      } else {
        toast.error(result.message);
      }
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (data: EditUserFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Creación de Usuario</DialogTitle>
          <DialogDescription>
            Por favor, introduzca los datos del nuevo usuario.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        ) : user ? (
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
                      {errors.userRol && (
                        <span className="text-red-500">*</span>
                      )}
                    </FieldLabel>

                    <Controller
                      name="userRol"
                      control={control}
                      render={({ field }) => (
                        <Select
                          key={`userRol-${field.value}`}
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
                            checked={field.value ?? false}
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
                      </Field>
                    </section>
                  </>
                )}

                <Field>
                  <FieldLabel>
                    Contraseña (Si no se cambia, se conserva la anterior)
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
                onClick={handleClose}
              >
                Cancelar
              </Button>

              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">No se encontro el usuario.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;