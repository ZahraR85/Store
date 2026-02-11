import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch cart
  const fetchCart = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3001/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
    else setCartItems([]);
  }, [token]);

  // Count items
  useEffect(() => {
    const count = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    setCartCount(count);
  }, [cartItems]);

  // Add to cart
  const addToCart = async (product, size, color, quantity = 1) => {
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch("http://localhost:3001/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          size: size || null,
          color: color || null,
          quantity,
        }),
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Update quantity for a specific cart item
  const updateQuantity = async (cartItemId, quantity) => {
    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/cart/update/${cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        return;
      }

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    if (!token) return alert("You must be logged in");

    try {
      const res = await fetch(
        `http://localhost:3001/cart/remove/${cartItemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
