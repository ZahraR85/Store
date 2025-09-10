import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import logo from "../images/Logo.png";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaTimes,
  FaBars,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    userId,
    setHoveredDropdown,
    isAuthenticated,
    role,
    signOut,
    shoppingCardCount,
  } = useAppContext();

  useEffect(() => {}, [isAuthenticated, role]);

  const handleMouseEnter = () => {
    setHoveredDropdown("adminPanel");
  };

  const handleMouseLeave = () => {
    setHoveredDropdown(null);
  };

  return (
    <nav className="border-b bg-BgKhaki shadow-md sticky top-0 z-50">
      {/* First Row */}
      <div className="flex items-center text-BgFont justify-between px-4 py-2 md:px-8">
        {/* Mobile menu button */}
        <button
          className="text-BgFont lg:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars className="text-2xl" />
        </button>

        {/* Left nav items */}
        <div>
          <ul className="flex font-bold text-BgFont items-center space-x-12">
            <li>
              <Link
                to="/"
                className="flex items-center space-x-1 hover:underline"
              >
                <FaHome className="text-xl" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/Gallery" className="hover:underline">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="hidden lg:block">
          <img src={logo} alt="Logo" className="h-16" />
        </Link>

        {/* Right nav items */}
        <ul className="flex font-bold text-BgFont items-center space-x-12">
          <li>
            <Link
              to="/ShoppingCard"
              className="flex items-center space-x-1 hover:underline"
            >
              <FaShoppingCart className="text-xl" />
              <span className="text-sm md:text-base whitespace-nowrap">
                Shopping Card
              </span>
              {isAuthenticated && shoppingCardCount > 0 && (
                <span className="ml-2 mb-4 text-lg text-red-600">
                  {shoppingCardCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            {isAuthenticated ? (
              <button
                className="hidden lg:block hover:underline"
                onClick={signOut}
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/signin"
                className="hidden lg:flex items-center space-x-1 hover:underline"
              >
                <FaUser className="text-xl" />
                <span>Signin | Register</span>
              </Link>
            )}
          </li>
        </ul>
      </div>

      {/* Second Row (Desktop Menus) */}
      <div className="hidden text-BgFont items-center justify-around bg-gray-100 px-4 py-2 text-sm md:flex">
        <ul className="flex font-bold items-center justify-around space-x-12 text-sm">
          {/* Men mega-menu */}
          <li className="relative group">
            <span className="hover:underline cursor-pointer">Men</span>
            <div className="absolute left-0 top-full bg-white shadow-xl rounded-md mt-2 p-6 hidden group-hover:grid grid-cols-4 gap-8 w-[800px] z-50">
              {/* Tops */}
              <div>
                <h3 className="font-bold mb-2">Tops</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/products/men/t-shirts"
                      className="hover:underline"
                    >
                      T-Shirts
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/polos" className="hover:underline">
                      Polos
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/shirts" className="hover:underline">
                      Shirts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/men/sweaters"
                      className="hover:underline"
                    >
                      Sweaters
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/men/hoodies"
                      className="hover:underline"
                    >
                      Hoodies
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Bottoms */}
              <div>
                <h3 className="font-bold mb-2">Bottoms</h3>
                <ul className="space-y-1">
                  <li>
                    <Link to="/products/men/jeans" className="hover:underline">
                      Jeans
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/chinos" className="hover:underline">
                      Chinos
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/shorts" className="hover:underline">
                      Shorts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/men/joggers"
                      className="hover:underline"
                    >
                      Joggers
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Outerwear */}
              <div>
                <h3 className="font-bold mb-2">Outerwear</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/products/men/jackets"
                      className="hover:underline"
                    >
                      Jackets
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/coats" className="hover:underline">
                      Coats
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/men/blazers"
                      className="hover:underline"
                    >
                      Blazers
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/parkas" className="hover:underline">
                      Parkas
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Accessories */}
              <div>
                <h3 className="font-bold mb-2">Accessories</h3>
                <ul className="space-y-1">
                  <li>
                    <Link to="/products/men/belts" className="hover:underline">
                      Belts
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/hats" className="hover:underline">
                      Hats
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/socks" className="hover:underline">
                      Socks
                    </Link>
                  </li>
                  <li>
                    <Link to="/products/men/bags" className="hover:underline">
                      Bags & Wallets
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products/men/jewelry"
                      className="hover:underline"
                    >
                      Jewelry
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          {/* Admin Panel */}
          {isAuthenticated && role === "admin" && (
            <li className="relative group">
              <span
                className="hover:underline"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Admin Panel
              </span>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[200px] max-w-[50vw] bg-gray-100 text-BgFont shadow-lg mt-2 p-4 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <ul className="flex flex-col items-start space-y-4">
                  <li className="hover:underline hover:bg-BgKhaki p-2 rounded-md">
                    <Link to="/admin">Admin Panel</Link>
                  </li>
                </ul>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-BgKhaki shadow-lg">
            <div className="flex items-center justify-between p-4">
              <span className="text-BgFont text-xl font-semibold">
                I Said Yes!
              </span>
              <button
                className="text-lg font-semibold text-BgFont focus:outline-none"
                onClick={() => setMenuOpen(false)}
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>
            <hr />
            <div className="flex flex-col gap-4 p-6">
              <Link to="/dashboard" className="text-BgFont hover:underline">
                Dashboard
              </Link>
              <Link to="/userinfo" className="text-BgFont hover:underline">
                User Information
              </Link>
              <Link to="/Guests" className="text-BgFont hover:underline">
                Invitation of Guests
              </Link>
              <Link
                to="/VenueSelections"
                className="text-BgFont hover:underline"
              >
                Book your Venue
              </Link>
              {/* Men (mobile version) */}
              <div>
                <h3 className="font-bold">Men</h3>
                <ul className="ml-4 space-y-2">
                  <li>
                    <Link to="/products/men/t-shirts">T-Shirts</Link>
                  </li>
                  <li>
                    <Link to="/products/men/jeans">Jeans</Link>
                  </li>
                  <li>
                    <Link to="/products/men/jackets">Jackets</Link>
                  </li>
                  <li>
                    <Link to="/products/men/belts">Belts</Link>
                  </li>
                </ul>
              </div>
              {/* Admin */}
              {isAuthenticated && role === "admin" && (
                <div className="flex flex-col gap-4">
                  <br />
                  <Link to="/admin" className="text-BgFont hover:underline">
                    Admin Panel
                  </Link>
                </div>
              )}
            </div>
            <hr />
            <br />
            {isAuthenticated ? (
              <button
                className="ml-6 text-BgFont hover:underline"
                onClick={signOut}
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/signin"
                className="flex ml-4 text-BgFont items-center space-x-1 hover:text-red-500 hover:underline focus:outline-none"
              >
                <FaUser className="text-xl text-BgFont" />
                <span>Signin | Register</span>
              </Link>
            )}
          </div>
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setMenuOpen(false)}
          ></div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
