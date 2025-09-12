import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Fetch favorites from backend (only if user is logged in)
  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // stop if user not logged in

    try {
      const res = await fetch("http://localhost:3001/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch favorites:", res.status);
        return;
      }

      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle favorite product
  const toggleFavorite = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add favorites");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!res.ok) {
        console.error("Failed to toggle favorite:", res.status);
        return;
      }

      fetchFavorites(); // refresh favorites after toggle
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, fetchFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
