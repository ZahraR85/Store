import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { userId, role } = useAppContext();
  const navigate = useNavigate();

  const [genders] = useState(["women", "men", "kids", "home"]); // Gender options
  const [categories, setCategories] = useState([]);
  const [categoryGender, setCategoryGender] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState("");

  const [productData, setProductData] = useState({
    gender: "",
    category: "",
    subcategory: "",
    name: "",
    description: "",
    price: "",
    brand: "",
    sizes: [],
    colors: [],
    stock: "",
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (!userId || role !== "admin") navigate("/");
    else fetchCategories();
  }, [userId, role, navigate]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryGender || !categoryName)
      return alert("Gender & Category required");
    try {
      const res = await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: categoryGender,
          name: categoryName,
          subcategories: subcategories.split(",").map((s) => s.trim()),
        }),
      });
      if (res.ok) {
        setCategoryGender("");
        setCategoryName("");
        setSubcategories("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
  };

  const uploadImagesToCloudinary = async () => {
    const uploadedImages = [];
    for (let file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");
      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/ddx3jbnt2/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        uploadedImages.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    return uploadedImages;
  };

  const handleAddProduct = async () => {
    if (
      !productData.gender ||
      !productData.category ||
      !productData.subcategory
    ) {
      return alert("Gender, Category & Subcategory are required");
    }
    const uploadedImages = await uploadImagesToCloudinary();
    try {
      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productData, images: uploadedImages }),
      });
      if (res.ok) {
        setProductData({
          gender: "",
          category: "",
          subcategory: "",
          name: "",
          description: "",
          price: "",
          brand: "",
          sizes: [],
          colors: [],
          stock: "",
          images: [],
        });
        setImageFiles([]);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-[1200px] mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        {/* Add Category */}
        <div className="border p-4 rounded space-y-2">
          <h2 className="text-xl font-semibold">Add Category</h2>
          <select
            value={categoryGender}
            onChange={(e) => setCategoryGender(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
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
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Category
          </button>
        </div>

        {/* Add Product */}
        <div className="border p-4 rounded space-y-2">
          <h2 className="text-xl font-semibold">Add Product</h2>

          <select
            name="gender"
            value={productData.gender}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Category</option>
            {categories
              .filter((c) => c.gender === productData.gender)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>

          <select
            name="subcategory"
            value={productData.subcategory}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            disabled={!productData.category}
          >
            <option value="">Select Subcategory</option>
            {categories
              .find((c) => c._id === productData.category)
              ?.subcategories.map((sub, i) => (
                <option key={i} value={sub}>
                  {sub}
                </option>
              ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productData.name}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={productData.description}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={productData.brand}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="sizes"
            placeholder="Sizes (comma separated)"
            value={productData.sizes}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(","),
              })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="colors"
            placeholder="Colors (comma separated)"
            value={productData.colors}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(","),
              })
            }
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={productData.stock}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          />

          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="border p-2 rounded w-full"
          />
          <div className="flex gap-2 flex-wrap">
            {imageFiles.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-16 h-16 object-cover rounded"
              />
            ))}
          </div>

          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
