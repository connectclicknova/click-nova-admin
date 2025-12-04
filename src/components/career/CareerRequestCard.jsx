import { SquarePen, Trash2, Phone, MapPin, Briefcase, Star, Award } from 'lucide-react';

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
    </div>
  );
};

export default CareerRequestCard;

