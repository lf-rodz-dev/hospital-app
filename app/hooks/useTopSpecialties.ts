// hooks/useTopSpecialties.ts

import { useQuery } from "@tanstack/react-query";
import { getTopSpecialties } from "@/app/actions/dashboard";

interface Specialty {
  id_specialtie: string;
  name_specialtie: string;
  total_doctors: number;
}

interface SpecialtiesResponse {
  data: Specialty[];
}

export function useTopSpecialties() {
  return useQuery<SpecialtiesResponse>({
    queryKey: ["topSpecialties"],
    queryFn: getTopSpecialties,
  });
}