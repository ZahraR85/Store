import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaTimes,
  FaBars,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from "../images/Logo.png";

import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGender, setOpenGender] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [mobileGender, setMobileGender] = useState(null);
  const [mobileCategory, setMobileCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const { isAuthenticated, role, signOut } = useAppContext();
  const { cartCount } = useCart();
  const genders = ["women", "men", "kids", "home"];

  useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleSearch = async (query) => {
    setSearchTerm(query);
    if (!query.trim()) return setSuggestions([]);
    try {
      const res = await fetch(
        `http://localhost:3001/products/search?name=${encodeURIComponent(query)}`,
      );
      if (res.ok) setSuggestions(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (name) => {
    setSearchOpen(false);
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/?search=${encodeURIComponent(name)}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-BgKhaki border-b shadow-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 md:px-8">
        <button
          className="lg:hidden text-BgFont"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars className="text-2xl" />
        </button>

        <Link to="/" className="text-BgFont">
          <FaHome className="text-xl" />
        </Link>

        <Link to="/" className="hidden lg:block">
          <img src={logo} alt="Logo" className="h-16" />
        </Link>

        <ul className="flex items-center gap-6 text-BgFont font-bold">
          <li>
            <button onClick={() => setSearchOpen(true)}>
              <FaSearch className="text-xl" />
            </button>
          </li>
          <li>
            <Link to="/favorites">❤️</Link>
          </li>
          <li>
            <Link to="/ShoppingCart" className="relative">
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            {isAuthenticated ? (
              <button onClick={signOut}>
                <FaSignOutAlt className="text-xl" />
              </button>
            ) : (
              <Link to="/signin">
                <FaUser className="text-xl" />
              </Link>
            )}
          </li>
        </ul>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed top-0 right-0 h-full w-full md:w-1/3 bg-white z-50 p-6">
          <div className="flex items-center border-b pb-2">
            <FaSearch className="mr-2" />
            <input
              autoFocus
              className="flex-1 outline-none"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button onClick={() => setSearchOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <ul className="mt-4">
            {suggestions.map((p) => (
              <li
                key={p._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(p.name)}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <DesktopNavbar
        genders={genders}
        setOpenGender={setOpenGender}
        openGender={openGender}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isAuthenticated={isAuthenticated}
        role={role}
      />

      <MobileNavbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        genders={genders}
        categories={categories}
        mobileGender={mobileGender}
        setMobileGender={setMobileGender}
        mobileCategory={mobileCategory}
        setMobileCategory={setMobileCategory}
        isAuthenticated={isAuthenticated}
        role={role}
      />
    </nav>
  );
};

export default Navbar;
