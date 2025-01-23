import React, { useState } from "react";


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
  
    const openModal = (user) => {
      setSelectedUser(user);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setSelectedUser(null);
      setIsModalOpen(false);
    };
  
    return (
      <div className="p-6 space-y-6">
        {/* Tarjetas de Contadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="p-4 bg-[#2A303C] text-white rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold">Total Mensajes</h2>
            <p className="text-3xl font-semibold text-cyan-400">{totalMessages}</p>
          </div>
          <div className="p-4 bg-[#2A303C] text-white rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold">Total Usuarios</h2>
            <p className="text-3xl font-semibold text-cyan-400">{totalUsers}</p>
          </div>
        </div>
  
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
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id} className="border-b border-gray-600 hover:bg-[#3B3F47]">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2">{user.age}</td>
                  <td
                    className={`px-4 py-2 ${
                      user.availability === "Available" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {user.availability}
                  </td>
                  <td className="px-4 py-2">{user.contactWay}</td>
                  <td className="px-4 py-2 text-center">{user.messagesSent}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-4 py-1 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-all duration-300"
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
            <div className="bg-[#2A303C] p-6 rounded-lg shadow-lg text-white w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Mensajes de {selectedUser.name}</h3>
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-cyan-400">
                    <th className="px-4 py-2">Message</th>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.messages.map((message) => (
                    <tr key={message.id} className="border-b border-gray-600 hover:bg-[#3B3F47]">
                      <td className="px-4 py-2">{message.content}</td>
                      <td className="px-4 py-2">{message.id}</td>
                      <td className="px-4 py-2">{message.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="mt-4 px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-all duration-300"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };
  