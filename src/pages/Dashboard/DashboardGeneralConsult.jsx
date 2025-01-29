import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp, Upload, X, Download } from "lucide-react";
import { FiltrosReportes } from './../../components/DashboardPage/FiltrosReportes';
import { UploadFilesModal } from './../../components/DashboardPage/UploadFilesModal';
import { UserMessagesModal } from './../../components/DashboardPage/UserMessagesModal';
import { DashboardTable } from './../../components/DashboardPage/DashboardTable';
import { ExcelDownloadButton } from './../../components/DashboardPage/ExcelDownloadButton';


export const GeneralConsult = () => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados principales
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [showModalupload, setshowModalupload] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [spentAmount, setSpentAmount] = useState(0);
  const [files, setFiles] = useState({
    usuariosBogota: null,
    usuariosBucaramanga: null
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredUsers: 0,
    conversionRate: 0,
    costPerUser: 0
  });

  //******************************************modularizado*************************************** */
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

  //*************************************************************************** */


  // Función para procesar archivos Excel y agregar campo ciudad
  const processExcelFile = async (file, ciudad) => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, {
        cellDates: true,
        cellStyles: true,
        cellNF: true
      });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convertir a JSON y agregar el campo ciudad
      const jsonData = XLSX.utils.sheet_to_json(worksheet).map(row => ({
        ...row,
        ciudad
      }));

      return jsonData;
    } catch (err) {
      console.error("Error procesando archivo Excel:", err);
      throw new Error(`Error procesando archivo Excel: ${err.message}`);
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  const handleUpload = async () => {
    try {
      let mergedUsers = [];

      // Procesar archivos Excel si están presentes
      if (files.usuariosBogota) {
        const bogotaData = await processExcelFile(files.usuariosBogota, 'Bogotá');
        mergedUsers = [...mergedUsers, ...bogotaData];
      }

      if (files.usuariosBucaramanga) {
        const bucaramangaData = await processExcelFile(files.usuariosBucaramanga, 'Bucaramanga');
        mergedUsers = [...mergedUsers, ...bucaramangaData];
      }

      // Si hay archivos cargados, guardar en localStorage
      if (mergedUsers.length > 0) {
        localStorage.setItem('mergedUsers', JSON.stringify(mergedUsers));
      }

      // Recalcular estadísticas
      calculateStats(filteredData);
      setshowModalupload(false);

    } catch (err) {
      console.error("Error en la carga de archivos:", err);
    }
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

  // Definición de las tarjetas de estadísticas
  const statsCards = [
    {
      title: "Usuarios Totales",
      icon: Users,
      value: stats.totalUsers,
      color: "cyan",
      description: "Total de usuarios únicos"
    },
    {
      title: "Usuarios Registrados",
      icon: MessageSquare,
      value: stats.registeredUsers,
      color: "cyan",
      description: "Usuarios que completaron registro"
    },
    {
      title: "Tasa de Conversión",
      icon: TrendingUp,
      value: `${stats.conversionRate}%`,
      color: "cyan",
      description: "Porcentaje de usuarios registrados"
    },
    {
      title: "Costo Global por Usuario",
      icon: MessageSquare,
      value: `$${stats.costPerUser}`,
      color: "cyan",
      description: "Costo promedio por usuario"
    }
  ];

  // Función para clasificar los usuarios
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
          <h2 className="text-3xl font-bold text-cyan-400 mb-4 lg:mb-0">
            Informe de Conversión Iza ChatBot
          </h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-400 mt-2`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400 opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
            />
          </div>
        </div>

        {/* Upload Files Modal */}
        <UploadFilesModal
          showModal={showModalupload}
          onClose={() => setShowModal(false)}
          spentAmount={spentAmount}
          setSpentAmount={setSpentAmount}
          files={files}
          handleFileChange={handleFileChange}
          removeFile={removeFile}
          handleUpload={handleUpload}
        />

        {/* Messages Modal */}
        <UserMessagesModal
          isOpen={showMessagesModal}
          user={selectedUser}
          onClose={handleCloseMessages}
        />
      </div>
    </div>
  );
};