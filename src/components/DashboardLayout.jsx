import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  UserCog, 
  LogOut, 
  Menu, 
  X,
  Mail,
  Briefcase,
  FileText
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Failed to logout', 'error');
    }
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/dashboard/leads', icon: Users },
    { name: 'Customers', path: '/dashboard/customers', icon: UserCheck },
    { name: 'Employees', path: '/dashboard/employees', icon: UserCog },
    { name: 'Contact From Website', path: '/dashboard/contact-from-website', icon: Mail },
    { name: 'Careers From Website', path: '/dashboard/careers-from-website', icon: Briefcase },
    { name: 'Free Quote From Website', path: '/dashboard/freequote-from-website', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        bg-gray-900 text-white transition-all duration-300 flex flex-col
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 flex items-center justify-between">
          <h1 className={`text-xl font-bold transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
            Click Nova
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition cursor-pointer"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg w-full text-gray-300 hover:bg-red-600 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`font-medium transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Click Nova</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
