import { Users, UserCheck, UserCog, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { name: 'Total Leads', value: '0', icon: Users, color: 'bg-blue-500' },
    { name: 'Total Customers', value: '0', icon: UserCheck, color: 'bg-green-500' },
    { name: 'Total Employees', value: '0', icon: UserCog, color: 'bg-purple-500' },
    { name: 'Conversion Rate', value: '0%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome to Click Nova Admin</h2>
        <p className="text-gray-600">
          Manage your digital marketing business efficiently. Track leads, customers, and employees all in one place.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
