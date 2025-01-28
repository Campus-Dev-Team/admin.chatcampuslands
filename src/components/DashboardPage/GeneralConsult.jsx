import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import EstudiantesBogota from "../json-exels/EstudiantesBogota.json";
import EstudiantesBucaramanga from "../json-exels/EstudiantesBucaramanga.json";

/**
 * Lógica del Componente GeneralConsult:
 * Este componente tiene como propósito mostrar un análisis de datos relacionado con estudiantes en dos ciudades: Bogotá y Bucaramanga.
 * La lógica principal se basa en la manipulación de los datos de estudiantes para extraer estadísticas clave como el total de mensajes, usuarios registrados y la tasa de conversión.
 *
 * 1. Selección de ciudad:
 *    - El componente permite al usuario seleccionar entre dos ciudades (Bogotá o Bucaramanga). Según la ciudad seleccionada, se cargan los datos correspondientes de estudiantes.
 * 
 * 2. Procesamiento de datos:
 *    - Una vez seleccionada la ciudad, los datos de los estudiantes son procesados para obtener métricas diarias.
 *    - El procesamiento incluye contar:
 *        - El número de mensajes enviados cada día.
 *        - El número de usuarios registrados cada día.
 *        - El total de usuarios por día.
 *    - A partir de esta información, se calcula la "Tasa de Conversión" diaria, que es el porcentaje de usuarios registrados respecto al total de usuarios por día.
 *    - Este procesamiento es realizado dentro de un `useEffect`, que se ejecuta cada vez que el valor de la ciudad cambia.
 *
 * 3. Estructura de los datos procesados:
 *    - Los datos procesados se organizan por fecha, de modo que cada entrada contiene:
 *        - La fecha de registro.
 *        - La cantidad de mensajes enviados, usuarios totales, usuarios registrados y la tasa de conversión para esa fecha.
 * 
 * 4. Cálculo de estadísticas generales:
 *    - Después de procesar los datos, se calculan estadísticas generales que suman o promedian la información:
 *        - Total de mensajes enviados.
 *        - Total de usuarios registrados.
 *        - Tasa de conversión promedio (promedio de las tasas de conversión de todos los días procesados).
 *
 * 5. Renderización:
 *    - Las estadísticas generales calculadas (mensajes totales, usuarios totales y tasa de conversión promedio) se muestran en tarjetas visuales.
 *    - Además, se muestran gráficos de barras que ilustran los datos diarios de los mensajes enviados, usuarios registrados, tasa de conversión y usuarios por día.
 *    - Los gráficos son dinámicos, mostrando información específica cuando el usuario pasa el ratón sobre las barras.
 * 
 * 6. Actualización dinámica:
 *    - Cuando el usuario selecciona una nueva ciudad, los datos se actualizan automáticamente para reflejar los registros de esa ciudad, y los gráficos y estadísticas se re-renderizan con los nuevos datos.
 */

export const GeneralConsult = () => {
  const [ciudad, setCiudad] = useState("Bogotá");
  const [data, setData] = useState([]);

  useEffect(() => {
    // Filtrar datos según la ciudad seleccionada
    const estudiantes = ciudad === "Bogotá" ? EstudiantesBogota.estudiantes : EstudiantesBucaramanga.estudiantes;

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

  const stats = getTotalStats();

  return (
    <div className="flex-1 overflow-y-auto mt-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-cyan-400">
            Dashboard de Análisis - {ciudad}
          </h2>
          <div className="w-64">
            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            >
              <option value="Bogotá">Bogotá</option>
              <option value="Bucaramanga">Bucaramanga</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title: "Mensajes Enviados", dataKey: "Mensajes", color: "#00C9A7" },
            { title: "Usuarios Registrados", dataKey: "UsuariosRegistrados", color: "#FF6F91" },
            { title: "Tasa de Conversión (%)", dataKey: "TasaConversion", color: "#FF9671" },
            { title: "Usuarios por Día", dataKey: "Usuarios", color: "#FFC75F" },
          ].map((chart, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-cyan-400">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chart.color} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={chart.color} stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                      <XAxis
                        dataKey="fecha"
                        stroke="#94A3B8"
                        tick={{ fill: '#94A3B8' }}
                        axisLine={{ stroke: '#475569' }}
                      />
                      <YAxis
                        stroke="#94A3B8"
                        tick={{ fill: '#94A3B8' }}
                        axisLine={{ stroke: '#475569' }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                      />
                      <Bar
                        dataKey={chart.dataKey}
                        fill={`url(#gradient-${index})`}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
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