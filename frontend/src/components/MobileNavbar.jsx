{
  /* ================= MOBILE MENU ================= */
}
{
  menuOpen && (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-[80%] max-w-sm bg-white h-full p-4 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          {(mobileGender || mobileCategory) && (
            <button
              onClick={() =>
                mobileCategory ? setMobileCategory(null) : setMobileGender(null)
              }
            >
              ←
            </button>
          )}
          <h2 className="font-bold capitalize">
            {mobileCategory?.name || mobileGender || "Menu"}
          </h2>
        </div>

        {!mobileGender && (
          <ul className="space-y-3">
            {genders.map((g) => (
              <li
                key={g}
                className="flex justify-between py-2"
                onClick={() => setMobileGender(g)}
              >
                {g}
                <span>›</span>
              </li>
            ))}
          </ul>
        )}

        {mobileGender && !mobileCategory && (
          <ul className="space-y-3">
            {categories
              .filter((c) => c.gender === mobileGender)
              .map((cat) => (
                <li
                  key={cat._id}
                  className="flex justify-between py-2"
                  onClick={() => setMobileCategory(cat)}
                >
                  {cat.name}
                  <span>›</span>
                </li>
              ))}
          </ul>
        )}

        {mobileCategory && (
          <ul className="space-y-3">
            {mobileCategory.subcategories.map((sub, i) => (
              <li key={i}>
                <Link
                  to={`/products/${mobileGender}/${mobileCategory._id}/${encodeURIComponent(
                    sub.toLowerCase(),
                  )}`}
                  onClick={() => {
                    setMenuOpen(false);
                    setMobileGender(null);
                    setMobileCategory(null);
                  }}
                >
                  {sub}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* ADMIN PANEL MOBILE */}
        {isAuthenticated && role === "admin" && (
          <div className="border-t mt-4 p-4">
            <h4 className="font-semibold mb-2">Admin</h4>
            <Link
              to="/admin"
              className="block py-1"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="block py-1"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
          </div>
        )}
      </div>

      <div
        className="flex-1 bg-black/50"
        onClick={() => {
          setMenuOpen(false);
          setMobileGender(null);
          setMobileCategory(null);
        }}
      />
    </div>
  );
}
