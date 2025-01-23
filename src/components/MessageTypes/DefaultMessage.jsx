// components/MessageTypes/DefaultMessage.jsx
import React from 'react';

export const DefaultMessage = ({ message }) => {
  return (
    <div className={`rounded-2xl p-4 ${
      message.isAI 
        ? 'bg-slate-700 rounded-tl-none' 
        : 'bg-cyan-400/10 rounded-tr-none'
    }`}>
      <p className="text-white/90 break-words">{message.message}</p>
    </div>
  );
};