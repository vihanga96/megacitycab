import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../utils/AuthContext";

const Drivers = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { role, userId, token } = auth;
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all drivers with the role of DRIVER
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const driverList = response.data.filter((user) => user.userRole === "DRIVER");
        setDrivers(driverList);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setError("Failed to fetch drivers.");
      }
    };

    if (token) {
      fetchDrivers();
    } else {
      console.error("No token available.");
      alert("Please login to the system");
      navigate("/adminlogin");
    }
  }, [token, navigate]);

  // Handle Update Button
  const handleUpdate = (driverId) => {
    console.log("Updating driver with ID:", driverId);
    navigate("/adminUpdateDriver", { state: { token: token, driverId: driverId } });
  };

  // Handle Delete Button
  const handleDelete = async (driverId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this driver?");
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/user/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id: driverId },
        });
        console.log("Driver deleted:", response.data);
        setDrivers(drivers.filter((driver) => driver.id !== driverId));
      } catch (error) {
        console.error("Error deleting driver:", error);
        setError("Failed to delete driver.");
      }
    } else {
      console.log("Driver deletion canceled.");
    }
  };

  const handleAddNewDriver = () => {
    navigate("/adminAddNewDriver");
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#e9ecef", padding: "20px" }}
    >
      <div className="container p-5 rounded-4 shadow-lg" style={{ backgroundColor: "#ffffff", maxWidth: "1200px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1
            className="fw-bold animate__animated animate__fadeIn"
            style={{ color: "#34495e" }}
          >
            Manage Drivers
          </h1>
          <Button
            onClick={handleAddNewDriver}
            className="fw-semibold rounded-pill px-4 py-2"
            style={{ backgroundColor: "#34495e", borderColor: "#34495e", color: "#fff" }}
          >
            Add New Driver
          </Button>
        </div>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

        {/* Table */}
        <Table
          striped
          bordered
          hover
          responsive
          className="shadow-sm rounded-3 overflow-hidden"
          style={{ backgroundColor: "#fff" }}
        >
          <thead style={{ backgroundColor: "#34495e", color: "#ffffff" }}>
            <tr>
              <th>Username</th>
              <th>NIC</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>License Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(drivers) && drivers.length > 0 ? (
              drivers.map((driver) => (
                <tr key={driver.id}>
                  <td>{driver.username}</td>
                  <td>{driver.nic}</td>
                  <td>{driver.phoneNumber}</td>
                  <td>{driver.email}</td>
                  <td>{driver.licenseNumber}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        onClick={() => handleUpdate(driver.id)}
                        className="fw-semibold rounded-pill px-3 py-1"
                        style={{ backgroundColor: "#ffc107", borderColor: "#ffc107", color: "#34495e" }}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDelete(driver.id)}
                        className="fw-semibold rounded-pill px-3 py-1"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No drivers available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Custom CSS */}
      <style>{`
        .table th {
          font-weight: 600;
          text-align: center;
        }
        .table td {
          vertical-align: middle;
          text-align: center;
        }
        .btn:hover {
          transform: translateY(-2px);
          transition: transform 0.3s ease-in-out;
        }
        .btn:hover:not([variant="danger"]) {
          background-color: #ffca2c;
        }
      `}</style>
    </div>
  );
};

export default Drivers;