import { Eye, Edit2, Trash2, Calendar, User, Phone, FileText, IndianRupee } from 'lucide-react';

const QuotationCard = ({ quotation, onView, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-700',
      'Sent': 'bg-blue-100 text-blue-700',
      'Accepted': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Expired': 'bg-orange-100 text-orange-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary-500" />
            <h3 className="text-base font-semibold text-gray-800">
              {quotation.quotationId}
            </h3>
          </div>
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
            {quotation.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onView(quotation)}
            className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(quotation)}
            className="p-2 text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(quotation)}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-2 mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{quotation.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{quotation.customerMobile}</span>
        </div>
      </div>

      {/* Date and Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{formatDate(quotation.quotationDate)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Grand Total</span>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(quotation.grandTotal).replace('₹', '')}
            </span>
          </div>
        </div>
      </div>

      {/* Items Count */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {quotation.items?.length || 0} item(s)
        </p>
      </div>
    </div>
  );
};

export default QuotationCard;
