import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
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

const AddNewBooking = () => {
  const location = useLocation();
  const { role, userId, token } = location.state || {};
  const navigate = useNavigate(); 

  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [cost, setCost] = useState(0); 
  const [vehicle, setVehicle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  useEffect(() => {
    if (!role || !userId || !token) {
      console.log("Error: Role, User ID, or Token not available.");
      navigate("/login");
    }
  }, [role, userId, token, navigate]);

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

  const calculateCost = (pickupLocation, destinationLocation, vehicle) => {
    if (!pickupLocation || !destinationLocation || !vehicle) return;

    const pickupCoords = districtLocations[pickupLocation];
    const destinationCoords = districtLocations[destinationLocation];
    const distance = calculateDistance(pickupCoords, destinationCoords);

    let costPerKm;

    if (vehicle.toLowerCase() === "car") {
      costPerKm = 300; // Rs. 300 per km for car
    } else if (vehicle.toLowerCase() === "van") {
      costPerKm = 500; // Rs. 500 per km for van
    } else {
      throw new Error("Invalid vehicle type");
    }

    const calculatedCost = distance * costPerKm;
    setCost(calculatedCost); 
  };

  const handlePickupChange = (event) => {
    const value = event.target.value;
    setPickupLocation(value);
    calculateCost(value, destinationLocation, vehicle);
  };

  const handleDestinationChange = (event) => {
    const value = event.target.value;
    setDestinationLocation(value);
    calculateCost(pickupLocation, value, vehicle); 
  };

  const handleVehicleChange = (event) => {
    const value = event.target.value;
    setVehicle(value);
    calculateCost(pickupLocation, destinationLocation, value); 
  };

  const handlePhoneNumberChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (numericValue.length <= 10) {
      setPhoneNumber(numericValue);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate phone number length
    if (phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits!");
      return;
    }

    const pickupCoords = districtLocations[pickupLocation];
    const destinationCoords = districtLocations[destinationLocation];

    const distance = calculateDistance(pickupCoords, destinationCoords);

    let costPerKm;
    if (vehicle.toLowerCase() === "car") {
      costPerKm = 300;
    } else if (vehicle.toLowerCase() === "van") {
      costPerKm = 500;
    } else {
      throw new Error("Invalid vehicle type");
    }
    const calculatedCost = distance * costPerKm;

    const bookingData = {
      phoneNumber,
      pickupLocation,
      destinationLocation,
      status: "pending",
      assignedDriverId: "",
      bookingDate: bookingDate.toString(),
      userId,
      distance: distance.toFixed(2),
      cost: calculatedCost.toFixed(2),
      vehicle,
    };

    try {
      console.log("Sending booking data:", bookingData);

      const response = await fetch("http://localhost:9090/api/bookings/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Booking added successfully!");
        navigate("/customerDashboard", { state: { role, userId, token } });
      } else {
        alert(data.message || "Failed to add booking.");
      }
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("An error occurred while adding the booking.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div
        className="container bg-white p-4 p-md-5 rounded shadow-lg"
        style={{ maxWidth: "600px", border: "1px solid #ddd" }}
      >
        <h2 className="text-center mb-4 fw-bold text-dark">Add New Booking</h2>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label htmlFor="phoneNumber" className="form-label fw-semibold text-dark">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className="form-control"
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
            <small className="text-muted">Must be 10 digits</small>
          </div>

          <div className="col-12">
            <label htmlFor="pickupLocation" className="form-label fw-semibold text-dark">
              Pickup Location
            </label>
            <select
              id="pickupLocation"
              className="form-select"
              value={pickupLocation}
              onChange={handlePickupChange}
              required
            >
              <option value="">Select Pickup Location</option>
              {Object.keys(districtLocations).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="destinationLocation" className="form-label fw-semibold text-dark">
              Destination Location
            </label>
            <select
              id="destinationLocation"
              className="form-select"
              value={destinationLocation}
              onChange={handleDestinationChange}
              required
            >
              <option value="">Select Destination Location</option>
              {Object.keys(districtLocations).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="bookingDate" className="form-label fw-semibold text-dark">
              Booking Date
            </label>
            <input
              type="datetime-local"
              id="bookingDate"
              className="form-control"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="vehicle" className="form-label fw-semibold text-dark">
              Vehicle
            </label>
            <select
              id="vehicle"
              className="form-select"
              value={vehicle}
              onChange={handleVehicleChange}
              required
            >
              <option value="">Select Vehicle</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </div>

          <div className="col-12 text-center">
            <p className="fs-5 fw-bold" style={{ color: "#34495e" }}>
              Estimated Cost: Rs. {cost.toFixed(2)}
            </p>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn w-100"
              style={{
                backgroundColor: "#34495e",
                color: "#fff",
                padding: "12px 20px",
                fontSize: "16px",
                transition: "0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2c3e50")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#34495e")}
            >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewBooking;