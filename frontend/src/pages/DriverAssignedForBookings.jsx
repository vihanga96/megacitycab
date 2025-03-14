import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Col, Row, Alert, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const vehicleTypes = ["car", "van", "truck", "bus"]; 

const DriverAssignedForBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, userId, token, bookingId } = location.state || {};

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cost, setCost] = useState(0);
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicles, setVehicles] = useState([]); 
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [drivers, setDrivers] = useState([]); 
  const [selectedDriver, setSelectedDriver] = useState(""); 
  const [vehicle, setVehicle] = useState("");

  useEffect(() => {
    if (!role || !userId || !token) {
      console.log("Error: Role, User ID, or Token not available.");
    }
  }, [role, userId, token]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/booking/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooking(response.data);
        setPickupLocation(response.data.pickupLocation);
        setDestinationLocation(response.data.destinationLocation);
        setVehicleType(response.data.vehicleType || "");
        setCost(response.data.cost); 
        setVehicle(response.data.vehicle);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching booking:", error);
        setError("Failed to fetch booking details.");
        setLoading(false);
      }
    };

    if (token && bookingId) {
      fetchBooking();
    }
  }, [token, bookingId]);

  // Fetch vehicles based on selected vehicle type
  useEffect(() => {
    const fetchVehicles = async () => {
      if (vehicleType) {
        try {
          const response = await axios.get(`http://localhost:7075/api/vehicles?type=${vehicleType}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("response",response)
          setVehicles(response.data); 
          setSelectedVehicle(""); 
        } catch (error) {
          console.error("Error fetching vehicles:", error);
          setError("Failed to fetch vehicles.");
        }
      } else {
        setVehicles([]); 
        setSelectedVehicle(""); 
      }
    };

    fetchVehicles();
  }, [vehicleType, token]);

  // Fetch all drivers with the role of DRIVER
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Filter drivers with userRole "DRIVER"
        const driverList = response.data.filter(user => user.userRole === "DRIVER");
        setDrivers(driverList);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setError("Failed to fetch drivers.");
      }
    };

    fetchDrivers();
  }, [token]);

  const handleUpdate = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.put(
        `http://localhost:9090/api/bookings/updateByBookingDriver`,
        {
          bookingId: bookingId,
          vehicleNumber: selectedVehicle, 
          assignedDriverId: selectedDriver, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Log the response for debugging
      console.log("Update response:", response);

      if (response.status >= 200 && response.status < 300) {
        setError(null); // Reset error state on successful update
        navigate("/adminbookings", { state: { role: role, userId: userId, token: token } });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      // Set error message based on the error response
      setError("Failed to update booking: " + (error.response?.data?.message || error.message));
    }
};

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Card className="shadow-lg p-2" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <h3 className="text-center mb-4" style={{ color: "#000000" }}> Assign a driver and Vehicle </h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleUpdate}>
            <Row>
              <Col>
                <div><strong>Booking ID:</strong> {bookingId}</div>
              </Col>
            </Row>
            <Row>
              <Col className="mb-4">
                <div><strong>Required Vehicle:</strong> {vehicle}</div> 
              </Col> 
            </Row>

            <Form.Group controlId="formVehicleType" className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control as="select" name="vehicleType" required value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                <option value="">Select Vehicle Type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formVehicleNumber" className="mb-3">
              <Form.Label>Vehicle Number</Form.Label>
              <Form.Control as="select" required value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} disabled={!vehicleType}>
                <option value="">Select Vehicle</option>
                {vehicles.filter(vehicle => vehicle.vehicleType === vehicleType).map((vehicle) => (
                  <option key={vehicle.vehicleNumber} value={vehicle.vehicleNumber}>
                    {`${vehicle.vehicleNumber} - ${vehicle.model} - ${vehicle.brand}`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDriver" className="mb-3">
              <Form.Label>Driver</Form.Label>
              <Form.Control as="select" required value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.username} value={driver.username}>
                    {`${driver.username} - ${driver.phoneNumber}`}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="text-center">
              <Button  type="submit">Update Booking</Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DriverAssignedForBookings;