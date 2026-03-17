"use server";

import { SpecialtyFormData, UpdateSpecialtyData } from "../lib/specialty/schema";

export async function createSpecialty(data: SpecialtyFormData) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
    const apiUrl = `${baseUrl}/createSpecialty`;

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
        message: result.message || "Error al crear la especialidad",
      };
    }

    return {
      success: true,
      message: result.message || "Especialidad creada exitosamente",
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Error al conectar con el servidor",
    };
  }
}

{
  /*Funcion asincrona que recibe como parametros las consultas y la pagina actual*/
}
export const fetchSpecialties = async (query: string, currentPage: number) => {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";

    {
      /*obtenemos una copia editable de los parametros de la url actual (en principio solo esta la url base)*/
    }
    const params = new URLSearchParams();
    {
      /*Si existe una consulta la añadimos a la url*/
    }
    if (query) params.append("query", query);
    {
      /*Si existe una pagina la añadimos a la url*/
    }
    if (currentPage) params.append("page", String(currentPage));

    const response = await fetch(
      /*Realizamos la consulta asincrona a la api*/
      `${baseUrl}/getSpecialties?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    {
      /*Si la repuesta no es ok arroja un mensaje de error*/
    }
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    {
      /*En la constante data guardamos la respuesta del servidor*/
    }
    const data = await response.json();

    {
      /*De cumplirse la consulta con exito retornamos un objeto con los datos
      consulta success(boleano de si se ontuvo respuesta), data(los datos de las especialidades como un array)
      totalPages(paginas totales de los datos) message (mensajes de error si hay errores que en este caso no hay)*/
    }
    return {
      success: true,
      data: data.specialties,
      totalPages: data.totalPages,
      message: null,
    };
    {
      /*Si la consulta falla mostramos un mensaje de error en consola y regresamos
      success(boleano que dice que no se obtuvo respuesta)
      data (array vacio ya que no se obtuvieron los datos de las especialidades)
      totalPages(0 ya que no hay datos)
      message (mensaje de error ya que no se obtuvo respuesta)*/
    }
  } catch (error: any) {
    return {
      success: false,
      data: [],
      totalPages: 0,
      message: error.message || "Error al obtener especialidades",
    };
  }
};

export const fetchSpecialtyById = async (id: string) => {
  try {
    {
      /*Si no encuentra el id devuelve un error*/
    }
    if (!id) {
      return {
        message: "ID de la especialidad requerido.",
        success: false,
        error: {},
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
    const apiUrl = `${baseUrl}/getSpecialtyById?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    {
      /*Si la respuesta no es positiva devuelve un error*/
    }
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateSpecialty = async (data: UpdateSpecialtyData) => {
  try {
    const { id, name_specialtie, description, office_number } = data;

    if (!id) {
      return {
        messaje: "ID de la especialidad requerido.",
        success: false,
        error: {},
      };
    }
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
    const apiUrl = `${baseUrl}/updateSpecialty`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name_specialtie,
        description,
        office_number,
      }),
    });

    if (!response.ok) {
      return {
        message: "Error al actualizar especialidad.",
        success: false,
        error: {},
      };
    }

    const responseData = await response.json();

    return {
      message: "Actualizacion del usuario exitosa.",
      success: true,
      error: {},
    };
  } catch (error: any) {
    return {
      message: `Error al conectar con el servidor: ${error.message}`,
      success: false,
      error: {},
    };
  }
};

{
  /*Funcion asincrona que recibe el id de la especialidad*/
}
export const deleteSpecialty = async (id: string) => {
  try {
    {
      /*Si no se encuentra el id de la especialidad muestra un error*/
    }
    if (!id) {
      return {
        message: "ID de la especialidad requerido",
        success: false,
        error: {},
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
    const apiUrl = `${baseUrl}/deleteSpecialty?id=${id}`;

    {
      /*Consulta asincrona a la api*/
    }
    const response = await fetch(apiUrl, {
      method: "DELETE",
      cache: "no-store",
    });

    {
      /*Lee la respuesta del servidor*/
    }
    const data = await response.json();

    {
      /*Si la respuesta del servidor no es ok mandamos un error al cliente*/
    }
    if (!response.ok) {
      return {
        message: "Error al eliminar el usuario.",
        success: false,
        error: {},
      };
    }

    return {
      message: "Usuario eliminado con exito.",
      success: true,
      error: {},
    };
  } catch (error: any) {
    return {
      message: `Error al conectar con el servidor: ${error.message}`,
      success: false,
      error: {},
    };
  }
};
