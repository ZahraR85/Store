import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import SignIn from "./Auth/SignIn.jsx";
import Register from "./Auth/Register.jsx";
import Homepage from "./pages/HomePage.jsx";
import AdminRoute from "./pages/AdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        {/* Protect Admin Dashboard Route */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
