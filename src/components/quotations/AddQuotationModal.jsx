import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AddQuotationModal = ({ isOpen, onClose, quotation = null }) => {
  const [formData, setFormData] = useState({
    quotationId: '',
    quotationDate: '',
    customerName: '',
    customerMobile: '',
    customerAddress: '',
    status: 'Draft',
    items: [],
    termsAndConditions: [],
    notes: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quotation) {
      setFormData({
        quotationId: quotation.quotationId || '',
        quotationDate: quotation.quotationDate ? 
          (quotation.quotationDate.toDate ? quotation.quotationDate.toDate().toISOString().split('T')[0] : quotation.quotationDate) 
          : '',
        customerName: quotation.customerName || '',
        customerMobile: quotation.customerMobile || '',
        customerAddress: quotation.customerAddress || '',
        status: quotation.status || 'Draft',
        items: quotation.items || [],
        termsAndConditions: quotation.termsAndConditions || [],
        notes: quotation.notes || [],
      });
    } else {
      // Generate quotation ID
      const today = new Date();
      const quotationId = `CNQT${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(Date.now()).slice(-4)}`;
      setFormData({
        quotationId,
        quotationDate: today.toISOString().split('T')[0],
        customerName: '',
        customerMobile: '',
        customerAddress: '',
        status: 'Draft',
        items: [],
        termsAndConditions: [],
        notes: [],
      });
    }
  }, [quotation, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      details: '',
      unit: '',
      price: 0,
      discount: 0,
      amount: 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleItemChange = (itemId, field, value) => {
    setFormData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // Calculate amount
          const price = parseFloat(updatedItem.price) || 0;
          const discount = parseFloat(updatedItem.discount) || 0;
          updatedItem.amount = price - discount;
          
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const handleAddTerm = () => {
    const newTerm = {
      id: Date.now(),
      text: '',
    };
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, newTerm],
    }));
  };

  const handleRemoveTerm = (termId) => {
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: prev.termsAndConditions.filter((term) => term.id !== termId),
    }));
  };

  const handleTermChange = (termId, value) => {
    setFormData((prev) => {
      const updatedTerms = prev.termsAndConditions.map((term) =>
        term.id === termId ? { ...term, text: value } : term
      );
      return { ...prev, termsAndConditions: updatedTerms };
    });
  };

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      text: '',
    };
    setFormData((prev) => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
  };

  const handleRemoveNote = (noteId) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== noteId),
    }));
  };

  const handleNoteChange = (noteId, value) => {
    setFormData((prev) => {
      const updatedNotes = prev.notes.map((note) =>
        note.id === noteId ? { ...note, text: value } : note
      );
      return { ...prev, notes: updatedNotes };
    });
  };

  const calculateGrandTotal = () => {
    return formData.items.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerMobile) {
      alert('Please fill in all required customer fields');
      return;
    }

    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    setLoading(true);

    try {
      const quotationData = {
        ...formData,
        grandTotal: calculateGrandTotal(),
        updatedAt: serverTimestamp(),
      };

      if (quotation) {
        // Update existing quotation
        const quotationRef = doc(db, 'quotations', quotation.id);
        await updateDoc(quotationRef, quotationData);
      } else {
        // Add new quotation
        await addDoc(collection(db, 'quotations'), {
          ...quotationData,
          createdAt: serverTimestamp(),
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving quotation:', error);
      alert('Failed to save quotation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {quotation ? 'Edit Quotation' : 'Create Quotation'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Quotation Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quotation ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="quotationId"
                value={formData.quotationId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="quotationDate"
                value={formData.quotationDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="customerMobile"
                  value={formData.customerMobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Items</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {formData.items.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">No items added yet. Click "Add Item" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">Item {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Details
                        </label>
                        <input
                          type="text"
                          value={item.details}
                          onChange={(e) => handleItemChange(item.id, 'details', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          placeholder="e.g., 1 Video"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Discount (₹)
                        </label>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleItemChange(item.id, 'discount', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={item.amount}
                          readOnly
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grand Total */}
            {formData.items.length > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-800">Grand Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹ {calculateGrandTotal().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Terms and Conditions</h3>
              <button
                type="button"
                onClick={handleAddTerm}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Term
              </button>
            </div>

            {formData.termsAndConditions.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">No terms added yet. Click "Add Term" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.termsAndConditions.map((term, index) => (
                  <div key={term.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700 mt-2">{index + 1}.</span>
                    <input
                      type="text"
                      value={term.text}
                      onChange={(e) => handleTermChange(term.id, e.target.value)}
                      placeholder="Enter term or condition..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTerm(term.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
              <button
                type="button"
                onClick={handleAddNote}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>

            {formData.notes.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500">No notes added yet. Click "Add Note" to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.notes.map((note, index) => (
                  <div key={note.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <span className="text-sm font-semibold text-gray-700 mt-2">{index + 1}.</span>
                    <input
                      type="text"
                      value={note.text}
                      onChange={(e) => handleNoteChange(note.id, e.target.value)}
                      placeholder="Enter note..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNote(note.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : quotation ? 'Update Quotation' : 'Create Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuotationModal;
