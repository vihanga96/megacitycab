package com.example.vehiclereservationproject.config;

import com.example.vehiclereservationproject.service.UserDetailsServiceImpl;
import com.example.vehiclereservationproject.util.JwtUtil;
import com.example.vehiclereservationproject.config.JwtRequestFilter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;
    private final CorsConfigurationSource corsConfigurationSource; 

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .authorizeRequests(auth -> auth
        .requestMatchers("/api/bookings/add").authenticated()       
            .requestMatchers("/api/bookings/user/{userId}").authenticated()
            .requestMatchers("/api/bookings/get/{id}").authenticated()
            .requestMatchers("/api/bookings/updateByBookingId").authenticated() 
            .requestMatchers("/api/bookings/deleteByBookingId").authenticated() 
            .requestMatchers("/api/bookings/booking/{bookingId}").authenticated() 
            .requestMatchers("/api/bookings/updateByBookingDriver").authenticated()
            .requestMatchers("/api/user/delete").authenticated()
            .requestMatchers("/api/user/update").authenticated()
            .requestMatchers("/api/user/updateDriver/{userId}").authenticated()
            .requestMatchers("/api/user/all").authenticated()
            .requestMatchers("/api/user/getDriver").authenticated()
            .requestMatchers("/api/vehicles/update/{id}").authenticated()
            .requestMatchers("/api/vehicles/delete/{id}").authenticated()
            .requestMatchers("/api/vehicles/getById/{id}").authenticated()
            .requestMatchers("/api/bookings/driver").authenticated()
            .requestMatchers("/api/user/getUser ").authenticated() 
            .requestMatchers("/api/bookings/all").permitAll()
            .requestMatchers("/api/user/register", "/api/admin/register", "/api/admin/login", "/api/user/login", "/api/drivers/login", "/error").permitAll()
            .requestMatchers("/api/vehicles/add", "/api/vehicles").permitAll() 
            .requestMatchers("/api/bookings/updateStatus/{bookingId}").permitAll()
            .requestMatchers( "/api/bookings/updateCost", "/api/drivers/add").authenticated()
            .anyRequest().authenticated()
        )
        .addFilterBefore(new JwtRequestFilter(jwtUtil, userDetailsService), UsernamePasswordAuthenticationFilter.class)
        .httpBasic(httpBasic -> httpBasic.disable())
        .formLogin(form -> form.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource)); 

    return http.build();
}

@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
