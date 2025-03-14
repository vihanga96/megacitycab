package com.example.vehiclereservationproject.repository;

import com.example.vehiclereservationproject.model.DriverLogin;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DriverLoginRepository extends MongoRepository<DriverLogin, String> {
    DriverLogin findByEmail(String email); 
}