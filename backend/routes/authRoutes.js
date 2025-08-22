import express from "express";
import {
  registerUser,
  registerMerchant,
  registerAdmin,
  loginUser
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/admin", registerAdmin);
router.post("/register/user", registerUser);
router.post("/register/merchant", registerMerchant);
router.post("/login", loginUser);

export default router;
