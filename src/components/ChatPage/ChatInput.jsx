import React, { useState } from "react";
import { SendHorizonal } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { addMessage } from "@/services/messagesService";

export const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const { isInputEnabled } = useChat();

  const handleAddMessage = async () => {
    try {
      const response = await addMessage(message);
      console.log('respuesta al anadir mensaje', response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && isInputEnabled) {
      onSendMessage(message);
      setMessage("");
      handleAddMessage(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-800/30 backdrop-blur-xl border-t border-slate-700/30">
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={!isInputEnabled ? "Por favor, responde las preguntas anteriores..." : "Escribe tú mensaje ..."}
          className="flex-1 bg-slate-800/50 border border-cyan-400/10 rounded-xl
                   px-4 py-2.5 text-white placeholder:text-white/40
                   focus:ring-2 focus:ring-cyan-400/30 
                   focus:border-cyan-400/30 outline-none
                   transition-all duration-200"
          disabled={disabled || !isInputEnabled}
        />
        <button
          type="submit"
          className={`bg-cyan-400 text-slate-900 p-2.5 rounded-xl
                   flex items-center justify-center
                   transition-all duration-200
                   hover:bg-cyan-400/90 hover:scale-105
                   active:scale-95
                   ${disabled || !isInputEnabled ? "opacity-50 cursor-not-allowed" : "hover:bg-cyan-400/90"}`}
          disabled={disabled || !isInputEnabled}
        >
          <SendHorizonal className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
