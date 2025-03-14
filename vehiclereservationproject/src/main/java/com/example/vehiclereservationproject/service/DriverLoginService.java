package com.example.vehiclereservationproject.service;

import com.example.vehiclereservationproject.model.DriverLogin;
import com.example.vehiclereservationproject.repository.DriverLoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DriverLoginService {

    @Autowired
    private DriverLoginRepository driverLoginRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Method to create driver login with encoded password (license number in this case)
    public DriverLogin createDriverLogin(String email, String licenseNumber) {
        // Encode the license number to store it securely as the password
        String encodedPassword = passwordEncoder.encode(licenseNumber);

        // Generate a unique driver ID
        String driverId = "DRIVER" + System.currentTimeMillis();

        // Create a login with driverId, email, and encoded license number as the password
        DriverLogin driverLogin = new DriverLogin(driverId, email, encodedPassword);

        return driverLoginRepository.save(driverLogin);
    }

    // Method to retrieve the login by email
    public DriverLogin getDriverLogin(String email) {
        return driverLoginRepository.findByEmail(email); // Use findByEmail
    }

    // Authentication method for plain text passwords
    public boolean authenticateDriver(String email, String password) {
        DriverLogin driverLogin = driverLoginRepository.findByEmail(email); // Use findByEmail

        if (driverLogin != null) {
            // Direct comparison of the stored password and the entered password
            boolean isPasswordMatch = driverLogin.getPassword().equals(password);
            System.out.println("Entered password: " + password);
            System.out.println("Stored password: " + driverLogin.getPassword());
            return isPasswordMatch;
        }
        System.out.println("Driver not found for email: " + email);
        return false;
    }
}