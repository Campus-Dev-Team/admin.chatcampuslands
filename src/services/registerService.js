import axios from 'axios';
import { endpoints } from './apiConfig';

export const register = async (data) => {
    try {
      const response = await axios.post(endpoints.register, data);
      const token = response.data.token;
  
      localStorage.setItem('token', token);
  
      return token; 
    } catch (error) {
      console.error('Error logging in', error);
      throw error;
    }
  };