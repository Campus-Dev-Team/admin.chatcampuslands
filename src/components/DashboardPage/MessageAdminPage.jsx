import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SendHorizonal, MessageSquare, User, ToggleLeft, ToggleRight } from "lucide-react";
import { LazyImage } from "../common/LazyImage";
import isadata2 from "../DashboardPage/isadata.json"; // Importa el JSON de datos de chat

export const MessageAdminPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  // Simula la carga de chats desde el JSON
  useEffect(() => {
    setChats(isadata2);
  }, []);

  // Función para manejar el envío de mensajes
  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Aquí puedes agregar la lógica para enviar el mensaje al backend
    console.log("Mensaje enviado:", message);

    // Limpiar el campo de mensaje
    setMessage("");
  };

  // Función para alternar la IA
  const toggleAI = () => {
    setIsAIEnabled(!isAIEnabled);
    console.log("IA", isAIEnabled ? "Desactivada" : "Activada");
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900">
      <div className="mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4 lg:mb-0">
            Panel de Mensajes
          </h2>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de chats */}
          <Card className="bg-slate-800/50 h-[80.3vh] border-slate-700 backdrop-blur-sm overflow-x-clip overflow-y-scroll scrollbar-custom">
            <CardContent className="p-6 pr-2">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Chats</h3>
              <div className="space-y-4">
                {chats.map((chat) => (
                  <div
                    key={chat.UserId}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-3 rounded-lg cursor-pointer p ${selectedChat?.UserId === chat.UserId
                      ? "bg-cyan-400/10"
                      : "bg-slate-700/50 hover:bg-slate-700/70"
                      } transition-all`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-cyan-400/20 flex items-center justify-center">
                        <User className="w-5 h-5 min-w-[40px] text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{chat.Username}</p>
                        <p className="text-sm text-slate-400">
                          {chat.Messages[chat.Messages.length - 1]?.Message || "No hay mensajes"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Área de chat */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[calc(100vh-12rem)]">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Header del chat */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-700 justify-between">
                    <div className="flex items-center gap-4 order-2">
                      <label className="flex order-2 items-center w-[55px] ">
                        <input
                          type="checkbox"
                          checked={isAIEnabled}
                          onChange={toggleAI}
                          className="opacity-0 absolute w-0 h-0"
                        />
                        <span
                          className={`slider block w-full h-full rounded-full bg-gray-600 transition-all duration-300 ${isAIEnabled ? "bg-cyan-500" : "bg-gray-500"
                            }`}
                        >
                          <span
                            className={`flex items-center w-[2.4vh] h-[2.4vh] bg-white rounded-full shadow-md transition-all duration-300 transform ${isAIEnabled ? "translate-x-8" : "translate-x-0"
                              }`}
                          ></span>
                        </span>
                      </label>
                      <span className="ml-2 text-white">
                        IZA
                      </span>
                    </div>




                    <div className=" flex">
                      <div className="h-10 w-10 rounded-full bg-cyan-400/20 flex items-center justify-center mx-3">
                        <User className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div><p className="text-white font-medium">{selectedChat.Username}</p>
                        <p className="text-sm text-slate-400">
                          {selectedChat.PhoneNumber}
                        </p></div>
                    </div>
                  </div>

                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto scrollbar-custom py-4 space-y-4">
                    {selectedChat.Messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.isAI ? "justify-start" : "justify-end"
                          }`}
                      >
                        <div
                          className={`p-3 rounded-lg ${msg.isAI ? "bg-slate-700/50" : "bg-cyan-400/10"
                            }`}
                        >
                          <p className="text-white">{msg.Message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de mensaje */}
                  <div className="pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-3">
                      <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-cyan-600 text-white p-2.5 rounded-lg hover:bg-cyan-700 transition-all"
                      >
                        <SendHorizonal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // UI de carga cuando no hay chat seleccionado
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};