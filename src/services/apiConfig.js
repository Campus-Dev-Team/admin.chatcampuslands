const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://chatcampuslands.com:8443/chatbot/";

// console.log("Variables de entorno: ",import.meta.env.VITE_API_BASE_URL, " y ",import.meta.env.VITE_API_WEBSOCKET_URL);

export const endpoints = {
  login: `${API_BASE_URL}auth/login`,
  register: `${API_BASE_URL}auth/register`,
  messages: `${API_BASE_URL}messages/add`,
  age: `${API_BASE_URL}user/age`,
  availability: `${API_BASE_URL}user/availability`,
};

