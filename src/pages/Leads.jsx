import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import AddLeadModal from '../components/leads/AddLeadModal';
import LeadCard from '../components/leads/LeadCard';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [requirementFilter, setRequirementFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  const statusOptions = [
    'All',
    'New',
    'Followup',
    'Not Reachable',
    'Contacted',
    'Details send in Whatsapp',
    'More Changes to be Customer',
    'Confirmed',
    'Customer',
  ];

  const serviceOptions = [
    'All',
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Digital Marketing',
    'SEO Services',
    'Cloud Solutions',
    'Consulting',
    'Other',
  ];

  // Fetch leads from Firestore
  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching leads:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter leads based on search and filters
  useEffect(() => {
    let result = [...leads];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (lead) =>
          lead.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.mobileNumber?.includes(searchTerm) ||
          lead.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    // Requirement filter
    if (requirementFilter !== 'All') {
      result = result.filter((lead) => lead.requirement === requirementFilter);
    }

    setFilteredLeads(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [leads, searchTerm, statusFilter, requirementFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (lead) => {
    if (window.confirm(`Are you sure you want to delete lead for ${lead.customerName}?`)) {
      try {
        await deleteDoc(doc(db, 'leads', lead.id));
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Error deleting lead. Please try again.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleSuccess = () => {
    // Data is updated via real-time listener
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Leads Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage and track all your leads
          </p>
        </div>
        <button
          onClick={handleAddLead}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
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

          {/* Status Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Requirement Filter */}
          <div>
            <select
              value={requirementFilter}
              onChange={(e) => setRequirementFilter(e.target.value)}
              className="w-full px-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            >
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service === 'All' ? 'All Services' : service}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing {currentLeads.length} of {filteredLeads.length} leads
            {(searchTerm || statusFilter !== 'All' || requirementFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setRequirementFilter('All');
                }}
                className="ml-2 text-primary-500 hover:text-primary-600 font-medium cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Leads Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="inline-block w-12 h-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600 font-medium">Loading leads...</p>
        </div>
      ) : currentLeads.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {currentLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No leads found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'All' || requirementFilter !== 'All'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first lead'}
          </p>
          {!searchTerm && statusFilter === 'All' && requirementFilter === 'All' && (
            <button
              onClick={handleAddLead}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors cursor-pointer"
            >
              Add Your First Lead
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Lead Modal */}
      <AddLeadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        lead={selectedLead}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Leads;

