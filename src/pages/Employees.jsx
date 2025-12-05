import { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import AddEmployeeModal from '../components/employees/AddEmployeeModal';
import EmployeeCard from '../components/employees/EmployeeCard';
import ViewEmployeeModal from '../components/employees/ViewEmployeeModal';
import DeleteConfirmModal from '../components/website/DeleteConfirmModal';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const roleOptions = [
    'All',
    'Manager',
    'Developer',
    'Designer',
    'Sales Executive',
    'Marketing Executive',
    'HR',
    'Accountant',
    'Support Staff',
    'Intern',
    'Other'
  ];

  // Fetch employees from Firebase
  useEffect(() => {
    const q = query(collection(db, 'employees'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const employeeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter employees based on search and filters
  useEffect(() => {
    let result = [...employees];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (employee) =>
          employee.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.mobileNumber?.includes(searchTerm) ||
          employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'All') {
      result = result.filter((employee) => employee.role === roleFilter);
    }

    setFilteredEmployees(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [employees, searchTerm, roleFilter]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsAddModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsAddModalOpen(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedEmployee) {
      try {
        await deleteDoc(doc(db, 'employees', selectedEmployee.id));
        setIsDeleteModalOpen(false);
        setSelectedEmployee(null);
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Employees</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your team members
          </p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role === 'All' ? 'All Roles' : role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing {currentEmployees.length} of {filteredEmployees.length} employees
            {(searchTerm || roleFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('All');
                }}
                className="ml-2 text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Employees Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="inline-block w-12 h-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-500 mt-4">Loading employees...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No employees found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || roleFilter !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first employee'}
          </p>
          {!searchTerm && roleFilter === 'All' && (
            <button
              onClick={handleAddEmployee}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {currentEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteClick}
                onView={handleViewEmployee}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1 sm:gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNumber
                            ? 'bg-primary-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />

      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.employeeName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Employees;

