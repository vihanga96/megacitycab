import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data
    localStorage.removeItem("userToken"); 

    // Redirect to login page
    navigate("/login"); 
  };

  return (
    <nav 
      className="navbar navbar-expand-lg" 
      style={{ backgroundColor: "#34495e", fontFamily: "'Arial', sans-serif" }}
    >
      <div className="container d-flex justify-content-center">
        <Link 
          className="navbar-brand" 
          to="/home" 
          style={{ color: "#f0f8ff", fontSize: "1.8rem", fontWeight: "bold" }}
        >
          Mega City Cabs
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ backgroundColor: "#f0f8ff" }}></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav text-center">
            <li className="nav-item mx-2">
              <Link 
                className="nav-link" 
                to="/home" 
                style={{ color: "#f0f8ff", fontSize: "1.2rem", fontWeight: "500" }} 
                onMouseEnter={(e) => e.target.style.color = "#E6C200"} 
                onMouseLeave={(e) => e.target.style.color = "#f0f8ff"}
              >
                Home
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link 
                className="nav-link" 
                to="/about" 
                style={{ color: "#f0f8ff", fontSize: "1.2rem", fontWeight: "500" }} 
                onMouseEnter={(e) => e.target.style.color = "#E6C200"} 
                onMouseLeave={(e) => e.target.style.color = "#f0f8ff"}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link 
                className="nav-link" 
                to="/contact" 
                style={{ color: "#f0f8ff", fontSize: "1.2rem", fontWeight: "500" }} 
                onMouseEnter={(e) => e.target.style.color = "#E6C200"} 
                onMouseLeave={(e) => e.target.style.color = "#f0f8ff"}
              >
                Contact Us
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link 
                className="nav-link" 
                to="/customerDashboard" 
                style={{ color: "#f0f8ff", fontSize: "1.2rem", fontWeight: "500" }} 
                onMouseEnter={(e) => e.target.style.color = "#E6C200"} 
                onMouseLeave={(e) => e.target.style.color = "#f0f8ff"}
              >
                RIDE
              </Link>
            </li>
            <li className="nav-item mx-2">
              <button 
                className="nav-link btn btn-link" 
                onClick={handleLogout} 
                style={{ color: "#f0f8ff", fontSize: "1.2rem", fontWeight: "500" }} 
                onMouseEnter={(e) => e.target.style.color = "#E6C200"} 
                onMouseLeave={(e) => e.target.style.color = "#f0f8ff"}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
  
  
  
};

export default NavBar;