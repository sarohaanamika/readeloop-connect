
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { UserRole } from './lib/types';
import DatabaseInitializer from './components/DatabaseInitializer'; 
import { Toaster } from 'sonner';

// Import all pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Payments from './pages/Payments';
import Admin from './pages/Admin';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Loan and Member Management Pages
import ManageLoans from './pages/ManageLoans';
import ManageMembers from './pages/ManageMembers';

const App: React.FC = () => {
  console.log("App rendering...");
  
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          {/* Initialize database with sample data if needed */}
          <DatabaseInitializer />
          
          {/* Toast notifications */}
          <Toaster position="top-right" />
          
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Member Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.MEMBER, UserRole.STAFF, UserRole.ADMIN]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/payments" element={<Payments />} />
            </Route>

            {/* Staff Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.STAFF, UserRole.ADMIN]} />}>
              <Route path="/manage/loans" element={<ManageLoans />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/manage/members" element={<ManageMembers />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
