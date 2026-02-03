import Product from "../models/Product.js";

// Create a product
export const createProduct = async (req, res) => {
  try {
    // Get form-data fields
    const {
      name,
      gender,
      description,
      price,
      sizes,
      colors,
      category,
      subcategory,
      brand,
      stock,
    } = req.body;

    // Convert comma-separated strings to arrays
    const sizesArray = sizes ? sizes.split(",").map((s) => s.trim()) : [];
    const colorsArray = colors ? colors.split(",").map((c) => c.trim()) : [];

    // Get uploaded images URLs from cloudUploader
    //const images = req.files?.map((file) => file.path) || [];
    const images = req.cloudinaryURLs || [];

    const product = new Product({
      name,
      gender,
      description,
      price,
      images,
      category,
      subcategory,
      brand,
      sizes: sizesArray,
      colors: colorsArray,
      stock: stock || 0,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: "Failed to create product", details: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand,
      stock,
      sizes,
      colors,
      subcategory,
      existingImages,
    } = req.body;

    // the fields to be updated
    const updateData = {
      name,
      description,
      price,
      brand,
      stock,
      subcategory,
    };

    // sizes and colors are converted to arrays if provided
    if (sizes) updateData.sizes = sizes.split(",").map((s) => s.trim());
    if (colors) updateData.colors = colors.split(",").map((c) => c.trim());

    // new images uploaded to the cloud
    const newImages = req.cloudinaryURLs || [];

    // combine old and new images
    let finalImages = [];
    if (existingImages) {
      finalImages = Array.isArray(existingImages)
        ? existingImages
        : [existingImages];
    }
    if (finalImages.length > 0 || newImages.length > 0) {
      updateData.images = [...finalImages, ...newImages];
    }

    // update product
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(400).json({
      error: "Failed to update product",
      details: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
// Get products by gender
export const getProductsByGender = async (req, res) => {
  try {
    const products = await Product.find({ gender: req.params.gender }).populate("category");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products by gender" });
  }
};

// Get products by gender + category
export const getProductsByGenderAndCategory = async (req, res) => {
  try {
    const products = await Product.find({
      gender: req.params.gender,
      category: req.params.categoryId,
    }).populate("category");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products by gender and category" });
  }
};

// Get products by gender + category + subcategory (case-insensitive)
export const getProductsByGenderCategorySubcategory = async (req, res) => {
  try {
    const { gender, categoryId, subcategory } = req.params;

    // Use regex for case-insensitive matching
    const products = await Product.find({
      gender,
      category: categoryId,
      subcategory: { $regex: `^${subcategory}$`, $options: "i" }
    }).populate("category");

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products by gender, category, and subcategory" });
  }
};
// Search products by name (case-insensitive)
function escapeRegex(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export const getProductsBySearch = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: new RegExp(escapeRegex(name), "i") };
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
