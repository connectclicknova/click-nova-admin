import { Edit, Trash2, Eye, Phone, Mail, MapPin, Briefcase, User } from 'lucide-react';

const EmployeeCard = ({ employee, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Employee Profile */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 overflow-hidden border-4 border-white shadow-lg">
            {employee.profilePicUrl ? (
              <img src={employee.profilePicUrl} alt={employee.employeeName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 truncate">
              {employee.employeeName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-primary-600 mb-2">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium truncate">{employee.role}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">{employee.mobileNumber}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">{employee.email}</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400 mt-0.5" />
            <span className="line-clamp-2">{employee.address}</span>
          </div>
        </div>

        {/* Additional Info */}
        {employee.dateOfBirth && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="text-xs text-gray-500">Date of Birth</div>
            <div className="text-sm font-medium text-gray-700">
              {new Date(employee.dateOfBirth).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(employee)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          
          <button
            onClick={() => onEdit(employee)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={() => onDelete(employee)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
