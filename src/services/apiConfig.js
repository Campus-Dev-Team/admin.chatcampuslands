const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_WEBSOCKET_URL = import.meta.env.VITE_API_WEBSOCKET_URL;

// console.log("Variables de entorno: ",import.meta.env.VITE_API_BASE_URL, " y ",import.meta.env.VITE_API_WEBSOCKET_URL);

export const endpoints = {
  login: `${API_BASE_URL}auth/login`,
  register: `${API_BASE_URL}auth/register`,
  messages: `${API_BASE_URL}messages/add`,
  age: `${API_BASE_URL}user/age`,
  availability: `${API_BASE_URL}user/availability`,

  //enpoints para consultar el historial de usuarios registrados y mensajes enviados (NO INCLUYE WHATSAPP)
  usersToday: `${API_BASE_URL}admin/users/today`,
  messagesToday: `${API_BASE_URL}admin/messages/today`,

  // enpoints para consultar el historial de usuarios registrados en CAMPUS
  usersCampusBogota: `${API_BASE_URL}api/bogota/users-register`,
  usersCampusBucaramanga: `${API_BASE_URL}api/campuslands/users-register`,
  usersCampusCajasan: `${API_BASE_URL}api/cajasan/users-register`,
  usersCampusTibu: `${API_BASE_URL}api/tibu/users-register`,

  chats: `${API_BASE_URL}api/chat/list`,
  chatMode: `${API_BASE_URL}api/chat/chatMode`,
  getMessages: `${API_BASE_URL}messages/chat`,

  getTemplates: `${API_BASE_URL}templates/getAll`,
  sendTemplates: `${API_BASE_URL}whatsapp/handleAdminMessages`,

  usersBogotaByState: `${API_BASE_URL}api/bogota/users-status`,
  usersBucaramangaByState: `${API_BASE_URL}api/campuslands/users-status`,
  usersCajasanByState: `${API_BASE_URL}api/cajasan/users-status`,
  usersTibuByState: `${API_BASE_URL}api/tibu/users-status`,
  allUsers: `${API_BASE_URL}user/getAll`,
};

export default API_WEBSOCKET_URL;
