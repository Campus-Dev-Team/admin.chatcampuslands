import { useEffect, useState } from "react";
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

 
  useEffect(() => {
    if (dates.start && dates.end) {
      calculateStats();
    }
  }, [dates]);

 
  const fetchCampusData = async () => {
    try {
      const dataCampus = await fetchReportDataCampus(dates.start, dates.end);
      setCampusData(dataCampus);
    } catch (error) {
      console.error("Error fetching campus data:", error);
    }
  };

  const calculateStats = () => {
    fetchCampusData();
    if (!Array.isArray(filteredDataIza)) return;
  
    // Datos y usuarios registrados filtrados por ciudad
    const cityFilteredData = filteredDataIza.filter(user => !ciudad || user.city === ciudad);
    const registeredUsers = ciudad === "Bucaramanga"
      ? campusData.usersBucaramanga
      : campusData.usersBogota;
  
    // Totales por ciudad
    const totalUsers = cityFilteredData.length;
    console.log(totalUsers);
    
    const registeredCount = cityFilteredData.filter(user =>
      registeredUsers.some(regUser => String(regUser.phone) === String(user.PhoneNumber))
    );
  
    // Cálculo global para costo por usuario
    const allRegisteredUsers = filteredDataIza.filter(user =>
      [...campusData.usersBucaramanga, ...campusData.usersBogota]
        .some(regUser => String(regUser.phone) === String(user.PhoneNumber))
    );
  
    const conversionRate = totalUsers > 0 ? ((registeredCount.length / totalUsers) * 100).toFixed(2) : 0;
    const costPerUser = allRegisteredUsers.length > 0 ? (spentAmount / allRegisteredUsers.length).toFixed(2) : 0;
  
    setStats({
      totalUsers,
      registeredUsers: registeredCount.length,
      conversionRate: Number(conversionRate),
      costPerUser: Number(costPerUser)
    });
  };

  const handleDataFetched = (dataIza, newDates) => {
    setFilteredDataIza(dataIza);
    setDates(newDates);
  };

  const getUsersList = (data) => {
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

  const prepareTableData = () => {
    try {
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
    } catch (error) {
      console.error('Error preparing table data:', error);
      return [];
    }
  };

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
          filteredData={filteredDataIza.filter(user => !ciudad || user.city === ciudad)}
          campusData={campusData}
          ciudad={ciudad}
        />

        <div className="mt-8">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-cyan-400">Detalle de Usuarios</h3>
            </div>
            <DashboardTable
              data={prepareTableData()}
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