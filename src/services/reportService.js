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

export const fetchReportDataIza = async (startDate, endDate) => {
  try {
    const params = { start: startDate, end: endDate };
    const headers = getHeaders();


    const [usersResponse, messagesResponse] = await Promise.all([
      axios.get(endpoints.usersToday, { params, headers }),
      axios.get(endpoints.messagesToday, { params, headers })
    ]);

    

    const dataNormalized = normalizeDataIza(usersResponse.data, messagesResponse.data)

    return dataNormalized

  } catch (error) {
    throw error;
  }
};

export const fetchReportDataCampus = async (startDate, endDate) => {
  try {
    if (!startDate) startDate = new Date().toISOString().split('T')[0]
    if (!endDate) endDate = new Date().toISOString().split('T')[0]

    const params = { startDate: startDate, endDate: endDate };
    const headers = getHeaders();



    const [userCampusBogota, userCampusBucaramanga] = await Promise.all([
      axios.get(endpoints.usersCampusBogota, { params, headers }),
      axios.get(endpoints.usersCampusBucaramanga, { params, headers })
    ]);

    return {
      usersBogota: userCampusBogota.data,
      usersBucaramanga: userCampusBucaramanga.data
    };

  } catch (error) {

    return "hubo un error conteniendo la data de campus ", error;
  }
};

const normalizeDataIza = (usersData, messagesData) => {
  const normalizedData = {};
  
  const normalizePhoneNumber = (phone) => {
    if (!phone) return phone;
    const phoneStr = phone.toString();
    return phoneStr.startsWith('57') ? parseInt(phoneStr.slice(2)) : parseInt(phoneStr);
  };
  
  const normalizeCity = (cityId) => {
    if (!cityId) return null;
    const cityMap = {
      1: 'Bucaramanga',
      2: 'Bogota'
    };
    return cityMap[cityId] || null;
  };

  // Primero vamos a verificar los datos
  console.log('Total usuarios:', usersData.length);
  console.log('Total mensajes:', messagesData.length);

  // Agrupar mensajes por userId
  const messagesByUserId = messagesData.reduce((acc, message) => {
    // Asegurarse de que el userId coincida exactamente
    const userId = message.userId;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push({
      Message: message.content,
      MessageId: message.messageId,
      Time: message.messageTime,
    });
    return acc;
  }, {});

  // Procesar usuarios
  usersData.forEach(user => {
    const normalizedCity = normalizeCity(user.city);
    if (normalizedCity) {
      const userId = user.id;
      const phoneNumber = normalizePhoneNumber(user.phone);
      
      // Obtener solo los mensajes que corresponden a este usuario específico
      const userMessages = messagesByUserId[userId] || [];
      
      // Filtrar mensajes de error
      const validMessages = userMessages.filter(
        message => message.Message !== 'Ocurrió un error al generar la respuesta.'
      );

      // Solo crear entrada si el usuario tiene mensajes válidos
      if (validMessages.length > 0) {
        normalizedData[userId] = {
          UserId: userId,
          Username: user.username.trim(),
          PhoneNumber: phoneNumber,
          Age: user.age,
          Availability: user?.availability || "No",
          ContactWay: user.contact_way,
          Messages: validMessages,
          city: normalizedCity,
          messageCount: validMessages.length
        };
      }
    }
  });

  // Verificar la normalización
  console.log('Usuarios normalizados:', Object.keys(normalizedData).length);

  return Object.values(normalizedData);
};