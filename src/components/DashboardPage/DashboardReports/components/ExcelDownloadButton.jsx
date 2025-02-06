import React from 'react';
import * as XLSX from 'xlsx';
import { FileDown } from 'lucide-react';

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
          'Métrica': 'Ciudad',
          'Valor': ciudad,
          'Descripción': 'Ciudad seleccionada'
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

      // Preparar datos de mensajes
      const messagesData = filteredData.flatMap(user =>
        (user.Messages || []).map(message => ({
          'Usuario': user.Username,
          'Teléfono': user.PhoneNumber,
          'Mensaje': message.Message,
          'ID Mensaje': message.MessageId,
          'Fecha y Hora': new Date(message.Time).toLocaleString('es-CO', {
            timeZone: 'America/Bogota'
          })
        }))
      );

      // Estilos para encabezados
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2A303C" } },
        alignment: { horizontal: "center" }
      };

      // Estilos para celdas normales
      const cellStyle = {
        alignment: { horizontal: "left" },
        font: { color: { rgb: "000000" } }
      };

      function setCellStyles(worksheet, headerStyle, cellStyle) {
        if (!worksheet['!ref']) return;
        
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            worksheet[cellRef].s = row === 0 ? headerStyle : cellStyle;
          }
        }
      }

      // Crear nuevo libro de Excel
      const workbook = XLSX.utils.book_new();

      // Crear y agregar hoja de estadísticas
      const wsStats = XLSX.utils.json_to_sheet(generalStats);
      XLSX.utils.book_append_sheet(workbook, wsStats, 'Estadísticas Generales');
      setCellStyles(wsStats, headerStyle, cellStyle);

      // Crear y agregar hoja de usuarios
      const wsUsers = XLSX.utils.json_to_sheet(usersData);
      XLSX.utils.book_append_sheet(workbook, wsUsers, 'Detalle de Usuarios');

      // Crear y agregar hoja de mensajes
      const wsMessages = XLSX.utils.json_to_sheet(messagesData);
      XLSX.utils.book_append_sheet(workbook, wsMessages, 'Historial de Mensajes');

      // Ajustar anchos de columna
      const wscolsStats = [
        { wch: 20 }, // Métrica
        { wch: 30 }, // Valor
        { wch: 40 }  // Descripción
      ];

      const wscolsUsers = [
        { wch: 15 }, // Estado
        { wch: 30 }, // Usuario
        { wch: 15 }, // Teléfono
        { wch: 15 }, // Ciudad
        { wch: 20 }  // Cantidad de Mensajes
      ];

      const wscolsMessages = [
        { wch: 30 }, // Usuario
        { wch: 15 }, // Teléfono
        { wch: 50 }, // Mensaje
        { wch: 15 }, // ID Mensaje
        { wch: 20 }  // Fecha y Hora
      ];

      wsStats['!cols'] = wscolsStats;
      wsUsers['!cols'] = wscolsUsers;
      wsMessages['!cols'] = wscolsMessages;

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
      className="h-fit w-fit bg-slate-800 text-white text-[0.9rem] border border-slate-600 
                 rounded-lg p-2 hover:bg-slate-700 focus:ring-2 focus:ring-cyan-400 
                 focus:border-transparent transition-all duration-200 flex items-center gap-2"
      title="Descargar reporte Excel"
    >
      <FileDown className="h-5 w-5 text-cyan-400" />
      <span className="hidden sm:inline">Exportar</span>
    </button>
  );
};