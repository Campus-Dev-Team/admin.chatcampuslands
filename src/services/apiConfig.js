const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://chatcampuslands.com:8443/iza--test/";
const API_WEBSOCKET_URL =
  import.meta.env.VITE_API_WEBSOCKET_URL ||
  "wss://chatcampuslands.com:8443/chatbot/chat";

// console.log("Variables de entorno: ",import.meta.env.VITE_API_BASE_URL, " y ",import.meta.env.VITE_API_WEBSOCKET_URL);

export const endpoints = {
  login: `${API_BASE_URL}auth/login`,
  register: `${API_BASE_URL}auth/register`,
  messages: `${API_BASE_URL}messages/add`,
  age: `${API_BASE_URL}user/age`,
  availability: `${API_BASE_URL}user/availability`,
  chats: `${API_BASE_URL}api/chat/list`,
  chatMode: `${API_BASE_URL}api/chat/chatMode`,
  getMessages: `${API_BASE_URL}messages/chat`,
};

export default API_WEBSOCKET_URL;
