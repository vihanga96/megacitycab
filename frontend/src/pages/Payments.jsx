import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Alert, Table, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../utils/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Payments = () => {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const { token } = auth;

  useEffect(() => {
    const fetchBookings = async () => {
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
    if (token) fetchBookings();
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

  const handleMonthChange = (event) => {
    setSelectedMonth(Number(event.target.value));
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#e9ecef", padding: "20px" }}
    >
      <div className="container p-5 rounded-4 shadow-lg" style={{ backgroundColor: "#ffffff", maxWidth: "1200px" }}>
        {/* Header */}
        <h1
          className="fw-bold mb-5 text-center animate__animated animate__fadeIn"
          style={{ color: "#34495e" }}
        >
          Payment Overview
        </h1>

        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

        {/* Month Selector and Total Cost */}
        <Row className="mb-5 g-4">
          <Col md={6}>
            <Form.Group controlId="monthSelect" className="shadow-sm p-4 rounded-3" style={{ backgroundColor: "#34495e" }}>
              <Form.Label className="text-white fw-semibold mb-2">Select Month</Form.Label>
              <Form.Control
                as="select"
                value={selectedMonth}
                onChange={handleMonthChange}
                className="bg-white text-dark border-0 rounded-3"
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index} value={index + 1}>
                    {new Date(0, index).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-center justify-content-center">
            <h4
              className="fw-semibold text-center p-4 rounded-3 shadow-sm"
              style={{ backgroundColor: "#34495e", color: "#ffc107" }}
            >
              Total Income for {new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })}: ${totalCost.toFixed(2)}
            </h4>
          </Col>
        </Row>

        {/* Table */}
        <Row>
          <Col md={12}>
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
                  <th>Booking ID</th>
                  <th>Booking Date</th>
                  <th>Distance (km)</th>
                  <th>Cost ($)</th>
                  <th>Vehicle Type</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(completedBookings) && completedBookings.length > 0 ? (
                  completedBookings
                    .filter((booking) => new Date(booking.bookingDate).getMonth() + 1 === selectedMonth)
                    .map((booking) => (
                      <tr key={booking.bookingId}>
                        <td>{booking.bookingId}</td>
                        <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                        <td>{booking.distance ? parseFloat(booking.distance).toFixed(2) : "N/A"}</td>
                        <td>${booking.cost ? parseFloat(booking.cost).toFixed(2) : "N/A"}</td>
                        <td>{booking.vehicle || "N/A"}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No completed bookings for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
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
      `}</style>
    </div>
  );
};

export default Payments;