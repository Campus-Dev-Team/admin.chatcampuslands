import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Datos de ejemplo para los gráficos (puedes reemplazarlos con datos reales)
const exampleData = [
  { name: "Lunes", Mensajes: 400, Usuarios: 240 },
  { name: "Martes", Mensajes: 300, Usuarios: 139 },
  { name: "Miércoles", Mensajes: 200, Usuarios: 980 },
  { name: "Jueves", Mensajes: 278, Usuarios: 390 },
  { name: "Viernes", Mensajes: 189, Usuarios: 480 },
  { name: "Sábado", Mensajes: 239, Usuarios: 380 },
  { name: "Domingo", Mensajes: 349, Usuarios: 430 },
];

export const GeneralConsult = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="p-6 bg-slate-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Consulta General</h2>

      {/* Filtro de Fechas */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-indigo-400 mb-2">
          Selecciona un rango de fechas:
        </label>
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          className="bg-slate-700 text-white p-2 rounded-lg"
          dateFormat="dd/MM/yyyy"
        />
      </div>

      {/* Gráficos */}
      <div className="space-y-8">
        {/* Gráfico de Mensajes */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Mensajes Enviados</h3>
          <BarChart width={600} height={300} data={exampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Mensajes" fill="#00C9A7" />
          </BarChart>
        </div>

        {/* Gráfico de Usuarios */}
        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Usuarios Activos</h3>
          <BarChart width={600} height={300} data={exampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Usuarios" fill="#845EC2" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};