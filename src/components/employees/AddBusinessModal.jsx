import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AddBusinessModal = ({ isOpen, onClose, employeeId, business = null }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    amount: '',
  });

  useEffect(() => {
    if (business) {
      setFormData({
        businessName: business.businessName || '',
        amount: business.amount || '',
      });
    } else {
      setFormData({
        businessName: '',
        amount: '',
      });
    }
  }, [business, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const businessData = {
        ...formData,
        amount: parseFloat(formData.amount),
        employeeId,
        updatedAt: new Date(),
      };

      if (business) {
        // Update existing business
        await updateDoc(doc(db, 'employeeBusinesses', business.id), businessData);
      } else {
        // Add new business
        await addDoc(collection(db, 'employeeBusinesses'), {
          ...businessData,
          createdAt: new Date(),
        });
      }

      onClose();
      setFormData({
        businessName: '',
        amount: '',
      });
    } catch (error) {
      console.error('Error saving business:', error);
      alert(`Failed to save business: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">
            {business ? 'Edit Business' : 'Add Business'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                placeholder="Enter business name"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                min="0"
                step="0.01"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Saving...' : business ? 'Update' : 'Add Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusinessModal;
