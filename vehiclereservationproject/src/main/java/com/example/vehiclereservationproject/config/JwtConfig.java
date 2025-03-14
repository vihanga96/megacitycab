package com.example.vehiclereservationproject.config;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class JwtConfig {

    private static final String SECRET_KEY = "your-very-long-secret-key-that-is-at-least-32-bytes"; // Ensure this matches in JwtUtil
    private static final long JWT_EXPIRATION = 3600000L; // Example: 1 hour in milliseconds
    private static final String ALGORITHM = "HS256";

    public SecretKey getSecretKey() {
        var key = new OctetSequenceKey.Builder(SECRET_KEY.getBytes())
                .algorithm(new JWSAlgorithm(ALGORITHM))
                .build();
        return key.toSecretKey();
    }

    public JWSAlgorithm getAlgorithm() {
        return new JWSAlgorithm(ALGORITHM);
    }

    public long getJwtExpiration() {
        return JWT_EXPIRATION;
    }
}