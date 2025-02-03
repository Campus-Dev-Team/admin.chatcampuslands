import axios from 'axios';
import { endpoints } from './apiConfig';

const getHeaders = () => {
  const token = localStorage.getItem("token"); // Cambiado de "authToken" a "token"
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzZXNzaW9uSWQiOiI2ODkzMTdhNS02ZGY2LTQyZWMtYjMzMS00N2IxMTYxZDg2MTIiLCJzdWIiOiJOaWNvbGFzIFBlZHJhemEiLCJpYXQiOjE3Mzg1OTUxNzIsImV4cCI6MTczODY4MTU3Mn0.rw1Hpwa-dK542Nkhvag2H6W1qCe_1D4WOzul7pBxG7U`
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

  const normalizeCity = (city) => {
    if (!city) return null;
    const cityStr = city.toString();
    const normalized = cityStr
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase());
    return normalized === 'Bogota' ? 'Bogota' : normalized;
  };

  const messagesByUserId = messagesData.reduce((acc, message) => {
    if (!acc[message.userId]) acc[message.userId] = [];
    acc[message.userId].push({
      Message: message.content,
      MessageId: message.messageId,
      Time: message.messageTime,
    });
    return acc;
  }, {});

  usersData.forEach(user => {
    const normalizedCity = normalizeCity(user.city);
    // Solo procesar usuarios con ciudad válida
    if (normalizedCity) {
      const userId = user.id;
      const phoneNumber = normalizePhoneNumber(user.telefono);
      const validMessages = (messagesByUserId[userId] || []).filter(
        message => message.MessageId !== phoneNumber && message.Message !== user.username
      );

      normalizedData[userId] = {
        UserId: userId,
        Username: user.username.trim(),
        PhoneNumber: phoneNumber,
        Age: user.age,
        Availability: user.availability,
        ContactWay: user.contact_way,
        Messages: validMessages,
        city: normalizedCity,
        messageCount: validMessages.length
      };
    }
  });

  return Object.values(normalizedData);
};

const tempDataUsersCampus = () => {
  const tempData = {
    usersBogota: [
      {
        "name": "Elizabeth Perez	",
        "phone": "3117652435",
        "email": "camiloandrespinzon0822@gmail.com",
        "createdAt": "2025-01-30T11:19:53",
        "state": "Registrado"
      },
      {
        "name": "Elizabeth	",
        "phone": "3117652435",
        "email": "davidpatoo2003@gmail.com",
        "createdAt": "2025-01-30T00:25:09",
        "state": "Registrado"
      }
    ],
    usersBucaramanga: [
      {
        "name": "Daniel Plazas",
        "phone": "3208380860",
        "email": "santi.mchacon14@gmail.com",
        "createdAt": "2025-01-30T15:58:24",
        "state": "Registrado"
      },
      {
        "name": "Jefersson Alberto Garcés Blanco ",
        "phone": "3123457215",
        "email": "jgarcesblanco@gmail.com",
        "createdAt": "2025-01-30T12:47:01",
        "state": "Borrador"
      },

    ]
  }
  return tempData
}