import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../utils/AuthContext'; 
import "bootstrap/dist/css/bootstrap.min.css";

const AddNewVehicle = () => {
      const { auth } = useAuth(); 
      const { token } = auth; 
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleNumber: '',
    vehicleType: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    capacity: '',
    driverId: null,
  });

  console.log("token",token)
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:7075/api/vehicles/add', vehicleDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Vehicle added:', response.data);
      setSuccess('Vehicle added successfully!');
      setError(null);

      navigate("/adminVehicles", { state: {  token:token  } });
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setError('Failed to add vehicle.');
      setSuccess(null);
    }
  };

  return (
    <div className="container-fluid bg-light mt-4 min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-sm" style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title className="h4 mb-4 text-center">Add New Vehicle</Card.Title>
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
            <Form.Group controlId="formColor" className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={vehicleDetails.color}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCapacity" className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={vehicleDetails.capacity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button style={{ backgroundColor: "#4070B0" }}  type="submit" className="w-100">
              Add Vehicle
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddNewVehicle;

