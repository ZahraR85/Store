import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["men", "women", "kids", "home"], required: true },
  subcategories: [String],
});

export default mongoose.model("Category", categorySchema);
