import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, Phone, MapPin, Calendar, Edit2, Package, Wallet, User, Plus } from 'lucide-react';
import AddCustomerModal from '../components/customers/AddCustomerModal';
import AddServiceModal from '../components/customers/AddServiceModal';
import AddPaymentModal from '../components/customers/AddPaymentModal';
import ServiceCard from '../components/customers/ServiceCard';
import PaymentCard from '../components/customers/PaymentCard';
import DeleteConfirmModal from '../components/website/DeleteConfirmModal';

const CustomerDetail = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] = useState(false);
  const [isDeletePaymentModalOpen, setIsDeletePaymentModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchCustomer();
    const unsubscribeServices = fetchServices();
    const unsubscribePayments = fetchPayments();

    return () => {
      if (unsubscribeServices) unsubscribeServices();
      if (unsubscribePayments) unsubscribePayments();
    };
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const customerRef = doc(db, 'customers', customerId);
      const customerDoc = await getDoc(customerRef);
      
      if (customerDoc.exists()) {
        setCustomer({
          id: customerDoc.id,
          ...customerDoc.data(),
        });
      } else {
        console.error('Customer not found');
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = () => {
    const q = query(
      collection(db, 'customerServices'),
      where('customerId', '==', customerId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort by createdAt in memory instead
      servicesData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });
      setServices(servicesData);
      console.log('Services fetched:', servicesData);
    }, (error) => {
      console.error('Error fetching services:', error);
    });

    return unsubscribe;
  };

  const fetchPayments = () => {
    const q = query(
      collection(db, 'customerPayments'),
      where('customerId', '==', customerId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort by createdAt in memory instead
      paymentsData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });
      setPayments(paymentsData);
      console.log('Payments fetched:', paymentsData);
    }, (error) => {
      console.error('Error fetching payments:', error);
    });

    return unsubscribe;
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsAddServiceModalOpen(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setIsDeleteServiceModalOpen(true);
  };

  const confirmDeleteService = async () => {
    if (selectedService) {
      try {
        await deleteDoc(doc(db, 'customerServices', selectedService.id));
        setIsDeleteServiceModalOpen(false);
        setSelectedService(null);
      } catch (error) {
        console.error('Error deleting service:', error);
        alert(`Failed to delete service: ${error.message}`);
      }
    }
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setIsAddPaymentModalOpen(true);
  };

  const handleDeletePayment = (payment) => {
    setSelectedPayment(payment);
    setIsDeletePaymentModalOpen(true);
  };

  const confirmDeletePayment = async () => {
    if (selectedPayment) {
      try {
        await deleteDoc(doc(db, 'customerPayments', selectedPayment.id));
        setIsDeletePaymentModalOpen(false);
        setSelectedPayment(null);
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert(`Failed to delete payment: ${error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Not Found</h2>
        <p className="text-gray-600 mb-4">The customer you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/customers')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage customer information</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
          Edit Customer
        </button>
      </div>

      {/* Customer Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-500">
                {customer.customerName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{customer.customerName}</h2>
              {customer.businessName && (
                <p className="text-primary-50 text-sm">{customer.businessName}</p>
              )}
              <p className="text-primary-100">Customer ID: {customer.id}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'details'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <User className="w-4 h-4" />
              Details
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'services'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Package className="w-4 h-4" />
              Services ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'payments'
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Payments ({payments.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {customer.businessName && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-50 rounded-lg">
                        <User className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Business Name</p>
                        <p className="text-base font-medium text-gray-800">{customer.businessName}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <Phone className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mobile Number</p>
                      <p className="text-base font-medium text-gray-800">{customer.mobileNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-base font-medium text-gray-800">{customer.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  {customer.createdAt && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer Since</p>
                        <p className="text-base font-medium text-gray-800">
                          {new Date(customer.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {customer.updatedAt && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-base font-medium text-gray-800">
                          {new Date(customer.updatedAt.seconds * 1000).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Services List</h3>
                <button
                  onClick={() => setIsAddServiceModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Services Added</h3>
                  <p className="text-gray-500 mb-4">Start by adding a service for this customer</p>
                  <button
                    onClick={() => setIsAddServiceModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Service
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service} 
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Payment Records</h3>
                <button
                  onClick={() => setIsAddPaymentModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment
                </button>
              </div>

              {payments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Payments Recorded</h3>
                  <p className="text-gray-500 mb-4">Start by adding a payment record</p>
                  <button
                    onClick={() => setIsAddPaymentModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Payment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => {
                    const servicePayments = payments.filter(p => p.serviceId === service.id);
                    const totalPaid = servicePayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
                    
                    return (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-800">{service.serviceName}</h4>
                            <p className="text-sm text-gray-500">Total: ₹{service.totalAmount || 0}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Paid</p>
                            <p className="font-semibold text-green-600">₹{totalPaid}</p>
                          </div>
                        </div>
                        
                        {servicePayments.length > 0 ? (
                          <div className="space-y-2">
                            {servicePayments.map((payment) => (
                              <PaymentCard 
                                key={payment.id} 
                                payment={payment}
                                onEdit={handleEditPayment}
                                onDelete={handleDeletePayment}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">No payments recorded for this service</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          fetchCustomer();
        }}
        customer={customer}
      />

      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => {
          setIsAddServiceModalOpen(false);
          setSelectedService(null);
        }}
        customerId={customerId}
        service={selectedService}
      />

      <AddPaymentModal
        isOpen={isAddPaymentModalOpen}
        onClose={() => {
          setIsAddPaymentModalOpen(false);
          setSelectedPayment(null);
        }}
        customerId={customerId}
        services={services}
        payment={selectedPayment}
      />

      <DeleteConfirmModal
        isOpen={isDeleteServiceModalOpen}
        onClose={() => {
          setIsDeleteServiceModalOpen(false);
          setSelectedService(null);
        }}
        onConfirm={confirmDeleteService}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.serviceName}"? This action cannot be undone.`}
      />

      <DeleteConfirmModal
        isOpen={isDeletePaymentModalOpen}
        onClose={() => {
          setIsDeletePaymentModalOpen(false);
          setSelectedPayment(null);
        }}
        onConfirm={confirmDeletePayment}
        title="Delete Payment"
        message={`Are you sure you want to delete this payment of ₹${selectedPayment?.amount}? This action cannot be undone.`}
      />
    </div>
  );
};

export default CustomerDetail;
