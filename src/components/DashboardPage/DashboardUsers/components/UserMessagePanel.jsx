import { SendMessageButton } from "./SendMessageButton";
import { UserList } from "./UsersList";
import { Card } from "@/components/ui/card";


export const UserMessagePanel = ({ selectedIds, selectedTemplate, onSendMessages }) => {
    return (
      <Card className="col-span-2 bg-slate-800/50 border-slate-700">
        <div className="p-4">
          <div className="mt-6">
            <UserList selectedIds={selectedIds} />
          </div>
          <div className="mt-6">
            <SendMessageButton 
              selectedTemplate={selectedTemplate}
              onSendMessages={onSendMessages}
            />
          </div>
        </div>
      </Card>
    );
  };


  export default UserMessagePanel;