import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    viewedAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

viewSchema.index({ product: 1, user: 1 });

const View = mongoose.model("View", viewSchema);

export default View;
