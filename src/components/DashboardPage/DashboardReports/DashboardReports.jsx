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

const formatPhone = phone => String(phone).replace(/\D/g, '').slice(-10);

const isValidDate = dateStr => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
};

export const DashboardReports = () => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [filteredDataIza, setFilteredDataIza] = useState([]);
  const [campusData, setCampusData] = useState({ usersBucaramanga: [], usersBogota: [] });
  const [dates, setDates] = useState({ start: '', end: '' });
  const [spentAmount, setSpentAmount] = useState(() => {
    const savedAmount = localStorage.getItem('spentAmount');
    return savedAmount && !isNaN(Number(savedAmount)) ? Number(savedAmount) : 0;
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredUsers: 0,
    conversionRate: 0,
    costPerUser: 0,
    dataRegisteredUsers: []
  });

  const tableColumns = [
    { key: 'status', label: 'Estado' },
    { key: 'Username', label: 'Usuario' },
    { key: 'PhoneNumber', label: 'Teléfono' },
    { key: 'city', label: 'Ciudad' },
    { key: 'messageCount', label: 'Mensajes' }
  ];

  const cityFilteredData = useMemo(() => {
    if (!Array.isArray(filteredDataIza)) return [];
    return filteredDataIza.filter(user =>
      user && !ciudad || (user.city === ciudad && user.PhoneNumber)
    );
  }, [filteredDataIza, ciudad]);

  const registeredUsers = useMemo(() => {
    return ciudad === "Bucaramanga"
      ? campusData?.usersBucaramanga || []
      : campusData?.usersBogota || [];
  }, [campusData, ciudad]);

  const allRegisteredUsers = useMemo(() => {
    if (!Array.isArray(filteredDataIza)) return [];

    return filteredDataIza.filter(user => {
      if (!user?.PhoneNumber) return false;
      const userPhone = formatPhone(user.PhoneNumber);

      // Verificar si el usuario está registrado en su ciudad correspondiente
      if (user.city === "Bucaramanga") {
        return campusData?.usersBucaramanga?.some(
          regUser => formatPhone(regUser.phone) === userPhone
        );
      } else if (user.city === "Bogota") {
        return campusData?.usersBogota?.some(
          regUser => formatPhone(regUser.phone) === userPhone
        );
      }
      return false;
    });
  }, [filteredDataIza, campusData]);

  const registeredCount = useMemo(() => {
    return cityFilteredData.filter(user => {
      if (!user?.PhoneNumber) return false;
      const userPhone = formatPhone(user.PhoneNumber);
      return registeredUsers.some(regUser => formatPhone(regUser.phone) === userPhone);
    });
  }, [cityFilteredData, registeredUsers]);

  useEffect(() => {
    const fetchCampusData = async () => {
      try {
        if (!isValidDate(dates.start) || !isValidDate(dates.end)) {
          throw new Error('Fechas inválidas');
        }
        const dataCampus = await fetchReportDataCampus(dates.start, dates.end);
        if (!dataCampus?.usersBucaramanga || !dataCampus?.usersBogota) {
          throw new Error('Datos incompletos');
        }
        setCampusData(dataCampus);
        setError(null);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching campus data:", error);
      }
    };

    if (dates.start && dates.end) {
      fetchCampusData();
    }
  }, [dates.start, dates.end]);

  useEffect(() => {
    if (!dates.start || !dates.end) return;

    try {
      const totalUsers = cityFilteredData.length;
      const registeredUsersCount = registeredCount.length;

      const conversionRate = totalUsers > 0
        ? ((registeredUsersCount / totalUsers) * 100)
        : 0;

      const registeredUsersTotal = allRegisteredUsers.length;
      //console.log(allRegisteredUsers);
      const costPerUser = registeredUsersTotal > 0
        ? (spentAmount / registeredUsersTotal)
        : 0;

      setStats({
        totalUsers,
        registeredUsers: registeredUsersCount,
        conversionRate: Number(conversionRate.toFixed(2)),
        costPerUser: Number(costPerUser.toFixed(2)),
        dataRegisteredUsers: registeredUsers
      });
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }, [cityFilteredData, registeredCount, allRegisteredUsers, spentAmount]);

  const handleDataFetched = (dataIza, newDates) => {
    if (!Array.isArray(dataIza)) {
      setFilteredDataIza([]);
      return;
    }
    setFilteredDataIza(dataIza);
    setDates(newDates);
  };

  const getUsersList = useMemo(() => {
    return (data) => {
      try {
        if (!Array.isArray(data)) return { registered: [], unregistered: [] };

        const cityUsers = data.filter(user =>
          user && (!ciudad || user.city === ciudad) && user.PhoneNumber
        );

        const currentCityUsers = registeredUsers;

        const registered = cityUsers.filter(user => {
          const userPhone = formatPhone(user.PhoneNumber);
          return currentCityUsers.some(regUser =>
            formatPhone(regUser.phone) === userPhone
          );
        });

        const unregistered = cityUsers.filter(user => {
          const userPhone = formatPhone(user.PhoneNumber);
          return !currentCityUsers.some(regUser =>
            formatPhone(regUser.phone) === userPhone
          );
        });

        return { registered, unregistered };
      } catch (error) {
        console.error('Error getting users list:', error);
        return { registered: [], unregistered: [] };
      }
    };
  }, [ciudad, registeredUsers]);

  const tableData = useMemo(() => {
    const { registered, unregistered } = getUsersList(filteredDataIza);

    const registeredData = registered.map(user => ({
      ...user,
      status: true,
      messageCount: Array.isArray(user?.Messages) ? user.Messages.length : 0
    }));

    const unregisteredData = unregistered.map(user => ({
      ...user,
      status: false,
      messageCount: Array.isArray(user?.Messages) ? user.Messages.length : 0
    }));

    return [...registeredData, ...unregisteredData];
  }, [filteredDataIza, getUsersList]);

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-900 overflow-y-scroll scrollbar-custom">
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
          <TitleHeader title="Informe de Conversión Iza ChatBot" />

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4">
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