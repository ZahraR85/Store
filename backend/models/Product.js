import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
    gender: {
    type: String,
    enum: ["men", "women", "kids", "home", "All"],
    required: true,
    default: "All",
  },
  description: String,
  price: { type: Number, required: true, min: 0},
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subcategory: { type: String }, // stored as string from category.subcategories
  brand: String,
  sizes: [String],   // ["S", "M", "L", "XL"]
  colors: [String],  // ["Black", "Blue", "Red"]
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
