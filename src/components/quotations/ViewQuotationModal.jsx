import { X, Printer, Calendar, User, Phone, MapPin, FileText } from 'lucide-react';
import { useRef } from 'react';
import Logo from '../../assets/Logo.png';

const ViewQuotationModal = ({ isOpen, onClose, quotation }) => {
  const printRef = useRef();

  if (!isOpen || !quotation) return null;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Quotation</title>
          <style>
            @page {
              size: A4;
              margin: 16mm;
            }

            body {
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            img {
              max-width: 100%;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th, td {
              border: 1px solid #999;
              padding: 8px;
            }

            thead {
              display: table-header-group;
            }

            tr {
              page-break-inside: avoid;
            }

            .no-print {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Sent: 'bg-blue-100 text-blue-700',
      Accepted: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
      Expired: 'bg-orange-100 text-orange-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-500" />
            <h2 className="text-xl font-semibold">Quotation Details</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg"
            >
              <Printer size={16} />
              Print
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X />
            </button>
          </div>
        </div>

        {/* PRINT CONTENT */}
        <div ref={printRef} className="p-6">
          {/* COMPANY HEADER */}
          <div className="flex justify-between border-b pb-4 mb-4">
            <div>
              <img src={Logo} alt="Logo" className="w-[220px] mb-2" />
              <p className="text-sm">Software and Digital Solutions</p>
              <p className="text-sm">Mobile: +91 9398638314</p>
              <p className="text-sm">Email: connect.clicknova@gmail.com</p>
              <p className="text-sm">Address: Nellore, Andhra Pradesh</p>
            </div>

            <div className="text-right">
              <p><strong>Quotation ID:</strong> {quotation.quotationId}</p>
              <p><Calendar size={14} className="inline" /> {formatDate(quotation.quotationDate)}</p>
              <span className={`inline-block px-3 py-1 mt-2 rounded-full text-xs ${getStatusColor(quotation.status)}`}>
                {quotation.status}
              </span>
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">To:</h3>
            <p><strong>{quotation.customerName}</strong></p>
            <p><Phone size={14} className="inline" /> {quotation.customerMobile}</p>
            {quotation.customerAddress && (
              <p><MapPin size={14} className="inline" /> {quotation.customerAddress}</p>
            )}
          </div>

          <p className="mb-4">Dear Sir/Madam,<br />We are pleased to quote as below:</p>

          {/* TABLE */}
          <table className="mb-6">
            <thead className="bg-green-700 text-white">
              <tr>
                <th>S.No</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{item.description}</strong>
                    {item.details && <div className="text-xs">{item.details}</div>}
                  </td>
                  <td>{item.unit}</td>
                  <td align="right">{formatCurrency(item.price)}</td>
                  <td align="right">{formatCurrency(item.discount)}</td>
                  <td align="right"><strong>{formatCurrency(item.amount)}</strong></td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" align="right"><strong>GRAND TOTAL</strong></td>
                <td align="right"><strong>{formatCurrency(quotation.grandTotal)}</strong></td>
              </tr>
            </tbody>
          </table>

          {/* TERMS */}
          {quotation.termsAndConditions?.length > 0 && (
            <>
              <h3 className="font-semibold mb-2">Terms & Conditions</h3>
              <ul className="mb-4">
                {quotation.termsAndConditions.map((t, i) => (
                  <li key={t.id}>{i + 1}. {t.text}</li>
                ))}
              </ul>
            </>
          )}

          {/* NOTES */}
          {quotation.notes?.length > 0 && (
            <>
              <h3 className="font-semibold mb-2">Notes</h3>
              <ul>
                {quotation.notes.map((n, i) => (
                  <li key={n.id}>{i + 1}. {n.text}</li>
                ))}
              </ul>
            </>
          )}

          <div className="text-center mt-6 font-semibold text-green-700">
            ********** Thank you for choosing CLICK NOVA **********
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuotationModal;
