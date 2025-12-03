import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="ml-60 mt-20 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
