import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { gender, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    category: "",
    subcategory: "",
    price: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      let url = "http://localhost:3001/products";
      if (filter.category) {
        url = `http://localhost:3001/products/category/${filter.category}`;
        if (filter.subcategory) {
          url += `/${filter.subcategory}`;
        }
      }
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <h1 className="text-2xl font-bold mb-4">
        {gender} - {subcategory}
      </h1>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {/* map categories here */}
        </select>
        <select
          onChange={(e) =>
            setFilter({ ...filter, subcategory: e.target.value })
          }
          className="border p-2 rounded"
          disabled={!filter.category}
        >
          <option value="">All Subcategories</option>
          {/* map subcategories here */}
        </select>
        <select
          onChange={(e) => setFilter({ ...filter, price: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg p-4 shadow">
            <img
              src={p.images[0]}
              alt={p.name}
              className="h-48 w-full object-cover rounded"
            />
            <h2 className="text-lg font-semibold mt-2">{p.name}</h2>
            <p className="text-gray-600">{p.brand}</p>
            <p className="text-gray-900 font-bold">€{p.price}</p>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
