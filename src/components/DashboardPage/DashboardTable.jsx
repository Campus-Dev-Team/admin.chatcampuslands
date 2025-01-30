// DashboardTable.jsx
import React from 'react';

export const DashboardTable = ({ 
  data, 
  columns, 
  emptyMessage = "No hay datos disponibles.",
  onRowAction,
  actionLabel = "Acción",
  rowClassName,
  statusColumn,
  statusFilter,
  onStatusFilterChange
}) => {
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    return null;
  }

  // Filter data based on status filter
  const filteredData = statusFilter === 'all' 
    ? data 
    : data.filter(row => row[statusColumn] === (statusFilter === 'registered'));

  return (
    <div>
      <div className="p-4 flex items-center gap-4">
        <span className="text-slate-300 text-sm">Filtrar por estado:</span>
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="bg-slate-800 text-white text-sm border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
        >
          <option value="all">Todos</option>
          <option value="registered">Registrados</option>
          <option value="unregistered">No Registrados</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-700/50">
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {onRowAction && (
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  {actionLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr 
                  key={row.id || row.UserId || `row-${index}`} 
                  className={`${rowClassName ? rowClassName(row) : ''}`}
                >
                  {columns.map((column) => (
                    <td 
                      key={`${row.id || row.UserId || index}-${column.key}`} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-slate-300"
                    >
                      {column.key === statusColumn ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row[statusColumn] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {row[statusColumn] ? 'Registrado' : 'No Registrado'}
                        </span>
                      ) : (
                        row[column.key] || column.defaultValue || "No disponible"
                      )}
                    </td>
                  ))}
                  {onRowAction && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      <button
                        onClick={() => onRowAction(row)}
                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all"
                      >
                        {actionLabel}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (onRowAction ? 1 : 0)} 
                  className="px-6 py-4 text-center text-sm text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};