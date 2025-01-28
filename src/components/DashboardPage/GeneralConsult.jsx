import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp, Upload, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import _ from 'lodash';
import { FiltrosReportes } from './FiltrosReportes';

export const GeneralConsult = () => {
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [filteredData, setFilteredData] = useState([]); 
  const [mergedData, setMergedData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    registeredUsers: 0,
    conversionRate: 0,
  });

  // Función para guardar archivo JSON
  const saveJsonFile = async (data, filename) => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const response = await window.fs.writeFile(`src/components/json-exels/${filename}`, blob);
      console.log('Archivo JSON guardado:', filename);
    } catch (err) {
      console.error('Error guardando archivo JSON:', err);
      setError(`Error guardando archivo: ${err.message}`);
    }
  };

  // Función para procesar archivos Excel
  const handleFileUpload = async (event, type) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          if (type === "excel") {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { 
              type: "array",
              cellDates: true,
              dateNF: 'yyyy-mm-dd'
            });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            await processExcelData(jsonData);
          } else if (type === "json") {
            const jsonData = JSON.parse(e.target.result);
            await processCostData(jsonData);
          }
          setError("");
        } catch (err) {
          setError(`Error procesando archivo: ${err.message}`);
        }
      };

      if (type === "excel") {
        reader.readAsArrayBuffer(file);
      } else if (type === "json") {
        reader.readAsText(file);
      }
    } catch (err) {
      setError(`Error cargando archivo: ${err.message}`);
    }
  };

  // Función para procesar datos de Excel
  const processExcelData = async (jsonData) => {
    const updatedData = [...mergedData];
    
    jsonData.forEach((entry) => {
      if (!entry.PhoneNumber) return;

      const existingIndex = updatedData.findIndex(
        (user) => user.PhoneNumber === entry.PhoneNumber
      );

      if (existingIndex !== -1) {
        updatedData[existingIndex] = { 
          ...updatedData[existingIndex], 
          ...entry,
          lastUpdate: new Date()
        };
      } else {
        updatedData.push({ 
          ...entry, 
          ciudad,
          lastUpdate: new Date()
        });
      }
    });

    setMergedData(updatedData);
    await saveJsonFile(updatedData, `estudiantes_${ciudad.toLowerCase()}.json`);
  };

  // Función para procesar datos de costos
  const processCostData = async (data) => {
    if (data && data.data) {
      const processedData = data.data.map(item => ({
        ...item,
        date: new Date(item.date),
        totalCost: parseFloat(item.cost_in_major)
      }));
      setCostData(processedData);
      await saveJsonFile(data, 'costos.json');
    }
  };

  // Función que maneja los datos recibidos de FiltrosReportes
  const handleDataFetched = (data) => {
    if (Array.isArray(data)) {
      const cityData = data.filter(user => !ciudad || user.city === ciudad);
      setFilteredData(cityData);
    }
  };

  // Cálculo de estadísticas
  const calculateStats = () => {
    if (!filteredData.length) return;

    // Filtrar por ciudad
    const cityFilteredData = filteredData.filter(
      user => !ciudad || user.city === ciudad
    );

    const totalUsers = cityFilteredData.length;

    // Calcular usuarios registrados comparando números de teléfono
    const registeredUsers = cityFilteredData.filter((user) =>
      mergedData.some((data) => String(data.PhoneNumber) === String(user.PhoneNumber))
    ).length;

    setStats({
      totalUsers,
      registeredUsers,
      conversionRate: totalUsers > 0 ? ((registeredUsers / totalUsers) * 100).toFixed(2) : 0
    });
  };

  // Efecto para recalcular estadísticas
  useEffect(() => {
    calculateStats();
  }, [filteredData, mergedData, ciudad]);

  // Tarjetas de estadísticas
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
      color: "emerald",
      description: "Usuarios que completaron registro"
    },
    { 
      title: "Tasa de Conversión", 
      icon: TrendingUp, 
      value: `${stats.conversionRate}%`,
      color: "blue",
      description: "Porcentaje de usuarios registrados"
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
              <option value="Bogotá">Bogotá</option>
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

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="bg-slate-800 p-6 rounded-lg w-96 space-y-4">
              <h3 className="text-xl font-bold text-cyan-400">Subir Archivos</h3>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Cargar Excel
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => handleFileUpload(e, "excel")}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Cargar JSON de Costos
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileUpload(e, "json")}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>
              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralConsult;