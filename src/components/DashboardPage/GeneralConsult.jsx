import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp, Upload, X } from "lucide-react";
import { FiltrosReportes } from './FiltrosReportes';
import * as XLSX from "xlsx";

export const GeneralConsult = () => {
  // Estados principales
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [showModal, setShowModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [files, setFiles] = useState({
    usuariosBogota: null,
    usuariosBucaramanga: null,
    costos: null
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredUsers: 0,
    conversionRate: 0,
    averageMessagesPerUser: 0
  });

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
      // Validar que todos los archivos estén cargados
      if (!files.usuariosBogota || !files.usuariosBucaramanga || !files.costos) {
        throw new Error('Por favor carga todos los archivos requeridos');
      }

      // Procesar archivos Excel
      const bogotaData = await processExcelFile(files.usuariosBogota, 'Bogotá');
      const bucaramangaData = await processExcelFile(files.usuariosBucaramanga, 'Bucaramanga');

      // Combinar datos de usuarios
      const mergedUsers = [...bogotaData, ...bucaramangaData];

      // Procesar archivo de costos
      const costosReader = new FileReader();
      costosReader.onload = async (e) => {
        try {
          const costosData = JSON.parse(e.target.result);

          // Guardar en localStorage
          localStorage.setItem('mergedUsers', JSON.stringify(mergedUsers));
          localStorage.setItem('costos', JSON.stringify(costosData));

          // Recalcular estadísticas
          calculateStats(filteredData);

          setShowModal(false);
        } catch (err) {
          console.error("Error procesando archivo de costos:", err);
        }
      };

      costosReader.readAsText(files.costos);

    } catch (err) {
      console.error("Error en la carga de archivos:", err);
    }
  };

 
  

  // Función que calcula las estadísticas
  const calculateStats = (data) => {
    if (!Array.isArray(data)) return;

    // Filtrar por ciudad
    const cityFilteredData = data.filter(user => !ciudad || user.city === ciudad);
    console.log('registros de isa para ',ciudad ,cityFilteredData);


    // Obtener datos del localStorage
    const storedData = localStorage.getItem("mergedUsers");
    const registeredUsers = storedData ? JSON.parse(storedData) : [];
    
    // Cálculo de estadísticas
    const totalUsers = cityFilteredData.length;

    // Contar usuarios registrados
    const registeredCount = cityFilteredData.filter(user =>
      registeredUsers.some(regUser => {
        const normalizedStoredPhone = normalizePhoneNumber(regUser.Celular);
        const normalizedUserPhone = normalizePhoneNumber(user.PhoneNumber);
        return normalizedStoredPhone === normalizedUserPhone;
      })
    )
    console.log('usuarios registrados' , registeredCount);

    // Calcular tasa de conversión
    const conversionRate = totalUsers > 0 ? ((registeredCount.length / totalUsers) * 100).toFixed(2) : 0;
        console.log('tasa de comversion', conversionRate);

    // Calcular promedio de mensajes
    const totalMessages = cityFilteredData.reduce((acc, user) => acc + (user.Messages?.length || 0), 0);
    const averageMessages = totalUsers > 0 ? (totalMessages / totalUsers).toFixed(1) : 0;

    // Actualizar estado
    setStats({
      totalUsers,
      registeredUsers: registeredCount.length,
      conversionRate,
      averageMessagesPerUser: averageMessages
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
  }, [ciudad]);

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
      title: "Mensajes Promedio",
      icon: MessageSquare,
      value: stats.averageMessagesPerUser,
      color: "cyan",
      description: "Mensajes por usuario"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-900">
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg w-[32rem] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-cyan-400">Cargar Archivos</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Usuarios Bogotá */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Usuarios Bogotá (Excel)
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileChange(e, 'usuariosBogota')}
                    className="hidden"
                    id="bogotaFile"
                  />
                  <button
                    onClick={() => document.getElementById('bogotaFile').click()}
                    className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {files.usuariosBogota ? files.usuariosBogota.name : 'Seleccionar archivo'}
                  </button>
                  {files.usuariosBogota && (
                    <button
                      onClick={() => removeFile('usuariosBogota')}
                      className="p-2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Usuarios Bucaramanga */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Usuarios Bucaramanga (Excel)
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileChange(e, 'usuariosBucaramanga')}
                    className="hidden"
                    id="bucaramangaFile"
                  />
                  <button
                    onClick={() => document.getElementById('bucaramangaFile').click()}
                    className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {files.usuariosBucaramanga ? files.usuariosBucaramanga.name : 'Seleccionar archivo'}
                  </button>
                  {files.usuariosBucaramanga && (
                    <button
                      onClick={() => removeFile('usuariosBucaramanga')}
                      className="p-2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Archivo de Costos */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Archivo de Costos (JSON)
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleFileChange(e, 'costos')}
                    className="hidden"
                    id="costosFile"
                  />
                  <button
                    onClick={() => document.getElementById('costosFile').click()}
                    className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {files.costos ? files.costos.name : 'Seleccionar archivo'}
                  </button>
                  {files.costos && (
                    <button
                      onClick={() => removeFile('costos')}
                      className="p-2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 text-slate-300 hover:text-white transition-all"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all"
                  onClick={handleUpload}
                >
                  Subir Archivos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};