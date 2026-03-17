// Interfaz para tipar las citas
export interface Appointment {
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

export type PeriodType = "day" | "week" | "month";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Medication {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
}

export const emptyMedication: Medication = {
  name: "",
  dose: "",
  frequency: "",
  duration: "",
  route: "Oral",
};

export interface CreateRecipe {
  id_appointment: string;
  patient_name: string;
  doctor_name: string;
  medicaments: Medication[];
}

export type Medicament={
  id_medicament: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
}
