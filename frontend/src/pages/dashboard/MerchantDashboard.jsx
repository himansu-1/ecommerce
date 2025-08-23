// src/pages/dashboards/MerchantDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/roles";

const MerchantDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    location: "",
    image: null,
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      title: product.title,
      description: product.description || "",
      category: product.category,
      subcategory: product.subcategory || "",
      price: product.price,
      location: product.location || "",
      image: null,
    });
    setShowEditModal(true);
  };

  // Fetch merchant's own products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${API_BASE_URL}/products/products/merchant`,
        {
          // withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_BASE_URL}/products/products/${productId}`, {
        // withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove deleted product from state
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data?.message || error.message
      );
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
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Image
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Title
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Category - Subcategory
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Price
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Location
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Loading products...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No products listed yet.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={`${API_BASE_URL.replace(/\/api$/, "")}${
                      product.imageUrl
                    }`}
                    alt={product.title}
                    className="h-20 w-20 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{product.title}</td>
                <td className="px-4 py-2">
                  {product.category} → {product.subcategory}
                </td>
                <td className="px-4 py-2">₹ {product.price}</td>
                <td className="px-4 py-2">{product.location}</td>
                <td className="px-4 py-2">
                  <div className=" row-auto flex gap-1 justify-center">
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="w-full bg-red-500 text-white p-1 mb-1 rounded hover:bg-red-600 transition duration-200 hover:cursor-pointer text-sm"
                    >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(product)}
                    className="w-full bg-yellow-500 text-white p-1 mb-1 rounded hover:bg-yellow-600 transition duration-200 hover:cursor-pointer text-sm"
                    >
                    Edit
                  </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowEditModal(false)}
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem("authToken");
                  const formData = new FormData();
                  formData.append("title", form.title);
                  formData.append("description", form.description);
                  formData.append("category", form.category);
                  formData.append("subcategory", form.subcategory);
                  formData.append("price", form.price);
                  formData.append("location", form.location);
                  // formData.append("merchant", form.location);
                  if (form.image) {
                    formData.append("image", form.image);
                  }
                  formData.append("merchantId", selectedProduct.merchant._id);
                  
                  await axios.put(
                    `${API_BASE_URL}/products/products/${selectedProduct._id}`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  console.log(formData);
                  

                  setShowEditModal(false);
                  fetchProducts(); // refresh list
                } catch (err) {
                  alert("Failed to update product");
                  console.error(err);
                }
              }}
            >
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full mb-3 px-3 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full mb-3 px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full mb-3 px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Subcategory"
                value={form.subcategory}
                onChange={(e) =>
                  setForm({ ...form, subcategory: e.target.value })
                }
                className="w-full mb-3 px-3 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full mb-3 px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full mb-3 px-3 py-2 border rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                className="mb-4"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;
