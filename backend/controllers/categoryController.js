import Category from "../models/Category.js";

// Add a new category
export const addCategory = async (req, res) => {
  try {
    const { name, gender, subcategories } = req.body;

    if (!name || !gender) {
      return res.status(400).json({ error: "Name and gender are required" });
    }

    const newCategory = new Category({
      name,
      gender,
      subcategories: subcategories || [],
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Add Category Error:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// Get all categories or filter by gender
export const getCategories = async (req, res) => {
  try {
    const { gender } = req.query;
    let query = {};
    if (gender) query.gender = gender; // filter by gender if provided

    const categories = await Category.find(query);
    res.json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
