import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; 
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateVehicle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth(); 
  const { token } = auth; 
  const { vehicleId } = location.state || {}; 

  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleNumber: '',
    model: '',
    brand: '',
    year: '',
    driverId: '',
    vehicleType: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch the current vehicle details
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {

        console.log("vehicleId",vehicleId)
        const response = await axios.get(`http://localhost:7075/api/vehicles/getById/${vehicleId}` , {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVehicleDetails(response.data); 
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        setError("Failed to fetch vehicle details.");
      }
    };

    if (vehicleId) {
      fetchVehicleDetails();
    } else {
      console.error("No vehicle ID available.");
    }
  }, [vehicleId, token]);

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:7075/api/vehicles/update/${vehicleId}`, vehicleDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setSuccess("Vehicle updated successfully!");
        setError(null);
        navigate("/adminVehicles"); 
    } else {
        // Handle unexpected response status
        setError("Failed to update vehicle. Please try again.");
        setSuccess(null);
    }
      

    } catch (error) {
      console.error("Error updating vehicle:", error);
      setError("Failed to update vehicle.");
      setSuccess(null);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-sm" style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title className="h4 mb-4 text-center">Update Vehicle</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formVehicleNumber" className="mb-3">
              <Form.Label>Vehicle Number</Form.Label>
              <Form.Control
                type="text"
                name="vehicleNumber"
                value={vehicleDetails.vehicleNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formModel" className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={vehicleDetails.model}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBrand" className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={vehicleDetails.brand}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formYear" className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={vehicleDetails.year}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {/* <Form.Group controlId="formDriverId" className="mb-3">
              <Form.Label>Driver ID</Form.Label>
              <Form.Control
                type="text"
                name="driverId"
                value={vehicleDetails.driverId}
                onChange={handleChange}
                required
              />
            </Form.Group> */}
            <Form.Group controlId="formVehicleType" className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                type="text"
                name="vehicleType"
                value={vehicleDetails.vehicleType}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button style={{ backgroundColor: "#4070B0" }} type="submit" className="w-100">
              Update Vehicle
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateVehicle;