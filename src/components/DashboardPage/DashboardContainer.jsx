import React, { useState } from "react";
import { FiltrosReportes } from './FiltrosReportes';
import { TarjetaContador } from './TarjetaContador';

export const DashboardContainer = () => {

  const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [filteredData, setFilteredData] = useState([]); // Usar los datos filtrados o el JSON simulado

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Función que maneja los datos obtenidos después de aplicar los filtros
  const handleDataFetched = (fetchedData) => {
    setFilteredData(fetchedData);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <FiltrosReportes onDataFetched={handleDataFetched} />
      </div>
      {/* Tarjetas de Contadores */}
      <TarjetaContador userList={filteredData} />

      {/* Tabla de Usuarios */}
      <div className="overflow-x-auto bg-[#162033] text-white rounded-lg shadow-md overflow-y-scroll scrollbar-custom max-h-[35rem]">
        <table className="min-w-full text-left ">
          <thead>
            <tr className="border-b border-cyan-400">
              <th className="px-4 py-2">Usuario ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Edad</th>
              <th className="px-4 py-2">Disponibilidad</th>
              <th className="px-4 py-2">Mensajes Enviados</th>
              <th className="px-4 py-2">Ciudad</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user.UserId} className="border-b border-gray-600 hover:bg-[#3B3F47]">
                <td className="px-4 py-2">{user.UserId}</td>
                <td className="px-4 py-2">{user.Username}</td>
                <td className="px-4 py-2">{user.PhoneNumber}</td>
                <td className="px-4 py-2">{user.Age}</td>
                <td
                  className={`px-4 py-2 ${user.Availability === "Available" ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {user.Availability}
                </td>
                <td className="px-4 py-2 text-center">{user.messageCount || 'No disponible'}</td>
                <td className="px-4 py-2 text-center">{user.city || 'No disponible'}</td>
                <td className="px-4 py-2">
                  <button
                    className="px-4 py-1 bg-color-primary text-white rounded-lg hover:bg-color-primary-hover transition-all duration-300"
                    onClick={() => openModal(user)}
                  >
                    Ver Mensajes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#162033] p-6 rounded-lg shadow-lg text-white h-[420px] w-[920px] overflow-y-scroll scrollbar-custom">

            {/* Contenedor para el título y el botón */}
            <div className="flex flex-row justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Mensajes de {selectedUser.Username}</h3>
              <button
                className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-all duration-300"
                onClick={closeModal}
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
                {selectedUser.Messages.map((message) => (
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
      )}

    </div>
  );
};
