import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const { signOut } = useAppContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/signin");
  };

  return (
    <button
      onClick={handleSignOut}
      className="ml-4 font-bold px-6 py-3 text-white rounded underline hover:decoration-2"
    >
      Sign Out
    </button>
  );
};

export default SignOut;
