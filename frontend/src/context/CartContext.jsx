import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");

  // fetchCart outside of useEffect
  const fetchCart = async () => {
    if (!token) return;

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

  // when token is changed (login/logout)
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]); // logout → cart empty
    }
  }, [token]);

  // counter of cart items (SUM OF QUANTITIES)
  useEffect(() => {
    const count = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    setCartCount(count);
  }, [cartItems]);

  // ===============================
  // ADD TO CART (WITH QUANTITY)
  // ===============================
  const addToCart = async (product, size, color, quantity = 1) => {
    if (!token) {
      alert("You must be logged in");
      return;
    }

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
          quantity: quantity || 1,
        }),
      });

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // UPDATE QUANTITY
  // ===============================
  const updateQuantity = async (cartItemId, quantity) => {
    if (!token) return alert("You must be logged in");

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

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // REMOVE FROM CART
  // ===============================
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
        updateQuantity, // ✅ added
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
