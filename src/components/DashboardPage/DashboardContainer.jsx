import React, { useState } from "react";
import { FiltrosReportes } from './FiltrosReportes';
import { TarjetaContador } from './TarjetaContador';

export const DashboardContainer = () => {
  // Datos de ejemplo
  const totalMessages = 1240; // Contador de mensajes
  const totalUsers = 320; // Contador de usuarios
  const userList = [
    {
      id: 1,
      name: "Juan Pérez",
      phone: "300-123-4567",
      age: 25,
      availability: "Available",
      contactWay: "Email",
      messagesSent: 45,
      messages: [
        { id: "m1", content: "Hola", time: "10:15 AM" },
        { id: "m2", content: "¿Cómo estás?", time: "10:20 AM" },
        { id: "m3", content: "Nos vemos mañana", time: "10:30 AM" },
      ],
    },
    {
      id: 2,
      name: "Ana Gómez",
      phone: "311-987-6543",
      age: 30,
      availability: "Busy",
      contactWay: "Phone",
      messagesSent: 60,
      messages: [
        { id: "m1", content: "Hola", time: "9:00 AM" },
        { id: "m2", content: "Estoy ocupada", time: "9:15 AM" },
        { id: "m3", content: "Te llamo luego", time: "9:30 AM" },
      ],
    },
    {
      id: 3,
      name: "Carlos Torres",
      phone: "322-654-7890",
      age: 28,
      availability: "Available",
      contactWay: "WhatsApp",
      messagesSent: 30,
      messages: [
        { id: "m1", content: "Buenas tardes", time: "3:00 PM" },
        { id: "m2", content: "Gracias por tu ayuda", time: "3:15 PM" },
      ],
    },
  ];

  const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
  const [filteredData, setFilteredData] = useState(userList); // Usar los datos filtrados o el JSON simulado

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
    console.log('Datos filtrados:', fetchedData);
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
      <div className="overflow-x-auto bg-[#2A303C] text-white rounded-lg shadow-md">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-cyan-400">
              <th className="px-4 py-2">Usuario ID</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Edad</th>
              <th className="px-4 py-2">Disponibilidad</th>
              <th className="px-4 py-2">Método de Contacto</th>
              <th className="px-4 py-2">Mensajes Enviados</th>
              <th className="px-4 py-2">Ciudad</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user.id} className="border-b border-gray-600 hover:bg-[#3B3F47]">
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
                <td className="px-4 py-2">{user.ContactWay}</td>
                <td className="px-4 py-2 text-center">{user.messageCount || 'No disponible'}</td>
                <td className="px-4 py-2 text-center">{user.City || 'No disponible'}</td>
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
          <div className="bg-[#2A303C] p-6 rounded-lg shadow-lg text-white h-[420px] w-[920px] overflow-y-scroll">

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
