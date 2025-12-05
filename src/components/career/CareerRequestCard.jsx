import { SquarePen, Trash2, Phone, MapPin, Briefcase, Star, Award, CalendarClock, FileCheck } from 'lucide-react';

const CareerRequestCard = ({ careerRequest, onEdit, onDelete }) => {
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const numRating = parseInt(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i < numRating ? 'fill-yellow-500 text-yellow-500' : 'fill-gray-200 text-gray-300'}`}
        />
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            {careerRequest.employeeName}
          </h3>
          {careerRequest.requestedFor && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-600">
              {careerRequest.requestedFor}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(careerRequest)}
            className="p-2 text-gray-600 hover:bg-primary-50 hover:text-primary-500 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <SquarePen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(careerRequest)}
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
          <span>{careerRequest.mobileNumber}</span>
        </div>
        {careerRequest.address && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5" />
            <span className="line-clamp-2">{careerRequest.address}</span>
          </div>
        )}
      </div>

      {/* Experience and Rating */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {careerRequest.experience ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Award className="w-4 h-4" />
            <span>{careerRequest.experience}</span>
          </div>
        ) : (
          <div></div>
        )}
        {careerRequest.rating && renderStars(careerRequest.rating)}
      </div>

      {/* Additional Details */}
      {(careerRequest.visitDetails || careerRequest.interviewDateTime || careerRequest.interviewPostponed) && (
        <div className="space-y-2 pt-3 border-t border-gray-100 mt-3">
          {careerRequest.visitDetails && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileCheck className="w-4 h-4" />
              <span className="text-xs">Visit Details: <span className={`font-medium ${careerRequest.visitDetails === 'sent' ? 'text-green-600' : 'text-orange-600'}`}>{careerRequest.visitDetails === 'sent' ? 'Sent' : 'Not Sent'}</span></span>
            </div>
          )}
          {careerRequest.interviewDateTime && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarClock className="w-4 h-4" />
              <span className="text-xs">{new Date(careerRequest.interviewDateTime).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
          {careerRequest.interviewPostponed && careerRequest.interviewPostponed === 'yes' && (
            <div className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
              Interview Postponed
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerRequestCard;

