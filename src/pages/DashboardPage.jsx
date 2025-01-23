import { ChatContainer } from '../components/DashboardPage/ChatContainer';
import { ChatHeader } from '../components/DashboardPage/ChatHeader';
import { ChatNavbar } from '../components/DashboardPage/ChatNavbar';
import { ChatProvider } from '../context/ChatContext';

export const DashboardPage = () => {
  return (
    <ChatProvider>
      <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-slate-900">
        <ChatNavbar />
        <div className="flex-1 flex flex-col min-h-0">
          <ChatHeader />
          <ChatContainer />
        </div>
      </div>
    </ChatProvider>
  );
};