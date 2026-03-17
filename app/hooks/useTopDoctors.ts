// hooks/useTopDoctors.ts

import { useQuery } from "@tanstack/react-query";
import { getTopDoctors } from "@/app/actions/dashboard";

interface Doctor {
  id_doctor: string;
  doctor_name: string;
  name_specialtie: string;
  total_appointments: number;
}

interface DoctorsResponse {
  data: Doctor[];
}

export function useTopDoctors() {
  return useQuery<DoctorsResponse>({
    queryKey: ["topDoctors"],
    queryFn: getTopDoctors,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    refetchInterval: 1000 * 60 * 30, // Refetch cada 30 minutos
    retry: 2,
    enabled: true,
  });
}