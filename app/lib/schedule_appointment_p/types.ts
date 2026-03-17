// Interfaz para tipar las citas
interface Appointment {
  id_appointment: string;
  id_user: string;
  id_specialty: string;
  id_doctor: string;
  date: string;
  time: string;
  status: "pendiente" | "completada" | "sin asistencia" | "cancelada";
  patient_name: string;
  doctor_name: string;
  name_specialtie: string;
  office_number: string;
  created_at: string;
  updated_at: string;
  has_recipe_record: number;
}

// Interfaz para respuesta de UN SOLO appointment
export interface FetchAppointmentResponse {
  success: boolean;
  data: Appointment | null;
  message?: string;
}

// Si aún necesitas FetchAppointmentsResponse (para lista de citas)
export interface FetchAppointmentsResponse {
  success: boolean;
  data: Appointment[];
  message?: string;
  filters?: {
    date: string;
  };
}