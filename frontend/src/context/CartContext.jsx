import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Read token from localStorage
  const token = localStorage.getItem("token");

  // Load cart from backend when app mounts
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return; // skip if no token

      try {
        const res = await fetch("http://localhost:3001/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCartItems(data.items || []);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };
    fetchCart();
  }, [token]);

  // Update cart count
  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  // Add item to cart
  const addToCart = async (product, size, color) => {
    if (!token) {
      console.log("No token found");
      alert("You must be logged in");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send token here
        },
        body: JSON.stringify({
          productId: product._id,
          size: size || null,
          color: color || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add to cart");
      }

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch(`http://localhost:3001/cart/remove/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
