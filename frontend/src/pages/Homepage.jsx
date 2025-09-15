import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProductId, setHoveredProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <ToastContainer />
      {/* Hero Section with Looping Video */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://www.youtube.com/watch?v=IFZ-7hM689E"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white p-6 md:p-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fadeInUp">
              New Season. New Style.
            </h1>
            <p className="text-lg md:text-xl mb-8 animate-fadeInUp delay-200">
              Discover our latest collections for clothing and home.
            </p>
            <a
              href="#"
              className="bg-white text-gray-900 py-3 px-8 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition-colors duration-300 animate-fadeInUp delay-400"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Product Grid */}
      <div className="container mx-auto py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                onMouseEnter={() => setHoveredProductId(product._id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                <div className="relative pt-[125%]">
                  <img
                    src={product.images[0]} // First image for static display
                    alt={product.name}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                      hoveredProductId === product._id
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                  />
                  <img
                    src={product.images[1] || product.images[0]} // Second image for hover effect
                    alt={product.name}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                      hoveredProductId === product._id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </div>

                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{product.price}</p>
                  <button
                    className={`absolute bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out`}
                  >
                    Quick View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">
              Loading products...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
