import React from "react";
import { LazyImage } from "../../../../common/LazyImage";

const EmptyChatState = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
      <div className="text-center space-y-4">
        <LazyImage
          src="https://cdn-icons-png.flaticon.com/128/1041/1041916.png"
          alt="Iza Campus"
          className="w-32 h-32 mx-auto"
        />
        <p className="text-slate-400">Selecciona un chat para comenzar</p>
      </div>
    </div>
  );
};

export default EmptyChatState;