import express from "express";
import {
  createProduct,
  updateProduct,
  listMerchantProducts,
  browseProducts,
  deleteProduct,
  getSingleProduct
} from "../controllers/productController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Protect routes for merchants only
router.post(
  "/products",
  authenticateJWT,
  authorizeRoles("merchant"),
  upload.single("image"),
  createProduct
);

router.put(
  "/products/:id",
  authenticateJWT,
  authorizeRoles("merchant"),
  upload.single("image"),
  updateProduct
);

router.get(
  "/products/merchant",
  authenticateJWT,
  authorizeRoles("merchant"),
  listMerchantProducts
);

router.delete(
  "/products/:id",
  authenticateJWT,
  authorizeRoles("merchant"),
  deleteProduct
);

router.get(
  "/products/:id",
  getSingleProduct
);

// Browse products for all users (no auth required)
router.get("/", browseProducts);

export default router;
