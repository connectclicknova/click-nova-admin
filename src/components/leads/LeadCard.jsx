import { Edit2, Trash2, Phone, MapPin, Calendar, Clock, SquarePen } from 'lucide-react';

const LeadCard = ({ lead, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-700',
      'Followup': 'bg-yellow-100 text-yellow-700',
      'Not Reachable': 'bg-red-100 text-red-700',
      'Contacted': 'bg-green-100 text-green-700',
      'Details send in Whatsapp': 'bg-purple-100 text-purple-700',
      'More Changes to be Customer': 'bg-orange-100 text-orange-700',
      'Confirmed': 'bg-teal-100 text-teal-700',
      'Customer': 'bg-primary-100 text-primary-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {lead.customerName || lead.name}
          </h3>
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
            {lead.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(lead)}
            className="p-2 text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(lead)}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{lead.mobileNumber || lead.phone}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5" />
          <span className="line-clamp-2">{lead.address}</span>
        </div>
      </div>

      {/* Requirement */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Requirement</p>
        <p className="text-sm font-medium text-gray-700">{lead.requirement}</p>
      </div>

      {/* Followup Info */}
      {(lead.followupDate || lead.followupTime) && (
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {lead.followupDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(lead.followupDate).toLocaleDateString()}</span>
            </div>
          )}
          {lead.followupTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{lead.followupTime}</span>
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      {lead.comments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Comments</p>
          <p className="text-sm text-gray-600 line-clamp-2">{lead.comments}</p>
        </div>
      )}
    </div>
  );
};

export default LeadCard;

