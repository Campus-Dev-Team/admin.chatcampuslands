import axios from 'axios';
import { endpoints } from './apiConfig';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const chatService = {
    // Obtener lista de chats
    getChats: async () => {
        try {
            const response = await axios.get(endpoints.chatList, getAuthHeader());
            return response.data;
        } catch (error) {
            console.error('Error fetching chats', error);
            throw error;
        }
    },

    getChatMessages: async (chatId) => {
        try {
          const response = await axios.get(endpoints.getMessages(chatId), getAuthHeader());
          return response.data;
        } catch (error) {
          console.error('Error fetching messages', error);
          throw error;
        }
      }

};