import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../utils/AuthContext";

const Vehicles = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { token } = auth;

  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`http://localhost:7075/api/vehicles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to fetch vehicles.");
      }
    };

    if (token) {
      fetchVehicles();
    } else {
      console.error("No token available.");
      alert("Please login to the system");
      navigate("/adminlogin");
    }
  }, [token, navigate]);

  // Handle Update Button
  const handleUpdate = (vehicleId) => {
    console.log("Updating vehicle with ID:", vehicleId);
    navigate("/adminUpdateVehicle", { state: { token: token, vehicleId: vehicleId } });
  };

  // Handle Delete Button
  const handleDelete = async (vehicleId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:7075/api/vehicles/delete/${vehicleId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Vehicle deleted:", response.data);
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        setError("Failed to delete vehicle.");
      }
    } else {
      console.log("Vehicle deletion canceled.");
    }
  };

  const handleAddNewVehicles = () => {
    navigate("/adminAddNewVehicle");
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
            Manage Vehicles
          </h1>
          <Button
            onClick={handleAddNewVehicles}
            className="fw-semibold rounded-pill px-4 py-2"
            style={{ backgroundColor: "#34495e", borderColor: "#34495e", color: "#fff" }}
          >
            Add New Vehicle
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
              <th>Vehicle Number</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Vehicle Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(vehicles) && vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.vehicleNumber}</td>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.vehicleType}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        onClick={() => handleUpdate(vehicle.id)}
                        className="fw-semibold rounded-pill px-3 py-1"
                        style={{ backgroundColor: "#ffc107", borderColor: "#ffc107", color: "#34495e" }}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDelete(vehicle.id)}
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
                  No vehicles available.
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

export default Vehicles;