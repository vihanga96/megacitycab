import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../utils/AuthContext'; // Import useAuth
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateDriver = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth(); // Get the auth object from context
  const { token } = auth; // Destructure token from auth
  const { driverId } = location.state || {}; // Get driverId from location state

  const [driver, setDriver] = useState({
    username: '',
    nic: '',
    phoneNumber: '',
    email: '',
    licenseNumber: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch the current driver details
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await axios.post(`http://localhost:8080/api/user/getDriver`, { id: driverId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDriver(response.data); // Set the driver details in state
      } catch (error) {
        console.error("Error fetching driver details:", error);
        setError("Failed to fetch driver details.");
      }
    };

    if (driverId) {
      fetchDriverDetails();
    } else {
      console.error("No driver ID available.");
    }
  }, [driverId, token]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await axios.put(`http://localhost:8080/api/user/updateDriver/${driverId}`, {
            ...driver, // Spread the driver object to include all fields
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status >= 200 && response.status < 300) {
          setSuccess("Driver updated successfully!");
          setError(null);
          navigate("/adminDrivers"); 
      } else {
          // Handle unexpected response status
          setError("Failed to update driver. Please try again.");
          setSuccess(null);
      }
    } catch (error) {
        console.error("Error updating driver:", error);
        setError("Failed to update driver.");
        setSuccess(null);
    }
};

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setDriver((prevDriver) => ({
      ...prevDriver,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-sm" style={{ width: '30rem' }}>
        <Card.Body>
          <Card.Title className="h4 mb-4 text-center">Update Driver</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={driver.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNIC" className="mb-3">
              <Form.Label>NIC</Form.Label>
              <Form.Control
                type="text"
                name="nic"
                value={driver.nic}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={driver.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={driver.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLicenseNumber" className="mb-3">
              <Form.Label>License Number</Form.Label>
              <Form.Control
                type="text"
                name="licenseNumber"
                value={driver.licenseNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button style={{ backgroundColor: "#4070B0" }} type="submit" className="w-100">
              Update Driver
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateDriver;