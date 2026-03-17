/**
 * Convierte un string de días disponibles a array de números
 * @param daysString - Ej: "lunes,martes,miercoles,jueves,viernes" O "1,2,3,4,5"
 * Retorna array de números (0=Domingo, 1=Lunes, 2=Martes, etc)
 */
export const parseDaysAvailable = (daysString: string): number[] => {
  const dayMapping: { [key: string]: number } = {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miercoles: 3,
    miércoles: 3, // Por si hay tilde
    jueves: 4,
    viernes: 5,
    sabado: 6,
    sábado: 6, // Por si hay tilde
  };

  const days = daysString.split(",").map((day) => day.trim().toLowerCase());

  const result: number[] = [];

  for (const day of days) {
    // Intentar parsear como número primero
    const numDay = parseInt(day, 10);
    if (!isNaN(numDay)) {
      result.push(numDay);
      continue;
    }

    // Si no es número, buscar en el mapeo de nombres
    if (dayMapping[day] !== undefined) {
      result.push(dayMapping[day]);
    }
  }

  return result;
};

/**
 * Verifica si un día es disponible
 * @param date - Fecha a verificar
 * @param availableDays - Array de días disponibles (0-6)
 */
export const isDayAvailable = (
  date: Date,
  availableDays: number[],
): boolean => {
  const dayOfWeek = date.getDay();
  return availableDays.includes(dayOfWeek);
};

/**
 * Convierte un string de tiempo (HH:MM:SS) a minutos desde medianoche
 */
export const timeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Convierte minutos desde medianoche a formato HH:MM
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

/**
 * Calcula los slots de tiempo disponibles
 * @param startTime - Hora inicio (HH:MM:SS)
 * @param endTime - Hora fin (HH:MM:SS)
 * @param slotDuration - Duración de cada slot en minutos (default: 30)
 */
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  slotDuration: number = 30,
): string[] => {
  const slots: string[] = [];
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  let currentMinutes = startMinutes;
  while (currentMinutes < endMinutes) {
    slots.push(minutesToTime(currentMinutes));
    currentMinutes += slotDuration;
  }

  return slots;
};

/**
 * Obtiene los nombres de los días de la semana en español
 */
export const getDayName = (dayIndex: number): string => {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return days[dayIndex] || "";
};

/**
 * Formatea una fecha al formato YYYY-MM-DD
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Obtiene las fechas disponibles para un mes específico
 */
export const getAvailableDatesInMonth = (
  year: number,
  month: number,
  availableDays: number[],
): Date[] => {
  const dates: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (
    let date = new Date(firstDay);
    date <= lastDay;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();

    // Solo agregar si el día está disponible y es futuro
    if (availableDays.includes(dayOfWeek) && date >= today) {
      dates.push(new Date(date));
    }
  }

  return dates;
};
