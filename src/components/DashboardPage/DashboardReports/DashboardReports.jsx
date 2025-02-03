import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { ExcelDownloadButton } from './components/ExcelDownloadButton';
import { FiltrosReportes } from './components/FiltrosReportes';
import { StatsOverview } from './components/StatsOverview';
import { DashboardTable } from './components/DashboardTable';
import { TitleHeader } from '../components/TitleHeader';
import { UploadFilesModal } from './components/UploadFilesModal';
import { UserMessagesModal } from './components/UserMessagesModal';
import StatsCharts from './components/StatisticsCharts';
import { fetchReportDataCampus } from '../../../services/reportService';

export const DashboardReports = () => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [showModalupload, setshowModalupload] = useState(false);
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
      fetchCampusData();
    }
  }, [dates]);

//para recalcular cuando campusData cambie
  useEffect(() => {
    if (filteredDataIza.length > 0 && (campusData.usersBucaramanga.length > 0 || campusData.usersBogota.length > 0)) {
      calculateStats(filteredDataIza);
    }
  }, [campusData, ciudad, filteredDataIza, spentAmount]);

  const fetchCampusData = async () => {
    try {
      const dataCampus = await fetchReportDataCampus(dates.start, dates.end);
      setCampusData(dataCampus);
      calculateStats(filteredDataIza);
    } catch (error) {
      console.error("Error fetching campus data:", error);
    }
  };

  const calculateStats = () => {
    if (!Array.isArray(filteredDataIza)) return;

    const cityFilteredData = filteredDataIza.filter(user => !ciudad || user.city === ciudad);
    const registeredUsers = ciudad === "Bucaramanga"
      ? campusData.usersBucaramanga
      : campusData.usersBogota;

    const totalUsers = cityFilteredData.length;
    const registeredCount = cityFilteredData.filter(user =>
      registeredUsers.some(regUser => String(regUser.phone) === String(user.PhoneNumber))
    );

    const totalRegisteredUsers = filteredDataIza.filter(user =>
      [...campusData.usersBucaramanga, ...campusData.usersBogota]
        .some(regUser => String(regUser.phone) === String(user.PhoneNumber))
    );

    const conversionRate = ((registeredCount.length / totalUsers) * 100).toFixed(2);
    const costPerUser = (spentAmount / filteredDataIza.length).toFixed(2);
    console.log(filteredDataIza);
    

    setStats({
      totalUsers,
      registeredUsers: totalRegisteredUsers.length,
      conversionRate,
      costPerUser
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
      console.error('salio algo mal al obtener la lista', error)
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
      console.error('error preparando la tabla ', error);

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
            <button
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all flex items-center gap-2"
              onClick={() => setshowModalupload(true)}
            >
              <Upload className="w-5 h-5" /> Cargar Archivos
            </button>
          </div>
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

        <UploadFilesModal
          showModal={showModalupload}
          onClose={() => setshowModalupload(false)}
          spentAmount={spentAmount}
          setSpentAmount={setSpentAmount}
          calculateStats={calculateStats}
          filteredData={filteredDataIza}
          onUploadSuccess={() => setshowModalupload(false)}
        />

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