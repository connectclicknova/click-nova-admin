import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AddQuotationModal from '../components/quotations/AddQuotationModal';
import QuotationCard from '../components/quotations/QuotationCard';
import ViewQuotationModal from '../components/quotations/ViewQuotationModal';
import DeleteConfirmModal from '../components/website/DeleteConfirmModal';

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const statusOptions = ['All', 'Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

  // Fetch quotations from Firestore
  useEffect(() => {
    const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const quotationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuotations(quotationsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching quotations:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter quotations based on search and filters
  useEffect(() => {
    let result = [...quotations];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (quotation) =>
          quotation.quotationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quotation.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quotation.customerMobile?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((quotation) => quotation.status === statusFilter);
    }

    setFilteredQuotations(result);
    setCurrentPage(1);
  }, [quotations, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuotations = filteredQuotations.slice(startIndex, endIndex);

  const handleAddQuotation = () => {
    setSelectedQuotation(null);
    setIsModalOpen(true);
  };

  const handleViewQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setIsViewModalOpen(true);
  };

  const handleEditQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  const handleDeleteQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedQuotation) {
      try {
        await deleteDoc(doc(db, 'quotations', selectedQuotation.id));
        setIsDeleteModalOpen(false);
        setSelectedQuotation(null);
      } catch (error) {
        console.error('Error deleting quotation:', error);
        alert('Failed to delete quotation. Please try again.');
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quotations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your quotations ({filteredQuotations.length})
          </p>
        </div>
        <button
          onClick={handleAddQuotation}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create Quotation
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by quotation ID, customer name, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {currentQuotations.length} of {filteredQuotations.length} quotations
            {statusFilter !== 'All' && ` • Filtered by: ${statusFilter}`}
          </p>
        </div>
      </div>

      {/* Quotations Grid */}
      {currentQuotations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No quotations found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by creating your first quotation'}
          </p>
          {!searchTerm && statusFilter === 'All' && (
            <button
              onClick={handleAddQuotation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Create Quotation
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentQuotations.map((quotation) => (
              <QuotationCard
                key={quotation.id}
                quotation={quotation}
                onView={handleViewQuotation}
                onEdit={handleEditQuotation}
                onDelete={handleDeleteQuotation}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg cursor-pointer ${
                          currentPage === pageNumber
                            ? 'bg-primary-500 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <AddQuotationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuotation(null);
          }}
          quotation={selectedQuotation}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <ViewQuotationModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedQuotation(null);
          }}
          quotation={selectedQuotation}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedQuotation(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Quotation"
          message={`Are you sure you want to delete quotation ${selectedQuotation?.quotationId}? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Quotations;
