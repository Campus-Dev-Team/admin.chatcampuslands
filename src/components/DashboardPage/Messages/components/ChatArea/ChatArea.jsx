import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";


const ChatArea = ({ selectedChat, messages, isAIEnabled, toggleAI }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log("Mensaje enviado:", message);
    setMessage("");
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[calc(100vh-12rem)]">
      <CardContent className="p-6 flex flex-col h-full">
        <ChatHeader
          selectedChat={selectedChat}
          isAIEnabled={isAIEnabled}
          toggleAI={toggleAI}
        />
        <MessageList messages={messages} />
        <MessageInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
      </CardContent>
    </Card>
  );
};

export default ChatArea;
