import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/roles';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    setProducts(res.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${API_BASE_URL}/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    setProducts(products.filter(p => p._id !== id));
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold my-4">Products</h2>
      {loading ? <p>Loading...</p> : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merchant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p._id}>
                <td className="px-6 py-4">{p.title}</td>
                <td className="px-6 py-4">{p.merchant?.username}</td>
                <td className="px-6 py-4">${p.price}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-red-500 hover:underline" onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProducts;
