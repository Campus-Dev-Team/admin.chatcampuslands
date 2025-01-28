import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import EstudiantesBogota from "../json-exels/EstudiantesBogota.json";
import EstudiantesBucaramanga from "../json-exels/EstudiantesBucaramanga.json";
import { FiltrosReportes } from './FiltrosReportes';



export const GeneralConsult = () => {
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Usar los datos filtrados o el JSON simulado


  useEffect(() => {
    // Filtrar datos según la ciudad seleccionada
    const estudiantes = ciudad === "Bucaramanga" ? EstudiantesBogota.estudiantes : EstudiantesBucaramanga.estudiantes;

    // Procesar datos para gráficos
    const procesarDatos = () => {
      const registrosPorDia = {};
      estudiantes.forEach((estudiante) => {
        const fecha = new Date(estudiante["Fecha registro"]).toLocaleDateString();
        if (!registrosPorDia[fecha]) {
          registrosPorDia[fecha] = { fecha, Mensajes: 0, Usuarios: 0, UsuariosRegistrados: 0 };
        }
        registrosPorDia[fecha].Usuarios += 1;
        if (estudiante.Estado === "Registrado") {
          registrosPorDia[fecha].UsuariosRegistrados += 1;
        }
        registrosPorDia[fecha].Mensajes += 1;
      });

      // Calcular Tasa de Conversión
      const datosProcesados = Object.values(registrosPorDia).map((dia) => ({
        ...dia,
        TasaConversion: ((dia.UsuariosRegistrados / dia.Usuarios) * 100).toFixed(2),
      }));

      setData(datosProcesados);
    };

    procesarDatos();
  }, [ciudad]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl">
          <p className="text-cyan-400 font-medium">{`Fecha: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getTotalStats = () => {
    return {
      mensajes: data.reduce((sum, item) => sum + item.Mensajes, 0),
      usuarios: data.reduce((sum, item) => sum + item.Usuarios, 0),
      tasaPromedio: (data.reduce((sum, item) => sum + parseFloat(item.TasaConversion), 0) / (data.length || 1)).toFixed(1)
    };
  };

  // Función que maneja los datos obtenidos después de aplicar los filtros
  const handleDataFetched = (fetchedData) => {
    setFilteredData(fetchedData);
  };

  const stats = getTotalStats();

  return (
    <div className="flex-1 overflow-y-auto mt-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between  h-24">
          <h2 className="text-3xl font-bold text-cyan-400 w-full ">
            Informe de Conversión Iza ChatBot
          </h2>
          <div className="w-full flex flex-col md:flex-row justify-center items-center">
            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="mt-1  h-fit w-fit bg-slate-800 text-white text-[0.9rem] border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            >
              <option value="Bogotá">Bogotá</option>
              <option value="Bucaramanga">Bucaramanga</option>
            </select>

            <FiltrosReportes onDataFetched={handleDataFetched} />

          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg">
          {[
            { title: "Total Mensajes", icon: MessageSquare, value: stats.mensajes.toLocaleString(), color: "cyan" },
            { title: "Usuarios Totales", icon: Users, value: stats.usuarios.toLocaleString(), color: "cyan" },
            { title: "Tasa Promedio", icon: TrendingUp, value: `${stats.tasaPromedio}%`, color: "cyan" },

          ].map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-400 mt-2`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400 opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </div>
  );
};

export default GeneralConsult;