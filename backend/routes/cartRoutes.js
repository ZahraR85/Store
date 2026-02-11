import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Add item with quantity
router.post("/add", verifyToken, addToCart);

// Get user cart
router.get("/", verifyToken, getCart);

// Remove item
router.delete("/remove/:itemId", verifyToken, removeFromCart);

// Update item quantity
router.put("/update/:itemId", verifyToken, updateCartItem); // changed PATCH → PUT for consistency

// Clear cart
router.delete("/clear", verifyToken, clearCart);

export default router;