import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AddCareerRequestModal from '../components/career/AddCareerRequestModal';
import CareerRequestCard from '../components/career/CareerRequestCard';

const CareerRequests = () => {
  const [careerRequests, setCareerRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [visitDetailsFilter, setVisitDetailsFilter] = useState('All');
  const [interviewPostponedFilter, setInterviewPostponedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const roleOptions = [
    'All',
    'Web Developer',
    'Mobile App Developer',
    'UI/UX Designer',
    'Digital Marketing Executive',
    'SEO Specialist',
    'Content Writer',
    'Business Analyst',
    'Project Manager',
    'Quality Assurance Engineer',
    'DevOps Engineer',
    'Data Analyst',
    'Graphic Designer',
  ];

  const ratingOptions = ['All', '5', '4', '3', '2', '1'];

  // Fetch career requests from Firestore
  useEffect(() => {
    const q = query(collection(db, 'careerRequests'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCareerRequests(requestsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching career requests:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter requests based on search and filters
  useEffect(() => {
    let result = [...careerRequests];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (request) =>
          request.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.mobileNumber?.includes(searchTerm) ||
          request.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'All') {
      result = result.filter((request) => request.requestedFor === roleFilter);
    }

    // Rating filter
    if (ratingFilter !== 'All') {
      result = result.filter((request) => request.rating === ratingFilter);
    }

    // Visit Details filter
    if (visitDetailsFilter !== 'All') {
      result = result.filter((request) => request.visitDetails === visitDetailsFilter);
    }

    // Interview Postponed filter
    if (interviewPostponedFilter !== 'All') {
      result = result.filter((request) => request.interviewPostponed === interviewPostponedFilter);
    }

    setFilteredRequests(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [careerRequests, searchTerm, roleFilter, ratingFilter, visitDetailsFilter, interviewPostponedFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handleAddRequest = () => {
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = async (request) => {
    if (window.confirm(`Are you sure you want to delete career request for ${request.employeeName}?`)) {
      try {
        await deleteDoc(doc(db, 'careerRequests', request.id));
      } catch (error) {
        console.error('Error deleting career request:', error);
        alert('Error deleting career request. Please try again.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleSuccess = () => {
    // Data is updated via real-time listener
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Career Requests</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage and track all career requests
          </p>
        </div>
        <button
          onClick={handleAddRequest}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Add Career Request</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role === 'All' ? 'All Roles' : role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              {ratingOptions.map((rating) => (
                <option key={rating} value={rating}>
                  {rating === 'All' ? 'All Ratings' : `${rating} Star${rating !== '1' ? 's' : ''}`}
                </option>
              ))}
            </select>
          </div>

          {/* Visit Details Filter */}
          <div>
            <select
              value={visitDetailsFilter}
              onChange={(e) => setVisitDetailsFilter(e.target.value)}
              className="w-full px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              <option value="All">All Visit Details</option>
              <option value="sent">Sent</option>
              <option value="not sent">Not Sent</option>
            </select>
          </div>

          {/* Interview Postponed Filter */}
          <div>
            <select
              value={interviewPostponedFilter}
              onChange={(e) => setInterviewPostponedFilter(e.target.value)}
              className="w-full px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              <option value="All">Interview Status</option>
              <option value="no">Not Postponed</option>
              <option value="yes">Postponed</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing {currentRequests.length} of {filteredRequests.length} career requests
            {(searchTerm || roleFilter !== 'All' || ratingFilter !== 'All' || visitDetailsFilter !== 'All' || interviewPostponedFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('All');
                  setRatingFilter('All');
                  setVisitDetailsFilter('All');
                  setInterviewPostponedFilter('All');
                }}
                className="ml-2 text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Career Requests Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="inline-block w-12 h-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600 font-medium">Loading career requests...</p>
        </div>
      ) : currentRequests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {currentRequests.map((request) => (
              <CareerRequestCard
                key={request.id}
                careerRequest={request}
                onEdit={handleEditRequest}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No career requests found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || roleFilter !== 'All' || ratingFilter !== 'All'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first career request'}
          </p>
          {!searchTerm && roleFilter === 'All' && ratingFilter === 'All' && (
            <button
              onClick={handleAddRequest}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Add Your First Career Request
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Career Request Modal */}
      <AddCareerRequestModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        careerRequest={selectedRequest}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CareerRequests;

