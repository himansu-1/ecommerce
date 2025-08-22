// src/pages/dashboards/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/roles';

const AdminDashboard = () => {
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
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Verified</th>
              <th>Products Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((m) => (
              <tr key={m._id}>
                <td>{m.username}</td>
                <td>{m.email}</td>
                <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={m.isVerified}
                    onChange={() => !m.isVerified && handleVerify(m._id)}
                  />
                </td>
                <td>{m.productCount || 0}</td>
                <td>
                  <button onClick={() => handleDelete(m._id)} className="btn-danger">
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

export default AdminDashboard;
