import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
      sizes: [String],
  colors: [String],
    images:[{ type: String }], // Image URL
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: String, trim: true }, // Example: "Jeans"
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

export default mongoose.model("Product", ProductSchema);
