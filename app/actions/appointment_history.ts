import { success } from "zod";
import {
  FetchAppointmentResponse,
  FetchAppointmentsResponse,
} from "../lib/schedule_appointment_p/types";
import { CreateRecipe, Medicament } from "../lib/schedule_appointment/types";

export const fetchAppointmentsPatient = async (
  id: string,
  startDate?: string,
  endDate?: string,
): Promise<FetchAppointmentsResponse> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    // Construir URL con parámetros opcionales
    const params = new URLSearchParams({ id });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const apiUrl = `${baseUrl}/getAppointmentsPatient?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        data: [],
        message: result.message,
      };
    }

    return {
      success: true,
      data: result.appointment,
      filters: result.filters,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.message,
    };
  }
};

export const fetchAppointmentsDoctor = async (
  id: string,
  startDate?: string,
  endDate?: string,
): Promise<FetchAppointmentsResponse> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    // Validar que si se proporciona startDate, también se proporcione endDate
    if (startDate && !endDate) {
      endDate = startDate;
    }

    // Construir URL con parámetros opcionales
    const params = new URLSearchParams({ id });
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const apiUrl = `${baseUrl}/getAppointmentsDoctor?${params.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        data: [],
        message: result.message,
      };
    }

    return {
      success: true,
      data: result.appointment,
      filters: result.filters,
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      message: error.message,
    };
  }
};

export const fetchAppointmentById = async (
  id: string,
): Promise<FetchAppointmentResponse> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getAppointmentById?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        data: null,
        message: result.message,
      };
    }

    return {
      success: true,
      data: result.appointment,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }
};

export const cancelAppointment = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/cancelAppointment`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
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
      message: error.message,
    };
  }
};

export const completedAppointment = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/completedAppointment`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
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
      message: error.message,
    };
  }
};

export const unassistedAppointment = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/unassistedAppointment`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
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
      message: error.message,
    };
  }
};

export const getDoctorIdByUserId = async (
  id_user: string,
): Promise<{ success: boolean; id_doctor?: string; message: string }> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const response = await fetch(`${baseUrl}/getDoctorByUserId?id=${id_user}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      id_doctor: result.id_doctor,
      message: "OK",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const rescheduleAppointment = async (data: {
  id_appointment: string;
  date: string;
  time: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
    const apiUrl = `${baseUrl}/rescheduleAppointment`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();

    return {
      success: result.success,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const createRecipe = async (data: CreateRecipe) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/createRecipe`;

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
        success: result.success,
        message: result.message,
      };
    }

    return {
      success: result.success,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const fetchRecipeById = async (id: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getRecipeById?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: result.success,
        message: result.message,
      };
    }

    return {
      success: result.success,
      id_recipe: result.id_recipe,
      data: result.medicaments,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateAndCreateMedicaments = async ({
  id_recipe,
  existingMedications,
  newMedications,
  patient_name,
  doctor_name,
}: {
  id_recipe: string;
  existingMedications: any[];
  newMedications: any[];
  patient_name?: string;
  doctor_name?: string;
}) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/updateRecipe`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_recipe,
        existingMedications: existingMedications.filter((med) =>
          med.name.trim()
        ),
        newMedications: newMedications.filter((med) => med.name.trim()),
        patient_name,
        doctor_name,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || `Error ${response.status}`,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Cambios guardados exitosamente",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Error al guardar cambios",
    };
  }
};

export const deleteMedicament = async (id: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/deleteMedicament?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      cache: "no-store"
    });

    const result = await response.json();

    if(!result.success){
      return{
        success: result.success,
        message: result.message
      }
    }

    return{
      success: result.success,
      message: result.message
    }
  } catch (error: any) {
    return{
      success: false,
      message: error.message
    }
  }
};

export const getRecipePdfUrl = async (id_appointment: string) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    const apiUrl = `${baseUrl}/getRecipePdf?id_appointment=${id_appointment}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || `Error ${response.status}`,
        pdf_url: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message,
      pdf_url: result.pdf_url,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Error al obtener la URL del PDF",
      pdf_url: null,
    };
  }
};
