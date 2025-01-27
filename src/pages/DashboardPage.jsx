import { DashboardHeader } from '../components/DashboardPage/DashboardHeader';
import { DashboardNavbar } from '../components/DashboardPage/DashboardNavbar';
import { Outlet } from 'react-router-dom';

export const DashboardPage = () => {
  return (
      <div className="h-screen flex flex-col lg:flex-row overflow-y-scroll lg:overflow-hidden bg-slate-900">
        <DashboardNavbar />
        <div className="flex-1 flex flex-col min-h-0">
          <DashboardHeader />
          <Outlet />
        </div>
      </div>
  );
};