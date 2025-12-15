import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AddServiceModal = ({ isOpen, onClose, customerId, service = null }) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    totalAmount: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || '',
        totalAmount: service.totalAmount || '',
      });
    } else {
      setFormData({
        serviceName: '',
        totalAmount: '',
      });
    }
  }, [service, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('Submitting service with customerId:', customerId);
    console.log('Service data:', formData);

    try {
      if (service) {
        // Update existing service
        const serviceRef = doc(db, 'customerServices', service.id);
        await updateDoc(serviceRef, {
          serviceName: formData.serviceName,
          totalAmount: Number(formData.totalAmount),
          updatedAt: serverTimestamp(),
        });
        console.log('Service updated successfully');
        alert('Service updated successfully!');
      } else {
        // Add new service
        const docRef = await addDoc(collection(db, 'customerServices'), {
          customerId,
          serviceName: formData.serviceName,
          totalAmount: Number(formData.totalAmount),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log('Service added successfully with ID:', docRef.id);
        alert('Service added successfully!');
      }

      onClose();
      setFormData({
        serviceName: '',
        totalAmount: '',
      });
    } catch (error) {
      console.error('Error saving service:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      alert(`Failed to save service: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{service ? 'Edit Service' : 'Add Service'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                placeholder="Enter service name"
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                placeholder="Enter total amount"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Saving...' : service ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
