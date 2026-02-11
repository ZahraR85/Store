import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const location = useLocation();
  const navigate = useNavigate();

  const fetchProducts = async (query = "") => {
    try {
      let url = "http://localhost:3001/products";
      if (query) {
        url = `http://localhost:3001/products/search?name=${encodeURIComponent(
          query,
        )}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
      setCurrentPage(1); // reset page when searching
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    fetchProducts(search);
  }, [location.search]);

  /* ---------------- Pagination Logic ---------------- */
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="bg-white min-h-screen">
      <ToastContainer />

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="../../public/video1.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white p-6 md:p-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              New Season. New Style.
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Discover our latest collections for clothing and home.
            </p>
            <a
              href="#products"
              className="bg-white text-gray-900 py-3 px-8 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition-colors duration-300"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div id="products" className="container mx-auto py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div
                key={product._id}
                className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer bg-white"
                onMouseEnter={() => setHoveredProductId(product._id)}
                onMouseLeave={() => setHoveredProductId(null)}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Image Hover Effect */}
                <div className="relative pt-[125%]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                      hoveredProductId === product._id
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                  />
                  <img
                    src={product.images[1] || product.images[0]}
                    alt={product.name}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                      hoveredProductId === product._id
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{product.price} €</p>

                  {/* Colors */}
                  {product.colors?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {product.colors.map((color) => {
                        const normalizedColor = color
                          .toLowerCase()
                          .replace(/\s+/g, "");

                        return (
                          <span
                            key={color}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: normalizedColor }}
                            title={color}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">
              No products found.
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
