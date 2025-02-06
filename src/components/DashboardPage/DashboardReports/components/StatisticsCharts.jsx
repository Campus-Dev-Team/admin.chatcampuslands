import React, { useMemo, useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import _ from 'lodash';

const StatsCharts = ({ filteredData, campusData, ciudad }) => {
  const [prevData, setPrevData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const chartData = useMemo(() => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      return prevData;
    }

    const registeredUsers = ciudad === "Bucaramanga"
      ? campusData?.usersBucaramanga || []
      : campusData?.usersBogota || [];

    const messagesByDate = _.groupBy(
      filteredData.flatMap(user => user.Messages || []),
      message => message.Time.split('T')[0]
    );

    const newData = Object.keys(messagesByDate)
      .sort()
      .map(date => {
        const dailyMessages = messagesByDate[date];
        const dailyUniqueUsers = new Set(
          dailyMessages.map(msg => {
            const user = filteredData.find(u =>
              (u.Messages || []).some(m => m.MessageId === msg.MessageId)
            );
            console.log('User found:', user?.PhoneNumber);
            return user ? user.PhoneNumber : null;
          }).filter(Boolean)
        );

        console.log('Daily messages:', dailyMessages);
        console.log('Filtered Data:', filteredData);

        console.log('Processing date:', date);
        console.log('Daily unique users:', Array.from(dailyUniqueUsers));
        console.log('Registered users:', registeredUsers);

        const totalUsers = dailyUniqueUsers.size;
        
        // Filtramos los usuarios registrados y obtenemos su fecha de registro
        console.log('Example registered user:', registeredUsers[0]);
        const registeredUsersWithDates = registeredUsers
          .filter(regUser => {
            const phoneAsInt = parseInt(String(regUser.phone).replace(/\D/g, ''));
            const isUserActive = Array.from(dailyUniqueUsers).some(
              phoneNumber => phoneNumber === phoneAsInt
            );
            console.log('Phone comparison:', {
              regUserPhone: phoneAsInt,
              activeUsers: Array.from(dailyUniqueUsers),
              isActive: isUserActive
            });
            return isUserActive;
          })
          .filter(regUser => {
            try {
              // Verificamos si tenemos una fecha válida
              if (!regUser.createdAt) return false;
              
              // Intentamos parsear la fecha
              const regDate = new Date(regUser.createdAt);
              
              // Verificamos si la fecha es válida
              if (isNaN(regDate.getTime())) return false;
              
              // Convertimos a YYYY-MM-DD
              const formattedDate = regDate.toISOString().split('T')[0];
              
              // Solo contamos si la fecha de registro es igual a la fecha actual del bucle
              return formattedDate === date;
            } catch (error) {
              console.error('Error processing date:', error);
              return false;
            }
          });
        
        const registeredCount = registeredUsersWithDates.length;

        return {
          date,
          conversionRate: totalUsers > 0
            ? parseFloat(((registeredCount / totalUsers) * 100).toFixed(2))
            : 0,
          totalUsers,
          registeredUsers: registeredCount
        };
      });

    setPrevData(newData);
    return newData;
  }, [filteredData, campusData, ciudad]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [filteredData, campusData, ciudad]);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'
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