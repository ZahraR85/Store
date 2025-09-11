import express from "express";
import { addCategory, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

// Add a new category
router.post("/", addCategory);

// Get categories (optionally filtered by gender)
router.get("/", getCategories);

export default router;
