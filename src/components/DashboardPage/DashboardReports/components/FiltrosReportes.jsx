import React, { useState, useEffect } from 'react';
import { Check } from "lucide-react";
import { fetchReportData } from '../../../../services/reportService';

export const FiltrosReportes = ({ onDataFetched }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [dates, setDates] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (dates.start && dates.end) fetchData();
    }, [dates]);


    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchReportData(
                dates.start,
                dates.end
            );
            const normalizedData = normalizeData(data.users, data.messages);
            console.log(normalizedData);
            
            onDataFetched(normalizedData);
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setIsLoading(false);
        }
    };


    const normalizeData = (usersData, messagesData) => {
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

    return (
        <div className="bg-transparent m-2 p-4 md:p-0 text-white rounded-md ">
            <div
                className={`flex flex-wrap md:flex-nowrap justify-center items-center gap-5 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="flex flex-col justify-center items-end shadow-md rounded-lg px-1 pt-4">
                    <div className='flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-fit justify-center'>
                        <div className="flex flex-col">
                            <label className="text-white/70 text-sm mb-1">Fecha Inicio</label>
                            <input
                                type="date"
                                className="px-3 py-1 bg-[#2A303C] text-[0.9em] text-white rounded-lg border border-[#00D8D6]
                                focus:ring-2 focus:ring-[#00D8D6] focus:outline-none transition-all duration-300"
                                value={dates.start}
                                onChange={(e) => setDates(prev => ({ ...prev, start: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-white/70 text-sm mb-1">Fecha Fin</label>
                            <input
                                type="date"
                                className="px-3 py-1 bg-[#2A303C] text-[0.9em] text-white rounded-lg border border-[#00D8D6]
                                focus:ring-2 focus:ring-[#00D8D6] focus:outline-none transition-all duration-300"
                                value={dates.end}
                                onChange={(e) => setDates(prev => ({ ...prev, end: e.target.value }))}
                            />
                        </div>

                    </div>



                    <span
                        className="py-2 px-1 text-white rounded-lg text-[0.875rem] flex flex-row justify-center items-center gap-1"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cargando...' : <>Filtro Aplicado <Check size={15} /></>}

                    </span>
                </div>

            </div>
        </div>
    );
};
