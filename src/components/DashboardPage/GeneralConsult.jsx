import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp, Upload, X, Download } from "lucide-react";
import { FiltrosReportes } from './FiltrosReportes';
import * as XLSX from "xlsx";
import { UploadFilesModal } from './UploadFilesModal';
import { UserMessagesModal } from './UserMessagesModal';



export const GeneralConsult = () => {
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados principales
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [showModal, setShowModal] = useState(false);
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

  // Add handler for opening messages modal
  const handleOpenMessages = (user) => {
    setSelectedUser(user);
    setShowMessagesModal(true);
  };

  // Add handler for closing messages modal
  const handleCloseMessages = () => {
    setSelectedUser(null);
    setShowMessagesModal(false);
  };

  // Función para normalizar números telefónicos
  const normalizePhoneNumber = (phone) => {
    if (!phone) return '';
    const phoneStr = phone.toString();
    return phoneStr.startsWith('57') ? phoneStr.slice(2) : phoneStr;
  };

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

  // Nueva función para exportar a Excel
  const exportToExcel = () => {
    try {
      // Preparar datos de estadísticas generales
      const generalStats = [
        {
          'Métrica': 'Usuarios Totales',
          'Valor': stats.totalUsers,
          'Descripción': 'Total de usuarios únicos'
        },
        {
          'Métrica': 'Usuarios Registrados',
          'Valor': stats.registeredUsers,
          'Descripción': 'Usuarios que completaron registro'
        },
        {
          'Métrica': 'Tasa de Conversión',
          'Valor': `${stats.conversionRate}%`,
          'Descripción': 'Porcentaje de usuarios registrados'
        },
        {
          'Métrica': 'Costo Global por Usuario',
          'Valor': `$${stats.costPerUser}`,
          'Descripción': 'Costo promedio por usuario'
        },
        {
          'Métrica': 'Gasto Total',
          'Valor': `$${spentAmount}`,
          'Descripción': 'Monto total invertido'
        }
      ];

      // Obtener datos de usuarios
      const { registered, unregistered } = getUsersList(filteredData);

      // Preparar datos detallados de usuarios
      const usersData = [...registered, ...unregistered].map(user => ({
        'Estado': registered.includes(user) ? 'Registrado' : 'No Registrado',
        'Usuario': user.Username || '',
        'Teléfono': user.PhoneNumber || '',
        'Ciudad': user.city || '',
        'Cantidad de Mensajes': user.Messages?.length || 0
      }));

      // Crear nuevo libro de Excel
      const workbook = XLSX.utils.book_new();

      // Crear y agregar hoja de estadísticas
      const wsStats = XLSX.utils.json_to_sheet(generalStats);
      XLSX.utils.book_append_sheet(workbook, wsStats, 'Estadísticas Generales');

      // Crear y agregar hoja de usuarios
      const wsUsers = XLSX.utils.json_to_sheet(usersData);
      XLSX.utils.book_append_sheet(workbook, wsUsers, 'Detalle de Usuarios');

      // Ajustar anchos de columna
      const wscols = [
        { wch: 20 }, // Estado/Métrica
        { wch: 30 }, // Usuario/Valor
        { wch: 15 }, // Teléfono
        { wch: 15 }, // Ciudad
        { wch: 20 }  // Mensajes/Descripción
      ];

      wsStats['!cols'] = wscols;
      wsUsers['!cols'] = wscols;

      // Generar nombre del archivo con fecha
      const date = new Date().toISOString().split('T')[0];
      const fileName = `Reporte_ChatBot_${ciudad}_${date}.xlsx`;

      // Guardar archivo
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
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
      setShowModal(false);

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
        const normalizedStoredPhone = normalizePhoneNumber(regUser.Celular);
        const normalizedUserPhone = normalizePhoneNumber(user.PhoneNumber);
        return normalizedStoredPhone === normalizedUserPhone;
      })
    );

    // Calcular total de usuarios registrados en todas las ciudades
    const totalRegisteredUsers = data.filter(user =>
      registeredUsers.some(regUser => {
        const normalizedStoredPhone = normalizePhoneNumber(regUser.Celular);
        const normalizedUserPhone = normalizePhoneNumber(user.PhoneNumber);
        return normalizedStoredPhone === normalizedUserPhone;
      })
    );

    // Calcular tasa de conversión (mantiene el filtro por ciudad)
    const conversionRate = totalUsers > 0 ? ((registeredCount.length / totalUsers) * 100).toFixed(2) : 0;


    // Calcular costo por usuario (usando TODOS los usuarios registrados)
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
        const normalizedStoredPhone = normalizePhoneNumber(regUser.Celular);
        const normalizedUserPhone = normalizePhoneNumber(user.PhoneNumber);
        return normalizedStoredPhone === normalizedUserPhone;
      })
    );

    const unregistered = cityFilteredData.filter(user =>
      !registeredUsers.some(regUser => {
        const normalizedStoredPhone = normalizePhoneNumber(regUser.Celular);
        const normalizedUserPhone = normalizePhoneNumber(user.PhoneNumber);
        return normalizedStoredPhone === normalizedUserPhone;
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

            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Exportar Excel
            </button>

            <button
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all flex items-center gap-2"
              onClick={() => setShowModal(true)}
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-700/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Ciudad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Mensajes
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {/* Usuarios Registrados */}
                  {getUsersList(filteredData).registered.map((user, index) => (
                    <tr key={`registered-${index}`} className="bg-green-900/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Registrado
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.Username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.PhoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.Messages?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        <button
                          onClick={() => handleOpenMessages(user)}
                          className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all"
                        >
                          Ver Mensajes
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Usuarios No Registrados */}
                  {getUsersList(filteredData).unregistered.map((user, index) => (
                    <tr key={`unregistered-${index}`} className="bg-red-900/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          No Registrado
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.Username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.PhoneNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {user.Messages?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        <button
                          onClick={() => handleOpenMessages(user)}
                          className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all"
                        >
                          Ver Mensajes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Upload Files Modal */}
        <UploadFilesModal
          showModal={showModal}
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