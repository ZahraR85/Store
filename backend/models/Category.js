import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Main category (e.g., Men, Women, Kids)
  subcategories: [{ type: String }], // List of subcategories
});

export default mongoose.model("Category", CategorySchema);
