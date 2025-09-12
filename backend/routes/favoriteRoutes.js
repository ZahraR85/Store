import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { toggleFavorite , getFavorites} from "../controllers/favoriteController.js";

const router = express.Router();

router.get("/", verifyToken, getFavorites); // GET favorites
router.post("/toggle", verifyToken, toggleFavorite); // POST toggle

export default router;
