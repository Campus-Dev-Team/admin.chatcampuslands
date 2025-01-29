import { MessageAdminPage } from '../components/DashboardPage/MessageAdminPage';
import { DashboardHeader } from '../components/DashboardPage/DashboardHeader';
import { DashboardNavbar } from '../components/DashboardPage/DashboardNavbar';
import { ChatProvider } from '../context/ChatContext';

export const MessageAdminPage = () => {
  return (
    <ChatProvider>
      <div className="h-screen flex flex-col lg:flex-row overflow-y-scroll lg:overflow-x-hidden bg-slate-900">
        <DashboardNavbar />
        <div className="flex-1 flex flex-col min-h-0">
          <DashboardHeader />
          <MessageAdminPage />
        </div>
      </div>
    </ChatProvider>
  );
};