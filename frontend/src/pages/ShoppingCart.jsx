import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
import { useFavorites } from "../context/FavoritesContext";

const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  // Local quantity state (per cart item)
  const [quantities, setQuantities] = useState({});

  // Sync local quantities when cartItems change
  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach((item) => {
      initialQuantities[item._id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  // Handle quantity change
  const handleQuantityChange = (itemId, newValue) => {
    const newQuantity = Math.max(1, Number(newValue));

    // Update local state immediately (UI feels fast)
    setQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    // Update backend
    updateQuantity(itemId, newQuantity);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const quantity = quantities[item._id] || 1;
    return total + item.product.price * quantity;
  }, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {cartItems.length === 0 && (
        <p className="text-lg text-center">Your cart is empty.</p>
      )}

      {cartItems.map((item) => {
        const quantity = quantities[item._id] || 1;
        const subtotal = item.product.price * quantity;

        return (
          <div key={item._id} className="flex items-center gap-6 border-b py-6">
            {/* Product Info */}
            <Link
              to={`/product/${item.product._id}`}
              className="flex items-center gap-4 flex-1"
            >
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="w-24 h-24 object-contain"
              />

              <div>
                <p className="font-semibold text-lg">{item.product.name}</p>

                <p className="text-gray-500">
                  €{item.product.price.toFixed(2)}
                </p>

                {/* Size */}
                {item.size && (
                  <p className="text-sm text-gray-600">
                    Size: <span className="font-medium">{item.size}</span>
                  </p>
                )}

                {/* Color */}
                {item.color && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Color:</span>

                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{
                        backgroundColor: item.color
                          .toLowerCase()
                          .replace(/\s+/g, ""),
                      }}
                      title={item.color}
                    />

                    <span className="font-medium">{item.color}</span>
                  </div>
                )}
              </div>
            </Link>
            {/* Favorite Button */}
            <button
              onClick={() => toggleFavorite(item.product)}
              className="text-xl"
            >
              <FaHeart
                className={
                  favorites.some((f) => f._id === item.product._id)
                    ? "text-red-500"
                    : "text-gray-300 hover:text-red-400"
                }
              />
            </button>
            {/* Quantity Controls */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(item._id, quantity - 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(item._id, e.target.value)
                  }
                  className="w-16 text-center border rounded py-1"
                />

                <button
                  onClick={() => handleQuantityChange(item._id, quantity + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="text-sm font-semibold">€{subtotal.toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-black-500 hover:underline"
              >
                <FaTrash className="inline ml-1" />
              </button>
            </div>
          </div>
        );
      })}

      {/* Total Section */}
      {cartItems.length > 0 && (
        <div className="mt-8 flex justify-between items-center border-t pt-6">
          <h2 className="text-xl font-bold">Total:</h2>

          <p className="text-2xl font-bold">€{totalPrice.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
