import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAppContext();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    stock: "",
  });

  useEffect(() => {
    if (role !== "admin") navigate("/");
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

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:3001/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert("Product updated");
      navigate("/admin/products");
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
