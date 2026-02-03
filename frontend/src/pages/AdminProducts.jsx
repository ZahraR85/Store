import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const { role } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") navigate("/");
    fetchProducts();
  }, [role]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3001/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const res = await fetch(`http://localhost:3001/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p._id} className="border p-4 rounded shadow">
            <img
              src={p.images[0]}
              alt={p.name}
              className="h-40 object-contain mx-auto"
            />
            <h2 className="font-semibold mt-2">{p.name}</h2>
            <p className="text-gray-600">€{p.price}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
