import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Set authentication context and store user info in localStorage
        setAuth(true, data.userId, data.role); // Set authentication context
        localStorage.setItem("role", data.role); // Store user role
        localStorage.setItem("token", data.token); // Store token
        navigate("/");
      } else {
        const message = await response.text();
        setError(message || "Invalid login credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to sign in. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-customBg">
      {/* Left Section: Form */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('https://i.postimg.cc/RVhWxyrV/userinfo3.png')]">
        {/* Overlay for controlling opacity */}
        <div className="absolute inset-0 bg-white/50"></div>

        {/* Centered Form */}
        <div className="relative w-4/5 max-w-md bg-opacity-80 rounded-lg p-5 ml-14 mb-14 space-y-4">
          {/*  <div className="w-1/2 flex justify-center items-center bg-customBg1">*/}
          {/*  <div className="max-w-5xl w-4/5 p-16 bg-customBg shadow-lg rounded-lg space-y-5">*/}
          <h2 className="text-3xl text-BgFont font-bold mb-10 text-center">
            Please Login!
          </h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="text"
            name="identifier"
            placeholder="Name or Email"
            value={formData.identifier}
            onChange={handleChange}
            className="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgPinkDark"
          />
          <div className="m-2 w-full text-start underline hover:decoration-2">
            <Link to="/register" className="text-m text-BgFont">
              Forgot your password?
            </Link>
          </div>
          <button
            onClick={handleSignIn}
            className="bg-BgPinkMiddle text-BgFont py-2 text-lg font-bold hover:bg-BgPinkDark rounded w-full"
          >
            Sign In
          </button>
          <div className="m-5 w-full text-BgFont text-center underline hover:decoration-2">
            <Link to="/register" className="text-m">
              Create Account / Register
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section: Picture */}
      <div
        className="w-full md:w-1/2 flex justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.postimg.cc/sXN2SjZQ/Quiet-Luxury-fashion-12.jpg')",
        }}
      >
        {/* You can replace the URL with your desired image */}
        <div className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default SignIn;
