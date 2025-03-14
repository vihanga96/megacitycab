import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For phoneNumber, only allow numbers and limit to 10 digits
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-digits
      if (numericValue.length <= 10) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate phone number length
    if (formData.phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits!");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      if (response.ok) {
        alert("Registration successful!");
        setFormData({ username: "", email: "", phoneNumber: "", password: "", confirmPassword: "" });
        navigate("/login");
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#e9ecef", paddingTop: "70px" }}
    >
      <div className="card shadow-lg p-5 border-0 w-100" style={{ maxWidth: "450px", backgroundColor: "#34495e", color: "#ffffff", marginTop: "-100px" }}>
        <h3 className="text-center mb-5 fw-bold animate__animated animate__fadeIn">
          Join Mega City Cabs
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-light">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control bg-white text-dark border-0 shadow-sm rounded-3"
              placeholder="Choose a username"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-light">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control bg-white text-dark border-0 shadow-sm rounded-3"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-light">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-control bg-white text-dark border-0 shadow-sm rounded-3"
              placeholder="Enter 10-digit phone number"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
            <small className="text-light">Must be 10 digits</small>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-light">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control bg-white text-dark border-0 shadow-sm rounded-3"
              placeholder="Create a password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-light">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control bg-white text-dark border-0 shadow-sm rounded-3"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="btn w-100 fw-bold text-dark py-2 rounded-pill register-btn"
            style={{ backgroundColor: "#ffc107" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-light">
            Already have an account?{" "}
            <Link to="/login" className="fw-semibold text-warning hover-link">
              Sign In
            </Link>
          </small>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .register-btn {
          transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
        }
        .register-btn:hover:not(:disabled) {
          background-color: #ffca2c;
          transform: translateY(-2px);
        }
        .hover-link {
          transition: color 0.3s ease-in-out;
        }
        .hover-link:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}

export default Register;