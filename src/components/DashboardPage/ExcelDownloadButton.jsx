import React from 'react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

export const ExcelDownloadButton = ({ 
  stats, 
  spentAmount, 
  ciudad, 
  getUsersList, 
  filteredData 
}) => {
  const exportToExcel = () => {
    try {
      // Preparar datos de estadísticas generales
      const generalStats = [
        {
          'Métrica': 'Usuarios Totales',
          'Valor': stats.totalUsers,
          'Descripción': 'Total de usuarios únicos'
        },
        {
          'Métrica': 'Usuarios Registrados',
          'Valor': stats.registeredUsers,
          'Descripción': 'Usuarios que completaron registro'
        },
        {
          'Métrica': 'Tasa de Conversión',
          'Valor': `${stats.conversionRate}%`,
          'Descripción': 'Porcentaje de usuarios registrados'
        },
        {
          'Métrica': 'Costo Global por Usuario',
          'Valor': `$${stats.costPerUser}`,
          'Descripción': 'Costo promedio por usuario'
        },
        {
          'Métrica': 'Gasto Total',
          'Valor': `$${spentAmount}`,
          'Descripción': 'Monto total invertido'
        }
      ];

      // Obtener datos de usuarios
      const { registered, unregistered } = getUsersList(filteredData);

      // Preparar datos detallados de usuarios
      const usersData = [...registered, ...unregistered].map(user => ({
        'Estado': registered.includes(user) ? 'Registrado' : 'No Registrado',
        'Usuario': user.Username || '',
        'Teléfono': user.PhoneNumber || '',
        'Ciudad': user.city || '',
        'Cantidad de Mensajes': user.Messages?.length || 0
      }));

      // Crear nuevo libro de Excel
      const workbook = XLSX.utils.book_new();

      // Crear y agregar hoja de estadísticas
      const wsStats = XLSX.utils.json_to_sheet(generalStats);
      XLSX.utils.book_append_sheet(workbook, wsStats, 'Estadísticas Generales');

      // Crear y agregar hoja de usuarios
      const wsUsers = XLSX.utils.json_to_sheet(usersData);
      XLSX.utils.book_append_sheet(workbook, wsUsers, 'Detalle de Usuarios');

      // Ajustar anchos de columna
      const wscols = [
        { wch: 20 }, // Estado/Métrica
        { wch: 30 }, // Usuario/Valor
        { wch: 15 }, // Teléfono
        { wch: 15 }, // Ciudad
        { wch: 20 }  // Mensajes/Descripción
      ];

      wsStats['!cols'] = wscols;
      wsUsers['!cols'] = wscols;

      // Generar nombre del archivo con fecha
      const date = new Date().toISOString().split('T')[0];
      const fileName = `Reporte_ChatBot_${ciudad}_${date}.xlsx`;

      // Guardar archivo
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
    >
      <Download className="w-5 h-5" /> Exportar Excel
    </button>
  );
};