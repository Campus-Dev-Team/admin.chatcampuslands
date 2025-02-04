import React from "react";

const AIToggle = ({ isAIEnabled, toggleAI }) => {
  return (
    <div className="flex items-center gap-4 order-2">
      <label className="flex order-2 items-center w-[55px] ">
        <input
          type="checkbox"
          checked={isAIEnabled}
          onChange={toggleAI}
          className="opacity-0 absolute w-0 h-0"
        />
        <span
          className={`slider block w-full h-full rounded-full bg-gray-600 transition-all duration-300 ${
            isAIEnabled ? "bg-cyan-500" : "bg-gray-500"
          }`}
        >
          <span
            className={`flex items-center w-[2.4vh] h-[2.4vh] bg-white rounded-full shadow-md transition-all duration-300 transform ${
              isAIEnabled ? "translate-x-8" : "translate-x-0"
            }`}
          ></span>
        </span>
      </label>
      <span className="ml-2 text-white">IZA</span>
    </div>
  );
};

export default AIToggle;