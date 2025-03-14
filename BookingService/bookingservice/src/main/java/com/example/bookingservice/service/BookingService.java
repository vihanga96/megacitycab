package com.example.bookingservice.service;

import com.example.bookingservice.model.Booking;
import com.example.bookingservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;


@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    //  districts with their latitude and longitude
    private static final Map<String, double[]> DISTRICT_LOCATIONS = new HashMap<>();

    static {
        DISTRICT_LOCATIONS.put("Colombo", new double[]{6.9271, 79.8612});
        DISTRICT_LOCATIONS.put("Gampaha", new double[]{7.0840, 80.0098});
        DISTRICT_LOCATIONS.put("Kandy", new double[]{7.2906, 80.6337});
        DISTRICT_LOCATIONS.put("Galle", new double[]{6.0535, 80.2210});
        DISTRICT_LOCATIONS.put("Jaffna", new double[]{9.6615, 80.0255});
        DISTRICT_LOCATIONS.put("Matara", new double[]{5.9549, 80.5549});
        DISTRICT_LOCATIONS.put("Kurunegala", new double[]{7.4863, 80.3658});
        DISTRICT_LOCATIONS.put("Anuradhapura", new double[]{8.3114, 80.4037});
        DISTRICT_LOCATIONS.put("Badulla", new double[]{6.9934, 81.0550});
        DISTRICT_LOCATIONS.put("Ratnapura", new double[]{6.7056, 80.3847});
    }

    // public Booking addBooking(Booking booking) {
    //     try {
    //         booking.setStatus("pending");
    //         booking.setAssignedDriverId(null);
    
    //         // Get latitude and longitude from district names
    //         double[] pickupCoords = DISTRICT_LOCATIONS.get(booking.getPickupLocation());
    //         double[] destinationCoords = DISTRICT_LOCATIONS.get(booking.getDestinationLocation());
    
    //         if (pickupCoords == null || destinationCoords == null) {
    //             throw new RuntimeException("Invalid pickup or destination location");
    //         }
    
    //         // Calculate distance (in km) using Haversine formula
    //         double distance = calculateDistance(pickupCoords[0], pickupCoords[1], destinationCoords[0], destinationCoords[1]);
    
    //         // Determine the cost based on the vehicle type
    //         double costPerKm;
    //         String vehicle = booking.getVehicle();  // Get the vehicle type
    
    //         if ("car".equalsIgnoreCase(vehicle)) {
    //             costPerKm = 300; // Rs. 300 per km for car
    //         } else if ("van".equalsIgnoreCase(vehicle)) {
    //             costPerKm = 500; // Rs. 500 per km for van
    //         } else {
    //             throw new RuntimeException("Invalid vehicle type");
    //         }
    
    //         // Calculate the cost
    //         double cost = distance * costPerKm;
    
    //         // Set distance and cost
    //         booking.setDistance(distance);
    //         booking.setCost(cost);
    
    //         return bookingRepository.save(booking);  
    //     } catch (DataAccessException e) {
    //         throw new RuntimeException("Error saving booking: " + e.getMessage());
    //     }
    // }
    
    public Booking addBooking(Booking booking) {
        try {
            booking.setStatus("pending");
            booking.setAssignedDriverId(null);
    
            // The frontend should send both `distance` and `cost`
            return bookingRepository.save(booking);
        } catch (DataAccessException e) {
            throw new RuntimeException("Error saving booking: " + e.getMessage());
        }
    }
    


    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the Earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public Optional<Booking> getBookingByBookingId(String bookingId) {
        return bookingRepository.findByBookingId(bookingId);
    }

    // public Booking addBooking(Booking booking) {
    //     try {
    //         booking.setStatus("pending");
    //         booking.setAssignedDriverId(null);
    //         return bookingRepository.save(booking);  // This will save and return the saved booking
    //     } catch (DataAccessException e) {
    //         throw new RuntimeException("Error saving booking: " + e.getMessage());
    //     }
    // }
    
    // In BookingService.java

    // public Booking updateBookingByBookingId(String bookingId, Booking updatedBooking) {
    //     return bookingRepository.findByBookingId(bookingId).map(existingBooking -> {
    //         try {
    //             // Update fields
    //             existingBooking.setPhoneNumber(updatedBooking.getPhoneNumber());
    //             existingBooking.setPickupLocation(updatedBooking.getPickupLocation());
    //             existingBooking.setDestinationLocation(updatedBooking.getDestinationLocation());
    //             existingBooking.setStatus(updatedBooking.getStatus());
    //             existingBooking.setAssignedDriverId(updatedBooking.getAssignedDriverId());
    
    //             // Always recalculate distance and cost
    //             double[] pickupCoords = DISTRICT_LOCATIONS.get(updatedBooking.getPickupLocation());
    //             double[] destinationCoords = DISTRICT_LOCATIONS.get(updatedBooking.getDestinationLocation());
    
    //             if (pickupCoords == null || destinationCoords == null) {
    //                 throw new RuntimeException("Invalid pickup or destination location");
    //             }
    
    //             // Calculate new distance
    //             double distance = calculateDistance(pickupCoords[0], pickupCoords[1], destinationCoords[0], destinationCoords[1]);
    
    //             // Determine the cost based on the vehicle type
    //             double costPerKm;
    //             String vehicle = updatedBooking.getVehicle();  // Get the vehicle type
    
    //             if ("car".equalsIgnoreCase(vehicle)) {
    //                 costPerKm = 300; // Rs. 300 per km for car
    //             } else if ("van".equalsIgnoreCase(vehicle)) {
    //                 costPerKm = 500; // Rs. 500 per km for van
    //             } else {
    //                 throw new RuntimeException("Invalid vehicle type");
    //             }
    
    //             // Calculate the new cost
    //             double cost = distance * costPerKm;
    
    //             // Set the new distance and cost
    //             existingBooking.setDistance(distance);
    //             existingBooking.setCost(cost);
    
    //             return bookingRepository.save(existingBooking);
    //         } catch (DataAccessException e) {
    //             throw new RuntimeException("Error updating booking: " + e.getMessage());
    //         }
    //     }).orElse(null);
    // }
    
    public Booking updateBookingByBookingId(String bookingId, Booking updatedBooking) {
        return bookingRepository.findByBookingId(bookingId).map(existingBooking -> {
            try {
                // Update fields
                existingBooking.setPhoneNumber(updatedBooking.getPhoneNumber());
                existingBooking.setPickupLocation(updatedBooking.getPickupLocation());
                existingBooking.setDestinationLocation(updatedBooking.getDestinationLocation());
                existingBooking.setStatus(updatedBooking.getStatus());
                existingBooking.setAssignedDriverId(updatedBooking.getAssignedDriverId());
                existingBooking.setDistance(updatedBooking.getDistance());
                existingBooking.setCost(updatedBooking.getCost()); 
                existingBooking.setVehicle(updatedBooking.getVehicle()); 
    
                return bookingRepository.save(existingBooking);
            } catch (DataAccessException e) {
                throw new RuntimeException("Error updating booking: " + e.getMessage());
            }
        }).orElse(null);
    }
    
    public boolean deleteBookingByBookingId(String bookingId) {
    try {
        Booking booking = bookingRepository.findByBookingId(bookingId).orElse(null);
        if (booking != null) {
            bookingRepository.delete(booking);
            return true;
        }
    } catch (DataAccessException e) {
        throw new RuntimeException("Error deleting booking: " + e.getMessage());
    }
    return false;
}

    public List<Booking> getUserBookings(String userId) {
        try {
            return bookingRepository.findByUserId(userId);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving user bookings: " + e.getMessage());
        }
    }

    public Optional<Booking> getBookingById(String id) {
        try {
            return bookingRepository.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving booking: " + e.getMessage());
        }
    }

    public Booking updateBooking(String id, Booking updatedBooking) {
        return bookingRepository.findById(id).map(existingBooking -> {
            try {
                existingBooking.setPhoneNumber(updatedBooking.getPhoneNumber());
                existingBooking.setPickupLocation(updatedBooking.getPickupLocation());
                existingBooking.setDestinationLocation(updatedBooking.getDestinationLocation());
                // existingBooking.setFare(updatedBooking.getFare());
                existingBooking.setStatus(updatedBooking.getStatus());
                existingBooking.setAssignedDriverId(updatedBooking.getAssignedDriverId());
                return bookingRepository.save(existingBooking);
            } catch (DataAccessException e) {
                throw new RuntimeException("Error updating booking: " + e.getMessage());
            }
        }).orElse(null);
    }

    public boolean deleteBooking(String id) {
        try {
            if (bookingRepository.existsById(id)) {
                bookingRepository.deleteById(id);
                return true;
            }
        } catch (DataAccessException e) {
            throw new RuntimeException("Error deleting booking: " + e.getMessage());
        }
        return false;
    }

    public Booking updateCost(String id, Double cost) {
        return bookingRepository.findById(id).map(existingBooking -> {
            existingBooking.setCost(cost);
            return bookingRepository.save(existingBooking);
        }).orElse(null);
    }

    // Update Status
    public Booking updateStatus(String id, String status) {
        return bookingRepository.findById(id).map(existingBooking -> {
            existingBooking.setStatus(status);
            return bookingRepository.save(existingBooking);
        }).orElse(null);
    }
    
    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);  
    }

    public List<Booking> getAllBookings() {
        try {
            return bookingRepository.findAll();
        } catch (DataAccessException e) {
            throw new RuntimeException("Error fetching bookings: " + e.getMessage());
        }
    }

    public Booking updateDriverOfBookingByBookingId(String bookingId, Booking updatedBooking) {
        return bookingRepository.findByBookingId(bookingId).map(existingBooking -> {
            try {
                // Update fields
                existingBooking.setVehicleNumber(updatedBooking.getVehicleNumber());
                existingBooking.setAssignedDriverId(updatedBooking.getAssignedDriverId());
                existingBooking.setStatus("assigned");
    
                return bookingRepository.save(existingBooking);
            } catch (DataAccessException e) {
                throw new RuntimeException("Error updating booking: " + e.getMessage());
            }
        }).orElse(null);
    }

    public List<Booking> getBookingsByAssignedDriverId(String assignedDriverId) {
        return bookingRepository.findByAssignedDriverId(assignedDriverId);
    }
    
    public Booking updateBookingStatus(String bookingId, String status) {
        return bookingRepository.findByBookingId(bookingId).map(existingBooking -> {
            existingBooking.setStatus(status); // Update the status
            return bookingRepository.save(existingBooking); // Save the updated booking
        }).orElse(null); // Return null if the booking is not found
    }
}
