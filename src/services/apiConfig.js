const API_BASE_URL = "https://chatcampuslands.com:8443/chatbot--TEST/";
const API_WEBSOCKET_URL = "wss://chatcampuslands.com:8443/chatbot--TEST/chat";

export const endpoints = {
  login: `${API_BASE_URL}auth/login`,
  register: `${API_BASE_URL}auth/register`,
  messages: `${API_BASE_URL}messages/add`,
  age: `${API_BASE_URL}user/age`,
  availability: `${API_BASE_URL}user/availability`,
};

export default API_WEBSOCKET_URL;
