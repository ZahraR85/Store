import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ShoppingCart = () => {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className="p-6">
      {cartItems.length === 0 && <p>Your cart is empty.</p>}

      {cartItems.map((item) => (
        <div key={item._id} className="flex items-center gap-4 border-b py-4">
          {/* Clicking image or name goes to ProductDetails page */}
          <Link
            to={`/product/${item.product._id}`}
            className="flex items-center gap-4"
          >
            <img
              src={item.product.images[0]}
              alt={item.product.name}
              className="w-24 h-24 object-contain"
            />
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-gray-500">€{item.product.price}</p>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;
