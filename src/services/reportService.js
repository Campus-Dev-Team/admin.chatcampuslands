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
    if (!startDate) startDate = new Date().toISOString().split('T')[0];
    if (!endDate) endDate = new Date().toISOString().split('T')[0];

    const params = { startDate: startDate, endDate: endDate };
    const headers = getHeaders();

    const [userCampusBogota, userCampusBucaramanga, userCampusCajasan, userCampusTibu] = await Promise.all([
      axios.get(endpoints.usersCampusBogota, { params, headers }),
      axios.get(endpoints.usersCampusBucaramanga, { params, headers }),
      axios.get(endpoints.usersCampusCajasan, { params, headers }),
      axios.get(endpoints.usersCampusTibu, { params, headers})
    ]);

    return {
      usersBogota: Array.isArray(userCampusBogota.data) ? userCampusBogota.data : [],
      usersBucaramanga: Array.isArray(userCampusBucaramanga.data) ? userCampusBucaramanga.data : [],
      usersCajasan: Array.isArray(userCampusCajasan.data) ? userCampusCajasan.data : [],
      usersTibu: Array.isArray(userCampusTibu.data) ? userCampusTibu.data : []
    };

  } catch (error) {
    console.error("Error fetching campus data:", error);
    return {
      usersBogota: [],
      usersBucaramanga: [],
      usersCajasan: [],
      usersTibu: []
    };
  }
};

const normalizeDataIza = (usersData, messagesData) => {
  const normalizedData = {};
  
  const normalizePhoneNumber = (phone) => {
    if (!phone) return '';
    const phoneStr = phone.toString();
    return phoneStr.startsWith('57') ? parseInt(phoneStr.slice(2)) : parseInt(phoneStr);
  };
  
  const normalizeCity = (cityId) => {
    if (!cityId) return null;
    const cityMap = {
      1: 'Bucaramanga',
      2: 'Bogota',
      3: 'Cajasan',
      4: 'Tibu'
    };
    return cityMap[cityId] || null;
  };

  // console.log('Total usuarios:', usersData.length);
  // console.log('Total mensajes:', messagesData.length);

  // Agrupar mensajes por userId
  const messagesByUserId = messagesData.reduce((acc, message) => {
    if (!message?.userId) return acc;
    const userId = message.userId;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push({
      Message: message.content || '',
      MessageId: message.messageId || '',
      Time: message.messageTime || '',
    });
    return acc;
  }, {});

  // Procesar usuarios
  usersData.forEach(user => {
    try {
      if (!user || typeof user !== 'object') return;

      const normalizedCity = normalizeCity(user.city);
      if (normalizedCity) {
        const userId = user.id;
        const phoneNumber = normalizePhoneNumber(user.phone);
        
        // Obtener solo los mensajes que corresponden a este usuario específico
        const userMessages = messagesByUserId[userId] || [];
        
        // Filtrar mensajes de error y nulos
        const validMessages = userMessages.filter(
          message => message?.Message && 
                    message.Message !== 'Ocurrió un error al generar la respuesta.'
        );

        // Solo crear entrada si el usuario tiene mensajes válidos
        if (validMessages.length > 0) {
          normalizedData[userId] = {
            UserId: userId,
            Username: user.username ? user.username.trim() : '',
            PhoneNumber: phoneNumber,
            Age: user.age || null,
            Availability: user?.availability || "No",
            ContactWay: user.contact_way || '',
            Messages: validMessages,
            city: normalizedCity,
            messageCount: validMessages.length
          };
        }
      }
    } catch (error) {
      console.error('Error processing user:', user, error);
    }
  });

  // Verificar la normalización
  // console.log('Usuarios normalizados:', Object.keys(normalizedData).length);

  return Object.values(normalizedData);
};