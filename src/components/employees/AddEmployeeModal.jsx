import { useState, useEffect } from 'react';
import { X, Upload, User } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

const AddEmployeeModal = ({ isOpen, onClose, employee = null }) => {
  const [loading, setLoading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    profilePicUrl: '',
    employeeName: '',
    mobileNumber: '',
    alternateMobileNumber: '',
    email: '',
    address: '',
    role: '',
    status: 'Active',
    dateOfBirth: '',
    emergencyContactRelation: '',
    emergencyContactName: '',
    emergencyContactMobile: '',
    aadharNumber: '',
    aadharFileUrl: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setProfilePicPreview(employee.profilePicUrl || null);
    } else {
      generateEmployeeId();
    }
  }, [employee, isOpen]);

  const generateEmployeeId = async () => {
    let newId;
    let isUnique = false;

    while (!isUnique) {
      // Generate random 8-digit number
      newId = Math.floor(10000000 + Math.random() * 90000000).toString();
      
      // Check if ID already exists
      const q = query(collection(db, 'employees'), where('employeeId', '==', newId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        isUnique = true;
      }
    }

    setFormData(prev => ({ ...prev, employeeId: newId }));
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      profilePicUrl: '',
      employeeName: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      email: '',
      address: '',
      role: '',
      status: 'Active',
      dateOfBirth: '',
      emergencyContactRelation: '',
      emergencyContactName: '',
      emergencyContactMobile: '',
      aadharNumber: '',
      aadharFileUrl: ''
    });
    setProfilePicPreview(null);
    setProfilePicFile(null);
    setAadharFile(null);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadharFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAadharFile(file);
    }
  };

  const uploadToImageKit = async (file, employeeId, type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `${employeeId}_${type}_${Date.now()}`);
      formData.append('folder', `/Employees/${employeeId}`);

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ':')}`,
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.url) {
        return data.url;
      } else {
        throw new Error('Failed to upload to ImageKit');
      }
    } catch (error) {
      console.error('ImageKit upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePicUrl = formData.profilePicUrl;
      let aadharFileUrl = formData.aadharFileUrl;

      // Upload profile picture to ImageKit if new file selected
      if (profilePicFile) {
        profilePicUrl = await uploadToImageKit(profilePicFile, formData.employeeId, 'profile');
      }

      // Upload aadhar file to ImageKit if new file selected
      if (aadharFile) {
        aadharFileUrl = await uploadToImageKit(aadharFile, formData.employeeId, 'aadhar');
      }

      const employeeData = {
        ...formData,
        profilePicUrl,
        aadharFileUrl,
        updatedAt: new Date().toISOString()
      };

      if (employee) {
        // Update existing employee (exclude employeeId from update)
        const { employeeId, ...updateData } = employeeData;
        await updateDoc(doc(db, 'employees', employee.id), updateData);
      } else {
        // Add new employee
        await addDoc(collection(db, 'employees'), {
          ...employeeData,
          createdAt: new Date().toISOString()
        });
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {employee ? 'Edit Employee' : 'Add New Employee'}
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
          {/* Profile Picture */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {profilePicPreview ? (
                  <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition-colors shadow-lg">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Click to upload profile picture</p>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Employee ID - Non-editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.employeeId}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
                  placeholder="Auto-generated"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.employeeName}
                  onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Enter employee name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Mobile Number
                </label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  value={formData.alternateMobileNumber}
                  onChange={(e) => setFormData({ ...formData, alternateMobileNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="employee@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="e.g., Manager, Developer, Designer"
                />
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-4 h-4 text-primary-500 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.status === 'Inactive'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-4 h-4 text-primary-500 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContactRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="e.g., Father, Mother, Spouse"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.emergencyContactMobile}
                  onChange={(e) => setFormData({ ...formData, emergencyContactMobile: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
          </div>

          {/* Aadhar Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Aadhar Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{12}"
                  value={formData.aadharNumber}
                  onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="12-digit aadhar number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Aadhar Card {!employee && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleAadharFileChange}
                    required={!employee}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                  {aadharFile && (
                    <p className="text-sm text-green-600 mt-1">File selected: {aadharFile.name}</p>
                  )}
                  {employee && formData.aadharFileUrl && !aadharFile && (
                    <a
                      href={formData.aadharFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-500 hover:text-primary-600 mt-1 inline-block"
                    >
                      View current file
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
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
              {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
