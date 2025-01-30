import React from 'react';

export const UserMessagesModal = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center h-screen -top-8  bg-black/50 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#162033] p-6 rounded-lg shadow-lg text-white h-[420px] w-[920px] overflow-y-scroll scrollbar-custom">
        {/* Contenedor para el título y el botón */}
        <div className="flex flex-row justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Mensajes de {user.Username}</h3>
          <button
            className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-all duration-300"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        {/* Tabla de mensajes */}
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-cyan-400">
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {user.Messages.map((message) => (
              <tr key={message.MessageId} className="border-b border-gray-600 hover:bg-[#3B3F47]">
                <td className="px-4 py-2">{message.Message}</td>
                <td className="px-4 py-2">{message.MessageId}</td>
                <td className="px-4 py-2">{message.Time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};