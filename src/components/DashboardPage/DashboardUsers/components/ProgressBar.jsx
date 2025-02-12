import React from 'react';

const ProgressBar = ({ progress, total, completed, failed }) => {
  const percentage = Math.round((progress / total) * 100);
  
  return (
    <div className="w-[70%]">
      <div className="flex justify-between mb-1 text-sm text-slate-300">
        <span>Progreso del envío</span>
        <span>{`${progress} de ${total} (${percentage}%)`}</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <span className="text-green-400">{completed} enviados</span>
        <span className="text-red-400">{failed} fallidos</span>
      </div>
    </div>
  );
};

export default ProgressBar;