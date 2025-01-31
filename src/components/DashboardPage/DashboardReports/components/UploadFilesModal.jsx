import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';

export const UploadFilesModal = ({
    showModal,
    onClose,
    spentAmount,
    setSpentAmount,
    onUploadSuccess,
    calculateStats,
    filteredData
}) => {
    const [files, setFiles] = useState({
        usuariosBogota: null,
        usuariosBucaramanga: null
    });
    const [displayAmount, setDisplayAmount] = useState('');


    if (!showModal) return null;

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

    const handleSpentAmountChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        setSpentAmount(Number(rawValue));
        localStorage.setItem('spentAmount', rawValue);

        const formatter = new Intl.NumberFormat('es-CO');
        setDisplayAmount(rawValue ? formatter.format(rawValue) : '');
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

            // Guardar el spentAmount en localStorage
            localStorage.setItem('spentAmount', spentAmount.toString());

            // Recalcular estadísticas y notificar al padre
            calculateStats(filteredData);
            onClose();
            onUploadSuccess?.();

        } catch (err) {
            console.error("Error en la carga de archivos:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg w-[32rem] space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-cyan-400">Cargar Archivos y Gastos</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Input para el gasto total */}
                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Gasto Total ($)
                    </label>
                    <input
                        type="text"
                        value={displayAmount}
                        onChange={handleSpentAmountChange}
                        className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="Ingrese el monto gastado"
                    />
                </div>

                {/* Usuarios Bogotá */}
                <div>
                    <label className="block text-sm font-medium text-white mb-1">
                        Usuarios Bogotá (Excel) - Opcional
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
                        Usuarios Bucaramanga (Excel) - Opcional
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

                <div className="flex justify-end gap-2 pt-4">
                    <button
                        className="px-4 py-2 text-slate-300 hover:text-white transition-all"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-all"
                        onClick={handleUpload}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};