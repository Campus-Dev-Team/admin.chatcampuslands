import React from "react";
import { User } from 'lucide-react';
import AIToggle from "../AIToggle/AIToggle";

const ChatHeader = ({ selectedChat, isAIEnabled, toggleAI }) => {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-slate-700 justify-between">
      <AIToggle isAIEnabled={isAIEnabled} toggleAI={toggleAI} />
      <div className="flex">
        <div className="h-10 w-10 rounded-full bg-cyan-400/20 flex items-center justify-center mx-3">
          <User className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <p className="text-white font-medium">{selectedChat.Username}</p>
          <p className="text-sm text-slate-400">{selectedChat.PhoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;