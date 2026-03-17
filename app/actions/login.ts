import { LoginFormData } from "../lib/login/schema";

export const login = async (data: LoginFormData) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL;
    
    const apiUrl = `${baseUrl}/login`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Error en la autenticación",
      };
    }

    // Guardar el token si viene en la respuesta
    if (result.token) {
      localStorage.setItem("authToken", result.token);
    }

    return {
      success: true,
      message: result.message,
      data: result.user,
      token: result.token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Error al conectarse con el servidor",
    };
  }
};