import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsonData from './usuarios_mensajes.json'

export const FiltrosReportes = ({ onDataFetched }) => {
    // Controla si el contenido está "cargado" para la animación (opacity)
    const [isLoaded, setIsLoaded] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); // Valor por defecto como la fecha de hoy
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Valor por defecto como la fecha de hoy
    const [isLoading, setIsLoading] = useState(false);

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
}, [startDate, endDate]);  // Este useEffect depende de las fechas, se ejecutará cuando cambien


    const myHeaders = () => {
        const token = localStorage.getItem("authToken");
        return new Headers({
            "content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        });
    };

    const fetchDataFromJson = (startDate, endDate) => {
        try {
            setIsLoading(true);

            const startDateFormatted = new Date(startDate).toISOString().split('T')[0];
            const endDateFormatted = new Date(endDate).toISOString().split('T')[0];

            // Filtrar los datos del JSON según las fechas seleccionadas
            const filteredData = jsonData.filter(item => {
                // Obtener la fecha del mensaje
                let messageTime = item.Messages.map(message => {
                    // Convertir la fecha del mensaje a un objeto Date
                    const date = new Date(message.Time);

                    // Si la fecha no es válida, reemplazarla con una fecha por defecto (por ejemplo, 1970-01-01)
                    return isNaN(date) ? new Date('1970-01-01T00:00:00Z') : date;
                });

                // Filtrar solo aquellos mensajes que estén dentro del rango de fechas
                return messageTime.some(date => {
                    const itemDate = date.toISOString().split('T')[0];
                    return itemDate >= startDateFormatted && itemDate <= endDateFormatted;
                });
            });

            console.log(filteredData);

            onDataFetched(normalizeData(filteredData)); // Llamamos a la función del padre con los datos filtrados
            setIsLoading(false);
        } catch (error) {
            console.log('Error al consultar el JSON:', error);
            setIsLoading(false);
        }
    };


    const fetchData = async () => {
        if (!startDate || !endDate) {
            console.error("Las fechas de inicio y fin son necesarias");
            return;
        }

        try {
            setIsLoading(true);

            // Solo enviamos la fecha
            const startDateFormatted = new Date(startDate).toISOString().split('T')[0]; // Solo tomamos la parte de la fecha (YYYY-MM-DD)
            const endDateFormatted = new Date(endDate).toISOString().split('T')[0]; // Solo tomamos la parte de la fecha (YYYY-MM-DD)

            // Realizamos la consulta al backend
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}admin/users/today`, {
                params: {
                    start: startDateFormatted,  // Enviar solo la fecha en formato YYYY-MM-DD
                    end: endDateFormatted,      // Enviar solo la fecha en formato YYYY-MM-DD
                    city: 'Bucaramanga'
                },
                headers: myHeaders(),
            });

            // Si no hay datos en la respuesta, usamos el archivo JSON
            if (!response.data || response.data.length === 0) {
                fetchDataFromJson(startDateFormatted, endDateFormatted);
            } else {
                console.log('Data encontrada desde el backend:', response.data);
                onDataFetched(normalizeData(response.data)); // Llamamos a la función del padre con los datos del backend
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error al obtener los datos desde el backend:", error);

            // Si hay un error, se usa el archivo JSON como fallback
            fetchDataFromJson(startDate, endDate);
            setIsLoading(false);
        }
    };

    const normalizeData = (data) => {
    const normalizedData = {};

    data.forEach(user => {
        const phone = user.PhoneNumber;

        // Filtrar los mensajes vacíos o de relleno (con contenido como el nombre del usuario o el PhoneNumber)
        const validMessages = user.Messages.filter(message => {
            return message.MessageId !== phone && message.Message !== user.Username;
        });

        // Si el número de teléfono ya existe en los datos normalizados
        if (normalizedData[phone]) {
            // Filtrar los mensajes existentes para evitar duplicados
            validMessages.forEach(message => {
                // Verificar si el mensaje ya existe en la lista, usando MessageId como identificador único
                if (!normalizedData[phone].Messages.some(existingMessage => existingMessage.MessageId === message.MessageId)) {
                    normalizedData[phone].Messages.push(message);
                }
            });
        } else {
            // Si no existe, lo añadimos como un nuevo usuario
            normalizedData[phone] = { ...user, Messages: validMessages };
        }
    });

    // Convertir el objeto de vuelta a un arreglo
    return Object.values(normalizedData);
};

    
    
    
    

    return (
        <div className="bg-transparent p-4 text-white rounded-md w-full">
            {/* Contenido de los filtros, estadísticas y reporte */}
            <div
                className={`flex flex-wrap md:flex-nowrap justify-center items-end gap-4 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {/* Agrupación de selectores de fecha en un contenedor flex */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-fit justify-center ">
                    {/* Selector de Fecha de Inicio */}
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

                    {/* Selector de Fecha de Fin */}
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

                {/* Botón Aplicar Filtro */}
                <button
                    className="px-4 py-1 sm:px-6 sm:py-2 lg:px-8 lg:py-3 bg-color-primary text-white rounded-lg font-semibold hover:bg-color-primary-hover
                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base lg:text-lg"
                    onClick={fetchData}
                    disabled={isLoading}
                >
                    {isLoading ? 'Cargando...' : 'Aplicar Filtro'}
                </button>

                {/* Botón Descargar Reporte */}
                <button
                    className="px-4 py-1 sm:px-6 sm:py-2 lg:px-8 lg:py-3 bg-[#2A303C] text-white rounded-lg font-semibold
                        hover:bg-[#1B2430]/90 border-b border-cyan-400 hover:bg-cyan-500/10
                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base lg:text-lg"
                    onClick={() => {
                        console.log('Descargando reporte...');
                        // Lógica para descargar el reporte
                    }}
                >
                    Descargar Reporte
                </button>
            </div>
        </div>
    );
};
