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

const router = express.Router();

// Create product with images
router.post(
  "/",
  fileUploader.array("images", 15),
  cloudUploader,
  createProduct
);

// Get all products
router.get("/", getAllProducts);

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
router.get('/', getProductsBySearch);
// Update product
router.put("/:id", fileUploader.array("images", 15), cloudUploader, updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;
