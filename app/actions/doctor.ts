"use server";

import {
  UpdateDoctorPayload,
  RegisterDoctorPayload,
} from "@/app/lib/doctor/schema";
import { success } from "zod";

export const fetchDoctors = async (
  query?: string,
  currentPage?: number,
  status?: string,
) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    /*Hacer una copia editable de los parametros de la url actual*/
    const params = new URLSearchParams();
    /*Si existe una query introducirla en los parametros de la url*/
    if (query) params.append("query", query);
    /*Si existe una currentPage introducirla en los parametros de la url*/
    if (currentPage) params.append("page", String(currentPage));
    /*Si existe status y status es diferente de all introducirla dentro de los parametros de la url*/
    if (status && status != "all") params.append("status", status);

    /*Traer los registros de doctores y poder pasar los filtros a traves de la consulta*/
    const response = await fetch(`${baseUrl}/getDoctors?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    /*Error si la respuesta del servidor es negativa*/
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    /*Guardamos la respuesta json en la constante data*/
    const data = await response.json();

    /*Retorna los datos y el total de paginas que vienen del back*/
    return {
      success: true,
      data: data.doctors,
      totalPages: data.totalPages,
      error: null,
    };

    /*Si la consulta falla muestra un error*/
  } catch (error: any) {
    return {
      success: false,
      data: [],
      totalPages: 0,
      message: error.message || "Error al obtener los doctores.",
    };
  }
};

export const fetchSpecialtiesSelect = async () => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const response = await fetch(`${baseUrl}/getSpecialtiesSelect`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.specialties,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.message || "Error al obtener las especialidades.",
    };
  }
};

export const fetchNameDoctor = async (id: string) => {
  try {
    if (!id) {
      return {
        message: "ID del usuario doctor requerido",
        success: false,
        name: "",
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
    const apiUrl = `${baseUrl}/getNameDoctor?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Retornar en el formato esperado por el componente
    return {
      success: data.success,
      name: data.name || "",
      error: null,
    };
  } catch (error: any) {
    ("Error en fetchNameDoctor: ", error);
    return {
      success: false,
      name: "",
      message: error.message || "Error al obtener el nombre del doctor",
    };
  }
};

export const registerDoctor = async (doctorData: RegisterDoctorPayload) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const response = await fetch(`${baseUrl}/registerDoctor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctorData),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message,
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Error al conectar con el servidor",
    };
  }
};

export const fetchDoctorById = async (id: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    // ✅ Cambiar parámetro de id_doctor a id (como espera el backend)
    const response = await fetch(`${baseUrl}/getDoctorById?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    // ✅ El backend retorna data.data, no data.doctor
    return {
      success: data.success,
      data: data.data, // ← CAMBIO: era data.doctor
      message: data.message,
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message || "Error al obtener datos del doctor",
      error: error,
    };
  }
};

export const updateDoctor = async (doctorData: UpdateDoctorPayload) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const response = await fetch(`${baseUrl}/updateDoctor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctorData),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message,
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Error al conectar con el servidor.",
    };
  }
};
