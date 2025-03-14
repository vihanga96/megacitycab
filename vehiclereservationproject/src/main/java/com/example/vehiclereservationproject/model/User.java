package com.example.vehiclereservationproject.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;

@Data
@Builder
@Document("user")
public class User implements UserDetails {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    private String nic;
    private String address;
    private String phoneNumber;
    private String email;
    private String password;
    private Date registrationDate;
    private String userRole = "USER";  
    private String licenseNumber = null;  


    @JsonIgnore 
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    // @Override
    // public Collection<? extends GrantedAuthority> getAuthorities() {
    //     return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    // }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
}
