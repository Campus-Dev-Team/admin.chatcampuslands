// components/MessageTypes/Avatar.jsx
import React from "react";
import izaCampus from "../../assets/iza-campus.webp";

export const Avatar = ({ isAI }) => {
  return (
    <div className="h-8 w-8 ring-2 ring-cyan-400/20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
      {isAI && (
        <img
          src={izaCampus}
          alt="Iza Campus"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};
