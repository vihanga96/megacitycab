import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import taxiImage from "../../public/images/taxi.jpg"; // Ensure this path is correct
import { useAuth } from "../utils/AuthContext";

// HomePage Component
const HomePage = () => {
  const { auth } = useAuth();
  const { role, userId, token } = auth;

  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="bg-primary text-white text-center py-5">
        <div className="container py-5">
          <h1 className="display-4 fw-bold mb-4">Mega City Cabs</h1>
          <p className="lead mb-4 col-lg-8 mx-auto">
            Your Reliable Travel Partner Since 2010
          </p>
          <Link
            to="/newbooking"
            state={{ role: role, userId: userId, token: token }}
          >
            <button className="btn btn-warning btn-lg fw-bold text-dark px-5 py-3 rounded-pill">
              Book a Ride Now
            </button>
          </Link>
        </div>
      </div>

      {/* About Mega Cabs */}
      <div className="container text-center py-5">
        <h2 className="fw-bold mb-4 text-primary display-5">
          Why Choose Mega City Cabs?
        </h2>
        <p className="lead text-muted col-lg-8 mx-auto">
          At <b>Mega City Cabs</b>, we deliver safe, reliable, and comfortable
          rides at affordable prices. Whether it’s a quick city trip or a
          long-distance journey, our professional drivers and modern fleet have
          you covered.
        </p>
      </div>

      {/* Services Section */}
      <div className="container py-5">
        <h2 className="fw-bold mb-5 text-center text-primary display-4 animate__animated animate__fadeIn">
          Explore Our Services
        </h2>
        <div className="row row-cols-1 row-cols-md-3 g-5">
          {[
            { title: "Private Airport Shuttles", icon: "bi bi-airplane-engines-fill", color: "text-primary" },
            { title: "Daily Commute Solutions", icon: "bi bi-geo-alt-fill", color: "text-success" },
            { title: "VIP Chauffeur Service", icon: "bi bi-star-fill", color: "text-warning" },
            { title: "Event Transportation", icon: "bi bi-calendar-event-fill", color: "text-info" },
            { title: "Long-Distance Journeys", icon: "bi bi-road", color: "text-danger" },
            { title: "Instant Ride Booking", icon: "bi bi-lightning-fill", color: "text-purple" },
          ].map((service, index) => (
            <div className="col" key={index}>
              <div className="card h-100 border-0 shadow-lg rounded-4 hover-scale" style={{ backgroundColor: "#34495e" }}>
                <div className="card-body text-center p-4">
                  <i className={`${service.icon} ${service.color} mb-4`} style={{ fontSize: "3.5rem", transition: "transform 0.3s" }}></i>
                  <h4 className="fw-semibold text-white mb-3">{service.title}</h4>
                  <p className="text-light fs-6">
                    Seamless, reliable rides crafted for your comfort and convenience.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for Services */}
      <style>{`
        .hover-scale {
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .hover-scale:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
        }
        .text-purple {
          color: #6f42c1;
        }
      `}</style>

      {/* Footer */}
      <footer className="text-warning text-center py-3" style={{ backgroundColor: "#34495e" }}>
        <p className="m-0">
          <i className="bi bi-telephone-fill me-2"></i> 123-456-7890 |{" "}
          <i className="bi bi-envelope-fill me-2 ms-3"></i> support@megacitycabs.com
        </p>
      </footer>
    </div>
  );
};

// AboutUs Component
export const AboutUs = () => {
  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-3 display-4">About Mega City Cabs</h2>
        <p className="text-muted lead mx-auto col-lg-8">
          Your trusted ride partner delivering safe, reliable, and affordable
          journeys since 2010.
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="row g-4 mb-5">
        {/* Left Column - Why Choose Us */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 rounded-3 bg-white p-4">
            <h4 className="fw-bold text-primary mb-4 h3">Why Ride With Us?</h4>
            <ul className="list-unstyled">
              {[
                "Reliable & Punctual Service",
                "Diverse Vehicle Fleet",
                "Expert Drivers",
                "Transparent Pricing",
                "Round-the-Clock Service",
              ].map((item, index) => (
                <li key={index} className="d-flex align-items-center mb-3">
                  <span className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-check-lg text-primary"></i>
                  </span>
                  <span className="text-dark">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Booking Steps */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 rounded-3 bg-white p-4">
            <h4 className="fw-bold text-primary mb-4 h3">Book Your Ride in Minutes</h4>
            <ol className="list-group list-group-numbered">
              {[
                "Sign up with your details",
                "Log in to get started",
                "Select 'Book a Ride'",
                "Enter trip details",
                "Confirm your booking",
              ].map((step, index) => (
                <li key={index} className="list-group-item border-0 ps-0">
                  <span className="text-dark">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-dark-subtle rounded-4 p-5 text-center mt-5" style={{ backgroundColor: "#34495e" }}>
        <h4 className="fw-bold text-white mb-4 h2 animate__animated animate__fadeIn">
          Let’s Connect
        </h4>
        <p className="text-light mb-5 lead">
          Have a question? Reach out anytime—our team is ready to assist you.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-5">
          <a
            href="mailto:support@megacitycabs.com"
            className="text-decoration-none text-primary fw-semibold d-flex align-items-center contact-link"
          >
            <i className="bi bi-envelope-fill me-2" style={{ fontSize: "1.5rem" }}></i>
            support@megacitycabs.com
          </a>
          <a
            href="tel:1234567890"
            className="text-decoration-none text-primary fw-semibold d-flex align-items-center contact-link"
          >
            <i className="bi bi-telephone-fill me-2" style={{ fontSize: "1.5rem" }}></i>
            123-456-7890
          </a>
        </div>
      </div>

      {/* Custom CSS for Contact */}
      <style>{`
        .contact-link {
          transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
        }
        .contact-link:hover {
          color: #ffffff !important;
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

// ContactUs Component
export const ContactUs = () => {
  return (
    <div className="container py-5">
      <div className="bg-dark rounded-4 p-5 text-center" style={{ backgroundColor: "#34495e" }}>
        <h4 className="fw-bold text-white mb-4 h2 animate__animated animate__fadeIn">
          Let’s Connect
        </h4>
        <p className="text-light mb-5 lead">
          Have a question? Reach out anytime—our team is ready to assist you.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-5">
          <a
            href="mailto:support@megacitycabs.com"
            className="text-decoration-none text-primary fw-semibold d-flex align-items-center contact-link"
          >
            <i className="bi bi-envelope-fill me-2" style={{ fontSize: "1.5rem" }}></i>
            support@megacitycabs.com
          </a>
          <a
            href="tel:1234567890"
            className="text-decoration-none text-primary fw-semibold d-flex align-items-center contact-link"
          >
            <i className="bi bi-telephone-fill me-2" style={{ fontSize: "1.5rem" }}></i>
            123-456-7890
          </a>
        </div>
      </div>

      {/* Custom CSS for Contact */}
      <style>{`
        .contact-link {
          transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
        }
        .contact-link:hover {
          color: #ffffff !important;
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

export default HomePage;