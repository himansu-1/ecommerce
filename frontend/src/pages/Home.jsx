// src/pages/Home.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { API_BASE_URL } from "../utils/roles";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
  });

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // or 'desc'

  const applyFilters = async () => {
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append("search", filters.search);

      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (sortOrder) queryParams.append("sortOrder", sortOrder);

      const res = await axios.get(
        `${API_BASE_URL}/products?${queryParams.toString()}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch filtered/sorted products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = async () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
    });

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    applyFilters();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Featured Products
      </h1>

      {/* Filtering Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Title, location, category..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="col-span-2 flex gap-3">
          <button
            onClick={applyFilters}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Select</option>
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
              <option value="location">Location</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <select
              className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              onClick={applyFilters}
              className="h-10 bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700 transition"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="h-10 bg-gray-200 text-gray-800 px-4 rounded-md hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Product Section */}
      {loading ? (
        // <div className="text-center text-gray-500">Loading products...</div>
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 text-lg font-medium py-10">
          No products available.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() => handleClick(product._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
