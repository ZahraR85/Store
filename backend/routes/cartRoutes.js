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

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.delete("/remove/:itemId", verifyToken, removeFromCart);
router.patch("/update/:itemId", verifyToken, updateCartItem);
router.delete("/clear", verifyToken, clearCart);

export default router;
