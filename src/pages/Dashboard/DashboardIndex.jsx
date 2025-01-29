import React, { useState } from "react";
import { FiltrosReportes } from './../../components/DashboardPage/FiltrosReportes';
import { TarjetaContador } from './../../components/DashboardPage/TarjetaContador';
import { UserMessagesModal } from './../../components/DashboardPage/UserMessagesModal';
import {DashboardTable} from './../../components/DashboardPage/DashboardTable';  // Asegúrate de ajustar la ruta de importación

export const DashboardIndex = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    { key: 'UserId', label: 'Usuario ID' },
    { key: 'Username', label: 'Nombre' },
    { key: 'PhoneNumber', label: 'Teléfono' },
    { key: 'Age', label: 'Edad' },
    { key: 'Availability', label: 'Disponibilidad' },
    { key: 'messageCount', label: 'Mensajes Enviados', defaultValue: 'No disponible' },
    { key: 'city', label: 'Ciudad', defaultValue: 'No disponible' }
  ];

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleDataFetched = (fetchedData) => {
    console.log('informacion de isadata ', fetchedData);
    setFilteredData(fetchedData);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-scroll scrollbar-custom">
      <div className="flex flex-col lg:flex-row items-center justify-between h-24">
        <h2 className="text-3xl font-bold text-cyan-400 w-full">
          Informe General
        </h2>
        <FiltrosReportes onDataFetched={handleDataFetched} />
      </div>

      <TarjetaContador userList={filteredData} />

      <DashboardTable 
        data={filteredData}
        columns={columns}
        onRowAction={openModal}
        actionLabel="Ver Mensajes"
        emptyMessage="No se encontraron datos en el periodo de fechas seleccionado."
      />

      <UserMessagesModal 
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={closeModal}
      />
    </div>
  );
};