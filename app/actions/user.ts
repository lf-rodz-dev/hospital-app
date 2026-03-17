"use server";

import { UserFormData, UsersResponse } from "../lib/user/schema";

// Función para obtener lista de usuarios
export async function fetchUsers(
  query?: string,
  currentPage?: number,
  rol?: string,
  status?: string,
): Promise<UsersResponse> {
  try {
    // URL base del API
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL;

    // Construir parámetros de la URL
    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (currentPage) params.append("page", String(currentPage));
    if (rol && rol !== "all") params.append("rol", rol);
    if (status && status !== "all") params.append("status", status);

    // URL completa
    const apiUrl = `${baseUrl}/getUsers?${params.toString()}`;

    // Hacer petición
    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    // Parsear respuesta
    const result = await response.json();

    // Si la respuesta no es OK, retornar error
    if (!response.ok || !result.success) {
      return {
        success: false,
        data: [],
        totalPages: 0,
        message: result.message || "Error al obtener usuarios",
      };
    }

    // Retornar datos exitosos
    return {
      success: true,
      data: result.users,
      totalPages: result.totalPages,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Error en fetchUsers:", error);
    return {
      success: false,
      data: [],
      totalPages: 0,
      message: "Error al conectar con el servidor",
    };
  }
}

export const createUser = async (data: UserFormData) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const apiUrl = `${baseUrl}/createUser`;

    const response = await fetch(apiUrl, {
      method: "POST",
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
      message: "Error al conectar con el servidor",
    };
  }
};

export const fetchUserById = async (id: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL;

    const apiUrl = `${baseUrl}/getUserById?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
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
      data: result.user,
      message: result.message,
    };
  } catch (error: any) {
    return {
      message: "Error al conectar con el servidor.",
      success: false,
    };
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL;
    const apiUrl = `${baseUrl}/updateUser`;

    // Preparar el body
    const body: any = {
      id: userId,
      name: userData.userName,
      email: userData.userEmail,
      phone: userData.userPhone,
      address: userData.userAddress,
      city: userData.userCity,
      state: userData.userState,
      rol: userData.userRol,
      status: userData.userStatus,
      birthDate: userData.birthDate,
      age: userData.age,
      nss: userData.nss,
      gender: userData.gender
    };

    // Solo agregar password si no está vacío
    if (userData.userPassword && userData.userPassword.trim()) {
      body.password = userData.userPassword;
    }

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
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
      message: "Error al conectar con el servidor",
    };
  }
};

export async function deleteUser(id: string) {
  try {
    if (!id) {
      return {
        message: "ID de usuario requerido",
        success: false,
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL;
    const apiUrl = `${baseUrl}/deleteUser?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        message: result.message ?? "Error al eliminar el usuario",
        success: false,
      };
    }

    return {
      message: result.message ?? "Usuario eliminado exitosamente",
      success: true,
    };
  } catch (error: any) {
    return {
      message: `Error al conectar con el servidor.`,
      success: false,
    };
  }
}
