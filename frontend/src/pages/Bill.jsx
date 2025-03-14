import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Bill = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId, token } = location.state || {};

    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/api/bookings/booking/${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBooking(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching booking:", error.response ? error.response.data : error.message);
                setError("Failed to fetch booking details.");
                setLoading(false);
            }
        };

        if (token && bookingId) {
            fetchBooking();
        } else {
            alert("No token or booking ID available.");
            navigate('/login');
        }
    }, [token, bookingId, navigate]);

    const generatePDF = () => {
        const input = document.getElementById('invoice');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save('invoice.pdf');
        });
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="bill-page">
            <div className="bill-card">
                <div id="invoice">
                    <h2 className="invoice-title">Invoice</h2>
                    <div className="invoice-details">
                        <p><strong>Booking ID:</strong> {booking.bookingId || booking.id}</p>
                        <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
                        <p><strong>Destination:</strong> {booking.destinationLocation}</p>
                        <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                        <p><strong>Cost:</strong> <span className="cost">Rs.{booking.cost.toFixed(2)}</span></p>
                        <p><strong>Vehicle:</strong> {booking.vehicle}</p>
                        <p><strong>Number:</strong> {booking.vehicleNumber}</p>
                        <p><strong>Driver:</strong> {booking.assignedDriverId}</p>
                    </div>
                </div>
                <button onClick={generatePDF} className="download-btn">
                    Download Invoice
                </button>
            </div>

            {/* Custom CSS */}
            <style>{`
                .bill-page {
                    min-height: 100vh;
                    background: #ffffff;
                    padding: 20px 0;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }
                .bill-card {
                    max-width: 500px;
                    width: 100%;
                    background: #f8f9fa;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1),
                                inset 0 2px 4px rgba(255, 255, 255, 0.8);
                    margin-top: 40px;
                    text-align: center;
                    color: #212529;
                    transition: transform 0.3s ease;
                }
                .bill-card:hover {
                    transform: translateY(-5px);
                }
                .invoice-title {
                    color: #343a40;
                    font-weight: 700;
                    font-size: 2rem;
                    margin-bottom: 1.5rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .invoice-details {
                    font-size: 1.1rem;
                    text-align: left;
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }
                .invoice-details p {
                    margin: 0.5rem 0;
                    display: flex;
                    justify-content: space-between;
                }
                .invoice-details strong {
                    color: #343a40;
                    font-weight: 600;
                }
                .cost {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #28a745;
                }
                .download-btn {
                    background: #4070B0;
                    color: #ffffff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    padding: 0.75rem 2rem;
                    border-radius: 25px;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                    margin-top: 1rem;
                }
                .download-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                    background: linear-gradient(90deg, #00c4cc, #007bff);
                }
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-size: 1.5rem;
                    color: #007bff;
                    background: #ffffff;
                }
                .error-container {
                    text-align: center;
                    color: #dc3545;
                    font-size: 1.2rem;
                    margin-top: 20px;
                    background: #fff3f3;
                    padding: 1rem;
                    border-radius: 12px;
                    max-width: 500px;
                    margin: 20px auto;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default Bill;