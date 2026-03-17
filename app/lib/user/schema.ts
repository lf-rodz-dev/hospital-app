import { z } from "zod";

export type User = {
  id_user: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  rol: string;
  status: boolean;
  created_at: string;
};

export type UsersResponse = {
  success: boolean;
  data: User[];
  totalPages: number;
  message?: string;
};

export const UserFormSchema = z.object({
  userName: z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(45, { message: "El nombre debe tener maximo 45 caracteres" }),
  userEmail: z.string().email({ message: "Email inválido" }),
  userPhone: z.string().min(1, { message: "El teléfono es requerido" }),
  userAddress: z.string().min(1, { message: "La dirección es requerida" }),
  userCity: z.string().min(1, { message: "La ciudad es requerida" }),
  userState: z.string().min(1, { message: "El estado es requerido" }),
  userRol: z.string().min(1, { message: "El rol es requerido" }),
  userPassword: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  userStatus: z.boolean(),
  birthDate: z.string().optional(),
  age: z.string().optional(),
  nss: z.string().optional(),
  gender: z.enum(["Masculino", "Femenino", "Otro"]).optional().nullable(),
});

export const EditUserFormSchema = UserFormSchema.extend({
  userPassword: z.string().refine((val) => val === "" || val.length >= 6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

export type UserFormData = z.infer<typeof UserFormSchema>;
export type EditUserFormData = z.infer<typeof EditUserFormSchema>;
