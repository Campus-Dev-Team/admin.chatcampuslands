import React, { useState, useEffect } from "react";
import ChatList from "./components/ChatList/ChatList";
import ChatArea from "./components/ChatArea/ChatArea";
import EmptyChatState from "./components/ChatArea/EmptyChatState";
import { getAllChats } from "@/services/chatsService";
import { getMessagesByChatId } from "@/services/messagesService";
import { updateChatMode } from "@/services/chatsService";

export const MessageAdminPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener lista de chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        const chatsData = await getAllChats();
        setChats(chatsData.data);
      } catch (error) {
        console.error("Error loading chats:", error);
        // Aquí podrías manejar el error (ej. mostrar notificación)
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;

      try {
        const messages = await getMessagesByChatId(selectedChat.id);
        setMessages(messages.data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [selectedChat]);

  const toggleAI = async () => {
    setIsAIEnabled((prevState) => {
      const newState = !prevState;
      console.log("IA", newState ? "Activada" : "Desactivada");
      return newState;
    });

    if (!selectedChat) return;

    try {
      const newMode = isAIEnabled ? "MODO_ADMINISTRADOR" : "MODO_IA";
      const dataToSend = {
        chatMode: newMode,
        chatId: selectedChat.id,
      };

      console.log("Enviando cambio de modo:", dataToSend);
      const response = await updateChatMode(dataToSend);
      console.log("Respuesta del servidor:", response);

      if (!response.ok) {
        throw new Error(`Error al cambiar el modo: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error cambiando el modo de IA:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-slate-900 h-screen flex items-center justify-center">
        <div className="text-cyan-400">Cargando chats...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-slate-900">
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4 lg:mb-0">
            Panel de Mensajes
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
          <div className="lg:col-span-2">
            {selectedChat ? (
              <ChatArea
                selectedChat={selectedChat}
                messages={messages}
                isAIEnabled={isAIEnabled}
                toggleAI={toggleAI}
              />
            ) : (
              <EmptyChatState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
