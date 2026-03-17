import {z} from 'zod'

export const LoginFormSchema = z.object ({
    userEmail: z
    .string()
    .min(1, {message: "Correo del usuario requerido."})
    .email({message: "Email invalido"}),
    userPass: z
    .string()
    .min(1, {message: "Contraseña del usuario requerida."})
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;