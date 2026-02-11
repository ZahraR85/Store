import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAppContext();

  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchProduct();
  }, [role]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`);
      const data = await res.json();

      // Convert arrays to comma separated string for input fields
      setProduct({
        ...data,
        sizes: data.sizes?.join(", ") || "",
        colors: data.colors?.join(", ") || "",
      });
    } catch (err) {
      toast.error("Failed to load product");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  // Optimistic delete with toast + rollback
  const removeOldImage = async (imgUrl) => {
    if (product.images.length === 1) {
      toast.error("Product must have at least one image");
      return;
    }

    const previousImages = [...product.images];

    // Optimistic UI
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imgUrl),
    }));

    const toastId = toast.loading("Deleting image...");

    try {
      const res = await fetch(`http://localhost:3001/products/${id}/image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl: imgUrl }),
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Image deleted", { id: toastId });
    } catch (error) {
      // rollback
      setProduct((prev) => ({
        ...prev,
        images: previousImages,
      }));

      toast.error("Failed to delete image", { id: toastId });
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (product.images.length === 0 && newImages.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("brand", product.brand);
    formData.append("stock", product.stock);
    formData.append("sizes", product.sizes);
    // Normalize colors before sending
    const normalizedColors = product.colors
      .split(",")
      .map((color) => color.trim())
      .map((color) =>
        color
          .toLowerCase()
          .replace(/\s+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      )
      .join(", ");

    formData.append("colors", normalizedColors);
    product.images.forEach((img) => {
      formData.append("existingImages", img);
    });

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    const toastId = toast.loading("Updating product...");
    setUpdating(true);

    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Product updated successfully", { id: toastId });
      navigate("/admin/products");
    } catch (err) {
      toast.error("Failed to update product", { id: toastId });
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (!product) {
    return <div className="p-10">Loading...</div>;
  }

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
        name="sizes"
        value={product.sizes}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Sizes (e.g. S, M, L, XL)"
      />

      <input
        name="colors"
        value={product.colors}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Colors (e.g. Red, Light Blue, Black)"
      />
      <input
        name="stock"
        value={product.stock}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        placeholder="Stock"
      />

      {/* Existing images */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt="product"
              className="w-20 h-20 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeOldImage(img)}
              className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* New images */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleUpdate}
        disabled={updating}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {updating ? "Updating..." : "Update Product"}
      </button>
    </div>
  );
};

export default EditProduct;
