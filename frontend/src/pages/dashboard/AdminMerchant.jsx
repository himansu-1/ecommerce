// src/pages/dashboards/AdminMerchant.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/roles';

const AdminMerchant = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMerchantData, setEditMerchantData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const openEditModal = (merchant) => {
    setEditMerchantData({
      id: merchant._id,
      username: merchant.username,
      email: merchant.email,
      isVerified: merchant.isVerified,
    });
    setShowEditModal(true);
  };

  // Handle input change in modal
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditMerchantData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const { id, username, email, isVerified } = editMerchantData;

      await axios.put(
        `${API_BASE_URL}/admin/merchants/${id}`,
        { username, email, isVerified },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setMerchants((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, username, email, isVerified } : m
        )
      );

      setShowEditModal(false);
    } catch (err) {
      alert("Failed to update merchant");
      console.error(err);
    }
  };

  const fetchMerchants = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/merchants`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setMerchants(res.data);
    } catch (err) {
      console.error('Error fetching merchants:', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    const confirm = window.confirm('Verify this merchant?');
    if (!confirm) return;

    await axios.post(`${API_BASE_URL}/admin/merchants/${id}/verify`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    setMerchants(merchants.map(m => m._id === id ? { ...m, isVerified: true } : m));
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Delete this merchant?');
    if (!confirm) return;

    await axios.delete(`${API_BASE_URL}/admin/merchants/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    setMerchants(merchants.filter(m => m._id !== id));
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>🛡️ Admin Dashboard</h1>
      <h2>Merchants</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Username</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Email</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Created At</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Verified</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Products Count</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {merchants.map((m) => (
              <tr key={m._id}>
                <td className="px-6 py-4">{m.username}</td>
                <td className="px-6 py-4">{m.email}</td>
                <td className="px-6 py-4">{new Date(m.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={m.isVerified}
                    onChange={() => !m.isVerified && handleVerify(m._id)}
                  />
                </td>
                <td className="px-6 py-4">{m.productCount || 0}</td>
                <td className="px-6 py-4">
                  <div className=" row-auto flex gap-1 justify-center">
                  <button onClick={() => handleDelete(m._id)} className="w-full bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-200 hover:cursor-pointer text-sm">
                    Delete
                  </button>
                  <button
                    onClick={() => openEditModal(m)}
                    className="w-full bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition duration-200 text-sm"
                  >
                    Edit
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Edit Merchant</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editMerchantData.username}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editMerchantData.email}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={editMerchantData.isVerified}
                  onChange={handleChange}
                />
                <label htmlFor="isVerified" className="font-medium">
                  Verified
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMerchant;
