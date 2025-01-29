import React, { useState } from "react";
import { FiltrosReportes } from './FiltrosReportes';
import { TarjetaContador } from './TarjetaContador';
import { UserMessagesModal } from './UserMessagesModal';

export const DashboardTable = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleDataFetched = (fetchedData) => {
    console.log('informacion de isadata ',fetchedData);
    setFilteredData(fetchedData);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-scroll scrollbar-custom">
      <div className="flex flex-col lg:flex-row items-center justify-between  h-24">
        <h2 className="text-3xl font-bold text-cyan-400 w-full ">
          Informe General
        </h2>

        <FiltrosReportes onDataFetched={handleDataFetched} />
      </div>
      {/* Tarjetas de Contadores */}
      <TarjetaContador userList={filteredData} />

      {/* Tabla de Usuarios */}
      <div className="overflow-x-auto bg-[#162033] text-white rounded-lg shadow-md max-h-[35rem]">
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
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
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
                  <td className="px-4 py-2 text-center">{user.messageCount || "No disponible"}</td>
                  <td className="px-4 py-2 text-center">{user.city || "No disponible"}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-4 py-1 bg-color-primary text-white rounded-lg hover:bg-color-primary-hover transition-all duration-300"
                      onClick={() => openModal(user)}
                    >
                      Ver Mensajes
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-400">
                  No se encontraron datos en el periodo de fechas seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <UserMessagesModal 
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={closeModal}
      />
    </div>
  );
};