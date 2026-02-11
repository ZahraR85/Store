import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");

  // FETCH CART
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

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [token]);
  // Count items
  useEffect(() => {
    const count = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0,
    );
    setCartCount(count);
  }, [cartItems]);

  // ADD TO CART
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
          size,
          color,
          quantity,
        }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setCartItems(data.items);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  // UPDATE QUANTITY
  const updateQuantity = async (cartItemId, quantity) => {
    if (!token) {
      toast.error("Please login first");
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
        toast.error("Failed to update quantity");
        return;
      }

      const data = await res.json();
      setCartItems(data.items || []);

      toast.success("Quantity updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // REMOVE
  const removeFromCart = async (cartItemId) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/cart/remove/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        toast.error("Failed to remove item");
        return;
      }

      const data = await res.json();
      setCartItems(data.items || []);

      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Remove failed");
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
