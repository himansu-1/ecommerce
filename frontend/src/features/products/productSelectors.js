// src/features/products/productSelectors.js
export const selectProducts = (state) => state.products.products;
export const selectLoading = (state) => state.products.loading;
export const selectProductById = (id) => (state) =>
  state.products.products.find((product) => product.id === id);
