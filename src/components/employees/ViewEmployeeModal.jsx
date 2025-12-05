import { X, User, Phone, Mail, MapPin, Briefcase, Calendar, Users, CreditCard, FileText } from 'lucide-react';

const ViewEmployeeModal = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Employee Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-lg">
              {employee.profilePicUrl ? (
                <img src={employee.profilePicUrl} alt={employee.employeeName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{employee.employeeName}</h3>
            <p className="text-primary-600 font-medium">{employee.role}</p>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Mobile Number</span>
                </div>
                <p className="text-gray-800 font-medium">{employee.mobileNumber}</p>
              </div>

              {employee.alternateMobileNumber && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Alternate Mobile</span>
                  </div>
                  <p className="text-gray-800 font-medium">{employee.alternateMobileNumber}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-gray-800 font-medium break-all">{employee.email}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Date of Birth</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {new Date(employee.dateOfBirth).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Role</span>
                </div>
                <p className="text-gray-800 font-medium">{employee.role}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Address</span>
                </div>
                <p className="text-gray-800 font-medium">{employee.address}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Relation</div>
                <p className="text-gray-800 font-medium">{employee.emergencyContactRelation}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Name</div>
                <p className="text-gray-800 font-medium">{employee.emergencyContactName}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Mobile</span>
                </div>
                <p className="text-gray-800 font-medium">{employee.emergencyContactMobile}</p>
              </div>
            </div>
          </div>

          {/* Aadhar Details */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" />
              Aadhar Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Aadhar Number</div>
                <p className="text-gray-800 font-medium">{employee.aadharNumber}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Aadhar Card</span>
                </div>
                {employee.aadharFileUrl ? (
                  <a
                    href={employee.aadharFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1"
                  >
                    View Document
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <p className="text-gray-500">No file uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(employee.createdAt || employee.updatedAt) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {employee.createdAt && (
                  <div>
                    <span className="text-gray-600">Created: </span>
                    <span className="text-gray-800 font-medium">
                      {new Date(employee.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                {employee.updatedAt && (
                  <div>
                    <span className="text-gray-600">Last Updated: </span>
                    <span className="text-gray-800 font-medium">
                      {new Date(employee.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeModal;
