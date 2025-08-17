import React, { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import classRoom from "../../../assets/class_room.jpeg";
import "./Registration.css";
import { useRegister } from "./regiterApi/RegistrationApi";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    password: "",
    organization: "",
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
        email: formData.email,
        password: formData.password,
        role: parseInt(formData.role),
        organization: parseInt(formData.organization),
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
            Role
            <input
              type="text"
              name="role"
              className="registration-form-input"
              value={formData.role}
              onChange={handleChange}
              placeholder="Enter Role"
            />
          </label>

          <label className="registration-form-label">
            Organization
            <input
              type="text"
              name="organization"
              className="registration-form-input"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Enter Organization Name"
            />
          </label>

          <label className="registration-form-label">
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="registration-form-input"
                value={formData.password}
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
