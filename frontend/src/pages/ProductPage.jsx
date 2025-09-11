import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart } from "react-icons/fa";

const ProductPage = () => {
  const { gender, categoryId, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [headerName, setHeaderName] = useState("");
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [gender, categoryId, subcategory]);

  const fetchProducts = async () => {
    try {
      let url = "http://localhost:3001/products";

      if (gender && categoryId && subcategory) {
        url = `http://localhost:3001/products/gender/${gender}/category/${categoryId}/subcategory/${subcategory}`;
        setHeaderName(subcategory);
      } else if (gender && categoryId) {
        url = `http://localhost:3001/products/gender/${gender}/category/${categoryId}`;
        setHeaderName("All in Category");
      } else if (gender) {
        url = `http://localhost:3001/products/gender/${gender}`;
        setHeaderName("All Products");
      } else {
        setHeaderName("All Products");
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
      <h2 className="text-2xl mb-4">
        {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : ""}{" "}
        {headerName ? `- ${headerName}` : ""}
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => {
            const isFav = favorites.some((f) => f._id === p._id);
            return (
              <div
                key={p._id}
                className="border rounded-lg p-4 shadow relative"
              >
                {/* Heart icon */}
                <button
                  onClick={() => toggleFavorite(p)}
                  className="absolute top-2 right-2 text-xl"
                >
                  <FaHeart
                    className={isFav ? "text-red-500" : "text-gray-400"}
                  />
                </button>

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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
