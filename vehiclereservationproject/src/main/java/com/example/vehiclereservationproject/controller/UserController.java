package com.example.vehiclereservationproject.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.vehiclereservationproject.model.DriverLogin;
import com.example.vehiclereservationproject.model.User;
import com.example.vehiclereservationproject.util.JwtUtil;
import com.example.vehiclereservationproject.repository.DriverLoginRepository;
import com.example.vehiclereservationproject.repository.UserRepository;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Autowired
    private DriverLoginRepository driverLoginRepository; // Declare the repository here

    // @PostMapping("/register")
    // public ResponseEntity<?> registerUser (@RequestBody User user) {
    // try {
    // if (userRepository.findByUsername(user.getUsername()).isPresent())
    // return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already
    // taken. Please try again");

    // user.setPassword(passwordEncoder.encode(user.getPassword()));
    // User savedUser = userRepository.save(user);
    // return ResponseEntity.status(HttpStatus.CREATED).body(savedUser );
    // } catch (Exception e) {
    // return ResponseEntity.internalServerError().body(e.getMessage());
    // }
    // }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Check if username is already taken
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken. Please try again");
            }

            // If no user role is provided, set default as "USER"
            if (user.getUserRole() == null) {
                user.setUserRole("USER");
            }

            // Handle password based on user role
            if ("DRIVER".equals(user.getUserRole())) {
                // If the user role is DRIVER, set the password to the license number
                if (user.getLicenseNumber() != null) {
                    user.setPassword(passwordEncoder.encode(user.getLicenseNumber())); 
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("License number is required for DRIVER role.");
                }
            } else {
                // For other roles, encode the password
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            // Save the user
            User savedUser = userRepository.save(user);

            if ("DRIVER".equals(user.getUserRole())) {
                DriverLogin driverLogin = new DriverLogin();
                driverLogin.setEmail(savedUser.getEmail());
                driverLogin.setPassword(user.getPassword()); 

                // Generate a unique driver ID
                String driverId = "DRIVER" + System.currentTimeMillis(); 
                driverLogin.setDriverId(driverId);

                // Check if a driver with this email already exists
                if (driverLoginRepository.findByEmail(driverLogin.getEmail()) != null) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Driver with this email already exists.");
                }

                // Save the DriverLogin object
                driverLoginRepository.save(driverLogin);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // @PostMapping("/register")
    // public ResponseEntity<?> registerUser (@RequestBody User user) {
    // try {
    // // Check if username is already taken
    // if (userRepository.findByUsername(user.getUsername()).isPresent()) {
    // return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already
    // taken. Please try again");
    // }

    // // If no user role is provided, set default as "USER"
    // if (user.getUser Role() == null) {
    // User.setUser Role("USER");
    // }

    // // Encode password
    // user.setPassword(passwordEncoder.encode(user.getPassword()));

    // // Save the user
    // User savedUser = userRepository.save(user);

    // // If the user role is DRIVER, create a DriverLogin object
    // if ("DRIVER".equals(user.getUser Role())) {
    // DriverLogin driverLogin = new DriverLogin();
    // driverLogin.setEmail(savedUser .getEmail());
    // driverLogin.setPassword(user.getLicenseNumber()); // Set password to license
    // number

    // // Save the DriverLogin object (you need to have a repository for
    // DriverLogin)
    // // Assuming you have a DriverLoginRepository
    // // driverLoginRepository.save(driverLogin);
    // }

    // return ResponseEntity.status(HttpStatus.CREATED).body(savedUser );
    // } catch (Exception e) {
    // return ResponseEntity.internalServerError().body(e.getMessage());
    // }
    // }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            // Find the user by email
            User foundUser = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User  not found"));

            // Use PasswordEncoder to match the password
            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                // Generate JWT token
                String token = jwtUtil.generateToken(foundUser.getUsername());

                // Prepare the response with token, user role, and user ID
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", foundUser.getUserRole()); 
                response.put("userId", foundUser.getId());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll(); // Fetch all users
            return ResponseEntity.ok(users); // Return the list of users
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Delete User by ID
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUserById(@RequestBody Map<String, String> requestBody) {
        String id = requestBody.get("id"); // Get the ID from the request body
        try {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                return ResponseEntity.ok("User  deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User  not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting user: " + e.getMessage());
        }
    }

    // Update User by ID
    @PutMapping("/update")
    public ResponseEntity<?> updateUserById(@RequestBody User updatedUser) {
        String id = updatedUser.getId(); // Get the ID from the updatedUser object
        return userRepository.findById(id).map(existingUser -> {
            try {
                // Update fields
                existingUser.setUsername(updatedUser.getUsername());
                existingUser.setNic(updatedUser.getNic());
                existingUser.setAddress(updatedUser.getAddress());
                existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setUserRole(updatedUser.getUserRole());
                // Optionally, update the password if provided
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword())); 
                                                                                                 
                }

                User savedUser = userRepository.save(existingUser);
                return ResponseEntity.ok(savedUser);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error updating user: " + e.getMessage());
            }
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/updateDriver/{userId}")
    public ResponseEntity<?> updateDriver(@PathVariable String userId, @RequestBody User updatedDriver) {
        return userRepository.findById(userId).map(existingDriver -> {
            try {
                // Update fields specific to driver
                existingDriver.setUsername(updatedDriver.getUsername());
                existingDriver.setNic(updatedDriver.getNic());
                existingDriver.setPhoneNumber(updatedDriver.getPhoneNumber());
                existingDriver.setEmail(updatedDriver.getEmail());
                existingDriver.setLicenseNumber(updatedDriver.getLicenseNumber());
    
                // Optionally, update the password if provided
                if (updatedDriver.getPassword() != null && !updatedDriver.getPassword().isEmpty()) {
                    existingDriver.setPassword(passwordEncoder.encode(updatedDriver.getPassword()));
                }
    
                User savedDriver = userRepository.save(existingDriver);
                return ResponseEntity.ok(savedDriver);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error updating driver: " + e.getMessage());
            }
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }


// Get Driver by ID
@PostMapping("/getDriver")
public ResponseEntity<User> getDriverById(@RequestBody Map<String, String> requestBody) {
    String driverId = requestBody.get("id"); // Get the driver ID from the request body
    try {
        return userRepository.findById(driverId)
            .map(driver -> ResponseEntity.ok(driver)) // Return the driver details
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build()); // Return 404 without a message
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // Handle exceptions
    }
}

@PostMapping("/getUser")
public ResponseEntity<User> getUserById(@RequestBody Map<String, String> requestBody) {
    String id = requestBody.get("id"); // Get the user ID from the request body
    try {
        return userRepository.findById(id)
            .map(user -> ResponseEntity.ok(user)) // Return the user details
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build()); // Return 404 if not found
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); 
    }
}


}