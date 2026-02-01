import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, size, color) => {
    const existingItem = cartItems.find(
      (item) =>
        item._id === product._id && item.size === size && item.color === color,
    );

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          ...product,
          size,
          color,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
