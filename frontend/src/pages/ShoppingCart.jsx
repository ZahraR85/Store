import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const { cartItems, removeFromCart, updateCartItem, clearCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-6 border-b py-4"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 object-contain"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.product.name}</h2>
                <p className="text-sm text-gray-600">
                  Size: {item.size || "-"} | Color: {item.color || "-"}
                </p>
                <p>
                  €{item.product.price} × {item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <h2 className="text-xl font-bold mt-6">Total: €{total.toFixed(2)}</h2>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
