import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AddPaymentModal = ({ isOpen, onClose, customerId, services, payment = null }) => {
  const [formData, setFormData] = useState({
    serviceId: '',
    amount: '',
    paymentMethod: 'Cash',
    instalmentNumber: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const paymentMethods = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque'];

  useEffect(() => {
    if (payment) {
      setFormData({
        serviceId: payment.serviceId || '',
        amount: payment.amount || '',
        paymentMethod: payment.paymentMethod || 'Cash',
        instalmentNumber: payment.instalmentNumber || '',
        notes: payment.notes || '',
      });
    } else {
      setFormData({
        serviceId: '',
        amount: '',
        paymentMethod: 'Cash',
        instalmentNumber: '',
        notes: '',
      });
    }
  }, [payment, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedService = services.find(s => s.id === formData.serviceId);
      
      await addDoc(collection(db, 'customerPayments'), {
        customerId,
        serviceId: formData.serviceId,
        serviceName: selectedService?.serviceName || '',
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        instalmentNumber: formData.instalmentNumber ? Number(formData.instalmentNumber) : null,
        notes: formData.notes,
        createdAt: serverTimestamp(),
      });

      console.log('Payment added successfully');
      onClose();
      setFormData({
        serviceId: '',
        amount: '',
        paymentMethod: 'Cash',
        instalmentNumber: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding payment:', error);
      alert(`Failed to add payment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">{payment ? 'Edit Payment' : 'Add Payment'}</h2>
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
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service <span className="text-red-500">*</span>
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                required
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.serviceName} - ₹{service.totalAmount}
                  </option>
                ))}
              </select>
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
                placeholder="Enter payment amount"
                min="0"
                step="0.01"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                required
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Instalment Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instalment Number
              </label>
              <input
                type="number"
                name="instalmentNumber"
                value={formData.instalmentNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 1, 2, 3"
                min="1"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Add any additional notes"
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
              {loading ? 'Saving...' : payment ? 'Update Payment' : 'Add Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;
