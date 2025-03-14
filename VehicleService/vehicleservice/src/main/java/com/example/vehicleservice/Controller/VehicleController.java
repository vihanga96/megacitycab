package com.example.vehicleservice.Controller;

import com.example.vehicleservice.Model.Vehicle;
import com.example.vehicleservice.Service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping("/add")
    public ResponseEntity<?> addVehicle(@RequestBody Vehicle vehicle) {
        try {
            return ResponseEntity.ok(vehicleService.addVehicle(vehicle));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }


   

    @PutMapping("/{id}/assignDriver")
    public ResponseEntity<?> assignDriver(@PathVariable String id, @RequestParam String driverId) {
        try {
            Vehicle updatedVehicle = vehicleService.updateDriverId(id, driverId);
            return ResponseEntity.ok(updatedVehicle);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Vehicle not found or error: " + e.getMessage());
        }
    }

    // Update vehicle by ID, ID sent in request body
    @PutMapping("/update/{id}")
public ResponseEntity<?> updateVehicle(@PathVariable String id, @RequestBody Vehicle vehicle) {
    vehicle.setId(id); // Set the ID from the path variable to the vehicle object
    Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicle);
    return updatedVehicle != null ? ResponseEntity.ok(updatedVehicle) : ResponseEntity.notFound().build();
}

    // Delete vehicle by ID, ID sent in request body
    @DeleteMapping("/delete/{id}")
public ResponseEntity<?> deleteVehicle(@PathVariable String id) {
    return vehicleService.deleteVehicle(id) ? ResponseEntity.ok("Vehicle deleted") : ResponseEntity.notFound().build();
}

    // New endpoint to get vehicle by ID
    // Change this to a GET request
    @GetMapping("/getById/{id}")
public ResponseEntity<?> getVehicleById(@PathVariable String id) {
    Optional<Vehicle> vehicle = vehicleService.getVehicleById(id);
    return vehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
}


}
