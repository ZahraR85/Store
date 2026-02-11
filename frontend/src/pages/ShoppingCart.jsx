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
            to={`/products/${item.product._id}`}
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

                  {/* Color circle */}
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

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 hover:underline"
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
