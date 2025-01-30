import React, { useState, useEffect } from "react";
import ChatList from "./components/ChatList/ChatList";
import ChatArea from "./components/ChatArea/ChatArea";
import EmptyChatState from "./components/ChatArea/EmptyChatState";
import { chatService } from "@/services/chatService";

export const MessageAdminPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener lista de chats
  useEffect(() => {
    const loadChats = async () => {
      try {
        const chatsData = await chatService.getChats();
        setChats(chatsData);
      } catch (error) {
        console.error("Error loading chats:", error);
        // Aquí podrías manejar el error (ej. mostrar notificación)
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  // Obtener mensajes cuando se selecciona un chat
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;

      try {
        const messages = await chatService.getChatMessages(selectedChat.UserId);
        setChats(prevChats => prevChats.map(chat =>
          chat.UserId === selectedChat.UserId
            ? { ...chat, Messages: messages }
            : chat
        ));
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [selectedChat]);

  const toggleAI = () => {
    setIsAIEnabled(!isAIEnabled);
    console.log("IA", isAIEnabled ? "Desactivada" : "Activada");
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