
export const routeConfig = {
  "/dashboard": "Panel de Control",
  "/dashboard/user": "Usuarios",
  "/dashboard/doctor": "Doctores",
  "/dashboard/specialties": "Especialidades",
  "/dashboard/patient_history": "Historial Médico de Pacientes",
  "/dashboard/patient_appointments": "Administrador de Citas",
  "/dashboard/schedule_appointment_d": "Agendar Cita",
  "/dashboard/schedule_appointment_p": "Agendar Cita",
  "/dashboard/dating_history": "Historial de Citas",
} as const;

export type Route = keyof typeof routeConfig;

// Función para obtener el nombre de la ruta
export const getRouteName = (pathname: string) => {
  return routeConfig[pathname as Route] || "Página";
};