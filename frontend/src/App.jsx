import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/Layout";
import SignIn from "./Auth/SignIn.jsx";
import Register from "./Auth/Register.jsx";
import Homepage from "./pages/HomePage.jsx";
//import AdminRoute from "./pages/AdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductDetails from "./pages/ProductDetails";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
function App() {
  return (
    <Layout>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:gender" element={<ProductPage />} />
        <Route path="/products/:gender/:categoryId" element={<ProductPage />} />
        <Route
          path="/products/:gender/:categoryId/:subcategory"
          element={<ProductPage />}
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/ShoppingCart" element={<ShoppingCart />} />
        {/* Admin Routes (commented out for now) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      </Routes>
    </Layout>
  );
}

export default App;
