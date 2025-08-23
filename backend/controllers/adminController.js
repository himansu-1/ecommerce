import User from "../models/User.js";
import Product from "../models/Product.js";
import View from "../models/View.js";

export const getMerchants = async (req, res) => {
  try {
    // const merchants = await User.find({ role: "merchant" }).select(
    //   "username email isVerified createdAt"
    // );

    // res.json(merchants);
    const merchants = await User.aggregate([
      { $match: { role: 'merchant' } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'merchant',
          as: 'products'
        }
      },
      { $addFields: { productCount: { $size: '$products' } } },
      { $project: { products: 0 } } // optionally remove large array
    ]);
    res.json(merchants);

  } catch (error) {
    res.status(500).json({ message: "Error fetching merchants" });
  }
};

export const verifyMerchant = async (req, res) => {
  try {
    const merchantId = req.params.id;

    const merchant = await User.findOne({ _id: merchantId, role: "merchant" });

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    if (merchant.isVerified) {
      return res.status(400).json({ message: "Merchant is already verified" });
    }

    merchant.isVerified = true;
    await merchant.save();

    res.json({ message: "Merchant verified successfully", merchant });
  } catch (error) {
    res.status(500).json({ message: "Error verifying merchant" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "username email createdAt"
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate({ path: "merchant", select: "username email" })
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getViewStats = async (req, res) => {
  try {
    // Aggregate total views per product with product info and merchant info
    const stats = await View.aggregate([
      {
        $group: {
          _id: "$product",
          totalViews: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "users",
          localField: "product.merchant",
          foreignField: "_id",
          as: "merchant"
        }
      },
      { $unwind: "$merchant" },
      {
        $project: {
          productId: "$product._id",
          title: "$product.title",
          category: "$product.category",
          subcategory: "$product.subcategory",
          merchantUsername: "$merchant.username",
          merchantEmail: "$merchant.email",
          totalViews: 1
        }
      },
      { $sort: { totalViews: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching view statistics" });
  }
};

// Delete merchant
export const deleteMerchant = async (req, res) => {
  const { id } = req.params;
  const merchant = await User.findOne({ _id: id, role: 'merchant' });
  if (!merchant) return res.status(404).json({ message: "Merchant not found" });
  // await merchant.remove();
  await User.deleteOne({ _id: merchant._id });
  res.json({ message: "Merchant deleted" });
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id, role: 'user' });
  if (!user) return res.status(404).json({ message: "User not found" });
  // await user.remove();
  await User.deleteOne({ _id: user._id });
  res.json({ message: "User deleted" });
};

// Delete product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  // await product.remove();
  await Product.deleteOne({ _id: product._id });
  res.json({ message: "Product deleted" });
};

export const editMerchant = async (req, res) => {
  try {
    const merchantId = req.params.id;
    const { username, email, isVerified } = req.body;

    const merchant = await User.findById(merchantId);
    if (!merchant || merchant.role !== "merchant") {
      return res.status(404).json({ message: "Merchant not found or invalid role" });
    }

    if (username !== undefined) merchant.username = username;
    if (email !== undefined) merchant.email = email;
    if (isVerified !== undefined) merchant.isVerified = isVerified;

    await merchant.save();

    res.json(merchant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update merchant" });
  }
};