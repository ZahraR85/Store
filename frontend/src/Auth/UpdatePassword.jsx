import { useState } from "react";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage("Password updated successfully");
      } else {
        const message = await response.text();
        setMessage(message || "Password update failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2>Update Password</h2>
      {message && <p>{message}</p>}
      <input
        type="password"
        name="oldPassword"
        placeholder="Old Password"
        value={formData.oldPassword}
        onChange={handleChange}
      />
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={handleChange}
      />
      <button onClick={handleUpdatePassword}>Update Password</button>
    </div>
  );
};

export default UpdatePassword;
