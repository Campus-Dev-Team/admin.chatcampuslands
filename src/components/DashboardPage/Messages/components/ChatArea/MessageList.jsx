import React, { useEffect, useRef } from "react";

const MessageList = ({ messages }) => {
  // Crea una referencia al contenedor de mensajes
  const messageContainerRef = useRef(null);

  // Desplazar al final cada vez que los mensajes cambien
  useEffect(() => {
    // Verifica si la referencia está definida y realiza el scroll
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]); // Se ejecuta cada vez que cambian los mensajes

  return (
    <div
      ref={messageContainerRef} // Asigna la referencia al contenedor
      className="flex-1 overflow-y-auto scrollbar-custom py-4 flex flex-col-reverse space-y-4"
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.messageType === "USER" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-5
              ${
                msg.messageType === "IA"
                  ? "bg-slate-700/50"
                  : msg.messageType === "ADMIN"
                  ? "bg-green-500/50"
                  : "bg-cyan-600/100"
              }`}
          >
            <p className="text-white break-words">{msg.content}</p>
          </div>
        </div>
      ))}
      <div />
    </div>
  );
};

export default MessageList;
