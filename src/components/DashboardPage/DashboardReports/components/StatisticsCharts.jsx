import React, { useMemo, useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import _ from 'lodash';

// Función auxiliar para generar un arreglo de fechas (en formato ISO "YYYY-MM-DD")
const getDateRangeArray = (start, end) => {
  const datesArr = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    datesArr.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return datesArr;
};

const StatsCharts = ({ filteredData, campusData, ciudad, dates }) => {
  const [isLoading, setIsLoading] = useState(false);

  const chartData = useMemo(() => {
    // Si no hay datos en filteredData, se genera un arreglo de fechas con valores en 0
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      if (dates && dates.start && dates.end) {
        const dateRange = getDateRangeArray(dates.start, dates.end);
        return dateRange.map(date => ({
          date,
          conversionRate: 0,
          totalUsers: 0,
          registeredUsers: 0
        }));
      }
      // Si no se dispone de rango de fechas, se retorna un arreglo vacío
      return [];
    }

    const registeredUsers = campusData?.[`users${ciudad}`] || [];
    // Mapa para rastrear la fecha del primer registro de cada usuario
    const firstRegistrationDates = new Map();

    // Se agrupan todos los mensajes por fecha
    const messagesByDate = _.groupBy(
      filteredData.flatMap(user => user.Messages || []),
      message => message.Time.split('T')[0]
    );

    const newData = Object.keys(messagesByDate)
      .sort()
      .map(date => {
        const dailyMessages = messagesByDate[date];

        // Se obtiene el conjunto de usuarios únicos que enviaron mensajes ese día
        const dailyUniqueUsers = new Set(
          dailyMessages.map(msg => {
            const user = filteredData.find(u =>
              (u.Messages || []).some(m => m.MessageId === msg.MessageId)
            );
            return user ? user.PhoneNumber : null;
          }).filter(Boolean)
        );

        const totalUsers = dailyUniqueUsers.size;
        let registeredCount = 0;

        // Se verifica para cada usuario si está registrado
        dailyUniqueUsers.forEach(phoneNumber => {
          const isRegistered = registeredUsers.some(regUser =>
            String(regUser.phone) === String(phoneNumber)
          );

          if (isRegistered && !firstRegistrationDates.has(phoneNumber)) {
            firstRegistrationDates.set(phoneNumber, date);
            registeredCount++;
          }
        });

        return {
          date,
          conversionRate: totalUsers > 0
            ? parseFloat(((registeredCount / totalUsers) * 100).toFixed(2))
            : 0,
          totalUsers,
          registeredUsers: registeredCount
        };
      });

    return newData;
  }, [filteredData, campusData, ciudad, dates]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [filteredData, campusData, ciudad, dates]);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 transition-opacity duration-300 ${
      isLoading ? 'opacity-50' : 'opacity-100'
    }`}>
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">
          Tasa de Conversión Diaria
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} unit="%" />
              <Tooltip contentStyle={{ 
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
                color: '#F3F4F6'
              }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="conversionRate"
                name="Tasa de Conversión"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: '#06B6D4', r: 4 }}
                activeDot={{ r: 6, stroke: '#0891B2' }}
                animationDuration={1000}
                animationBegin={0}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">
          Usuarios por Día
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ 
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
                color: '#F3F4F6'
              }} />
              <Legend />
              <Bar
                dataKey="totalUsers"
                name="Usuarios Totales"
                fill="#94A3B8"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                animationBegin={0}
                animationEasing="ease-in-out"
              />
              <Bar
                dataKey="registeredUsers"
                name="Usuarios Registrados"
                fill="#06B6D4"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                animationBegin={200}
                animationEasing="ease-in-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;
