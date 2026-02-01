import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart } from "react-icons/fa";

const ProductPage = () => {
  const { gender, categoryId, subcategory } = useParams();
  const navigate = useNavigate();

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

  const isFavorite = (productId) => {
    return favorites.some((f) => f._id === productId);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">
        {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : ""}
        {headerName ? ` - ${headerName}` : ""}
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 shadow relative cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(p);
                }}
                className="absolute top-2 right-2 text-xl"
              >
                <FaHeart
                  className={
                    isFavorite(p._id) ? "text-red-500" : "text-gray-400"
                  }
                />
              </button>

              {/* Image */}
              <img
                src={p.images[0]}
                alt={p.name}
                className="h-72 w-72 object-contain rounded mx-auto"
              />

              {/* Info */}
              <h2 className="text-sm font-semibold mt-2">{p.name}</h2>
              <p className="text-m text-gray-600">{p.brand}</p>
              <p className="text-gray-900 font-bold">€{p.price}</p>

              {/* Colors */}
              {p.colors?.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {p.colors.map((color) => (
                    <span
                      key={color}
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
