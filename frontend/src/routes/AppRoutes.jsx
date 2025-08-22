import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductDetails from '../pages/ProductDetails';
import ProtectedRoute from '../components/ProtectedRoute';
import UserDashboard from '../pages/dashboard/UserDashboard';
import MerchantDashboard from '../pages/dashboard/MerchantDashboard';
import AdminDashboard from '../pages/dashboard/AdminDarhboard';
import { ROLES } from '../utils/roles';
import AdminMerchant from '../pages/dashboard/AdminMerchant';
import AdminUsers from '../pages/dashboard/AdminUsers';
import AdminProducts from '../pages/dashboard/AdminProducts';
import MerchantProduct from '../pages/dashboard/MerchantProduct';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/product/:id"
        element={
          <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.MERCHANT, ROLES.ADMIN]}>
            <ProductDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.USER]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/merchant-dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MERCHANT]}>
            <MerchantDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Merchant Sub-Routes */}
      <Route
        path="/merchant/products"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MERCHANT]}>
            <MerchantProduct />
          </ProtectedRoute>
        }
      />

      {/* Admin Sub-Routes */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/merchants"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminMerchant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
