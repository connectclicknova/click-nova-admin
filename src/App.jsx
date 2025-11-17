import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import ContactFromWebsite from './pages/ContactFromWebsite';
import CareersFromWebsite from './pages/CareersFromWebsite';
import FreeQuoteFromWebsite from './pages/FreeQuoteFromWebsite';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="customers" element={<Customers />} />
              <Route path="employees" element={<Employees />} />
              <Route path="contact-from-website" element={<ContactFromWebsite />} />
              <Route path="careers-from-website" element={<CareersFromWebsite />} />
              <Route path="freequote-from-website" element={<FreeQuoteFromWebsite />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;