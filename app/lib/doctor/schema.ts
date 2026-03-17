import { z } from "zod";

export const DoctorFormSchema = z.object({
  specialty: z
    .string()
    .min(1, { message: "La especialidad es requerida" }),
  rfc: z
    .string()
    .min(1, { message: "RFC requerido" })
    .length(13, { message: "RFC debe tener 13 caracteres" }),
  cedulaNumber: z
    .string()
    .min(1, { message: "Cédula requerida" }),
  startTime: z
    .string()
    .min(1, { message: "Hora de inicio requerida" }),
  endTime: z
    .string()
    .min(1, { message: "Hora de fin requerida" }),
  daysAvailable: z
    .array(z.string())
    .min(1, { message: "Debe seleccionar al menos un día" }),
});

// Tipos inferidos automáticamente
export type DoctorFormData = z.infer<typeof DoctorFormSchema>;

// Tipo para la respuesta del servidor (reutilizar)
export type UpdateDoctorResponse = {
  success: boolean;
  message: string;
  id_doctor: string;
  error: null | string;
};

// Tipo del doctor desde la BD (extender del form data)
export type DoctorData = {
  id_doctor: string;
  id_user: string;
  id_specialtie: string;
  rfc: string;
  cedula_number: string;
  start_time: string;
  end_time: string;
  days_available: string;
  office_number: string;
};

// Tipo para enviar al servidor (sin id_doctor porque ya está en el schema)
export type UpdateDoctorPayload = {
  id_doctor: string;
  id_specialtie: string;
  rfc: string;
  cedula_number: string;
  start_time: string;
  end_time: string;
  days_available: string[];
  office_number: string;
};


// Tipo para registro de doctor
export type RegisterDoctorPayload = DoctorFormData & {
  id_user: string;
  id_specialtie: string,
  office_number: string;
};

// Tipos para las queries
export type Specialty = {
  id_specialtie: string;
  name_specialtie: string;
  office_number: string;
};

export type SpecialtiesResponse = {
  success: boolean;
  data: Specialty[];
  message?: string;
};

export type NameResponse = {
  success: boolean;
  name: string;
};