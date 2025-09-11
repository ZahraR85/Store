import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { userId, role } = useAppContext();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [genderForCategory, setGenderForCategory] = useState("women");
  const [subcategoriesInput, setSubcategoriesInput] = useState("");

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    images: [],
    gender: "",
    category: "",
    subcategory: "",
    brand: "",
    sizes: [],
    colors: [],
    stock: "",
  });

  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    if (!userId || role !== "admin") {
      navigate("/");
    }
  }, [userId, role, navigate]);

  // Fetch categories when gender is selected
  useEffect(() => {
    if (productData.gender) {
      fetchCategoriesByGender(productData.gender);
    }
  }, [productData.gender]);

  const fetchCategoriesByGender = async (gender) => {
    try {
      const res = await fetch(
        `http://localhost:3001/categories?gender=${gender}`
      );
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    try {
      const res = await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          gender: genderForCategory,
          subcategories: subcategoriesInput.split(",").map((s) => s.trim()),
        }),
      });

      if (res.ok) {
        setCategoryName("");
        setSubcategoriesInput("");
        if (genderForCategory === productData.gender) {
          fetchCategoriesByGender(genderForCategory);
        }
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
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/ddx3jbnt2/image/upload",
          { method: "POST", body: formData }
        );
        const data = await response.json();
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
      !productData.name ||
      !productData.price
    ) {
      alert("Please fill all required fields: Gender, Category, Name, Price");
      return;
    }

    const formData = new FormData();

    // Append product info
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("subcategory", productData.subcategory);
    formData.append("brand", productData.brand);
    formData.append("sizes", productData.sizes.join(","));
    formData.append("colors", productData.colors.join(","));
    formData.append("stock", productData.stock);
    formData.append("gender", productData.gender);

    // Append images
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        body: formData, // important: multipart/form-data
      });

      if (response.ok) {
        alert("Product added successfully!");
        setProductData({
          name: "",
          description: "",
          price: "",
          images: [],
          category: "",
          subcategory: "",
          brand: "",
          sizes: [],
          colors: [],
          stock: "",
          gender: "",
        });
        setImageFiles([]);
      } else {
        const err = await response.json();
        console.error("Failed to add product:", err);
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div className="mx-auto max-w-[1200px] bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Add Category */}
        <div className="border p-4 rounded space-y-3">
          <h2 className="text-xl font-semibold">Add Category</h2>
          <select
            value={genderForCategory}
            onChange={(e) => setGenderForCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
            <option value="home">Home</option>
            <option value="unisex">Unisex</option>
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
            value={subcategoriesInput}
            onChange={(e) => setSubcategoriesInput(e.target.value)}
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
        <div className="border p-4 rounded space-y-3">
          <h2 className="text-xl font-bold">Add Product</h2>
          <select
            value={productData.gender}
            onChange={(e) =>
              setProductData({
                ...productData,
                gender: e.target.value,
                category: "",
                subcategory: "",
              })
            }
            className="border p-2 rounded w-full"
          >
            <option value="">Select Gender</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
            <option value="home">Home</option>
            <option value="unisex">Unisex</option>
          </select>

          <select
            value={productData.category}
            onChange={(e) =>
              setProductData({
                ...productData,
                category: e.target.value,
                subcategory: "",
              })
            }
            className="border p-2 rounded w-full"
            disabled={!productData.gender}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={productData.subcategory}
            onChange={(e) =>
              setProductData({ ...productData, subcategory: e.target.value })
            }
            className="border p-2 rounded w-full"
            disabled={!productData.category}
          >
            <option value="">Select Subcategory</option>
            {categories
              .find((cat) => cat._id === productData.category)
              ?.subcategories.map((sub, idx) => (
                <option key={idx} value={sub}>
                  {sub}
                </option>
              ))}
          </select>

          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="border p-2 rounded w-full"
          />
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 rounded w-full"
          ></textarea>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleInputChange}
            placeholder="Brand"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="sizes"
            value={productData.sizes}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(","),
              })
            }
            placeholder="Sizes (comma separated, e.g. S,M,L)"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="colors"
            value={productData.colors}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(","),
              })
            }
            placeholder="Colors (comma separated, e.g. Black,Blue)"
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            className="border p-2 rounded w-full"
          />
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png"
            onChange={(e) =>
              setImageFiles([...imageFiles, ...Array.from(e.target.files)])
            }
            className="border p-2 rounded w-full mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImageFiles(imageFiles.filter((_, i) => i !== index))
                  }
                  className="absolute top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
