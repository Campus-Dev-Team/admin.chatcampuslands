import React from 'react';

export const ContactPreferenceForm = ({ onSubmit }) => {
  return (
    <div className="bg-slate-700 rounded-2xl p-4">
      <div className="flex space-x-4">
        <button 
          onClick={() => onSubmit('message')}
          className="bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg"
        >
          Mensaje
        </button>
        <button 
          onClick={() => onSubmit('call')}
          className="bg-slate-600 text-white px-4 py-2 rounded-lg"
        >
          Llamada
        </button>
      </div>
    </div>
  );
};