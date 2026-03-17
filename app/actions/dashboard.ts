import { success } from "zod";

export async function fetchSummary() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

  const response = await fetch(`${baseUrl}/getSummary`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error al obtener resumen");
  }

  return response.json();
}

export const getTopSpecialties = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

  const apiUrl = `${baseUrl}/getTopSpecialties`;

  const response = await fetch(apiUrl, {
    method: "GET",
    cache: "no-store"
  });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return{
      data: data.specialties
    }
};

export const getTopDoctors = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

  const apiUrl = `${baseUrl}/getTopDoctors`;

  const response = await fetch(apiUrl, {
    method: "GET",
    cache: "no-store"
  });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return{
      data: data.doctors
    }
};
