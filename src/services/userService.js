import axios from "axios";
import { endpoints } from "./apiConfig";

export const addAge = async (data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(endpoints.age, data, config);

    return response;
  } catch (error) {
    console.error("Error saving a message", error);
    throw error;
  }
};

export const addAvailability = async (data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(endpoints.availability, data, config);

    return response;
  } catch (error) {
    console.error("Error saving a message", error);
    throw error;
  }
};
