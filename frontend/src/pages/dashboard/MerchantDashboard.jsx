// src/pages/dashboards/MerchantDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/roles';

const MerchantDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch merchant's own products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`${API_BASE_URL}/products/products/merchant`, {
        // withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE_URL}/products/products/${productId}`, {
        // withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Remove deleted product from state
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>🏪 Merchant Dashboard</h1>
      <p>Manage your product listings below:</p>

      <table className="min-w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Image</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Title</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Category - Subcategory</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Price</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Location</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">Loading products...</td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">No products listed yet.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={`${API_BASE_URL.replace(/\/api$/, '')}${product.imageUrl}`}
                    alt={product.title}
                    className="h-20 w-20 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{product.title}</td>
                <td className="px-4 py-2">{product.category} → {product.subcategory}</td>
                <td className="px-4 py-2">₹ {product.price}</td>
                <td className="px-4 py-2">{product.location}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MerchantDashboard;
