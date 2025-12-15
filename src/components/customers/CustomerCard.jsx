import { SquarePen, Trash2, Phone, MapPin, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/customers/${customer.id}`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {customer.customerName}
          </h3>
          {customer.businessName && (
            <p className="text-sm text-gray-600 mb-2">{customer.businessName}</p>
          )}
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-600">
            Customer
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleView}
            className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors cursor-pointer"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(customer)}
            className="p-2 text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(customer)}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{customer.mobileNumber}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5" />
          <span className="line-clamp-2">{customer.address}</span>
        </div>
      </div>

      {/* Created Date */}
      {customer.createdAt && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Added on {new Date(customer.createdAt.seconds * 1000).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerCard;
