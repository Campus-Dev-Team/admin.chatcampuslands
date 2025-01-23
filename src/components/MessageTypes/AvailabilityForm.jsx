import React from "react";
import { useChat } from "@/context/ChatContext";
import { addAvailability } from "@/services/userService";

export const AvailabilityForm = ({ message }) => {
  const { submitAvailability } = useChat();

  const handleSubmit = async () => {
    let availability = "";

    if (submitAvailability === true) {
      availability = "si";
    } else {
      availability = "no";
    }

    try {
      const datosAvailability = { availability: availability };
      console.log("disponibilidad a enviar", datosAvailability);
      const response = await addAvailability(datosAvailability);
      console.log("disponibilidad enviada", response);
      return response;
    } catch (error) {
      console.error("error al registrar la disponibilidad", error);
    }
  };

  return (
    <div className="bg-slate-700/50 rounded-2xl p-4">
      <p className="text-white/90 mb-4">{message.message}</p>
      <div className="flex gap-4">
        <button
          onClick={() => {
            submitAvailability(true);
            handleSubmit();
          }}
          className="flex-1 bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg
                     hover:bg-cyan-400/90 transition-colors"
        >
          Sí, tengo disponibilidad
        </button>
        <button
          onClick={() => {
            submitAvailability(false);
            handleSubmit();
          }}
          className="flex-1 bg-slate-600 text-white px-4 py-2 rounded-lg
                     hover:bg-slate-500 transition-colors"
        >
          No tengo disponibilidad
        </button>
      </div>
    </div>
  );
};
