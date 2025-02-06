
import axios from "axios";
import { endpoints } from "./apiConfig";

export const getAllTemplates = async () => {
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

    const response = await axios.get(endpoints.getTemplates, config);

    return response;
  } catch (error) {
    console.error("Error saving a message", error);
    throw error;
  }
};

export const sendTemplates = async (data) => {
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
  
      const response = await axios.post(endpoints.sendTemplates, data, config);
  
      return response;
    } catch (error) {
      console.error("Error saving a message", error);
      throw error;
    }
  };
