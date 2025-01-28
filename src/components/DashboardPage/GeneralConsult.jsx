import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp, Upload } from "lucide-react";
import { FiltrosReportes } from './FiltrosReportes';
import * as XLSX from "xlsx";

export const GeneralConsult = () => {
  const [ciudad, setCiudad] = useState("Bucaramanga");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Usar los datos filtrados o el JSON simulado
  const [showModal, setShowModal] = useState(false);
  const [mergedData, setMergedData] = useState([]); // Datos combinados de Excel
  const [costData, setCostData] = useState([]); // Datos del JSON de costos

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      if (type === "excel") {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        processExcelData(jsonData);
      } else if (type === "json") {
        const jsonData = JSON.parse(e.target.result);
        setCostData(jsonData);
      }
    };

    if (type === "excel") {
      reader.readAsArrayBuffer(file);
    } else if (type === "json") {
      reader.readAsText(file);
    }
  };

  const processExcelData = (jsonData) => {
    const updatedData = [...mergedData];

    jsonData.forEach((entry) => {
      const existingIndex = updatedData.findIndex(
        (user) => user.PhoneNumber === entry.PhoneNumber
      );

      if (existingIndex !== -1) {
        // Actualizar datos existentes
        updatedData[existingIndex] = { ...updatedData[existingIndex], ...entry };
      } else {
        // Agregar nuevo usuario
        updatedData.push({ ...entry, ciudad });
      }
    });

    setMergedData(updatedData);
  };

  const tarjetas = [
    { title: "Total Mensajes", icon: MessageSquare, value: "2", color: "cyan" },
    { title: "Usuarios Totales", icon: Users, value: "2", color: "cyan" },
    { title: "Tasa Promedio", icon: TrendingUp, value: "2%", color: "cyan" },
  ];

  const handleDataFetched = (fetchedData) => {
    setFilteredData(fetchedData);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between h-24">
          <h2 className="text-3xl font-bold text-cyan-400 w-full">
            Informe de Conversión Iza ChatBot
          </h2>
          <div className="w-full flex flex-col md:flex-row justify-end items-center">
            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="mt-1 h-fit w-fit bg-slate-800 text-white text-[0.9rem] border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            >
              <option value="Bogotá">Bogotá</option>
              <option value="Bucaramanga">Bucaramanga</option>
            </select>

            <FiltrosReportes onDataFetched={handleDataFetched} />
            <button
              className="ml-4 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-all"
              onClick={() => setShowModal(true)}
            >
              <Upload className="inline w-5 h-5 mr-2" /> Cargar Archivos
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg">
          {tarjetas.map((stat, index) => (
            <Card
              key={index}
              className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className={`text-2xl font-bold text-${stat.color}-400 mt-2`}>{stat.value}</p>
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
                <label className="block text-sm font-medium text-white mb-1">Cargar Excel</label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => handleFileUpload(e, "excel")}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Cargar JSON de Costos</label>
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
