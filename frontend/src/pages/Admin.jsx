import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { userId, role } = useAppContext();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState("");
  //const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    subcategory: "",
  });

  useEffect(() => {
    if (!userId || role !== "admin") {
      navigate("/"); // Redirect to home if not an admin
    } else {
      fetchCategories();
    }
  }, [userId, role, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          subcategories: subcategories.split(",").map((s) => s.trim()),
        }),
      });

      if (response.ok) {
        fetchCategories(); // Refresh categories after adding
        setCategoryName("");
        setSubcategories("");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setProductData({
          name: "",
          description: "",
          price: "",
          image: "",
          category: "",
          subcategory: "",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p>Welcome, Admin! Manage your products and categories here.</p>

      {/* Add Category */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Add Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Subcategories (comma separated)"
          value={subcategories}
          onChange={(e) => setSubcategories(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Add Category
        </button>
      </div>

      {/* Add Product */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Add Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productData.name}
          onChange={(e) =>
            setProductData({ ...productData, name: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={productData.description}
          onChange={(e) =>
            setProductData({ ...productData, description: e.target.value })
          }
          className="border p-2 rounded w-full mt-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={productData.price}
          onChange={(e) =>
            setProductData({ ...productData, price: e.target.value })
          }
          className="border p-2 rounded w-full mt-2"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={productData.image}
          onChange={(e) =>
            setProductData({ ...productData, image: e.target.value })
          }
          className="border p-2 rounded w-full mt-2"
        />
        <select
          value={productData.category}
          onChange={(e) =>
            setProductData({ ...productData, category: e.target.value })
          }
          className="border p-2 rounded w-full mt-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default Admin;
