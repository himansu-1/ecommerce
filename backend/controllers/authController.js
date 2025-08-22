import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email and password" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Admin with this email or username already exists" });
    }

    const user = new User({
      username,
      email,
      password,
      role: "admin",
      isVerified: true
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during user registration" });
  }
};
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email and password" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Admin with this email or username already exists" });
    }

    const user = new User({
      username,
      email,
      password,
      role: "user",
      isVerified: true
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during user registration" });
  }
};

export const registerMerchant = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide username, email and password" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    const merchant = new User({
      username,
      email,
      password,
      role: "merchant",
      isVerified: false
    });

    await merchant.save();

    res.status(201).json({
      message: "Merchant registered successfully, pending admin verification",
      merchant: {
        id: merchant._id,
        username: merchant.username,
        email: merchant.email,
        role: merchant.role,
        isVerified: merchant.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during merchant registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide email, password, and role" });
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials or role" });
    }

    if (role === "merchant" && !user.isVerified) {
      return res.status(403).json({ message: "Merchant account is not verified by admin" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};
