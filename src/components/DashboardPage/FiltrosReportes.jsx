import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsonData from './usuarios_mensajes.json';
import * as XLSX from 'xlsx'; // Importamos la librería XLSX

export const FiltrosReportes = ({ onDataFetched }) => {
    // Controla si el contenido está "cargado" para la animación (opacity)
    const [isLoaded, setIsLoaded] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Valor por defecto como la fecha de hoy
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Valor por defecto como la fecha de hoy
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]); // Para almacenar los datos filtrados


    useEffect(() => {
        // Simulamos un retraso de 500ms para la animación de opacidad
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Ejecutar fetchData al montar el componente
    useEffect(() => {
        if (startDate && endDate) {
            fetchData();  // Ejecuta la función fetchData cuando las fechas ya están configuradas
        }
    }, [startDate, endDate]);

    const myHeaders = () => {
        const token = localStorage.getItem("authToken");
        return new Headers({
            "content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        });
    };

    const fetchData = async () => {
        if (!startDate || !endDate) {
            console.error("Las fechas de inicio y fin son necesarias");
            return;
        }

        try {
            setIsLoading(true);

            const startDateFormatted = new Date(startDate).toISOString().split('T')[0];
            const endDateFormatted = new Date(endDate).toISOString().split('T')[0];

            const responseUsers = await axios.get(`${import.meta.env.VITE_API_BASE_URL}admin/users/today`, {
                params: {
                    start: startDateFormatted,
                    end: endDateFormatted,
                    city: 'Bucaramanga'
                },
                headers: myHeaders(),
            });

            if (!responseUsers.data || responseUsers.data.length === 0) {
                throw new Error(responseUsers?.status)
            } else {
                const responseMessages = await axios.get(`${import.meta.env.VITE_API_BASE_URL}admin/messages/today`, {
                    params: {
                        start: startDateFormatted,
                        end: endDateFormatted,
                        city: 'Bucaramanga'
                    },
                    headers: myHeaders(),
                });
                if (!responseMessages.data || responseMessages.data.length === 0) {
                    throw new Error(responseUsers?.status)
                } else {
                    const normalizedData = (normalizeData(responseUsers.data, responseMessages.data));
                    onDataFetched(normalizedData); // Llamamos a la función del padre con los datos filtrados
                    setFilteredData(normalizedData);
                    console.log(filteredData);
                }

            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error al obtener los datos desde el backend:", error);
            fetchDataFromJson(startDate, endDate);
            setIsLoading(false);
        }
    };

    const normalizeData = (usersData, messagesData) => {
        const normalizedData = {};

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
            const phoneNumber = user.telefono;

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
                city: user.city
            };

            // Agregar conteo de mensajes
            normalizedData[userId].messageCount = validMessages.length;
        });

        return Object.values(normalizedData);
    };


    const handleDownload = () => {
        const usersData = filteredData
        
        // Convertir la información de los usuarios en formato adecuado para la hoja de usuarios
        const usersSheetData = usersData.map(user => ({
            UserId: user.UserId,
            Username: user.Username,
            PhoneNumber: user.PhoneNumber,
            Age: user.Age,
            Availability: user.Availability,
            ContactWay: user.ContactWay,
            City: user.city,
            MessageCount: user.messageCount
        }));

        // Convertir la información de los mensajes en formato adecuado para la hoja de mensajes
        const messagesSheetData = usersData.flatMap(user =>
            user.Messages.map(message => ({
                UserId: user.UserId,
                Username: user.Username,
                Message: message.Message,
                MessageId: message.MessageId,
                Time: message.Time
            }))
        );

        // Crear las hojas del libro de trabajo
        const wsUsers = XLSX.utils.json_to_sheet(usersSheetData);
        const wsMessages = XLSX.utils.json_to_sheet(messagesSheetData);

        // Crear un libro nuevo
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsUsers, 'Usuarios');
        XLSX.utils.book_append_sheet(wb, wsMessages, 'Mensajes');

        // Escribir el archivo Excel
        XLSX.writeFile(wb, 'reporte.xlsx');
    };

    return (
        <div className="bg-transparent p-4 text-white rounded-md w-full">
            <div
                className={`flex flex-wrap md:flex-nowrap justify-center items-end gap-4 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-fit justify-center ">
                    <div className="flex flex-col">
                        <label className="text-white/70 text-sm mb-1">Fecha Inicio</label>
                        <input
                            type="date"
                            className="px-3 py-2 bg-[#2A303C] text-white rounded-lg border border-[#00D8D6]
                                focus:ring-2 focus:ring-[#00D8D6] focus:outline-none transition-all duration-300"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-white/70 text-sm mb-1">Fecha Fin</label>
                        <input
                            type="date"
                            className="px-3 py-2 bg-[#2A303C] text-white rounded-lg border border-[#00D8D6]
                                focus:ring-2 focus:ring-[#00D8D6] focus:outline-none transition-all duration-300"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="px-4 py-1 sm:px-6 sm:py-2 lg:px-8 lg:py-3 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover
                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base lg:text-lg"
                    onClick={fetchData}
                    disabled={isLoading}
                >
                    {isLoading ? 'Cargando...' : 'Aplicar Filtro'}
                </button>

                {/* Botón para descargar el reporte */}
                <button
                    className="px-4 py-1 sm:px-6 sm:py-2 lg:px-8 lg:py-3 bg-[#2A303C] text-white rounded-lg font-semibold
                        hover:bg-[#1B2430]/90 border-b border-cyan-400 hover:bg-cyan-500/10
                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base lg:text-lg"
                    onClick={handleDownload} // Llamamos a la función de descarga
                >
                    Descargar Reporte
                </button>
            </div>
        </div>
    );
};
