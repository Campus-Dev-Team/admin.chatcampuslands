import React, { useEffect, useRef } from "react";

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("messages", messages);
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-custom py-4 flex flex-col-reverse space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.messageType === "USER" ? "justify-start" : "justify-end"
          }`}
        >
          <div
            className={`p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
