import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';

const ChatList = ({ chats, selectedChat, setSelectedChat }) => {

  console.log(chats);

  return (
    <Card className="bg-slate-800/50 h-[80.3vh] border-slate-700 backdrop-blur-sm overflow-x-clip overflow-y-scroll scrollbar-custom">
      <CardContent className="p-6 pr-2">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Chats</h3>
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.userId}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 rounded-lg cursor-pointer ${
                selectedChat?.userId === chat.userId
                  ? "bg-cyan-400/10"
                  : "bg-slate-700/50 hover:bg-slate-700/70"
              } transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-cyan-400/20 flex items-center justify-center">
                  <User className="w-5 h-5 min-w-[40px] text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{chat.username}</p>
                  <p className="text-white font-thin text-sm">
                    +{chat.phone}
                  </p>
                  <p className="text-white font-thin text-sm">
                    #{chat.userId}
                  </p>
                
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatList;