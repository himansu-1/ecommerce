import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/roles";

const AdminProducts = () => {
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

  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/products`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    setProducts(res.data);    
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`${API_BASE_URL}/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    setProducts(products.filter((p) => p._id !== id));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold my-4">Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
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
            {products.map((product) => (
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
            ))}
          </tbody>
        </table>
      )}

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

export default AdminProducts;
