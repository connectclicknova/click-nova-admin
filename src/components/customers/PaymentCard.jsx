import { Calendar, CreditCard, FileText, SquarePen, Trash2 } from 'lucide-react';

const PaymentCard = ({ payment, onEdit, onDelete }) => {
  const getPaymentMethodColor = (method) => {
    const colors = {
      'Cash': 'bg-green-100 text-green-700',
      'UPI': 'bg-blue-100 text-blue-700',
      'Bank Transfer': 'bg-purple-100 text-purple-700',
      'Card': 'bg-orange-100 text-orange-700',
      'Cheque': 'bg-yellow-100 text-yellow-700',
    };
    return colors[method] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">₹{payment.amount}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentMethodColor(payment.paymentMethod)}`}>
              {payment.paymentMethod}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(payment.createdAt?.seconds * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {payment.instalmentNumber && (
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
              Instalment #{payment.instalmentNumber}
            </span>
          )}
          <button
            onClick={() => onEdit(payment)}
            className="p-1.5 text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(payment)}
            className="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {payment.notes && (
        <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-200">
          <FileText className="w-3 h-3 text-gray-400 mt-0.5" />
          <p className="text-xs text-gray-600">{payment.notes}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentCard;
