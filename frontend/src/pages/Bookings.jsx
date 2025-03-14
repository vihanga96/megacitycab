import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../utils/AuthContext";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const location = useLocation();
  const { auth } = useAuth();
  const { role, userId, token } = auth;

  useEffect(() => {
    if (!role || !userId || !token) {
      alert("Please login to the system");
      navigate("/adminlogin");
    }
  }, [role, userId, token, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          const filteredBookings = response.data.filter(
            (booking) => booking.status === "pending" || booking.status === "assigned"
          );
          setBookings(filteredBookings);
        } else {
          console.error("Unexpected response format", response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (token) fetchBookings();
  }, [userId, token]);

  const handleUpdate = (bookingId) => {
    navigate("/adminDriverAssign", { state: { role, userId, token, bookingId } });
  };

  const handleDelete = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      axios
        .delete("http://localhost:9090/api/bookings/deleteByBookingId", {
          data: { bookingId },
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
        })
        .catch((error) => console.error("Error deleting booking:", error));
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#e9ecef", padding: "40px" }}
    >
      <div className="container p-5 rounded-4 shadow-lg" style={{ backgroundColor: "#ffffff", maxWidth: "1400px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1
            className="fw-bold animate__animated animate__fadeIn"
            style={{ color: "#34495e" }}
          >
            Manage Bookings
          </h1>
          <div className="d-flex gap-3">
            <Link to="/adminbookingHistory" state={{ role, userId, token }}>
              <Button
                className="fw-semibold rounded-pill px-4 py-2"
                style={{ backgroundColor: "#34495e", borderColor: "#34495e" }}
              >
                Completed Bookings
              </Button>
            </Link>
            <Link to="/adminOngoingbookings" state={{ role, userId, token }}>
              <Button
                className="fw-semibold rounded-pill px-4 py-2"
                style={{ backgroundColor: "#34495e", borderColor: "#34495e" }}
              >
                Ongoing Bookings
              </Button>
            </Link>
          </div>
        </div>

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
              <th>Order ID</th>
              <th>Pickup Location</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Assigned Driver</th>
              <th>Vehicle Number</th>
              <th>Booking Date</th>
              <th>Distance (km)</th>
              <th>Cost ($)</th>
              <th>Vehicle Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.pickupLocation}</td>
                  <td>{booking.destinationLocation}</td>
                  <td>{booking.status}</td>
                  <td>{booking.assignedDriverId || "Under Review"}</td>
                  <td>{booking.vehicleNumber || "Under Review"}</td>
                  <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                  <td>{booking.distance ? parseFloat(booking.distance).toFixed(2) : "N/A"}</td>
                  <td>{booking.cost ? parseFloat(booking.cost).toFixed(2) : "N/A"}</td>
                  <td>{booking.vehicle}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        onClick={() => handleUpdate(booking.bookingId)}
                        className="fw-semibold rounded-pill px-3 py-1"
                        style={{ backgroundColor: "#ffc107", borderColor: "#ffc107", color: "#34495e" }}
                      >
                        Assign D&V
                      </Button>
                      <Button
                        onClick={() => handleDelete(booking.bookingId)}
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
                <td colSpan="11" className="text-center py-4 text-muted">
                  No bookings available.
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
      `}</style>
    </div>
  );
};

export default Bookings;