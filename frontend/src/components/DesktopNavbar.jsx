import { Link } from "react-router-dom";

const DesktopNavbar = ({
  genders,
  setOpenGender,
  openGender,
  categories,
  activeCategory,
  setActiveCategory,
  isAuthenticated,
  role,
}) => {
  return (
    <>
      {/* Desktop Gender Bar */}
      <div className="hidden lg:flex justify-center bg-gray-100 py-2 gap-8">
        {genders.map((gender) => (
          <span
            key={gender}
            className="capitalize cursor-pointer px-4 py-2"
            onMouseEnter={() => {
              setOpenGender(gender);
              setActiveCategory(null);
            }}
          >
            {gender}
          </span>
        ))}
      </div>

      {/* Desktop Left Menu */}
      {openGender && (
        <div
          className="fixed top-[120px] left-0 h-[calc(100vh-120px)] w-[320px] bg-white shadow-2xl z-40"
          onMouseLeave={() => {
            setOpenGender(null);
            setActiveCategory(null);
          }}
        >
          <div className="p-4 border-b font-bold capitalize">{openGender}</div>

          {!activeCategory ? (
            <ul className="p-4 space-y-3">
              {categories
                .filter((c) => c.gender === openGender)
                .map((cat) => (
                  <li
                    key={cat._id}
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-100 px-2 py-2"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.name}
                    <span>›</span>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="p-4">
              <button
                className="mb-4 text-sm flex gap-2"
                onClick={() => setActiveCategory(null)}
              >
                ← Back
              </button>

              <h3 className="font-semibold mb-3">{activeCategory.name}</h3>

              <ul className="space-y-2">
                {activeCategory.subcategories.map((sub, i) => (
                  <li key={i}>
                    <Link
                      to={`/products/${openGender}/${activeCategory._id}/${encodeURIComponent(
                        sub.toLowerCase(),
                      )}`}
                      className="block px-2 py-1 hover:bg-gray-100"
                      onClick={() => {
                        setOpenGender(null);
                        setActiveCategory(null);
                      }}
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Admin Links */}
          {isAuthenticated && role === "admin" && (
            <div className="border-t mt-4 p-4">
              <h4 className="font-semibold mb-2">Admin</h4>
              <Link to="/admin" className="block py-1">
                Dashboard
              </Link>
              <Link to="/admin/products" className="block py-1">
                Products
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DesktopNavbar;
