import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAppContext();

  const token = localStorage.getItem("token");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    stock: "",
    images: [],
  });

  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchProduct();
  }, [role]);

  const fetchProduct = async () => {
    const res = await fetch(`http://localhost:3001/products/${id}`);
    const data = await res.json();
    setProduct(data);
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const removeOldImage = (index) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index),
    });
  };

  const handleUpdate = async () => {
    if (product.images.length === 0 && newImages.length === 0) {
      alert("At least one image is required");
      return;
    }
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("brand", product.brand);
    formData.append("stock", product.stock);
    formData.append("gender", product.gender);

    // category can be populated object or ID
    formData.append(
      "category",
      typeof product.category === "object"
        ? product.category._id
        : product.category,
    );
    // old images (after delete)
    formData.append("existingImages", JSON.stringify(product.images));

    // new images
    newImages.forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch(`http://localhost:3001/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert("Product updated successfully");
      navigate("/admin/products");
    } else {
      const err = await res.json();
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>

      <input
        name="name"
        value={product.name}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Name"
      />

      <input
        name="price"
        value={product.price}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Price"
      />

      <input
        name="brand"
        value={product.brand}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Brand"
      />

      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Description"
      />

      <input
        name="stock"
        value={product.stock}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        placeholder="Stock"
      />

      {/* current images */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.images?.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt="product"
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeOldImage(index)}
              className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/*add new images*/}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update Product
      </button>
    </div>
  );
};

export default EditProduct;
