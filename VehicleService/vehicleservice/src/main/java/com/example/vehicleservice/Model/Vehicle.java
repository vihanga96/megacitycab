package com.example.vehicleservice.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicles")
public class Vehicle {
    @Id
    private String id;
    private String vehicleNumber;
    private String model;
    private String brand;
    private int year;
    private String driverId; // Assigned driver ID
    private String vehicleType;

    

    public Vehicle(String vehicleNumber, String model, String brand, int year, String driverId, String vehicleType) {
        this.vehicleNumber = vehicleNumber;
        this.model = model;
        this.brand = brand;
        this.year = year;
        this.driverId = driverId;
        this.vehicleType = vehicleType;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

}
