// package com.example.vehiclereservationproject.service;

// import com.example.vehiclereservationproject.model.User; // Ensure this import is present
// import com.example.vehiclereservationproject.repository.UserRepository; // Adjust the package path as necessary
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// @Service
// public class MyUserDetailsService implements UserDetailsService {

//     @Autowired
//     private UserRepository userRepository; // Ensure you have a UserRepository for database access

//     @Override
//     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//         // First, check if the user is a hardcoded "admin" for demonstration purposes
//         if ("admin".equals(username)) {
//             return org.springframework.security.core.userdetails.User.withUsername("admin")
//                     .password("$2a$10$7v8O3sBfX5s/NZTty3eKxe6ndG/gzYoGLZmGS2YUEQb8K9u5YUKku") // BCrypt hash for "password"
//                     .roles("ADMIN")
//                     .build();
//         }

//         // Attempt to retrieve the user from the database
//         User user = userRepository.findByUsername(username)
//                 .orElseThrow(() -> new UsernameNotFoundException("User not found"));

//         // Return the user details from the database
//         return new org.springframework.security.core.userdetails.User(
//             user.getUsername(), user.getPassword(), user.getAuthorities());
//     }
// }
