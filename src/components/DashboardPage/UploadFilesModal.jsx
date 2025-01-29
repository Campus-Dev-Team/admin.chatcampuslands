import React from 'react';
import { Upload, X } from 'lucide-react';

export const UploadFilesModal = ({
    showModal,
    onClose,
    spentAmount,
    setSpentAmount,
    files,
    handleFileChange,
    removeFile,
    handleUpload
}) => {
    if (!showModal) return null;

    const handleSpentAmountChange = (e) => {
        const value = e.target.value;
        setSpentAmount(value === '' ? '' : Number(value));
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
                        type="number"
                        value={spentAmount === 0 ? '' : spentAmount}
                        onChange={handleSpentAmountChange}
                        className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="Ingrese el monto gastado"
                    />
                </div>

                {/* Resto del código permanece igual */}
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