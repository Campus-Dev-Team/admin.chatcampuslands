import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import * as XLSX from 'xlsx';

const ExcelUpload = ({ onDataProcessed }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processExcelFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processExcelFile(files[0]);
    }
  };

  const processExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log(data);
      
      onDataProcessed(data);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 flex justify-center items-center h-full mt-5">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
          isDragging ? 'border-cyan-500 bg-slate-700' : 'border-slate-600 hover:border-cyan-500'
        }`}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
          id="excel-upload"
        />
        <label 
          htmlFor="excel-upload" 
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload 
            className={`w-12 h-12 mb-4 ${
              isDragging ? 'text-cyan-500' : 'text-slate-400'
            }`}
          />
          <p className="text-slate-200 text-center px-4">
            {isDragging 
              ? "Suelta el archivo aquí..."
              : "Arrastra y suelta un archivo Excel aquí, o haz clic para seleccionar"
            }
          </p>
        </label>
      </div>
    </Card>
  );
};

export default ExcelUpload;