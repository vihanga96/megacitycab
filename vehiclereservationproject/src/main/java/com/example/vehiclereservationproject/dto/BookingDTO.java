package com.example.vehiclereservationproject.dto;

import java.util.Date;
import java.util.UUID;
import org.springframework.data.annotation.Id;

public class BookingDTO {
    @Id
    private String id;
    private String bookingId;
    private String phoneNumber;
    private String pickupLocation;
    private String destinationLocation;
    // private double fare;
    private Date bookingDate;
    private String userId;
    private String username; 
    private String status; 
    private String assignedDriverId; 
    private Double cost;
    private Double distance; 
    private String vehicle; 
    private String vehicleNumber; 

    public BookingDTO() {
        this.bookingId = "BOOKING-" + UUID.randomUUID().toString().substring(0, 8);
        this.bookingDate = new Date();
        this.status = "pending";
        this.assignedDriverId = null;
        this.vehicleNumber = null; // Default value for vehicleNumber is null
    }

    // Getters and Setters
    public BookingDTO(String phoneNumber, String pickupLocation, String destinationLocation, double fare, String userId, String vehicle, String vehicleNumber) {
        this();
        this.phoneNumber = phoneNumber;
        this.pickupLocation = pickupLocation;
        this.destinationLocation = destinationLocation;
        // this.fare = fare;
        this.userId = userId;
        this.vehicle = vehicle; 
        this.vehicleNumber = vehicleNumber; 
        this.username = username;
    }

    // Getters and Setters
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }

    public Double getDistance() { return distance; }  
    public void setDistance(Double distance) { this.distance = distance; } 

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDestinationLocation() { return destinationLocation; }
    public void setDestinationLocation(String destinationLocation) { this.destinationLocation = destinationLocation; }


    public Date getBookingDate() { return bookingDate; }
    public void setBookingDate(Date bookingDate) { this.bookingDate = bookingDate; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(String assignedDriverId) { this.assignedDriverId = assignedDriverId; }

    // Getter and Setter for 'vehicle'
    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}