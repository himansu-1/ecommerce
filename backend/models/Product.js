import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    subcategory: { type: String, trim: true, index: true },
    price: { type: Number, required: true, index: true },
    location: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Compound indexes for category, subcategory, price to optimize queries
productSchema.index({ category: 1, subcategory: 1, price: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
