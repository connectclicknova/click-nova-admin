import { NavLink } from 'react-router-dom';
import { UserCircle, Users, Briefcase, Wrench } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/leads', label: 'Leads', icon: UserCircle },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/employees', label: 'Employees', icon: Briefcase },
    { path: '/services', label: 'Services', icon: Wrench },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200">
      {/* Logo/Brand */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">C</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-800">Click Nova</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider" style={{ fontSize: '10px' }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-2 space-y-0.5 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-normal transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              <span className="text-[13px]">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
