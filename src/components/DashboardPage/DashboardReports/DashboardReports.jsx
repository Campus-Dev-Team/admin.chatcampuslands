import { useEffect, useState, useMemo } from "react";
import { ExcelDownloadButton } from './components/ExcelDownloadButton';
import { FiltrosReportes } from './components/FiltrosReportes';
import { StatsOverview } from './components/StatsOverview';
import { DashboardTable } from './components/DashboardTable';
import { TitleHeader } from '../components/TitleHeader';
import { UserMessagesModal } from './components/UserMessagesModal';
import { SpentAmountInput } from './components/SpentAmountInput';
import StatsCharts from './components/StatisticsCharts';
import { fetchReportDataCampus } from '../../../services/reportService';

export const DashboardReports = () => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [filteredDataIza, setFilteredDataIza] = useState([]);
  const [campusData, setCampusData] = useState({ usersBucaramanga: [], usersBogota: [] });
  const [dates, setDates] = useState({ start: '', end: '' });
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
    { key: 'status', label: 'Estado' },
    { key: 'Username', label: 'Usuario' },
    { key: 'PhoneNumber', label: 'Teléfono' },
    { key: 'city', label: 'Ciudad' },
    { key: 'messageCount', label: 'Mensajes' }
  ];


  // Datos filtrados por ciudad
  const cityFilteredData = useMemo(() => {
    if (!Array.isArray(filteredDataIza)) return [];
    return filteredDataIza.filter(user => !ciudad || user.city === ciudad);
  }, [filteredDataIza, ciudad]);

  // Usuarios registrados según la ciudad seleccionada
  const registeredUsers = useMemo(() => {
    return ciudad === "Bucaramanga"
      ? campusData.usersBucaramanga
      : campusData.usersBogota;
  }, [campusData, ciudad]);

  // Todos los usuarios registrados (ambas ciudades)
  const allRegisteredUsers = useMemo(() => {
    if (!Array.isArray(filteredDataIza)) return [];
    return filteredDataIza.filter(user =>
      [...campusData.usersBucaramanga, ...campusData.usersBogota]
        .some(regUser => String(regUser.phone) === String(user.PhoneNumber))
    );
  }, [filteredDataIza, campusData]);

  // Conteo de usuarios registrados de la ciudad actual
  const registeredCount = useMemo(() => {
    return cityFilteredData.filter(user =>
      registeredUsers.some(regUser => String(regUser.phone) === String(user.PhoneNumber))
    );
  }, [cityFilteredData, registeredUsers]);

  // Efecto para cargar datos del campus

  useEffect(() => {
    const fetchCampusData = async () => {
      try {
        const dataCampus = await fetchReportDataCampus(dates.start, dates.end);
        setCampusData(dataCampus);
      } catch (error) {
        console.error("Error fetching campus data:", error);
      }
    };

    if (dates.start && dates.end) {
      fetchCampusData();
    }
  }, [dates.start, dates.end]);

  // Efecto para actualizar estadísticas
  useEffect(() => {
    if (!dates.start || !dates.end) return;


    const totalUsers = cityFilteredData.length;
    const conversionRate = totalUsers > 0
      ? ((registeredCount.length / totalUsers) * 100).toFixed(2)
      : 0;
    const costPerUser = allRegisteredUsers.length > 0
      ? (spentAmount / allRegisteredUsers.length).toFixed(2)
      : 0;
    
    setStats({
      totalUsers,
      registeredUsers: registeredCount.length,
      conversionRate: Number(conversionRate),
      costPerUser: Number(costPerUser)
    });
  }, [cityFilteredData, registeredCount, allRegisteredUsers, spentAmount]);

  
  const handleDataFetched = (dataIza, newDates) => {
    setFilteredDataIza(dataIza);
    setDates(newDates);
  };

  // Función para obtener listas de usuarios
  const getUsersList = useMemo(() => {
    return (data) => {
      try {
        if (!Array.isArray(data)) return { registered: [], unregistered: [] };

        const cityFilteredData = data.filter(user => !ciudad || user.city === ciudad);
        const currentCityUsers = ciudad === "Bucaramanga"
          ? campusData.usersBucaramanga
          : campusData.usersBogota;

        const registered = cityFilteredData.filter(user =>
          currentCityUsers.some(regUser => String(regUser.phone) === String(user.PhoneNumber))
        );

        const unregistered = cityFilteredData.filter(user =>
          !currentCityUsers.some(regUser => String(regUser.phone) === String(user.PhoneNumber))
        );

        return { registered, unregistered };
      } catch (error) {
        console.error('Error getting users list:', error);
        return { registered: [], unregistered: [] };
      }
    };
  }, [ciudad, campusData]);

  // Datos preparados para la tabla
  const tableData = useMemo(() => {
    const { registered, unregistered } = getUsersList(filteredDataIza);

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
  }, [filteredDataIza, getUsersList]);

  return (
    <div className="p-6 space-y-6 bg-slate-900 overflow-y-scroll scrollbar-custom">
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <TitleHeader title="Informe de Conversión Iza ChatBot" />
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
              filteredData={filteredDataIza}
            />

          </div>
          <SpentAmountInput value={spentAmount} onChange={setSpentAmount} />
        </div>

        <StatsOverview stats={stats} />
        <StatsCharts
          filteredData={cityFilteredData}
          campusData={campusData}
          ciudad={ciudad}
        />

        <div className="mt-8">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-cyan-400">Detalle de Usuarios</h3>
            </div>
            <DashboardTable
              data={tableData}
              columns={tableColumns}
              onRowAction={(user) => {
                setSelectedUser(user);
                setShowMessagesModal(true);
              }}
              actionLabel="Ver Mensajes"
              rowClassName={(row) => row.status ? 'bg-green-900/10' : 'bg-red-900/10'}
              statusColumn="status"
              emptyMessage="No hay usuarios disponibles para mostrar."
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        </div>

        <UserMessagesModal
          isOpen={showMessagesModal}
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setShowMessagesModal(false);
          }}
        />
      </div>
    </div>
  );
};