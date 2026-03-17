import { z } from "zod";

export const PatientFormSchema = z.object({

  weight: z
    .string()
    .min(1, "El peso es requerido"),

  height: z
    .string()
    .min(1, "La altura es requerida"),

  bloodType: z
    .enum(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"], {
      errorMap: () => ({ message: "Selecciona un tipo de sangre válido" }),
    }),

  allergies: z
    .string()
    .min(1, "Las alergias son requeridas")
    .max(500, "Las alergias no pueden exceder 500 caracteres"),

  emergencyContact: z
    .string()
    .min(1, "El contacto de emergencia es requerido")
    .min(10, "El contacto debe tener al menos 10 caracteres")
    .max(100, "El contacto no puede exceder 100 caracteres"),

  medicalHistory: z
    .string()
    .min(1, "El historial médico es requerido")
    .max(1000, "El historial no puede exceder 1000 caracteres"),
});

export type PatientFormData = z.infer<typeof PatientFormSchema>;

export type UpdatePatientData = PatientFormData & {id: string;};