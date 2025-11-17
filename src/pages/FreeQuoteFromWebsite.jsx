import { useState, useEffect } from 'react';
import { collection, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useToast } from '../context/ToastContext';
import { Edit2, Trash2, Search } from 'lucide-react';

const FreeQuoteFromWebsite = () => {
  const [quotes, setQuotes] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    city: '',
    status: 'new'
  });
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'freequotefromwebsite'), (snapshot) => {
      const quotesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        const dateA = new Date(a.submittedAt?.seconds ? a.submittedAt.seconds * 1000 : a.submittedAt || 0);
        const dateB = new Date(b.submittedAt?.seconds ? b.submittedAt.seconds * 1000 : b.submittedAt || 0);
        return dateB - dateA;
      });
      setQuotes(quotesData);
      setFetchingData(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (quote) => {
    setEditingQuote(quote);
    setFormData({
      name: quote.name,
      mobile: quote.mobile,
      city: quote.city || '',
      status: quote.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      showToast('Name and mobile are required', 'error');
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'freequotefromwebsite', editingQuote.id), formData);
      showToast('Quote request updated successfully', 'success');
      setIsEditModalOpen(false);
      setEditingQuote(null);
      setFormData({ name: '', mobile: '', city: '', status: 'new' });
    } catch (error) {
      showToast('Failed to update quote request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'freequotefromwebsite', id), { status: newStatus });
      showToast('Status updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quote request?')) {
      try {
        await deleteDoc(doc(db, 'freequotefromwebsite', id));
        showToast('Quote request deleted successfully', 'success');
      } catch (error) {
        showToast('Failed to delete quote request', 'error');
      }
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          quote.mobile.includes(searchTerm) ||
                          (quote.city && quote.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Free Quote From Website</h1>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, mobile, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="new">New</option>
          <option value="quoted">Quoted</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredQuotes.length} of {quotes.length} quote requests
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fetchingData ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500">Loading quote requests...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'All' ? 'No quote requests match your search criteria.' : 'No quote requests found.'}
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value)}
                        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full cursor-pointer border-0 outline-none ${
                          quote.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          quote.status === 'quoted' ? 'bg-yellow-100 text-yellow-800' :
                          quote.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="quoted">Quoted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(quote.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(quote)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(quote.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Quote Request</h2>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="quoted">Quoted</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {loading ? 'Updating...' : 'Update Quote'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingQuote(null);
                      setFormData({ name: '', mobile: '', city: '', status: 'new' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeQuoteFromWebsite;
