import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit2,
  User,
  Plus,
  Target,
  CreditCard,
  Building2,
  Briefcase,
} from 'lucide-react';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import AddBusinessModal from '../components/employees/AddBusinessModal';
import BusinessCard from '../components/employees/BusinessCard';
import DeleteConfirmModal from '../components/website/DeleteConfirmModal';

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  const [isDeleteBusinessModalOpen, setIsDeleteBusinessModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    fetchEmployee();
    const unsubscribeBusinesses = fetchBusinesses();

    return () => {
      if (unsubscribeBusinesses) unsubscribeBusinesses();
    };
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      const employeeRef = doc(db, 'employees', employeeId);
      const employeeDoc = await getDoc(employeeRef);

      if (employeeDoc.exists()) {
        setEmployee({
          id: employeeDoc.id,
          ...employeeDoc.data(),
        });
      } else {
        console.error('Employee not found');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = () => {
    const q = query(collection(db, 'employeeBusinesses'), where('employeeId', '==', employeeId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const businessesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by createdAt in memory
        businessesData.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.seconds - a.createdAt.seconds;
        });
        setBusinesses(businessesData);
      },
      (error) => {
        console.error('Error fetching businesses:', error);
      }
    );

    return unsubscribe;
  };

  const handleEditBusiness = (business) => {
    setSelectedBusiness(business);
    setIsAddBusinessModalOpen(true);
  };

  const handleDeleteBusiness = (business) => {
    setSelectedBusiness(business);
    setIsDeleteBusinessModalOpen(true);
  };

  const confirmDeleteBusiness = async () => {
    if (selectedBusiness) {
      try {
        await deleteDoc(doc(db, 'employeeBusinesses', selectedBusiness.id));
        setIsDeleteBusinessModalOpen(false);
        setSelectedBusiness(null);
      } catch (error) {
        console.error('Error deleting business:', error);
        alert(`Failed to delete business: ${error.message}`);
      }
    }
  };

  const getFilteredBusinesses = () => {
    const now = new Date();
    let filtered = [...businesses];

    switch (dateFilter) {
      case 'thisMonth': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = businesses.filter((b) => {
          const date = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return date >= startOfMonth;
        });
        break;
      }
      case 'lastMonth': {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        filtered = businesses.filter((b) => {
          const date = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return date >= startOfLastMonth && date <= endOfLastMonth;
        });
        break;
      }
      case 'thisYear': {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        filtered = businesses.filter((b) => {
          const date = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return date >= startOfYear;
        });
        break;
      }
      case 'lastYear': {
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
        filtered = businesses.filter((b) => {
          const date = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return date >= startOfLastYear && date <= endOfLastYear;
        });
        break;
      }
      case 'custom': {
        if (customDateRange.from && customDateRange.to) {
          const fromDate = new Date(customDateRange.from);
          const toDate = new Date(customDateRange.to);
          toDate.setHours(23, 59, 59, 999);
          filtered = businesses.filter((b) => {
            const date = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return date >= fromDate && date <= toDate;
          });
        }
        break;
      }
      default:
        break;
    }

    return filtered;
  };

  const calculateTotalBusiness = () => {
    const filtered = getFilteredBusinesses();
    return filtered.reduce((sum, business) => sum + (business.amount || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Employee Not Found</h2>
        <p className="text-gray-600 mb-4">The employee you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/employees')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Employees
        </button>
      </div>
    );
  }

  const filteredBusinesses = getFilteredBusinesses();
  const totalBusiness = calculateTotalBusiness();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage employee information</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
          Edit Employee
        </button>
      </div>

      {/* Employee Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-white">
              {employee.profilePicUrl ? (
                <img
                  src={employee.profilePicUrl}
                  alt={employee.employeeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{employee.employeeName}</h2>
              <p className="text-primary-100">{employee.role}</p>
              <p className="text-primary-100 text-sm">ID: {employee.employeeId}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'details'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <User className="w-4 h-4" />
              Details
            </button>
            <button
              onClick={() => setActiveTab('target')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'target'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Target className="w-4 h-4" />
              Target ({businesses.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <User className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-base font-medium text-gray-800">{employee.employeeName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Phone className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p className="text-base font-medium text-gray-800">{employee.mobileNumber}</p>
                    </div>
                  </div>

                  {employee.alternateMobileNumber && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Phone className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Alternate Mobile</p>
                        <p className="text-base font-medium text-gray-800">
                          {employee.alternateMobileNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Mail className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-medium text-gray-800">{employee.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-base font-medium text-gray-800">
                        {new Date(employee.dateOfBirth).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-base font-medium text-gray-800">{employee.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="text-base font-medium text-gray-800">{employee.role}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <User className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          employee.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank & Emergency Contact */}
              <div className="space-y-6">
                {/* Bank Account Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <User className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Holder Name</p>
                        <p className="text-base font-medium text-gray-800">
                          {employee.accountHolderName || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="text-base font-medium text-gray-800">
                          {employee.accountNumber || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Building2 className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bank Name</p>
                        <p className="text-base font-medium text-gray-800">
                          {employee.bankName || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">IFSC Code</p>
                        <p className="text-base font-medium text-gray-800">
                          {employee.ifscCode || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <User className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-base font-medium text-gray-800">
                          {employee.emergencyContactName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <User className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Relation</p>
                        <p className="text-base font-medium text-gray-800">
                          {employee.emergencyContactRelation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <Phone className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mobile Number</p>
                        <p className="text-base font-medium text-gray-800">
                          {employee.emergencyContactMobile}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aadhar Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Aadhar Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Aadhar Number</p>
                        <p className="text-base font-medium text-gray-800">{employee.aadharNumber}</p>
                      </div>
                    </div>

                    {employee.aadharFileUrl && (
                      <div>
                        <a
                          href={employee.aadharFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
                        >
                          View Aadhar Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Target Tab */}
          {activeTab === 'target' && (
            <div>
              {/* Filters and Stats */}
              <div className="mb-6 space-y-4">
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDateFilter('all')}
                    className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                      dateFilter === 'all'
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => setDateFilter('thisMonth')}
                    className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                      dateFilter === 'thisMonth'
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => setDateFilter('lastMonth')}
                    className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                      dateFilter === 'lastMonth'
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Last Month
                  </button>
                  <button
                    onClick={() => setDateFilter('thisYear')}
                    className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                      dateFilter === 'thisYear'
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    This Year
                  </button>
                  <button
                    onClick={() => setDateFilter('lastYear')}
                    className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                      dateFilter === 'lastYear'
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Last Year
                  </button>
                  <button
                    onClick={() => setDateFilter('custom')}
                    className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                      dateFilter === 'custom'
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Custom Range
                  </button>
                </div>

                {/* Custom Date Range Inputs */}
                {dateFilter === 'custom' && (
                  <div className="flex gap-4 items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                      <input
                        type="date"
                        value={customDateRange.from}
                        onChange={(e) =>
                          setCustomDateRange({ ...customDateRange, from: e.target.value })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                      <input
                        type="date"
                        value={customDateRange.to}
                        onChange={(e) =>
                          setCustomDateRange({ ...customDateRange, to: e.target.value })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}

                {/* Total Business Card */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Total Business</p>
                      <p className="text-3xl font-bold">{formatCurrency(totalBusiness)}</p>
                      <p className="text-green-100 text-sm mt-1">
                        {filteredBusinesses.length} transaction{filteredBusinesses.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-full">
                      <Target className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Business Button */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Business List</h3>
                <button
                  onClick={() => {
                    setSelectedBusiness(null);
                    setIsAddBusinessModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Business
                </button>
              </div>

              {/* Business List */}
              {filteredBusinesses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No businesses found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {dateFilter === 'all' 
                      ? 'Add your first business to get started' 
                      : 'Try adjusting your filter criteria'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBusinesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      business={business}
                      onEdit={handleEditBusiness}
                      onDelete={handleDeleteBusiness}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={employee}
      />

      <AddBusinessModal
        isOpen={isAddBusinessModalOpen}
        onClose={() => {
          setIsAddBusinessModalOpen(false);
          setSelectedBusiness(null);
        }}
        employeeId={employeeId}
        business={selectedBusiness}
      />

      <DeleteConfirmModal
        isOpen={isDeleteBusinessModalOpen}
        onClose={() => {
          setIsDeleteBusinessModalOpen(false);
          setSelectedBusiness(null);
        }}
        onConfirm={confirmDeleteBusiness}
        title="Delete Business"
        message={`Are you sure you want to delete "${selectedBusiness?.businessName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default EmployeeDetail;
