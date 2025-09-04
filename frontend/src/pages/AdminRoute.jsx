import { useAppContext } from "../context/AppContext";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const AdminRoute = () => {
  const { isAuthenticated, role } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      toast.warn("You must sign in as Admin to access this page."); // Show warning toast
      setTimeout(() => {
        navigate("/signin"); // Delay navigation
      }, 2000);
    }
  }, [isAuthenticated, role, navigate]);

  if (!isAuthenticated || role !== "admin") {
    return (
      <h1 className="text-2xl text-BgFont font-bold">
        Access Denied. It just for Admin.
      </h1>
    ); // Render Access Denied if not authorized
  }

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default AdminRoute;
