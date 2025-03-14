package com.example.bookingservice.repository;

import com.example.bookingservice.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    Optional<Booking> findByBookingId(String bookingId);
    List<Booking> findByAssignedDriverId(String assignedDriverId);

    
}
