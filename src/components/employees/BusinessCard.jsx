import { SquarePen, Trash2, Calendar, IndianRupee } from 'lucide-react';

const BusinessCard = ({ business, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {business.businessName}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <IndianRupee className="w-4 h-4" />
              <span className="font-semibold text-sm">
                {formatCurrency(business.amount)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(business)}
            className="p-2 text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(business)}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date */}
      {business.createdAt && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Added on {formatDate(business.createdAt)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCard;
