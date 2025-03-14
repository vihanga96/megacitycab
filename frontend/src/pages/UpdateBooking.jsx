import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Col,
  Row,
  InputGroup,
  FormControl,
  Alert,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const districtLocations = {
  Colombo: [6.9271, 79.8612],
  Gampaha: [7.084, 80.0098],
  Kandy: [7.2906, 80.6337],
  Galle: [6.0535, 80.221],
  Jaffna: [9.6615, 80.0255],
  Matara: [5.9549, 80.5549],
  Kurunegala: [7.4863, 80.3658],
  Anuradhapura: [8.3114, 80.4037],
  Badulla: [6.9934, 81.055],
  Ratnapura: [6.7056, 80.3847],
};

const vehicleTypes = ["car", "van", "Truck", "Bus"];

const UpdateBooking = () => {
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

  useEffect(() => {
    if (!role || !userId || !token) {
      console.log("Error: Role, User ID, or Token not available.");
    }
  }, [role, userId, token]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9090/api/bookings/booking/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBooking(response.data);
        setPickupLocation(response.data.pickupLocation);
        setDestinationLocation(response.data.destinationLocation);
        setVehicleType(response.data.vehicleType || "");
        setCost(response.data.cost);
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

  const vehicleRates = {
    car: 300,
    van: 400,
    Truck: 500,
    Bus: 600,
  };

  const handleLocationChange = () => {
    if (pickupLocation && destinationLocation) {
      const pickupCoords = districtLocations[pickupLocation];
      const destinationCoords = districtLocations[destinationLocation];
      const distance = calculateDistance(pickupCoords, destinationCoords);

      const rate = vehicleRates[vehicleType] || 300;
      const calculatedCost = distance * rate;

      setCost(calculatedCost);
    }
  };

  useEffect(() => {
    handleLocationChange();
  }, [pickupLocation, destinationLocation, vehicleType]);

  const calculateDistance = (pickupCoords, destinationCoords) => {
    const R = 6371; // Radius of the Earth in km
    const toRad = (angle) => (angle * Math.PI) / 180;

    const lat1 = pickupCoords[0];
    const lon1 = pickupCoords[1];
    const lat2 = destinationCoords[0];
    const lon2 = destinationCoords[1];

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const pickupCoords = districtLocations[pickupLocation];
    const destinationCoords = districtLocations[destinationLocation];

    if (!pickupCoords || !destinationCoords) {
      console.error("Invalid pickup or destination location");
      return;
    }

    const distance = calculateDistance(pickupCoords, destinationCoords);
    const rate = vehicleRates[vehicleType] || 300; // Default rate Rs. 300/km
    const calculatedCost = distance * rate;

    try {
      const response = await axios.put(
        `http://localhost:9090/api/bookings/updateByBookingId`,
        {
          bookingId: bookingId,
          phoneNumber: formData.get("phoneNumber"),
          pickupLocation: formData.get("pickupLocation"),
          destinationLocation: formData.get("destinationLocation"),
          vehicle: formData.get("vehicleType"),
          distance: distance,
          cost: calculatedCost,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        navigate("/customerDashboard", {
          state: { role: role, userId: userId, token: token },
        });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Card
        className="shadow-lg p-2"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <Card.Body>
          <h3 className="text-center mb-4" style={{ color: "#222" }}>
            Update Booking
          </h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleUpdate}>
            <Row>
              <Col>
                <div>
                  <strong>Booking ID:</strong> {bookingId}
                </div>
              </Col>
            </Row>

            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <InputGroup>
                <FormControl
                  type="text"
                  name="phoneNumber"
                  defaultValue={booking?.phoneNumber}
                  required
                  placeholder="Enter your phone number"
                  className="border-0 shadow-sm"
                  readOnly
                />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formPickupLocation" className="mb-3">
              <Form.Label>Pickup Location</Form.Label>
              <Form.Control
                as="select"
                name="pickupLocation"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              >
                {Object.keys(districtLocations).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDestinationLocation" className="mb-3">
              <Form.Label>Destination Location</Form.Label>
              <Form.Control
                as="select"
                name="destinationLocation"
                required
                value={destinationLocation}
                onChange={(e) => setDestinationLocation(e.target.value)}
              >
                {Object.keys(districtLocations).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formVehicleType" className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                as="select"
                name="vehicleType"
                required
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <div style={{ marginBottom: "20px" }}>
              <strong>Estimated Cost: </strong> Rs. {cost?.toFixed(2)}
            </div>

            <Form.Group className="text-center">
              <Button style={{ backgroundColor: "#4070B0" }} type="submit">
                Update Booking
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateBooking;
