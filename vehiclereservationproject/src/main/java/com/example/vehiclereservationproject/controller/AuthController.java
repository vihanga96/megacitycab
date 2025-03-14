// package com.example.vehiclereservationproject.controller;

// import com.example.vehiclereservationproject.model.Admin;
// import com.example.vehiclereservationproject.service.AdminService;
// import com.example.vehiclereservationproject.util.JwtUtil;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {
//     @Autowired
//     private AdminService adminService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody Admin admin) {
//         Admin authenticatedAdmin = adminService.authenticateAdmin(admin.getEmail(), admin.getPassword());
//         Map<String, Object> response = new HashMap<>();

//         if (authenticatedAdmin != null) {
//             String token = jwtUtil.generateToken(authenticatedAdmin.getEmail());
//             response.put("status", "success");
//             response.put("jwt_token", token);
//             response.put("message", "Successfully logged in");
//             return ResponseEntity.ok(response);
//         }

//         response.put("status", "error");
//         response.put("message", "Invalid Credentials");
//         return ResponseEntity.badRequest().body(response);
//     }
// }
