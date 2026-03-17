"use server";

import { success } from "zod";
import {
  AppointmentData,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
} from "../lib/schedule_appointment/schema";

export const fetchPatientsAppointment = async (
  query: string,
  currentPage: number,
) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (currentPage) params.append("page", String(currentPage));

    const apiUrl = `${baseUrl}/getPatientsAppointment?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success,
      data: data.patients || [], // ✅ Asegúrate que sea "patients"
      totalPages: data.totalPages || 0,
      message: null,
    };
  } catch (error: any) {
    console.error("Error fetching patients:", error);
    return {
      success: false,
      data: [],
      totalPages: 0,
      message: error.message || "Error al obtener pacientes",
    };
  }
};

export const fetchSpecialtiesAppointment = async () => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getSpecialtiesAppointment`;

    const response = await fetch(apiUrl, {
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
      message: null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.message || "Error al obtener especialidades",
    };
  }
};

export const fetchDoctorsAppointment = async (id_specialty: string | null) => {
  try {
    if (!id_specialty) {
      return {
        success: false,
        data: [],
        message: "ID de la especialidad requerido.",
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getDoctorsAppointment?id_specialty=${id_specialty}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.doctors,
      message: null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.message || "Error al obtener doctores.",
    };
  }
};

export const fetchDoctorInfoById = async (id_user: string) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
    const response = await fetch(`${baseUrl}/getDoctorInfoById?id_user=${id_user}`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!data.success) {
      return { success: false, message: data.message };
    }

    return {
      success: true,
      id_doctor: data.result.id_doctor,
      id_specialtie: data.result.id_specialtie,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const fetchDoctorAppointmentById = async (doctorId: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getDoctorAppointmentById?doctorId=${doctorId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success,
      data: data.doctor || null,
      message: null,
    };
  } catch (error: any) {
    console.error("Error fetching doctor:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Error al obtener datos del doctor",
    };
  }
};

export const fetchOccupiedAppointmentTimes = async (
  doctorId: string,
  date: string, // YYYY-MM-DD format
) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getOccupiedAppointmentTimes?doctorId=${doctorId}&date=${date}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: data.success,
      occupiedTimes: data.occupiedTimes || [],
      message: null,
    };
  } catch (error: any) {
    console.error("Error fetching occupied times:", error);
    return {
      success: false,
      occupiedTimes: [],
      message: error.message || "Error al obtener horarios ocupados",
    };
  }
};

export async function createAppointment(data: AppointmentData) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/createAppointment`;

    const response = await fetch(apiUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Error al conectar se con el servidor.",
    };
  }
}

export const fetchRecipeByAppointmentId = async (id: string) => {
  
}