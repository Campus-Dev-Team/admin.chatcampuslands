import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import _ from 'lodash';

const StatsCharts = ({ filteredData }) => {
  // Process data for charts
  const chartData = useMemo(() => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) return [];

    // Get stored registered users data
    const storedData = localStorage.getItem("mergedUsers");
    const registeredUsers = storedData ? JSON.parse(storedData) : [];

    // Group messages by date
    const messagesByDate = _.groupBy(
      filteredData.flatMap(user => user.Messages || []),
      message => message.Time.split('T')[0]
    );

    // Get all unique dates
    const dates = Object.keys(messagesByDate).sort();

    // Calculate daily stats
    return dates.map(date => {
      const dailyMessages = messagesByDate[date];
      
      // Get unique users for this date based on Messages
      const dailyUniqueUsers = new Set(
        dailyMessages.map(msg => {
          const user = filteredData.find(u => 
            (u.Messages || []).some(m => m.MessageId === msg.MessageId)
          );
          return user ? user.PhoneNumber : null;
        }).filter(Boolean)
      );

      // Total unique users for the day
      const totalUsers = dailyUniqueUsers.size;
      
      // Count registered users for this date
      const registeredCount = Array.from(dailyUniqueUsers).filter(phoneNumber =>
        registeredUsers.some(regUser => regUser.Celular === phoneNumber)
      ).length;

      // Calculate conversion rate
      const conversionRate = totalUsers > 0 
        ? (registeredCount / totalUsers) * 100 
        : 0;

      return {
        date,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        totalUsers,
        registeredUsers: registeredCount
      };
    });
  }, [filteredData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Conversion Rate Chart */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">
          Tasa de Conversión Diaria
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                unit="%"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.375rem',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="conversionRate"
                name="Tasa de Conversión"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: '#06B6D4', r: 4 }}
                activeDot={{ r: 6, stroke: '#0891B2' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Users Chart with Total and Registered */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">
          Usuarios por Día
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.375rem',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Bar
                dataKey="totalUsers"
                name="Usuarios Totales"
                fill="#94A3B8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="registeredUsers"
                name="Usuarios Registrados"
                fill="#06B6D4"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;