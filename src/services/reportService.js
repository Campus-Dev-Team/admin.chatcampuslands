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
    const params = { start: startDate, end: endDate };
    const headers = getHeaders();
 
    const [userCampusBogota, userCampusBucaramanga] = await Promise.all([
      axios.get(endpoints.usersCampusBogota, { params, headers }),
      axios.get(endpoints.usersCampusBucaramanga, { params, headers })
    ]);
    
    const storedData = JSON.parse(localStorage.getItem("mergedUsers") || "{}");
    
    return {
      usersBogota: userCampusBogota.data?.length ? userCampusBogota.data : storedData.usersBogota || [],
      usersBucaramanga: userCampusBucaramanga.data?.length ? userCampusBucaramanga.data : storedData.usersBucaramanga || []
    };
  } catch (error) {
    const storedData = JSON.parse(localStorage.getItem("mergedUsers") || "{}");
    return storedData;
  }
 };

const normalizeDataIza = (usersData, messagesData) => {
  const normalizedData = {};

  // Función para normalizar el número de teléfono
  const normalizePhoneNumber = (phone) => {
    if (!phone) return phone;
    const phoneStr = phone.toString();
    return phoneStr.startsWith('57') ? parseInt(phoneStr.slice(2)) : parseInt(phoneStr);
  };

  // Función para normalizar el nombre de la ciudad
  const normalizeCity = (city) => {
    if (!city) return city;

    // Convertir a string, por si acaso viene otro tipo de dato
    const cityStr = city.toString();

    // Convertir a minúsculas y luego capitalizar la primera letra
    const normalized = cityStr
      // Eliminar acentos y caracteres especiales
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Convertir a minúsculas
      .toLowerCase()
      // Capitalizar primera letra
      .replace(/^\w/, c => c.toUpperCase());

    return normalized;
  };

  // Crear un mapa de mensajes agrupados por userId
  const messagesByUserId = messagesData.reduce((acc, message) => {
    if (!acc[message.userId]) {
      acc[message.userId] = [];
    }
    acc[message.userId].push({
      Message: message.content,
      MessageId: message.messageId,
      Time: message.messageTime,
    });
    return acc;
  }, {});

  // Procesar los usuarios y asociarles los mensajes correspondientes
  usersData.forEach(user => {
    const userId = user.id;
    const phoneNumber = normalizePhoneNumber(user.telefono);

    // Filtrar mensajes válidos
    const validMessages = (messagesByUserId[userId] || []).filter(
      message => message.MessageId !== phoneNumber && message.Message !== user.username
    );

    // Agregar usuario al resultado normalizado
    normalizedData[userId] = {
      UserId: userId,
      Username: user.username.trim(),
      PhoneNumber: phoneNumber,
      Age: user.age,
      Availability: user.availability,
      ContactWay: user.contact_way,
      Messages: validMessages,
      city: normalizeCity(user.city) // Aplicamos la normalización de la ciudad
    };

    // Agregar conteo de mensajes
    normalizedData[userId].messageCount = validMessages.length;
  });

  return Object.values(normalizedData);
};