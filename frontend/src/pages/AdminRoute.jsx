import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, role } = useContext(AppContext);

  return user && role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;
