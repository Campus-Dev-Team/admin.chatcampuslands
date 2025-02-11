import { useEffect, useState } from "react";
import { SendMessageButton } from "./SendMessageButton";
import { UserList } from "./UsersList";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const UserMessagePanel = ({
  selectedUsers,
  selectedTemplate,
  citySelected,
  stateSelected,
  onSendMessages,
  isLoading,
}) => {
  return (
    <Card className="col-span-2 bg-slate-800/50 border-slate-700 h-full">
  <div className="p-3 md:p-4 flex flex-col h-full">
    <div className="flex-1 relative">
      <div 
        className={`absolute inset-0 bg-slate-800/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg transition-all duration-300 ease-in-out ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
          <span className="text-slate-200">Cargando usuarios...</span>
        </div>
      </div>
      <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <UserList
          selectedUsers={selectedUsers}
          selectedTemplate={selectedTemplate}
          stateSelected={stateSelected}
        />
      </div>
    </div>
    <div className="mt-4 md:mt-6 flex-shrink-0">
      <SendMessageButton
        selectedTemplate={selectedTemplate}
        citySelected={citySelected}
        stateSelected={stateSelected}
        usersExist={selectedUsers.length}
        isLoading={isLoading}
        onSendMessages={onSendMessages}
      />
    </div>
  </div>
</Card>
  );
};

export default UserMessagePanel;