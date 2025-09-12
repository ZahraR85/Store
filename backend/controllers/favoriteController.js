import Favorite from "../models/Favorite.js";

// Toggle favorite product

export const toggleFavorite = async (req, res) => {
  const { productId } = req.body;
 const userId = req.user.id; // will now correctly have the user ID

  if (!productId) return res.status(400).json({ msg: "Product ID is required" });
  if (!userId) return res.status(401).json({ msg: "User not authorized" });

  try {
    const existing = await Favorite.findOne({ user: userId, product: productId });

    if (existing) {
      // old: await existing.remove();
      await Favorite.findByIdAndDelete(existing._id); // ✅ new way
      return res.json({ msg: "Removed from favorites" });
    }

    const newFav = new Favorite({ user: userId, product: productId });
    await newFav.save();

    res.json({ msg: "Added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all favorites for a user
export const getFavorites = async (req, res) => {

  try {
    const userId = req.user.id;
    const favorites = await Favorite.find({ user: userId }).populate("product");
    res.json(favorites.map(f => f.product)); // send only products
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};