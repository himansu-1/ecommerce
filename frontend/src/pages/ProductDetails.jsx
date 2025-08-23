// src/pages/ProductDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/roles";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center mt-20 text-red-500">
        {error || "Product not found."}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
          <img
            src={`${API_BASE_URL.replace(/\/api$/, '')}${product.imageUrl}`}
            alt={product.title}
            className="w-full h-auto max-w-md rounded-lg object-cover"
          />
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {product.title}
            </h2>
            <p className="text-xl text-green-600 font-semibold mb-4">
              ${product.price}
            </p>

            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Description:</span>{" "}
              {product.description}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Category:</span>{" "}
              {product.category} → {product.subcategory}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Location:</span>{" "}
              {product.location}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Views:</span> {product.views}
            </p>
          </div>

          <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 hover:cursor-pointer">
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
