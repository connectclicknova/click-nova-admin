import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Search, Briefcase, Mail, Phone, MapPin, GraduationCap, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const WebsiteCareerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    const q = query(collection(db, 'careersfromwebsite'), orderBy('submittedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredRequests = requests.filter(request =>
    request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.mobile?.includes(searchTerm) ||
    request.applyingFor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'reviewed': return 'bg-yellow-100 text-yellow-700';
      case 'contacted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Career Requests from Website</h1>
          <p className="text-sm text-gray-500 mt-1">Total: {filteredRequests.length} request(s)</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, position, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <svg className="inline-block w-12 h-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Requests List */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {currentRequests.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Career Requests Found</h3>
              <p className="text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Career requests from the website will appear here'}
              </p>
            </div>
          ) : (
            currentRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">{request.name}</h3>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status || 'new'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-700">{request.applyingFor || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{request.email || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{request.mobile || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{request.city || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{request.qualification || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs">{formatDate(request.submittedAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredRequests.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredRequests.length)}</span> of <span className="font-medium">{filteredRequests.length}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteCareerRequests;

