import React from "react";
import { SendHorizonal } from 'lucide-react';

const MessageInput = ({ message, setMessage, handleSendMessage }) => {
  return (
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
  );
};

export default MessageInput;