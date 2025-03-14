import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Card, Row, Col, Form } from "react-bootstrap";
import { useAuth } from "../utils/AuthContext";

const AdminDashboard = () => {
  const { auth } = useAuth();
  const { token } = auth;
  const [pendingCount, setPendingCount] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(null);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Fetch counts of bookings
  useEffect(() => {
    const fetchBookingsCount = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setPendingCount(response.data.filter((booking) => booking.status === "pending").length);
          setOngoingCount(response.data.filter((booking) => booking.status === "ongoing").length);
          setCompletedCount(response.data.filter((booking) => booking.status === "completed").length);
        } else {
          console.error("Unexpected response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings.");
      }
    };

    if (token) fetchBookingsCount();
  }, [token]);

  // Fetch count of drivers
  useEffect(() => {
    const fetchDriversCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const driverList = response.data.filter((user) => user.userRole === "DRIVER");
        setDriverCount(driverList.length);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setError("Failed to fetch drivers.");
      }
    };

    if (token) fetchDriversCount();
  }, [token]);

  // Fetch count of vehicles
  useEffect(() => {
    const fetchVehiclesCount = async () => {
      try {
        const response = await axios.get(`http://localhost:7075/api/vehicles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicleCount(response.data.length);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to fetch vehicles.");
      }
    };

    if (token) fetchVehiclesCount();
  }, [token]);

  // Fetch count of users
  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userList = response.data.filter((user) => user.userRole === "USER");
        setUserCount(userList.length);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      }
    };

    if (token) fetchUsersCount();
  }, [token]);

  // Fetch completed bookings and calculate total cost for the selected month
  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          const completedBookings = response.data.filter((booking) => booking.status === "completed");
          setCompletedBookings(completedBookings);
        } else {
          console.error("Unexpected response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings.");
      }
    };

    if (token) fetchCompletedBookings();
  }, [token]);

  useEffect(() => {
    const calculateTotalCost = () => {
      const total = completedBookings.reduce((acc, booking) => {
        const bookingDate = new Date(booking.bookingDate);
        if (bookingDate.getMonth() + 1 === selectedMonth) {
          return acc + booking.cost;
        }
        return acc;
      }, 0);
      setTotalCost(total);
    };

    calculateTotalCost();
  }, [completedBookings, selectedMonth]);

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#e9ecef", padding: "40px" }}
    >
      <div
        className="container p-5 rounded-4 shadow-lg"
        style={{ backgroundColor: "#ffffff", maxWidth: "1200px" }}
      >
        {/* Header */}
        <h1
          className="mb-5 text-center fw-bold animate__animated animate__fadeIn"
          style={{ color: "#34495e" }}
        >
          Admin Dashboard
        </h1>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

        {/* Row 1: Booking Stats */}
        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="shadow-sm border-0 rounded-3 hover-scale" style={{ backgroundColor: "#34495e" }}>
              <Card.Body className="text-center p-4">
                <Card.Title className="text-white fw-semibold mb-3">Pending Bookings</Card.Title>
                <Card.Text className="text-warning" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  {pendingCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0 rounded-3 hover-scale" style={{ backgroundColor: "#34495e" }}>
              <Card.Body className="text-center p-4">
                <Card.Title className="text-white fw-semibold mb-3">Ongoing Bookings</Card.Title>
                <Card.Text className="text-warning" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  {ongoingCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0 rounded-3 hover-scale" style={{ backgroundColor: "#34495e" }}>
              <Card.Body className="text-center p-4">
                <Card.Title className="text-white fw-semibold mb-3">Completed Bookings</Card.Title>
                <Card.Text className="text-warning" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  {completedCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Row 2: Resource Counts */}
        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="shadow-sm border-0 rounded-3 hover-scale" style={{ backgroundColor: "#34495e" }}>
              <Card.Body className="text-center p-4">
                <Card.Title className="text-white fw-semibold mb-3">Driver Count</Card.Title>
                <Card.Text className="text-warning" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  {driverCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0 rounded-3 hover-scale" style={{ backgroundColor: "#34495e" }}>
              <Card.Body className="text-center p-4">
                <Card.Title className="text-white fw-semibold mb-3">Vehicle Count</Card.Title>
                <Card.Text className="text-warning" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  {vehicleCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0 rounded-3 hover-scale" style={{ backgroundColor: "#34495e" }}>
              <Card.Body className="text-center p-4">
                <Card.Title className="text-white fw-semibold mb-3">User Count</Card.Title>
                <Card.Text className="text-warning" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  {userCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Row 3: Month Selector and Total Cost */}
        <Row className="g-4">
          <Col md={6}>
            <Form.Group controlId="monthSelector" className="shadow-sm p-4 rounded-3" style={{ backgroundColor: "#34495e" }}>
              <Form.Label className="text-white fw-semibold mb-2">Select Month</Form.Label>
              <Form.Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-white text-dark border-0 rounded-3"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm border-0 rounded-3 hover-scale" style={{ backgroundColor: "#34495e" }}>
              <Card.Body className="text-center p-4">
                <Card.Title className="text-white fw-semibold mb-3">
                  Total Earnings ({new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })})
                </Card.Title>
                <Card.Text className="text-warning" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  ${totalCost.toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Custom CSS */}
      <style>{`
        .hover-scale {
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;