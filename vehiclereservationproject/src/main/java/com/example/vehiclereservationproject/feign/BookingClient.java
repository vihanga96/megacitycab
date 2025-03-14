package com.example.vehiclereservationproject.feign;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.vehiclereservationproject.dto.BookingDTO;
import java.util.List;

@FeignClient(name = "booking-service", url = "http://localhost:9090")
public interface BookingClient {
    @GetMapping("/api/bookings/user/{userId}")
    List<BookingDTO> getBookingsByUserId(@PathVariable("userId") String userId);
}
