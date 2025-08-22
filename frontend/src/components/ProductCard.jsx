// src/components/ProductCard.tsx

import React from 'react';
import { API_BASE_URL } from '../utils/roles';

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <img
        src={`${API_BASE_URL.replace(/\/api$/, '')}${product.imageUrl}`}
        alt={product.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
        <p className="text-green-600 font-medium text-sm mb-1">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mb-1">{product.category} → {product.subcategory}</p>
        <p className="text-sm text-gray-500">📍 {product.location}</p>
      </div>
    </div>
  );
};

export default ProductCard;
