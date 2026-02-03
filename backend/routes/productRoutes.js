import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByGender,
  getProductsByGenderAndCategory,
  getProductsByGenderCategorySubcategory,
  getProductsBySearch
} from "../controllers/productController.js";
import fileUploader from "../middleware/fileUploader.js";
import cloudUploader from "../middleware/cloudinaryMultiple.js";
import { verifyToken, adminOnly } from "../middleware/auth.js";
const router = express.Router();

// Create product with images
router.post(
  "/",
  verifyToken,
  adminOnly,
  fileUploader.array("images", 15),
  cloudUploader,
  createProduct
);

// Get all products
router.get("/", getAllProducts);
// Search products by name (case-insensitive)
router.get('/search', getProductsBySearch);
// Get product by ID
router.get("/:id", getProductById);

// Get by gender
router.get("/gender/:gender", getProductsByGender);

// Get by gender + category
router.get("/gender/:gender/category/:categoryId", getProductsByGenderAndCategory);

// Get by gender + category + subcategory
router.get(
  "/gender/:gender/category/:categoryId/subcategory/:subcategory",
  getProductsByGenderCategorySubcategory
);


// Update product
router.put("/:id", verifyToken, adminOnly,
  fileUploader.array("images", 15), cloudUploader, updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
