import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';
import { format, isToday, isYesterday, differenceInDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const formatLastConnection = (dateString) => {
  if (!dateString) return null;
  
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'ayer';
  } else if (differenceInDays(new Date(), date) < 7) {
    // Capitalizar primera letra del día
    const dayName = format(date, 'EEEE', { locale: es });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  } else {
    return format(date, 'dd/MM/yyyy');
  }
};

const ChatList = ({ chats, selectedChat, setSelectedChat }) => {
  const activeChats = chats.filter(chat => chat.lastConnection);
  return (
    <Card className="bg-slate-800/50 h-[80.3vh] border-slate-700 backdrop-blur-sm overflow-x-clip overflow-y-scroll scrollbar-custom">
      <CardContent className="p-6 pr-2">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4">Chats</h3>
        <div className="space-y-4">
          {activeChats.map((chat) => (
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
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-white font-medium truncate max-w-[70%]">{chat.username}</p>
                    <span className="text-xs text-gray-400">
                      {formatLastConnection(chat.lastConnection)}
                    </span>
                  </div>
                  <p className="font-thin text-sm text-gray-300">
                    +{chat.phone}
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