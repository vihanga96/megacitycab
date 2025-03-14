import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const AdminNavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication data
    localStorage.removeItem("userToken"); 

    // Redirect to login page
    navigate("/adminLogin"); 
  };

  return (
    <nav 
    className="navbar navbar-expand-lg" 
    style={{ 
      backgroundColor: "#34495e", 
      fontFamily: "'Poppins', sans-serif" 
    }}
  >
    <div className="container d-flex justify-content-center">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" style={{ backgroundColor: "#ffffff" }}></span>
      </button>
      <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul className="navbar-nav text-center">
        <li className="nav-item mx-2">
            <Link 
              className="nav-link" 
              to="/adminDashboard" 
              style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: "600" }}
              onMouseEnter={(e) => e.target.style.color = "#f1c40f"} 
              onMouseLeave={(e) => e.target.style.color = "#ffffff"} 
            >
              Home
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link 
              className="nav-link" 
              to="/adminbookings" 
              style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: "600" }}
              onMouseEnter={(e) => e.target.style.color = "#f1c40f"} 
              onMouseLeave={(e) => e.target.style.color = "#ffffff"} 
            >
              Bookings
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link 
              className="nav-link" 
              to="/adminDrivers" 
              style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: "600" }}
              onMouseEnter={(e) => e.target.style.color = "#f1c40f"}
              onMouseLeave={(e) => e.target.style.color = "#ffffff"}
            >
              Drivers
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link 
              className="nav-link" 
              to="/adminVehicles" 
              style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: "600" }}
              onMouseEnter={(e) => e.target.style.color = "#f1c40f"}
              onMouseLeave={(e) => e.target.style.color = "#ffffff"}
            >
              Vehicles
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link 
              className="nav-link" 
              to="/adminPayments" 
              style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: "600" }}
              onMouseEnter={(e) => e.target.style.color = "#f1c40f"}
              onMouseLeave={(e) => e.target.style.color = "#ffffff"}
            >
              Payments
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link 
              className="nav-link" 
              to="/adminLogin" 
              style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: "600" }}
              onMouseEnter={(e) => e.target.style.color = "#f1c40f"}
              onMouseLeave={(e) => e.target.style.color = "#ffffff"}
            >
              Login
            </Link>
          </li>
          <li className="nav-item mx-2">
            <button 
              className="nav-link btn btn-link" 
              onClick={handleLogout} 
              style={{ color: "#ffffff", fontSize: "1.3rem", fontWeight: "600" }}
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

export default AdminNavBar;
