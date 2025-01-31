import axios from 'axios';
import { endpoints } from './apiConfig';

const getHeaders = () => {
    const token = localStorage.getItem("token"); // Cambiado de "authToken" a "token"
    return {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

export const fetchReportData = async (startDate, endDate) => {
  try {
    const params = { start: startDate, end: endDate };
    const headers = getHeaders();

    
    const [usersResponse, messagesResponse] = await Promise.all([
      axios.get(endpoints.usersToday, { params, headers }),
      axios.get(endpoints.messagesToday, { params, headers })
    ]);
    
    
    return {
      users: usersResponse.data,
      messages: messagesResponse.data
    };
  } catch (error) {
    throw error;
  }
};