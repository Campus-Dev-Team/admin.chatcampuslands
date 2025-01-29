import React from 'react';

export const DashboardTable = ({ 
  data, 
  columns, 
  emptyMessage = "No hay datos disponibles.",
  onRowAction,
  actionLabel = "Acción"
}) => {
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    return null;
  }

  return (
    <div className="overflow-x-auto bg-[#162033] text-white rounded-lg shadow-md max-h-[35rem]">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-cyan-400">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-2">
                {column.label}
              </th>
            ))}
            {onRowAction && <th className="px-4 py-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id || row.UserId} className="border-b border-gray-600 hover:bg-[#3B3F47]">
                {columns.map((column) => (
                  <td 
                    key={`${row.id || row.UserId}-${column.key}`} 
                    className={`px-4 py-2 ${column.className || ''} ${
                      column.key === 'Availability' 
                        ? row[column.key] === "Available" 
                          ? "text-green-400" 
                          : "text-red-400"
                        : ""
                    }`}
                  >
                    {row[column.key] || column.defaultValue || "No disponible"}
                  </td>
                ))}
                {onRowAction && (
                  <td className="px-4 py-2">
                    <button
                      className="px-4 py-1 bg-color-primary text-white rounded-lg hover:bg-color-primary-hover transition-all duration-300"
                      onClick={() => onRowAction(row)}
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
                className="text-center py-4 text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
