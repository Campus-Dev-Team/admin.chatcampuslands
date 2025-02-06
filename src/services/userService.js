import axios from "axios";
import { endpoints } from "./apiConfig";

export const getUsersByStateBucaramanga = async (data) => {
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

    const response = await axios.post(
      endpoints.usersBucaramangaByState,
      data,
      config
    );

    return response;
  } catch (error) {
    console.error("Error saving a message", error);
    throw error;
  }
};

export const getUsersByStateBogota = async (data) => {
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

    const response = await axios.post(
      endpoints.usersBogotaByState,
      data,
      config
    );

    return response;
  } catch (error) {
    console.error("Error saving a message", error);
    throw error;
  }
};

export const getAllusers = async () => {
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

    const response = await axios.get(endpoints.allUsers, config);

    return response;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};
