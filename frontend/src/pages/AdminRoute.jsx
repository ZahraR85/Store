import { useAppContext } from "../context/AppContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { userId, role } = useAppContext();

  return userId && role === "admin" ? children : <Navigate to="/" />;
};

export default AdminRoute;
