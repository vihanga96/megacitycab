package com.example.vehiclereservationproject.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "driver_logins")
public class DriverLogin {
    @Id
    private String id;
    private String driverId; 
    private String email; 
    private String password;

    public DriverLogin() {
    }

    //  constructor 
    public DriverLogin(String driverId, String email, String password) {
        this.driverId = driverId; 
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}