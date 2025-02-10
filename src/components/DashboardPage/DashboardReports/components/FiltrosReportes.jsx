import React, { useState, useEffect } from 'react';
import { Check } from "lucide-react";
import { fetchReportDataIza } from '../../../../services/reportService';

export const FiltrosReportes = ({ onDataFetched }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [dates, setDates] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [isLoading, setIsLoading] = useState(false);

    // Efecto para el loading visual
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Efecto para la petición inicial
    useEffect(() => {
        fetchData();
    }, []); // Se ejecuta solo al montar el componente

    // Efecto para cambios en las fechas
    useEffect(() => {
        if (dates.start && dates.end) fetchData();
    }, [dates]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const dataIza = await fetchReportDataIza(dates.start, dates.end)
            onDataFetched(dataIza, dates);
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-transparent m-2 p-4 md:p-0 text-white rounded-md ">
            <div
                className={`flex flex-wrap md:flex-nowrap 
                sm:flex-nowrap justify-center items-center gap-5 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="flex flex-col justify-center items-end shadow-md rounded-lg px-1 pt-4">
                    <div className='flex flex-wrap md:flex-nowrap
                    sm:flex-nowrap items-center gap-4 w-full md:w-fit justify-center'>
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