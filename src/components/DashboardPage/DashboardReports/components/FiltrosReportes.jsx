import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Check } from "lucide-react";
import { fetchReportDataIza } from '../../../../services/reportService';

/**
 * Componente FiltrosReportes
 * Maneja la selección de fechas y la obtención de datos para los reportes
 * 
 * @param {Function} onDataFetched - Callback que se ejecuta cuando se obtienen nuevos datos
 */
export const FiltrosReportes = ({ onDataFetched }) => {
    // Estados para manejar la UI y los datos
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Estado inicial de las fechas (día actual)
    const [dates, setDates] = useState(() => {
        const today = new Date();
        return {
            start: today.toISOString().split('T')[0],
            end: today.toISOString().split('T')[0]
        };
    });

    // Referencia para evitar peticiones duplicadas
    const previousDates = useRef(dates);

    /**
     * Función para obtener los datos del reporte
     * Memoizada para evitar recreaciones innecesarias
     */
    const fetchData = useCallback(async () => {
        if (!dates.start || !dates.end) return;
        
        try {
            setIsLoading(true);
            const dataIza = await fetchReportDataIza(dates.start, dates.end);
            
            if (dataIza) {
                onDataFetched(dataIza, dates);
                // Actualizar las fechas previas solo si la petición fue exitosa
                previousDates.current = dates;
            }
        } catch (error) {
            // Ignorar errores de red para evitar spam en la consola
            if (error.code !== 'ERR_NETWORK') {
                console.error("Error fetching report data:", error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [dates, onDataFetched]);

    /**
     * Efecto para la animación inicial de carga
     * Se ejecuta una sola vez al montar el componente
     */
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 500);
        return () => clearTimeout(timer);
    }, []);

    /**
     * Efecto para manejar la obtención de datos
     * Se ejecuta en el montaje inicial y cuando cambian las fechas
     */
    useEffect(() => {
        // Solo realizar la petición si las fechas realmente cambiaron
        const datesChanged = 
            previousDates.current.start !== dates.start || 
            previousDates.current.end !== dates.end;

        if (datesChanged) {
            fetchData();
        }
    }, [fetchData, dates]);

    /**
     * Manejador para cambios en las fechas
     * Incluye validación para mantener la coherencia entre fecha inicio y fin
     */
    const handleDateChange = useCallback((field, value) => {
        setDates(prev => {
            const newDates = { ...prev, [field]: value };
            
            // Asegurar que la fecha fin no sea menor que la fecha inicio
            if (field === 'end' && value < prev.start) {
                newDates.end = prev.start;
            }
            // Asegurar que la fecha inicio no sea mayor que la fecha fin
            if (field === 'start' && value > prev.end) {
                newDates.start = prev.end;
            }
            
            return newDates;
        });
    }, []);

    return (
        <div className="bg-transparent m-2 p-4 md:p-0 text-white rounded-md">
            {/* Contenedor con animación de fade-in */}
            <div className={`flex flex-wrap md:flex-nowrap justify-center items-center gap-5 transition-opacity duration-700 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
            }`}>
                <div className="flex flex-col justify-center items-end shadow-md rounded-lg px-1 pt-4">
                    {/* Contenedor de inputs de fecha */}
                    <div className='flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-fit justify-center'>
                        {/* Input fecha inicio */}
                        <div className="flex flex-col">
                            <label className="text-white/70 text-sm mb-1">Fecha Inicio</label>
                            <input
                                type="date"
                                className="px-3 py-1 bg-[#2A303C] text-[0.9em] text-white rounded-lg border border-[#00D8D6]
                                focus:ring-2 focus:ring-[#00D8D6] focus:outline-none transition-all duration-300"
                                value={dates.start}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        {/* Input fecha fin */}
                        <div className="flex flex-col">
                            <label className="text-white/70 text-sm mb-1">Fecha Fin</label>
                            <input
                                type="date"
                                className="px-3 py-1 bg-[#2A303C] text-[0.9em] text-white rounded-lg border border-[#00D8D6]
                                focus:ring-2 focus:ring-[#00D8D6] focus:outline-none transition-all duration-300"
                                value={dates.end}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Indicador de estado */}
                    <div className="py-2 px-1 text-white rounded-lg text-[0.875rem] flex items-center justify-center gap-1">
                        {isLoading ? (
                            'Cargando...'
                        ) : (
                            <>
                                <span>Filtro Aplicado</span>
                                <Check size={15} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};