import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`);
      const data = await res.json();
      setProduct(data);
      setActiveImage(data.images[0]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Images */}
      <div>
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-[500px] object-contain border rounded"
        />

        <div className="flex gap-3 mt-4">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              onClick={() => setActiveImage(img)}
              className={`w-20 h-20 object-contain border rounded cursor-pointer
                ${activeImage === img ? "border-blue-500" : ""}`}
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
                  className="border px-4 py-1 rounded hover:bg-gray-100"
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
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        <button className="mt-8 bg-blue-500 text-white px-6 py-3 rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
