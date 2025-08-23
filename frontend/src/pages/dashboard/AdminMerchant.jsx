// src/pages/dashboards/AdminMerchant.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/roles';

const AdminMerchant = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  <button onClick={() => handleDelete(m._id)} className="w-full bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-200 hover:cursor-pointer text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMerchant;
