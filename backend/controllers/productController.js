import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new product
export const createProduct = async (req, res) => {
  try {
      const { name, description, price, category, subcategory } = req.body;
      const images = req.cloudinaryURLs || []; // Cloudinary image URLs

      const newProduct = new Product({
          name,
          description,
          price,
          category,
          subcategory,
          image: images, // Correctly store images
      });

      await newProduct.save();
      res.status(201).json(newProduct);
  } catch (error) {
      res.status(500).json({ message: "Error adding product", error });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
