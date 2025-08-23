export const ROLES = {
  USER: 'user',
  MERCHANT: 'merchant',
  ADMIN: 'admin'
};

// export const API_BASE_URL = 'http://localhost:5000/api'; // change to prod URL if needed
// export const API_BASE_URL = 'https://ecommerce-642n.onrender.com/api'; // change to prod URL if needed
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // change to prod URL if needed
