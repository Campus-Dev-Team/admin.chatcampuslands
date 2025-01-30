import { Upload, } from "lucide-react";
import { useEffect, useState } from "react";
import { ExcelDownloadButton } from './components/ExcelDownloadButton';
import { FiltrosReportes } from './components/FiltrosReportes';
import { StatsOverview } from './components/StatsOverview';
import { DashboardTable } from './components/DashboardTable';
import { TitleHeader } from '../components/TitleHeader';
import { UploadFilesModal } from './components/UploadFilesModal';
import { UserMessagesModal } from './components/UserMessagesModal';
import StatsCharts from './components/StatisticsCharts';

export const DashboardReports = () => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados principales
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [showModalupload, setshowModalupload] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [spentAmount, setSpentAmount] = useState(() => {
    const savedAmount = localStorage.getItem('spentAmount');
    return savedAmount ? Number(savedAmount) : 0;
  });
  const [statusFilter, setStatusFilter] = useState('all');

  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredUsers: 0,
    conversionRate: 0,
    costPerUser: 0
  });


  const tableColumns = [
    {
      key: 'status',
      label: 'Estado'
    },
    {
      key: 'Username',
      label: 'Usuario'
    },
    {
      key: 'PhoneNumber',
      label: 'Teléfono'
    },
    {
      key: 'city',
      label: 'Ciudad'
    },
    {
      key: 'messageCount',
      label: 'Mensajes'
    }
  ];

  const prepareTableData = () => {
    const { registered, unregistered } = getUsersList(filteredData);

    const registeredData = registered.map(user => ({
      ...user,
      status: true,
      messageCount: user.Messages?.length || 0
    }));

    const unregisteredData = unregistered.map(user => ({
      ...user,
      status: false,
      messageCount: user.Messages?.length || 0
    }));

    return [...registeredData, ...unregisteredData];
  };

  // cambiar estilo de la tabla segun el estado
  const getRowClassName = (row) =>
    row.status ? 'bg-green-900/10' : 'bg-red-900/10';

  // manejo para abrir el modal de mensajes
  const handleOpenMessages = (user) => {
    setSelectedUser(user);
    setShowMessagesModal(true);
  };

  // manejo para cerrar el modal de mensajes
  const handleCloseMessages = () => {
    setSelectedUser(null);
    setShowMessagesModal(false);
  };


  // Dentro de la función calculateStats
  const calculateStats = (data) => {
    if (!Array.isArray(data)) return;

    // Filtrar por ciudad (para las demás estadísticas)
    const cityFilteredData = data.filter(user => !ciudad || user.city === ciudad);

    // Obtener datos del localStorage
    const storedData = localStorage.getItem("mergedUsers");
    const registeredUsers = storedData ? JSON.parse(storedData) : [];

    // Cálculo de estadísticas
    const totalUsers = cityFilteredData.length;

    // Contar usuarios registrados (filtrado por ciudad)
    const registeredCount = cityFilteredData.filter(user =>
      registeredUsers.some(regUser => {
        return regUser.Celular === user.PhoneNumber;
      })
    );

    // Calcular total de usuarios registrados en todas las ciudades
    const totalRegisteredUsers = data.filter(user =>
      registeredUsers.some(regUser => {
        return regUser.Celular === user.PhoneNumber;
      })
    );

    // Calcular tasa de conversión (mantiene el filtro por ciudad)
    const conversionRate = totalUsers > 0 ? ((registeredCount.length / totalUsers) * 100).toFixed(2) : 0;


    // Calcular costo por usuario (usando TODOS los usuarios registrados - no se filtra por ciudad)
    const costPerUser = totalRegisteredUsers.length > 0 ? (spentAmount / totalRegisteredUsers.length).toFixed(2) : 0;


    // Actualizar estado
    setStats({
      totalUsers,
      registeredUsers: registeredCount.length,
      conversionRate,
      costPerUser
    });
  };

  // Función que maneja los datos recibidos de FiltrosReportes
  const handleDataFetched = (data) => {
    setFilteredData(data);
    calculateStats(data);
  };


  // Efecto para recalcular cuando cambia la ciudad
  useEffect(() => {
    calculateStats(filteredData);
  }, [ciudad, spentAmount]);


  // Función para clasificar los usuarios por estado
  const getUsersList = (data) => {
    if (!Array.isArray(data)) return { registered: [], unregistered: [] };

    const storedData = localStorage.getItem("mergedUsers");
    const registeredUsers = storedData ? JSON.parse(storedData) : [];

    const cityFilteredData = data.filter(user => !ciudad || user.city === ciudad);


    const registered = cityFilteredData.filter(user =>
      registeredUsers.some(regUser => {
        return regUser.Celular === user.PhoneNumber;
      })
    );

    const unregistered = cityFilteredData.filter(user =>
      !registeredUsers.some(regUser => {
        return regUser.Celular === user.PhoneNumber;
      })
    );

    return { registered, unregistered };
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 overflow-y-scroll scrollbar-custom">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <TitleHeader title={"Informe de Conversión Iza ChatBot"} />
          <div className="flex flex-col md:flex-row items-center gap-4">
            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="h-fit w-fit bg-slate-800 text-white text-[0.9rem] border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            >
              <option value="Bogota">Bogotá</option>
              <option value="Bucaramanga">Bucaramanga</option>
            </select>

            <FiltrosReportes onDataFetched={handleDataFetched} />

            <ExcelDownloadButton
              stats={stats}
              spentAmount={spentAmount}
              ciudad={ciudad}
              getUsersList={getUsersList}
              filteredData={filteredData}
            />

            <button
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all flex items-center gap-2"
              onClick={() => setshowModalupload(true)}
            >
              <Upload className="w-5 h-5" /> Cargar Archivos
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Stats Charts */}
        <StatsCharts filteredData={filteredData.filter(user => !ciudad || user.city === ciudad)} />

        {/* Users Table */}
        <div className="mt-8">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-cyan-400">Detalle de Usuarios</h3>
            </div>
            <DashboardTable
              data={prepareTableData()}
              columns={tableColumns}
              onRowAction={handleOpenMessages}
              actionLabel="Ver Mensajes"
              rowClassName={getRowClassName}
              statusColumn="status"
              emptyMessage="No hay usuarios disponibles para mostrar."
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        </div>

        {/* Modals */}
        <UploadFilesModal
          showModal={showModalupload}
          onClose={() => setshowModalupload(false)}
          spentAmount={spentAmount}
          setSpentAmount={setSpentAmount}
          calculateStats={calculateStats}
          filteredData={filteredData}
          onUploadSuccess={() => {
            setshowModalupload(false);
          }}
        />

        <UserMessagesModal
          isOpen={showMessagesModal}
          user={selectedUser}
          onClose={handleCloseMessages}
        />
      </div>
    </div>
  );
};