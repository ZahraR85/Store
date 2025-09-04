import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import fileUploader from "../middleware/fileUploader.js";
import cloudUploader from "../middleware/cloudinaryMultiple.js";

const router = express.Router();

// Create a product (uploads images)
router.post(
  "/",
  fileUploader.array("images", 15), // Handle multiple files
  (req, res, next) => {
      console.log("Middleware Debug - Received files:", req.files); // Check files
      if (!req.files) {
          return res.status(400).json({ error: "No files uploaded" });
      }
      next();
  },
  cloudUploader, // Upload images to Cloudinary
  createProduct
);


// Get all products
router.get("/", getAllProducts);

// Get a product by ID
router.get("/:id", getProductById);

// Update a product (with new images)
router.put(
    "/:id",
    fileUploader.array("images", 15), 
    cloudUploader,
    updateProduct
);

// Delete a product
router.delete("/:id", deleteProduct);

export default router;
