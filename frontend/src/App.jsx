import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import SignIn from "./Auth/SignIn.jsx";
import Register from "./Auth/Register.jsx";
import Homepage from "./pages/HomePage.jsx";
//import AdminRoute from "./pages/AdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  return (
    <Layout>
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

        {/* Admin Routes (commented out for now) */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
