import Category from "../models/Category.js";

// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.body;

    const category = new Category({
      name,
      subcategories: subcategories || [],
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Add Category Error:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
