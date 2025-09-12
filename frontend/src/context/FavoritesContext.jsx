// src/context/FavoritesContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAppContext } from "./AppContext";
const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  const [favorites, setFavorites] = useState([]);

  const normalizeServerData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => (item.product ? item.product : item));
  };

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch favorites:", res.status);
        // اگر توکن نامعتبره یا 401 شد، پیشنهادم اینه که در AppContext signOut کنین.
        return;
      }

      const data = await res.json();
      const normalized = normalizeServerData(data);
      setFavorites(normalized);

      localStorage.removeItem("favorites");
    } catch (err) {
      console.error("fetchFavorites error:", err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isAuthenticated && token) {
      fetchFavorites();
    } else {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, fetchFavorites]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = async (product) => {
    const token = localStorage.getItem("token");
    if (token && isAuthenticated) {
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

        await fetchFavorites();
      } catch (err) {
        console.error("toggleFavorite (server) error:", err);
      }
    } else {
      setFavorites((prev) => {
        const exists = prev.some((p) => p._id === product._id);
        if (exists) {
          return prev.filter((p) => p._id !== product._id);
        } else {
          return [...prev, product];
        }
      });
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
