import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`);
      const data = await res.json();
      setProduct(data);
      setCurrentIndex(0);
      setActiveImage(data.images[0]);

      if (data.sizes?.length === 1) setSelectedSize(data.sizes[0]);
      if (data.colors?.length === 1) setSelectedColor(data.colors[0]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <p className="p-6">Loading...</p>;

  //Image pagination
  const nextImage = () => {
    if (currentIndex < product.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setActiveImage(product.images[currentIndex + 1]);
    }
  };
  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setActiveImage(product.images[currentIndex - 1]);
    }
  };
  //Selection rules
  const sizeRequired = product.sizes?.length > 1;
  const colorRequired = product.colors?.length > 1;
  const canAddToCart =
    (!sizeRequired || selectedSize) && (!colorRequired || selectedColor);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Images */}
      <div>
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-[500px] object-contain border rounded"
        />
        {/* pagination controls */}
        <div className="flex justify-between mt-4">
          <button
            onClick={prevImage}
            disabled={currentIndex === 0}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            ◀ Prev
          </button>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {product.images.length}
          </span>
          <button
            onClick={nextImage}
            disabled={currentIndex === product.images.length - 1}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next ▶
          </button>
        </div>
        <div className="flex gap-3 mt-4">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              onClick={() => {
                setActiveImage(img);
                setCurrentIndex(index);
              }}
              className={`w-20 h-20 object-contain border rounded cursor-pointer ${
                currentIndex === index ? "border-blue-500" : ""
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600">{product.brand}</p>
        <p className="text-2xl font-bold mt-2">€{product.price}</p>
        <p className="mt-4 text-gray-700">{product.description}</p>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-1 rounded ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color) => {
                {
                  /* Normalize color string for CSS (fix Light Blue, Dark Red, etc.) */
                }
                const normalizedColor = color.toLowerCase().replace(/\s+/g, "");
                return (
                  <span
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border cursor-pointer ${
                      selectedColor === color ? "ring-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: normalizedColor }}
                    title={color}
                  />
                );
              })}
            </div>
          </div>
        )}
        {/* Quantity */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Quantity</h3>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              -
            </button>

            <span className="w-12 text-center border rounded py-1">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          disabled={!canAddToCart || isAdding}
          onClick={async () => {
            if (!canAddToCart) {
              toast.error("Please select size and color");
              return;
            }

            setIsAdding(true);

            const success = await addToCart(
              product,
              selectedSize,
              selectedColor,
              quantity,
            );

            if (success) {
              toast.success("Added to cart successfully 🛒");
              setQuantity(1);
            } else {
              toast.error("Something went wrong");
            }

            setIsAdding(false);
          }}
          className="mt-8 bg-blue-500 text-white px-6 py-3 rounded disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
