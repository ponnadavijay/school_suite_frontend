import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import classRoom from "../../../assets/class_room.jpeg";
import "./Registration.css";
import { useRegister } from "./regiterApi/RegistrationApi";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password_hash: "",
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    whatsapp: "",
    role_id: "",
    tenant_id: "",
  });

  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerMutation.mutate(
      {
        username: formData.username,
        password_hash: formData.password_hash,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        contact: formData.contact,
        whatsapp: formData.whatsapp,
        role_id: formData.role_id,
        tenant_id: formData.tenant_id,
      },
      {
        onSuccess: (data) => {
          console.log("Registration successful:", data);
          alert("Registration successful!");
          navigate("/login", { state: formData });
        },
        onError: (error) => {
          console.error("Registration error:", error);
          alert("Registration failed. Please try again.");
        },
      }
    );
  };

  const handleNavigateToHome = () => {
    navigate("/login");
  };

  return (
    <div
      className="registration-container"
      style={{
        backgroundImage: `url(${classRoom})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="registration-form">
        <div className="registration-form-title">Registration Of Tech Patashala</div>
        <form onSubmit={handleSubmit}>
          <label className="registration-form-label">
            Username
            <input
              type="text"
              name="username"
              className="registration-form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
            />
          </label>

          <label className="registration-form-label">
            First Name
            <input
              type="text"
              name="first_name"
              className="registration-form-input"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          </label>

          <label className="registration-form-label">
            Last Name
            <input
              type="text"
              name="last_name"
              className="registration-form-input"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          </label>

          <label className="registration-form-label">
            Email ID
            <input
              type="email"
              name="email"
              className="registration-form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter school email"
            />
          </label>

          <label className="registration-form-label">
            Contact Number
            <input
              type="text"
              name="contact"
              className="registration-form-input"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </label>

          <label className="registration-form-label">
            WhatsApp Number
            <input
              type="text"
              name="whatsapp"
              className="registration-form-input"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Enter whatsapp number"
            />
          </label>

          <label className="registration-form-label">
            Role ID
            <input
              type="text"
              name="role_id"
              className="registration-form-input"
              value={formData.role_id}
              onChange={handleChange}
              placeholder="Enter Role ID"
            />
          </label>

          <label className="registration-form-label">
            Tenant ID
            <input
              type="text"
              name="tenant_id"
              className="registration-form-input"
              value={formData.tenant_id}
              onChange={handleChange}
              placeholder="Enter Tenant ID"
            />
          </label>

          <label className="registration-form-label">
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password_hash"
                className="registration-form-input"
                value={formData.password_hash}
                onChange={handleChange}
                placeholder="Create password"
              />
              <span onClick={togglePasswordVisibility} className="eye-icon">
                {showPassword ? "👁️" : "👁"}
              </span>
            </div>
          </label>

          <button type="submit" className="signup-btn">
            Register
          </button>
        </form>

        <div className="registration-login--content">
          <div className="registration-login-link">
            <div className="registration-login-text">
              Already have an account?{' '}
              <span onClick={handleNavigateToHome} className="registration-login-link-text">
                Login
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
