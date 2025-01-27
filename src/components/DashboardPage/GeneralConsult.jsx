import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "react-datepicker/dist/react-datepicker.css";
import { FiltrosReportes } from './FiltrosReportes';


// Datos de ejemplo para los gráficos
const exampleData = [
  { name: "Lunes", Mensajes: 400, Usuarios: 240, UsuariosRegistrados: 120, TasaConversion: 50, UsuariosPorDia: 240 },
  { name: "Martes", Mensajes: 300, Usuarios: 139, UsuariosRegistrados: 70, TasaConversion: 50, UsuariosPorDia: 139 },
  { name: "Miércoles", Mensajes: 200, Usuarios: 980, UsuariosRegistrados: 490, TasaConversion: 50, UsuariosPorDia: 980 },
  { name: "Jueves", Mensajes: 278, Usuarios: 390, UsuariosRegistrados: 195, TasaConversion: 50, UsuariosPorDia: 390 },
  { name: "Viernes", Mensajes: 189, Usuarios: 480, UsuariosRegistrados: 240, TasaConversion: 50, UsuariosPorDia: 480 },
  { name: "Sábado", Mensajes: 239, Usuarios: 380, UsuariosRegistrados: 190, TasaConversion: 50, UsuariosPorDia: 380 },
  { name: "Domingo", Mensajes: 349, Usuarios: 430, UsuariosRegistrados: 215, TasaConversion: 50, UsuariosPorDia: 430 },
];

export const GeneralConsult = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [ciudad, setCiudad] = useState("Bogotá"); // Estado para la ciudad seleccionada
  const [filteredData, setFilteredData] = useState([]); // Usar los datos filtrados o el JSON simulado

  // Función que maneja los datos obtenidos después de aplicar los filtros
  const handleDataFetched = (fetchedData) => {
    setFilteredData(fetchedData);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // Datos de ejemplo para las métricas
  const metricsData = {
    costoGlobalPorUsuario: 50, // Costo global por usuario registrado
    usuariosTotales: 1000, // Usuarios totales
    usuariosRegistrados: 500, // Usuarios registrados
    tasaConversion: 50, // Tasa de conversión
    tasaConversionDiaria: 5, // Tasa de conversión diaria
  };

  return (
    <div className="p-4 md:p-6 bg-slate-900 rounded-lg shadow-lg overflow-y-scroll scrollbar-custom">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Informe de Conversión Iza ChatBot </h2>

      {/* Filtros: Ciudad y Fecha */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        {/* Filtro de Ciudad */}
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-indigo-400 mb-2">
            Selecciona una ciudad:
          </label>
          <select
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded-lg"
          >
            <option value="Bogotá">Bogotá</option>
            <option value="Bucaramanga">Bucaramanga</option>
          </select>
        </div>

        {/* Filtro de Fechas */}
        <div>
          <FiltrosReportes onDataFetched={handleDataFetched} />
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-400">Costo Global por Usuario Registrado</h3>
          <p className="text-white">${metricsData.costoGlobalPorUsuario}</p>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-400">Ciudad Seleccionada</h3>
          <p className="text-white">{ciudad}</p>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-400">Usuarios Totales</h3>
          <p className="text-white">{metricsData.usuariosTotales}</p>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-400">Usuarios Registrados</h3>
          <p className="text-white">{metricsData.usuariosRegistrados}</p>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-400">Tasa de Conversión</h3>
          <p className="text-white">{metricsData.tasaConversion}%</p>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-400">Tasa de Conversión Diaria</h3>
          <p className="text-white">{metricsData.tasaConversionDiaria}%</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="space-y-8">
        {/* Gráfico de Mensajes */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Mensajes Enviados</h3>
          <ResponsiveContainer width="100%" height={300} className="lg:h-64">
            <BarChart data={exampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Mensajes" fill="#00C9A7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Usuarios */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Usuarios Activos</h3>
          <ResponsiveContainer width="100%" height={300} className="lg:h-64">
            <BarChart data={exampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Usuarios" fill="#845EC2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Usuarios Registrados */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Usuarios Registrados</h3>
          <ResponsiveContainer width="100%" height={300} className="lg:h-64">
            <BarChart data={exampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="UsuariosRegistrados" fill="#FF6F91" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Tasa de Conversión */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Tasa de Conversión</h3>
          <ResponsiveContainer width="100%" height={300} className="lg:h-64">
            <BarChart data={exampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="TasaConversion" fill="#FF9671" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Usuarios por Día */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Usuarios por Día</h3>
          <ResponsiveContainer width="100%" height={300} className="lg:h-64">
            <BarChart data={exampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="UsuariosPorDia" fill="#FFC75F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};