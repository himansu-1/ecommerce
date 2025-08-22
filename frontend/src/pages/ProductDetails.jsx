// src/pages/ProductDetails.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectProductById } from '../features/products/productSelectors';

const ProductDetails = () => {
  const { id } = useParams();
  const product = useSelector((state) => selectProductById(id)(state));

  if (!product) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Product not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-auto max-w-md rounded-lg object-cover"
          />
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h2>
            <p className="text-xl text-green-600 font-semibold mb-4">${product.price}</p>

            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Description:</span> {product.description}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Category:</span> {product.category} → {product.subcategory}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Location:</span> {product.location}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Views:</span> {product.views}
            </p>
          </div>

          <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
