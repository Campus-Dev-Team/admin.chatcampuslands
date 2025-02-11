import { useEffect, useState } from "react";
import { SendMessageButton } from "./SendMessageButton";
import { UserList } from "./UsersList";
import { Card } from "@/components/ui/card";

export const UserMessagePanel = ({
  selectedUsers,
  selectedTemplate,
  citySelected, 
  stateSelected,
  onSendMessages,
}) => {

  useEffect(() => {
    //console.log("lista de usuarios:", selectedUsers);
  }, [selectedUsers]); 

  return (
    <Card className="col-span-2 bg-slate-800/50 border-slate-700">
      <div className="p-4">
        <div className="mt-6">
          <UserList selectedUsers={selectedUsers} />
        </div>
        <div className="mt-6">
          <SendMessageButton
            selectedTemplate={selectedTemplate}
            citySelected={citySelected}
            stateSelected={stateSelected}
            onSendMessages={onSendMessages}
          />
        </div>
      </div>
    </Card>
  );
};

export default UserMessagePanel;
