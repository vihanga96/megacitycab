package com.example.vehicleservice.Service;
import com.example.vehicleservice.Model.Vehicle;
import com.example.vehicleservice.Repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public Vehicle addVehicle(Vehicle vehicle) {
        if (vehicleRepository.findByVehicleNumber(vehicle.getVehicleNumber()).isPresent()) {
            throw new RuntimeException("Vehicle with this number already exists!");
        }
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle updateDriverId(String vehicleId, String newDriverId) {
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
        if (vehicleOptional.isPresent()) {
            Vehicle vehicle = vehicleOptional.get();
            vehicle.setDriverId(newDriverId); // Update the driverId
            return vehicleRepository.save(vehicle); // Save the updated vehicle
        } else {
            throw new RuntimeException("Vehicle not found with id: " + vehicleId);
        }
    }
    public Vehicle updateVehicle(String id, Vehicle updatedVehicle) {
        return vehicleRepository.findById(id).map(existingVehicle -> {
            existingVehicle.setVehicleNumber(updatedVehicle.getVehicleNumber());
            existingVehicle.setModel(updatedVehicle.getModel());
            existingVehicle.setBrand(updatedVehicle.getBrand());
            existingVehicle.setYear(updatedVehicle.getYear());
            existingVehicle.setVehicleType(updatedVehicle.getVehicleType());
            existingVehicle.setDriverId(updatedVehicle.getDriverId());
            return vehicleRepository.save(existingVehicle);
        }).orElse(null);
    }
    
    public boolean deleteVehicle(String id) {
        if (vehicleRepository.existsById(id)) {
            vehicleRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public Optional<Vehicle> getVehicleById(String id) {
        return vehicleRepository.findById(id);
    }
}

