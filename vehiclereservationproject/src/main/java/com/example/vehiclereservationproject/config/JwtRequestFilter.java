package com.example.vehiclereservationproject.config;

import com.example.vehiclereservationproject.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import java.io.IOException;
import com.example.vehiclereservationproject.service.UserDetailsServiceImpl;

public class JwtRequestFilter extends OncePerRequestFilter { 

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService; 

    public JwtRequestFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) { 
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService; 
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");

        String path = request.getRequestURI();
        
        

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            System.out.println("Extracted Token: " + token);
        
            try {
                String username = jwtUtil.extractUsername(token);
                System.out.println("Extracted Username: " + username);
        
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Call the new userChecker method
                    UserDetails userDetails = userDetailsService.userChecker(username); 
                    if (jwtUtil.validateToken(token, userDetails)) {
                        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        System.out.println("Authentication set for user: " + username);
                    } else {
                        System.out.println("Token validation failed.");
                    }
                }
            } catch (Exception e) {
                System.out.println("Token validation error: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        } else {
            System.out.println("Authorization header is missing or invalid.");
        }
        
        chain.doFilter(request, response);
    }
}