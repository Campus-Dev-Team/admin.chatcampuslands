import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-custom py-4 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`p-3 rounded-lg ${
              msg.isAI ? "bg-slate-700/50" : "bg-cyan-400/10"
            }`}
          >
            <p className="text-white">{msg.Message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;