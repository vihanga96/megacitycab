import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("Response is not valid JSON:", text);
        throw new Error("Invalid response from server.");
      }

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);

        if (data.role === "USER") {
          navigate("/customerDashboard", {
            state: { role: data.role, userId: data.userId, token: data.token },
          });
        } else if (data.role === "DRIVER") {
          navigate("/driverDashboard", {
            state: { role: data.role, userId: data.userId, token: data.token },
          });
        } else {
          alert("You do not have access to the customer dashboard.");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#e9ecef" }}>
      <div className="card shadow-lg p-5 border-0 w-10 mw-100" style={{ maxWidth: "450px", backgroundColor: "#34495e", color: "#ffffff" }}>
        <h3 className="text-center mb-5 fw-bold animate__animated animate__fadeIn">
          Sign In to Mega City Cabs
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-semibold text-light">Email Address</label>
            <input
            id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control bg-white text-dark border-0 shadow-sm rounded-3"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold text-light">Password</label>
            <input
            id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control bg-white text-dark border-0 shadow-sm rounded-3"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-100 fw-bold text-dark py-2 rounded-pill login-btn"
            style={{ backgroundColor: "#ffc107" }}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-light">
            Don’t have an account?{" "}
            <Link to="/register" className="fw-semibold text-warning hover-link">
              Register Now
            </Link>
          </small>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .login-btn {
          transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
        }
        .login-btn:hover:not(:disabled) {
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
};

export default Login;