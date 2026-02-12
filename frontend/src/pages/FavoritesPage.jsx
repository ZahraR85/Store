import { useFavorites } from "../context/FavoritesContext";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <p>No favorite products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favorites.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 shadow relative flex flex-col"
            >
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(p)}
                className="absolute top-2 right-2 text-xl z-10"
              >
                <FaHeart className="text-red-500" />
              </button>

              {/* Product Image & Link */}
              <Link to={`/product/${p._id}`} className="cursor-pointer">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-48 w-full object-cover rounded"
                />
                <h2 className="text-lg font-semibold mt-2">{p.name}</h2>
                <p className="text-gray-600">{p.brand}</p>
                <p className="text-gray-900 font-bold">€{p.price}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
