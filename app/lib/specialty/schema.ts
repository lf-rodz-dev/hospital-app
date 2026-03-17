import { z } from "zod";

export const SpecialtySchema = z.object({
  name_specialtie: z
    .string()
    .min(1, { message: "El nombre de especialidad es requerido." })
    .max(100, { message: "El nombre no puede exceder 100 caracteres." }),
  description: z
    .string()
    .min(1, { message: "La descripción es requerida." })
    .max(500, { message: "La descripción no puede exceder 500 caracteres." }),
  office_number: z
    .string()
    .min(1, { message: "El número de consultorio es requerido." })
    .max(10, {
      message: "El número de consultorio no puede exceder 10 caracteres.",
    }),
});

//Inferir tipos de la validacion
export type SpecialtyFormData = z.infer<typeof SpecialtySchema>;

// Tipo para actualización (con id)
export type UpdateSpecialtyData = SpecialtyFormData & {
  id: string;
};