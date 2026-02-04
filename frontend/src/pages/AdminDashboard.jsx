import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { userId, role } = useAppContext();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [genderForCategory, setGenderForCategory] = useState("women");
  const [subcategoriesInput, setSubcategoriesInput] = useState("");

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    gender: "",
    category: "",
    subcategory: "",
    brand: "",
    sizes: [],
    colors: [],
    stock: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    if (!userId || role !== "admin") navigate("/");
  }, [userId, role]);

  useEffect(() => {
    if (productData.gender) fetchCategoriesByGender(productData.gender);
  }, [productData.gender]);

  const fetchCategoriesByGender = async (gender) => {
    try {
      const res = await fetch(
        `http://localhost:3001/categories?gender=${gender}`,
      );
      setCategories(await res.json());
    } catch {
      toast.error("Error while fetching categories");
    }
  };

  // ➕ Add Category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoadingCategory(true);
    try {
      const res = await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: categoryName,
          gender: genderForCategory,
          subcategories: subcategoriesInput.split(",").map((s) => s.trim()),
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Category added successfully ✅");
      setCategoryName("");
      setSubcategoriesInput("");
      fetchCategoriesByGender(genderForCategory);
    } catch {
      toast.error("Error adding category");
    } finally {
      setLoadingCategory(false);
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
          { method: "POST", body: formData },
        );
        const data = await response.json();
        uploadedImages.push(data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    return uploadedImages;
  };
  // ➕ Add Product
  const handleAddProduct = async () => {
    if (
      !productData.gender ||
      !productData.category ||
      !productData.name ||
      !productData.price
    ) {
      toast.error("Gender, Category, Name, and Price are required");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    setLoadingProduct(true);
    const formData = new FormData();

    Object.entries(productData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else {
        formData.append(key, value);
      }
    });

    imageFiles.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("Product added successfully ");
      setProductData({
        name: "",
        description: "",
        price: "",
        gender: "",
        category: "",
        subcategory: "",
        brand: "",
        sizes: [],
        colors: [],
        stock: "",
      });
      setImageFiles([]);
    } catch {
      toast.error("Error adding product");
    } finally {
      setLoadingProduct(false);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div className="max-w-[1200px] mx-auto bg-white p-6 rounded shadow space-y-6">
        {/* Add Category */}
        <div className="border p-4 rounded space-y-3">
          <h2 className="text-xl font-semibold">Add Category</h2>

          <select
            value={genderForCategory}
            onChange={(e) => setGenderForCategory(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
            <option value="home">Home</option>
          </select>

          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category name"
            className="border p-2 w-full"
          />
          <input
            value={subcategoriesInput}
            onChange={(e) => setSubcategoriesInput(e.target.value)}
            placeholder="Subcategories ( , )"
            className="border p-2 w-full"
          />

          <button
            onClick={handleAddCategory}
            disabled={loadingCategory}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingCategory ? "Adding..." : "Add Category"}
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
            disabled={loadingProduct}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingProduct ? "Saving..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
