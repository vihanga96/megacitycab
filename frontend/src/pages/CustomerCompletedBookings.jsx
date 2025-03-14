import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerCompletedBookings = () => {
  const location = useLocation();
  const { userId, token } = location.state || {};
  const [completedBookings, setCompletedBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if token is available
  useEffect(() => {
    if (!token) {
      console.log("No token available.");
      alert("Please login to the system");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch completed bookings
  useEffect(() => {
    const fetchCompletedBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Bookings response:", response);

        if (Array.isArray(response.data)) {
          const filteredBookings = response.data.filter((booking) => booking.status === "completed");
          setCompletedBookings(filteredBookings);
        } else {
          console.error("Expected an array, but got:", typeof response.data);
          setError("Unexpected response format. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Error fetching bookings: " + (error.response?.data?.message || error.message));
      }
    };

    if (token) {
      fetchCompletedBookings();
    }
  }, [userId, token]);

  const handleBillClick = (bookingId) => {
    navigate("/bill", { state: { bookingId, token } });
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-flex-start"
      style={{ minHeight: "100vh", backgroundColor: "#e9ecef", padding: "20px 40px" }}
    >
      <div className="container p-5 rounded-4 shadow-lg" style={{ backgroundColor: "#ffffff", maxWidth: "1200px", marginTop: "20px" }}>
        {/* Header */}
        <h1
          className="fw-bold mb-5 text-center animate__animated animate__fadeIn"
          style={{ color: "#34495e" }}
        >
          Completed Bookings
        </h1>

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
          <thead className="table-dark">
            <tr>
              <th>Booking ID</th>
              <th>Pickup Location</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Booking Date</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.pickupLocation}</td>
                  <td>{booking.destinationLocation}</td>
                  <td>{booking.status}</td>
                  <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                  <td>Rs.{booking.cost.toFixed(2)}</td>
                  <td>
                    <Button
                      onClick={() => handleBillClick(booking.bookingId)}
                      className="fw-semibold rounded-pill px-4 py-1"
                      style={{ backgroundColor: "#ffc107", borderColor: "#ffc107", color: "#34495e" }}
                    >
                      Generate Bill
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No completed bookings available.
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
          background-color: #ffca2c;
        }
      `}</style>
    </div>
  );
};

export default CustomerCompletedBookings;