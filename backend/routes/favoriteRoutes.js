import express from "express";
import { toggleFavorite, getFavorites } from "../controllers/favoriteController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get user's favorites
router.get("/", verifyToken, getFavorites);

// Toggle favorite product
router.post("/toggle", verifyToken, toggleFavorite);

export default router;
