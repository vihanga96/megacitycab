import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, Container, Spinner, Table } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const DriverDashboard = () => {
  const location = useLocation();
  const { token, userId } = location.state || {};

  const [driver, setDriver] = useState(null);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStatusChanged, setIsStatusChanged] = useState(false);

  // [Previous useEffect hooks remain unchanged]
  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/user/getDriver`,
          { id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDriver(response.data);
      } catch (error) {
        setError("Failed to fetch driver details.");
      } finally {
        setLoading(false);
      }
    };
    if (userId && token) fetchDriverDetails();
  }, [userId, token]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/user/getUser`,
          { id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response.data);
      } catch (error) {
        setError("Failed to fetch user details.");
      }
    };
    if (userId && token) fetchUserDetails();
  }, [userId, token]);

  useEffect(() => {
    const fetchDriverBookings = async () => {
      if (driver) {
        try {
          const response = await axios.post(
            `http://localhost:9090/api/bookings/driver`,
            { assignedDriverId: driver.username },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setBookings(response.data.filter((booking) => booking.status === "assigned"));
        } catch (error) {
          setError("No bookings assigned for you.");
        }
      }
    };
    if (token) fetchDriverBookings();
  }, [driver, token, isStatusChanged]);

  const handlePickup = async (bookingId) => {
    try {
      const response = await axios.put(
        `http://localhost:9090/api/bookings/updateStatus/${bookingId}`,
        { status: "ongoing" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, status: "ongoing" } : booking
          )
        );
        setIsStatusChanged(true);
      }
    } catch (error) {
      setError("Failed to update booking status.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" style={{ color: "#2c3e50" }} />
        <p className="mt-2" style={{ color: "#2c3e50" }}>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center mt-5 mx-auto" style={{ maxWidth: "600px" }}>
        {error}
      </Alert>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Container className="dashboard-container">
        <h1 className="dashboard-title">Driver Dashboard</h1>

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <Link to="/driverOngoingBookings" state={{ userId, token }} className="nav-btn">
            Ongoing Bookings
          </Link>
          <Link to="/driverCompletedBookings" state={{ userId, token }} className="nav-btn">
            Booking History
          </Link>
        </div>

        {/* Bookings Table */}
        {bookings.length > 0 ? (
          <Table striped bordered hover className="bookings-table">
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>User Phone</th>
                <th>Pickup</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Date</th>
                <th>Distance</th>
                <th>Vehicle</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.phoneNumber || "N/A"}</td>
                  <td>{booking.pickupLocation}</td>
                  <td>{booking.destinationLocation}</td>
                  <td>
                    <span className="status-badge">{booking.status}</span>
                  </td>
                  <td>Rs.{booking.cost.toFixed(2)}</td>
                  <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                  <td>{booking.distance.toFixed(2)} km</td>
                  <td>
                    {booking.vehicle} ({booking.vehicleNumber})
                  </td>
                  <td>
                    <Button
                      onClick={() => handlePickup(booking.bookingId)}
                      className="pickup-btn"
                    >
                      Start Pickup
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="no-bookings">No bookings assigned to you at this time.</p>
        )}
      </Container>


      <style>{`
        .dashboard-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #ecf0f1, #bdc3c7);
          padding: 20px 0; /* Reduced top padding */
          display: flex;
          justify-content: center;
          align-items: flex-start; /* Changed from center to flex-start */
        }
        .dashboard-container {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 1200px;
          width: 100%;
          margin-top: 20px; /* Added small top margin for spacing */
        }
        .dashboard-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #2c3e50;
          text-align: center;
          margin-bottom: 2rem;
        }
        .nav-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .nav-btn {
          background: #2c3e50;
          color: #fff;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .nav-btn:hover {
          background: #3498db;
          color: #fff;
          transform: translateY(-2px);
        }
        .bookings-table {
          background: #fff;
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }
        .bookings-table th {
          color: #fff;
          text-align: center;
          vertical-align: middle;
        }
        .bookings-table td {
          vertical-align: middle;
          color: #2c3e50;
        }
        .status-badge {
          background: #f1c40f;
          color: #2c3e50;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-weight: 600;
          display: inline-block;
        }
        .pickup-btn {
          background: #f1c40f;
          border: none;
          color: #2c3e50;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .pickup-btn:hover {
          background: #f39c12;
          transform: translateY(-2px);
        }
        .no-bookings {
          text-align: center;
          font-size: 1.2rem;
          color: #7f8c8d;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default DriverDashboard;