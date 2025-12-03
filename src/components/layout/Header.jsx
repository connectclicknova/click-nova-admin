import { LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const pageName = location.pathname.slice(1) || 'dashboard';
  const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-60 right-0 h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-10">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold text-gray-800">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">{user?.email || 'admin@gmail.com'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="ml-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
