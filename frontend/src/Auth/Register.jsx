import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    family: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    if (!/^[a-zA-Z]+$/.test(formData.name)) {
      return setError("Name must contain only letters.");
    }
    if (!/^[a-zA-Z]+$/.test(formData.family)) {
      return setError("Family name must contain only letters.");
    }
    if (!/^\d{10,15}$/.test(formData.phone)) {
      return setError("Enter a valid phone number (10-15 digits).");
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return setError("Enter a valid email.");
    }
    if (!formData.password) {
      return setError("Password is required.");
    }
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/signin"), 2000); // Redirect after success
      } else {
        const message = await response.text();
        setError(message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-customBg">
      {/* Left Section: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center min-h-screen">
        {/* Centered Form Box */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-10 space-y-6">
          <h2 className="text-3xl text-BgFont font-bold mb-10 text-center">
            Please Register!
          </h2>
          {success && (
            <p className="text-green-500 text-sm text-center">
              Registration successful! Redirecting...
            </p>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
          />
          <input
            type="text"
            name="family"
            placeholder="Last Name"
            value={formData.family}
            onChange={handleChange}
            className="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
          />
          <button
            onClick={handleRegister}
            className="bg-BgBlack text-white py-2 text-lg font-bold hover:bg-BgBlackLight rounded w-full"
          >
            Register
          </button>
        </div>
      </div>
      {/* Right Section: Picture */}
      <div
        className="w-full md:w-1/2 flex justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.postimg.cc/Gt6TTH3t/pick.jpg')",
        }}
      >
        {/* You can replace the URL with your desired image */}
        <div className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default Register;
