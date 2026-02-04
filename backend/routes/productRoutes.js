import express from "express";
import Product from "../models/Product.js";
import cloudinary from "../middleware/cloudinary.js";

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

// Update product with optional new images
router.put(
  "/:id",
  verifyToken,
  adminOnly,
  (req, res, next) => {
    // Check if request has new files
    const isMultipart = req.headers["content-type"]?.startsWith("multipart/form-data");

    if (isMultipart) {
      // Use multer only if files are present
      fileUploader.array("images", 15)(req, res, (err) => {
        if (err) return next(err);

        // Only run cloudUploader if new files exist
        if (req.files && req.files.length > 0) {
          cloudUploader(req, res, next);
        } else {
          next();
        }
      });
    } else {
      next();
    }
  },
  updateProduct
);


// Delete product
router.delete("/:id", deleteProduct);

// DELETE /products/:id/image
router.delete("/:id/image", verifyToken, adminOnly, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.images = product.images.filter(img => img !== imageUrl);
    await product.save();

    const publicId = imageUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: "Image deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});


export default router;
