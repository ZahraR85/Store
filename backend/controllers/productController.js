import Product from "../models/Product.js";

// Create a product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, sizes, colors, category, subcategory, stock } = req.body;

    // Map uploaded files to URLs (already handled by cloudUploader middleware)
    const images = req.files?.map(file => file.path) || [];

    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      subcategory,
      brand,
      sizes,
      colors,
      stock,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: "Failed to create product" });
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
    const { name, description, price, sizes, colors, category, subcategory, stock } = req.body;

    const images = req.files?.map(file => file.path); // Replace images if new files uploaded

    const updateData = {
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      sizes,
      colors,
      stock,
    };

    if (images && images.length > 0) updateData.images = images;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ error: "Failed to update product" });
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
