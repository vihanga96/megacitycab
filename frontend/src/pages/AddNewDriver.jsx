import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";

const AddNewDriver = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); 
  const { token } = auth; 

  const [driverDetails, setDriverDetails] = useState({
    username: '',
    nic: '',
    address: '',
    phoneNumber: '',
    email: '',
    password: null, 
    userRole: 'DRIVER',
    licenseNumber: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setDriverDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Set password to license number before sending
      const response = await axios.post(`http://localhost:8080/api/user/register`, {
        ...driverDetails,
        password: driverDetails.licenseNumber, // Set password to license number
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Driver added successfully!");
      setError(null);

      navigate("/adminDrivers");
    } catch (error) {
      console.error("Error adding driver:", error);
      setError("Driver details are exising. Please change the details.");
      setSuccess(null);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-sm" style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title className="h4 mb-4 text-center">Add New Driver</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={driverDetails.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNIC" className="mb-3">
              <Form.Label>NIC</Form.Label>
              <Form.Control
                type="text"
                name="nic"
                value={driverDetails.nic}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={driverDetails.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={driverDetails.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={driverDetails.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLicenseNumber" className="mb-3">
              <Form.Label>License Number</Form.Label>
              <Form.Control
                type="text"
                name="licenseNumber"
                value={driverDetails.licenseNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button style={{ backgroundColor: "#4070B0" }} type="submit" className="w-100">
              Add Driver
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddNewDriver;