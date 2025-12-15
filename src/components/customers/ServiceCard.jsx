import { Package, IndianRupee, SquarePen, Trash2 } from 'lucide-react';

const ServiceCard = ({ service, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Package className="w-5 h-5 text-primary-500" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{service.serviceName}</h4>
            <p className="text-xs text-gray-500">
              Added on {new Date(service.createdAt?.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(service)}
            className="p-1.5 text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(service)}
            className="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <IndianRupee className="w-4 h-4 text-gray-500" />
        <div>
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-lg font-semibold text-gray-800">₹{service.totalAmount || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
