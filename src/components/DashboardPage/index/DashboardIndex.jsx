import { useState } from "react";
import { FiltrosReportes } from '../FiltrosReportes';
import { DashboardTable } from '../GeneralConsults/components/DashboardTable';
import { TitleHeader } from '../GeneralConsults/components/TitleHeader';
import { UserMessagesModal } from '../GeneralConsults/components/UserMessagesModal';
import { TarjetaContador } from '../TarjetaContador';

export const DashboardIndex = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const columns = [
    { key: 'status', label: 'Estado' },  // Añadido el campo status
    { key: 'UserId', label: 'Usuario ID' },
    { key: 'Username', label: 'Nombre' },
    { key: 'PhoneNumber', label: 'Teléfono' },
    { key: 'Age', label: 'Edad' },
    { key: 'Availability', label: 'Disponibilidad' },
    { key: 'messageCount', label: 'Mensajes Enviados', defaultValue: 'No disponible' },
    { key: 'city', label: 'Ciudad', defaultValue: 'No disponible' }
  ];

  const handleOpenMessages = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseMessages = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Función para preparar los datos y agregar el campo status
  const prepareTableData = () => {
    return filteredData.map(user => ({
      ...user,
      status: user.isRegistered || false, // Asumiendo que tienes un campo isRegistered o similar
      messageCount: user.Messages?.length || 0
    }));
  };

  // Función para aplicar estilo según el estado
  const getRowClassName = (row) => {
    return row.status ? 'bg-green-900/10' : 'bg-red-900/10';
  };

  const handleDataFetched = (fetchedData) => {
    console.log('información de isadata ', fetchedData);
    setFilteredData(fetchedData);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-scroll scrollbar-custom">
      <div className="flex flex-col lg:flex-row items-center justify-between h-24">
        <TitleHeader title={"Informe General"}/>
        <FiltrosReportes onDataFetched={handleDataFetched} />
      </div>

      <TarjetaContador userList={filteredData} />

      <DashboardTable 
        data={prepareTableData()}
        columns={columns}
        onRowAction={handleOpenMessages}
        actionLabel="Ver Mensajes"
        rowClassName={getRowClassName}
        statusColumn="status"
        emptyMessage="No se encontraron datos en el periodo de fechas seleccionado."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <UserMessagesModal 
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={handleCloseMessages}
      />
    </div>
  );
};