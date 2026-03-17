"use server";

import { PatientFormData, UpdatePatientData } from "../lib/patient_history/schema";

export async function fetchPatients(
  query?: string,
  currentPage?: number,
  status?: string,
) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (currentPage) params.append("page", String(currentPage));
    if (status && status !== "all") params.append("status", status);

    const response = await fetch(
      `${baseUrl}/getPatients?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.users,
      totalPages: data.totalPages,
      message: null,
    };
  } catch (error: any) {
    console.error("Error en fetchPatients:", error);
    return {
      success: false,
      data: [],
      totalPages: 0,
      message: error.message || "Error al obtener usuarios",
    };
  }
}

export const fetchInfoPatient = async (id: string) => {
  try {
    if (!id) {
      return {
        message: "ID del paciente requerido",
        success: false,
        name: "",
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getInfoPatient?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success,
      data: data.patient,
      message: null,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al consultar nombre de paciente",
    };
  }
};

export const registerPatient = async (
  data: PatientFormData,
  id_user: string,
) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/registerPatient`;

    // Agregar id_user al payload
    const payload = {
      ...data,
      id_user,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Error al registrar paciente",
      };
    }

    return {
      success: true,
      message: result.message || "Paciente registrado con éxito",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error en registerPatient:", error);
    return {
      success: false,
      message: error.message || "Error al conectar con el servidor",
    };
  }
};

export const fetchPatientById = async (id: string) => {
  try {
    if (!id) {
      return {
        message: "ID del paciente requerido",
        success: false,
        data: null,
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getPatientById?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("Error en fetchPatientById:", error);
    return {
      success: false,
      message: error.message || "Error al conectar con el servidor",
      data: null,
    };
  }
};

export const updatePatient = async (data: UpdatePatientData) => {
  try {
    if (!data.id) {
      return {
        success: false,
        message: "ID del paciente requerido",
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/updatePatient`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Error al actualizar paciente",
      };
    }

    return {
      success: true,
      message: result.message || "Paciente actualizado exitosamente",
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error en updatePatient:", error);
    return {
      success: false,
      message: error.message || "Error al conectar con el servidor",
    };
  }
};