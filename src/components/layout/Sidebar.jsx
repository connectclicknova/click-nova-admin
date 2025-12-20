import { NavLink } from 'react-router-dom';
import { UserCircle, Users, Briefcase, Wrench, X, ClipboardList, Globe, MessageSquare, GraduationCap, FileText } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/leads', label: 'Leads', icon: UserCircle },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/quotations', label: 'Quotations', icon: FileText },
    { path: '/employees', label: 'Employees', icon: Briefcase },
    { path: '/services', label: 'Services', icon: Wrench },
    { path: '/career-requests', label: 'Career Requests', icon: ClipboardList },
    { path: '/website-career-requests', label: 'Career Request from Website', icon: Globe },
    { path: '/website-contact-requests', label: 'Contact Request from Website', icon: MessageSquare },
    { path: '/website-training-requests', label: 'Training Request from Website', icon: GraduationCap },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo/Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">C</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-800">Click Nova</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider" style={{ fontSize: '10px' }}>Admin Panel</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-2 space-y-0.5 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-normal transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
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
    </>
  );
};

export default Sidebar;

