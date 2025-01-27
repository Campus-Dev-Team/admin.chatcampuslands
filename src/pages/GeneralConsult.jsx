import { GeneralConsult } from '../components/DashboardPage/GeneralConsult';
import { DashboardHeader } from '../components/DashboardPage/DashboardHeader';
import { DashboardNavbar } from '../components/DashboardPage/DashboardNavbar';
import { ChatProvider } from '../context/ChatContext';

export const GeneralConsult = () => {
  return (
    <ChatProvider>
      <div className="h-screen flex flex-col lg:flex-row overflow-x-hidden bg-slate-900">
        <DashboardNavbar />
        <div className="flex-1 flex flex-col min-h-0">
          <DashboardHeader />
          <GeneralConsult />
        </div>
      </div>
    </ChatProvider>
  );
};