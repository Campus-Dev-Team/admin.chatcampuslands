import axios from 'axios';
import { endpoints } from './apiConfig';
import { isTokenExpired } from '../lib/tokenUtils';

export const login = async (data) => {
  try {
    const response = await axios.post(endpoints.login, data);
    const token = response.data.token;
    
    if (!token || isTokenExpired(token)) {
      throw new Error('Token inválido o expirado');
    }
    
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};