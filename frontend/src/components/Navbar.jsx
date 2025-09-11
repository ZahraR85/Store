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
  const [categories, setCategories] = useState([]);

  const { isAuthenticated, role, signOut, shoppingCardCount } = useAppContext();

  useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const genders = ["women", "men", "kids", "home", "unisex"];

  return (
    <nav className="border-b bg-BgKhaki shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 md:px-8">
        {/* Mobile menu */}
        <button
          className="text-BgFont lg:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars className="text-2xl" />
        </button>

        {/* Left nav */}
        <div>
          <ul className="flex items-center space-x-6 font-bold text-BgFont">
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

        {/* Right nav */}
        <ul className="flex items-center space-x-6 font-bold text-BgFont">
          <li>
            <Link
              to="/ShoppingCard"
              className="flex items-center space-x-1 hover:underline"
            >
              <FaShoppingCart className="text-xl" />
              <span className="text-sm md:text-base">Shopping Card</span>
              {isAuthenticated && shoppingCardCount > 0 && (
                <span className="ml-2 text-red-600">{shoppingCardCount}</span>
              )}
            </Link>
          </li>
          <li>
            {isAuthenticated ? (
              <button onClick={signOut} className="hover:underline">
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

      {/* Desktop dropdowns */}
      <div className="hidden md:flex justify-center bg-gray-100 py-2 space-x-8 font-medium">
        {genders.map((gender) => {
          const genderCategories = categories.filter(
            (c) => c.gender === gender
          );
          return (
            <div key={gender} className="relative group">
              <Link
                to={`/products/${gender}`}
                className="hover:text-black capitalize"
              >
                {gender}
              </Link>
              {/* Dropdown */}
              <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg p-4 rounded-lg min-w-[250px]">
                <ul className="space-y-2">
                  {genderCategories.map((cat) => (
                    <li key={cat._id} className="group relative">
                      <Link
                        to={`/products/${gender}/${cat._id}`}
                        className="font-semibold hover:text-black"
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {cat.subcategories.map((sub, i) => (
                            <li key={i}>
                              <Link
                                to={`/products/${gender}/${
                                  cat._id
                                }/${encodeURIComponent(sub.toLowerCase())}`}
                                className="text-gray-600 hover:text-black"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}

        {/* Admin Panel */}
        {isAuthenticated && role === "admin" && (
          <div className="relative group">
            <span className="hover:underline cursor-pointer">Admin Panel</span>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[200px] max-w-[50vw] bg-gray-100 text-BgFont shadow-lg mt-2 p-4 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <ul className="flex flex-col items-start space-y-2">
                <li className="hover:underline hover:bg-BgKhaki p-2 rounded-md">
                  <Link to="/admin">Admin Panel</Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-BgKhaki shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-BgFont font-semibold text-xl">Menu</span>
              <button onClick={() => setMenuOpen(false)}>
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <ul className="space-y-3">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/Gallery">Gallery</Link>
              </li>
              {genders.map((gender) => {
                const genderCategories = categories.filter(
                  (c) => c.gender === gender
                );
                return (
                  <li key={gender}>
                    <Link
                      to={`/products/${gender}`}
                      className="font-bold capitalize"
                    >
                      {gender}
                    </Link>
                    <ul className="ml-4 space-y-1">
                      {genderCategories.map((cat) => (
                        <li key={cat._id}>
                          <Link
                            to={`/products/${gender}/${cat._id}`}
                            className="font-semibold"
                          >
                            {cat.name}
                          </Link>
                          {cat.subcategories.length > 0 && (
                            <ul className="ml-4 space-y-1">
                              {cat.subcategories.map((sub, i) => (
                                <li key={i}>
                                  <Link
                                    to={`/products/${gender}/${
                                      cat._id
                                    }/${encodeURIComponent(sub.toLowerCase())}`}
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/admin" className="text-BgFont hover:underline">
                  Admin Panel
                </Link>
              </div>
            </ul>

            <hr className="my-4" />

            {isAuthenticated ? (
              <button
                className="ml-2 text-BgFont hover:underline"
                onClick={signOut}
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/signin"
                className="flex ml-2 text-BgFont items-center space-x-1 hover:text-red-500 hover:underline"
              >
                <FaUser className="text-xl text-BgFont" />
                <span>Signin | Register</span>
              </Link>
            )}
          </div>
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
