import { X, Printer, Calendar, User, Phone, MapPin, FileText } from 'lucide-react';
import { useRef } from 'react';
import Logo from '../../assets/Logo.png'

const ViewQuotationModal = ({ isOpen, onClose, quotation }) => {
  const printRef = useRef();

  if (!isOpen || !quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-700',
      'Sent': 'bg-blue-100 text-blue-700',
      'Accepted': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Expired': 'bg-orange-100 text-orange-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <style>{`
        @media print {
          .print-hide {
            display: none !important;
          }
          .print-modal {
            position: static !important;
            background: white !important;
            max-width: 100% !important;
            max-height: none !important;
            overflow: visible !important;
          }
        }
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto print-modal">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 print-hide">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold text-gray-800">Quotation Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 print-container" ref={printRef}>
          {/* Header Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {/* <h1 className="text-3xl font-bold text-primary-600">CLICK NOVA</h1> */}
                  <img src={Logo} alt="" className='w-[250px]' />
                </div>
                <p className="text-sm text-gray-600">Software and Digital Solutions</p>
                <p className="text-sm text-gray-600">Mobile Number: +91 9398638314</p>
                <p className="text-sm text-gray-600">Email: connect.clicknova@gmail.com</p>
                <p className="text-sm text-gray-600">Address: Janasakthi Nagar, Nellore, Andhra Pradesh</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <span className="text-sm text-gray-600">Quotation ID:</span>
                  <span className="text-lg font-bold text-gray-800">{quotation.quotationId}</span>
                </div>
                <div className="flex items-center gap-2 justify-end mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Date: {formatDate(quotation.quotationDate)}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                  {quotation.status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-500" />
              To
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-base font-semibold text-gray-800 mb-2">Name: {quotation.customerName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Phone className="w-4 h-4" />
                <span>Mobile Number: {quotation.customerMobile}</span>
              </div>
              {quotation.customerAddress && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Address: {quotation.customerAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-6">
            <p className="text-gray-700">Dear Sir/Mam,</p>
            <p className="text-gray-700 mt-2">Thank you for your valuable inquiry. We are pleased to quote as below</p>
          </div>

          {/* Items Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-green-700">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-white">S.No</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-white">Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-white">Unit</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-white">Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-white">Discount</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-white">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items?.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-800">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="font-semibold text-sm text-gray-800">{item.description}</div>
                      {item.details && (
                        <div className="text-xs text-gray-600 mt-1">{item.details}</div>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">{item.unit}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-800 text-right">{formatCurrency(item.price)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-800 text-right">{formatCurrency(item.discount)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 text-right">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                <tr className="bg-green-700">
                  <td colSpan="5" className="border border-gray-300 px-4 py-3 text-right text-sm font-bold text-white">
                    GRAND TOTAL
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right text-base font-bold text-white">
                    {formatCurrency(quotation.grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          {quotation.termsAndConditions && quotation.termsAndConditions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Terms and Conditions:</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {quotation.termsAndConditions.map((term, index) => (
                    <li key={term.id} className="text-sm text-gray-700 flex gap-2">
                      <span className="font-semibold">{index + 1}.</span>
                      <span>{term.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {quotation.notes && quotation.notes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Notes:</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {quotation.notes.map((note, index) => (
                    <li key={note.id} className="text-sm text-gray-700 flex gap-2">
                      <span className="font-semibold">{index + 1}.</span>
                      <span>{note.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-green-700 font-semibold text-lg">
              ********** Thank you for choosing CLICK NOVA. **********
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ViewQuotationModal;
