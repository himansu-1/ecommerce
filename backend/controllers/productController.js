import Product from "../models/Product.js";
import View from "../models/View.js";
import path from "path";
import fs from "fs";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      price,
      location
    } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ message: "Title, category, and price are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;

    const product = new Product({
      title,
      description,
      category,
      subcategory,
      price,
      location,
      imageUrl,
      merchant: req.user.id
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const merchantId = req.user.id;

    const product = await Product.findOne({ _id: productId, merchant: merchantId });
    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    const {
      title,
      description,
      category,
      subcategory,
      price,
      location
    } = req.body;

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (price !== undefined) product.price = price;
    if (location !== undefined) product.location = location;

    if (req.file) {
      // Delete old image file if exists
      if (product.imageUrl) {
        const oldImagePath = path.join(process.cwd(), "backend", product.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          // Ignore error, file might not exist
        });
      }
      product.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const listMerchantProducts = async (req, res) => {
  try {
    const merchantId = req.user.id;

    const products = await Product.find({ merchant: merchantId }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching merchant products" });
  }
};

export const browseProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;

    const filters = {};
    
    if (search) {
      const regex = { $regex: search, $options: "i" };
      filters.$or = [
        { title: regex },
        { category: regex },
        { subcategory: regex },
        { location: regex }
      ];
    }
    

    // Only products from verified merchants should be shown
    // Populate merchant info to check isVerified
    const products = await Product.find(filters)
      .populate({
        path: "merchant",
        match: { isVerified: true },
        select: "username email"
      })
      .sort({ createdAt: -1 });

    // Filter out products with non-verified merchants
    const filteredProducts = products.filter((p) => p.merchant !== null);

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: "Error browsing products" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const merchantId = req.user.id;

    const product = await Product.findOne({ _id: productId, merchant: merchantId });
    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    // Delete image file if exists
    if (product.imageUrl) {
      const imagePath = path.join(process.cwd(), "backend", product.imageUrl);
      fs.unlink(imagePath, () => {});
    }

    // await product.remove();
    await Product.deleteOne({ _id: product._id });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error deleting product" });
  }
};
