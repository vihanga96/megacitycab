import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar"; 
import AdminNavBar from "./components/AdminNavBar"; 
import DriverNavBar from "./components/DriverNavBar"; 

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDash from "./pages/CustomerDashboard";
import AddNewBooking from "./pages/AddNewBooking";
import UpdateBooking from "./pages/UpdateBooking";
import HomePage from "./pages/HomePage";
import { AboutUs, ContactUs } from "./pages/HomePage"; 
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Bookings from "./pages/Bookings";
import BookingHistory from "./pages/BookingHistory";
import OngoingBookings from "./pages/OngoingBookings";
import DriverAssignedForBookings from "./pages/DriverAssignedForBookings";
import Drivers from "./pages/Drivers";
import UpdateDriver from "./pages/UpdateDriver";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import Vehicles from "./pages/Vehicles";
import AddNewDriver from "./pages/AddNewDriver";
import UpdateVehicle from "./pages/UpdateVehicle";
import AddNewVehicle from "./pages/AddNewVehicle";
import CustomerCompletedBookings from "./pages/CustomerCompletedBookings";
import Bill from "./pages/Bill";
import DriverDashboard from "./pages/DriverDashboard";
import OngoingBookingsForDriver from "./pages/OngoingBookingsForDriver";
import CompletedBookingsForDriver from "./pages/CompletedBookingsForDriver";

const Layout = ({ children }) => {
  const location = useLocation();

  // Check if the current path is "/adminLogin"
  const isAdminLoginRoute = location.pathname === "/adminLogin";

  // If the current path starts with "/admin", use AdminNavBar
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDriverRoute = location.pathname.startsWith("/driver");

  return (
    <>
      {!isAdminLoginRoute && (isAdminRoute ? <AdminNavBar /> : isDriverRoute ? <DriverNavBar /> : <NavBar />)}
      <main>{children}</main>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customerDashboard" element={<CustomerDash />} />
                <Route path="/newbooking" element={<AddNewBooking />} />
                <Route path="/updatebooking" element={<UpdateBooking />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/customerCompletedBookings" element={<CustomerCompletedBookings />} />
                <Route path="/bill" element={<Bill />} />

                {/* Admin routes */}
                <Route path="/adminDashboard" element={<AdminDashboard />} />
                <Route path="/adminLogin" element={<AdminLogin />} />
                <Route path="/adminbookings" element={<Bookings />} />
                <Route path="/adminbookingHistory" element={<BookingHistory />} />
                <Route path="/adminOngoingbookings" element={<OngoingBookings />} />
                <Route path="/adminDriverAssign" element={<DriverAssignedForBookings />} />
                <Route path="/adminDrivers" element={<Drivers />} />
                <Route path="/adminUpdateDriver" element={<UpdateDriver />} />
                <Route path="/adminUsers" element={<Users />} />
                <Route path="/adminpayments" element={<Payments />} />
                <Route path="/adminVehicles" element={<Vehicles />} />
                <Route path="/adminAddNewDriver" element={<AddNewDriver />} />
                <Route path="/adminUpdateVehicle" element={<UpdateVehicle />} />
                <Route path="/adminAddNewVehicle" element={<AddNewVehicle />} />
                
                {/* Driver routes */}
                <Route path="/driverDashboard" element={<DriverDashboard />} />
                <Route path="/driverOngoingBookings" element={<OngoingBookingsForDriver />} />
                <Route path="/driverCompletedBookings" element={<CompletedBookingsForDriver />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;