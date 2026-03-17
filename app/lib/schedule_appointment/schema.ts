export type FetchPatientsResponse = {
  success: boolean;
  data: Patient[];
  totalPages: number;
  message: string | null;
};

export type FetchSpecialtiesResponse = {
  success: boolean;
  data: Specialty[];
  message: string | null;
};

export type fetchDoctorsResponse = {
  success: boolean;
  data: Doctor[];
  message: string | null;
};

export type TimeSlot = {
  time: string; // formato HH:MM
  available: boolean;
};

// ===== NUEVOS TIPOS PARA EL FLUJO DE CITAS =====

export type Patient = {
  id_user: string;
  name: string;
  email: string;
  phone: string;
};

export type Specialty = {
  id_specialtie: string;
  name_specialtie: string;
  description: string;
};

export type Doctor = {
  id_doctor: string;
  doctor_name: string;
  office_number: string | null;
  start_time: string; // formato HH:MM:SS
  end_time: string; // formato HH:MM:SS
  days_available: string; // ej: "lunes,martes,miercoles,jueves,viernes"
};

export type Appointment = {
  selectedDate: Date | null;
  selectedTime: string | null;
};

export type AppointmentData = {
  id_user: string;
  id_specialty: string;
  id_doctor: string;
  date: string;
  time: string;
};

// ===== TIPOS PARA GUARDAR EN BASE DE DATOS =====

export type CreateAppointmentRequest = {
  id_patient: string;
  id_doctor: string;
  appointment_date: Date;
  appointment_time: string; // formato HH:MM
  status?: "pending" | "confirmed" | "cancelled";
};

export type CreateAppointmentResponse = {
  success: boolean;
  message: string;
  appointmentId?: string;
};
