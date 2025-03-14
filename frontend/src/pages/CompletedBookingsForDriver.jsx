import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Container, Table, Button, Spinner } from 'react-bootstrap';
import { useLocation } from "react-router-dom";

const CompletedBookingsForDriver = () => {
    const location = useLocation();
    const { token, userId } = location.state || {};

    const [driver, setDriver] = useState(null);
    const [user, setUser ] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/user/getDriver`, { id: userId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDriver(response.data);
            } catch (error) {
                setError("Failed to fetch driver details.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchDriverDetails();
    }, [userId, token]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/user/getUser `, { id: userId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser (response.data);
            } catch (error) {
                setError("Failed to fetch user details.");
            }
        };

        if (userId) fetchUserDetails();
    }, [userId, token]);

    useEffect(() => {
        const fetchDriverBookings = async () => {
            if (driver) {
                try {
                    const response = await axios.post(`http://localhost:9090/api/bookings/driver`, { assignedDriverId: driver.username }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setBookings(response.data.filter(booking => booking.status === 'completed'));
                } catch (error) {
                    setError("Failed to fetch driver bookings.");
                }
            }
        };

        fetchDriverBookings();
    }, [driver, token]);


    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading...</p>
        </Container>
    );

    if (error) return <Alert variant="danger" className="text-center mt-3">{error}</Alert>;

    return (
        <Container className="mt-5">
            <h1 className="h3 mb-4 text-center text-dark fw-bold">Ride History </h1>

            {bookings.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                         <th>Booking ID</th>
                            <th>Phone </th>
                            <th>Pickup </th>
                            <th>Destination </th>
                            <th>Status</th>
                            <th>Cost</th>
                            <th>Booking Date</th>
                            <th>Distance</th>
                            <th>Vehicle</th>

                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                 <td>{booking.bookingId}</td>

                                 <td>{booking?.phoneNumber}</td>
                                <td>{booking.pickupLocation}</td>
                                <td>{booking.destinationLocation}</td>
                                <td><span className="badge bg-warning text-dark">{booking.status}</span></td>
                                <td>Rs.{booking.cost.toFixed(2)}</td>
                                <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                                <td>{booking.distance.toFixed(2)} km</td>
                                <td>{booking.vehicle} ({booking.vehicleNumber})</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p className="text-center text-muted">No ongoing bookings assigned to this driver.</p>
            )}
        </Container>
    );
};

export default CompletedBookingsForDriver;

