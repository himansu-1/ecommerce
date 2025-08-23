import express from "express";
import {
  getMerchants,
  verifyMerchant,
  getUsers,
  getProducts,
  getViewStats,
  deleteMerchant,
  deleteUser,
  deleteProduct,
  editMerchant
} from "../controllers/adminController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeRoles("admin"));

router.get("/merchants", getMerchants);
router.post("/merchants/:id/verify", verifyMerchant);
router.get("/users", getUsers);
router.get("/products", getProducts);
router.get("/views/stats", getViewStats);
router.put("/merchants/:id", authorizeRoles("admin"), editMerchant);
router.delete("/merchants/:id", authorizeRoles("admin"), deleteMerchant);
router.delete("/users/:id", authorizeRoles("admin"), deleteUser);
router.delete("/products/:id", authorizeRoles("admin"), deleteProduct);

export default router;
