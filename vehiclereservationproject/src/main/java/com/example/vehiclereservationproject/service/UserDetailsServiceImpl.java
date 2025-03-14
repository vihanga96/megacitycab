package com.example.vehiclereservationproject.service;

import com.example.vehiclereservationproject.model.User;
import com.example.vehiclereservationproject.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String lowerCaseEmail = email;
        logger.info("Attempting to load user by email: {}", lowerCaseEmail);
        
        return userRepository.findByEmail(lowerCaseEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + lowerCaseEmail));
    }
    
     // New method to find user by username
     public UserDetails userChecker(String username) throws UsernameNotFoundException {
        logger.info("Attempting to load user by username: {}", username);
        
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User  not found with username: " + username));
    }
}
