package com.example.bookingservice.controller;

import com.example.bookingservice.model.Booking;
import com.example.bookingservice.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingService bookingService;

    // Add Booking
    @PostMapping("/add")
    public ResponseEntity<?> addBooking(@RequestBody Booking booking, Authentication authentication) {
        logger.info("Received request to add booking");

        // if (authentication == null || !authentication.isAuthenticated()) {
        //     return ResponseEntity.status(401).body("Unauthorized: Please log in first!");
        // }

        try {
            Booking savedBooking = bookingService.addBooking(booking);
            return ResponseEntity.ok(savedBooking);  // Return saved booking
        } catch (Exception e) {
            logger.error("Error saving booking: ", e);
            return ResponseEntity.status(500).body("Error saving booking: " + e.getMessage());
        }
    }

    @GetMapping("/all")
public ResponseEntity<?> getAllBookings() {
    try {
        List<Booking> bookings = bookingService.getAllBookings();
        if (bookings.isEmpty()) {
            return ResponseEntity.noContent().build();  // If no bookings are found
        }
        return ResponseEntity.ok(bookings);
    } catch (Exception e) {
        logger.error("Error fetching all bookings", e);
        return ResponseEntity.status(500).body("Error fetching all bookings: " + e.getMessage());
    }
}

    // Get User Bookings
    @GetMapping("/user")
    public ResponseEntity<?> getUserBookings(Principal principal) {
        List<Booking> bookings = bookingService.getUserBookings(principal.getName());
        return ResponseEntity.ok(bookings);
    }

        // get booking by booking ID
    @GetMapping("/booking/{bookingId}")
public ResponseEntity<?> getBookingByBookingId(@PathVariable String bookingId) {
    Optional<Booking> booking = bookingService.getBookingByBookingId(bookingId);
    return booking.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
}

    // Get Booking by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update Booking
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable String id, @RequestBody Booking booking) {
        Booking updatedBooking = bookingService.updateBooking(id, booking);
        return updatedBooking != null ? ResponseEntity.ok(updatedBooking) : ResponseEntity.notFound().build();
    }

    // Assign Driver to Booking
    @PutMapping("/assignDriver")
    public ResponseEntity<?> assignDriver(@RequestBody Map<String, Object> requestBody) {
        String id = (String) requestBody.get("id");
        String driverId = (String) requestBody.get("driverId");

        Optional<Booking> booking = bookingService.getBookingById(id);
        if (booking.isPresent()) {
            Booking updatedBooking = booking.get();
            updatedBooking.setAssignedDriverId(driverId);
            updatedBooking.setStatus("assigned");
            return ResponseEntity.ok(bookingService.addBooking(updatedBooking));
        }
        return ResponseEntity.notFound().build();
    }

    // Delete Booking
    @DeleteMapping("/deleteBooking")
    public ResponseEntity<?> deleteBooking(@RequestBody Map<String, Object> requestBody) {
        String id = (String) requestBody.get("id");
        return bookingService.deleteBooking(id) ? ResponseEntity.ok("Booking deleted") : ResponseEntity.notFound().build();
    }

    // Update Cost
    @PutMapping("/updateCost")
    public ResponseEntity<Booking> updateCost(@RequestBody Map<String, Object> requestBody) {
        String id = (String) requestBody.get("id");
        Double cost = (Double) requestBody.get("cost");

        Booking updatedBooking = bookingService.updateCost(id, cost);
        return ResponseEntity.ok(updatedBooking);
    }

    // Update Status
    @PutMapping("/updateStatus")
    public ResponseEntity<?> updateStatus(@RequestBody Map<String, Object> requestBody) {
        String id = (String) requestBody.get("id");
        String status = (String) requestBody.get("status");

        Booking updatedBooking = bookingService.updateStatus(id, status);
        return updatedBooking != null ? ResponseEntity.ok(updatedBooking) : ResponseEntity.notFound().build();
    }

    // Get Bookings by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUserId(@PathVariable String userId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByUserId(userId);
            if (bookings.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            logger.error("Error fetching bookings for userId: " + userId, e);
            return ResponseEntity.status(500).body("Error fetching bookings");
        }
    }
    

    // In BookingController.java

// Update Booking by BookingId
@PutMapping("/updateByBookingId")
public ResponseEntity<?> updateBookingByBookingId(@RequestBody Map<String, Object> requestBody) {
    // Extract values from the request body
    String bookingId = (String) requestBody.get("bookingId");
    String phoneNumber = (String) requestBody.get("phoneNumber");
    String pickupLocation = (String) requestBody.get("pickupLocation");
    String destinationLocation = (String) requestBody.get("destinationLocation");
    String vehicle = (String) requestBody.get("vehicle"); // Changed from vehicleType to vehicle
    Double distance = (Double) requestBody.get("distance");
    Double cost = (Double) requestBody.get("cost");

    // Log extracted values
    logger.info("Extracted values - bookingId: {}, phoneNumber: {}, pickupLocation: {}, destinationLocation: {}, vehicle: {}, distance: {}, cost: {}",
                bookingId, phoneNumber, pickupLocation, destinationLocation, vehicle, distance, cost);

    // Create a new Booking object to update
    Booking updatedBooking = new Booking();
    updatedBooking.setBookingId(bookingId);
    updatedBooking.setPhoneNumber(phoneNumber);
    updatedBooking.setPickupLocation(pickupLocation);
    updatedBooking.setDestinationLocation(destinationLocation);
    updatedBooking.setVehicle(vehicle); // Ensure this matches the field in Booking class
    updatedBooking.setDistance(distance);
    updatedBooking.setCost(cost);

    // Log the updated Booking object
    logger.info("Updated Booking object: {}", updatedBooking);

    // Call the service to update the booking
    Booking result = bookingService.updateBookingByBookingId(bookingId, updatedBooking);
    
    // Return the appropriate response
    return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
}

// Delete Booking by BookingId
@DeleteMapping("/deleteByBookingId")
public ResponseEntity<?> deleteBookingByBookingId(@RequestBody Map<String, Object> requestBody) {
    String bookingId = (String) requestBody.get("bookingId");
    return bookingService.deleteBookingByBookingId(bookingId) ? ResponseEntity.ok("Booking deleted") : ResponseEntity.notFound().build();
}

@PutMapping("/updateByBookingDriver")
public ResponseEntity<?> updateByBookingDriver(@RequestBody Map<String, Object> requestBody) {
    String bookingId = (String) requestBody.get("bookingId");
    String vehicleNumber = (String) requestBody.get("vehicleNumber");
    String assignedDriverId = (String) requestBody.get("assignedDriverId");

    // Create a new Booking object to update
    Booking updatedBooking = new Booking();
    updatedBooking.setVehicleNumber(vehicleNumber);
    updatedBooking.setAssignedDriverId(assignedDriverId);

    Booking result = bookingService.updateDriverOfBookingByBookingId(bookingId, updatedBooking);
    return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
}

@PostMapping("/driver")
public ResponseEntity<List<Booking>> getBookingsByAssignedDriverId(@RequestBody Map<String, String> requestBody) {
    String assignedDriverId = requestBody.get("assignedDriverId");
    List<Booking> bookings = bookingService.getBookingsByAssignedDriverId(assignedDriverId);
    if (bookings.isEmpty()) {
        return ResponseEntity.noContent().build(); // If no bookings are found
    }
    return ResponseEntity.ok(bookings);
}
@PutMapping("/updateStatus/{bookingId}")
public ResponseEntity<?> updateBookingStatus(@PathVariable String bookingId, @RequestBody Map<String, String> requestBody) {
    String status = requestBody.get("status"); // Get the new status from the request body
    Booking updatedBooking = bookingService.updateBookingStatus(bookingId, status);
    return updatedBooking != null ? ResponseEntity.ok(updatedBooking) : ResponseEntity.notFound().build();
}
}
