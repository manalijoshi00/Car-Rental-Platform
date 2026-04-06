package com.car_rental.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_rental.entity.Admin;
import com.car_rental.service.AdminService;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:3000"
})
public class AdminController {
    
    @Autowired  // Add this annotation
    private AdminService adminService;

    @GetMapping()
    public List<Admin> getAdmins() {
        return adminService.getAllAdmins();
    }

    @PostMapping()
    public Admin createAdmin(@RequestBody Admin admin) {
        return adminService.saveAdmin(admin);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
    }
    
    // Add admin login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Admin> adminOpt = adminService.findByEmail(email);

        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();

            if (admin.getPassword().equals(password)) {
                return ResponseEntity.ok(Map.of(
                    "id", admin.getAdminId(),
                    "name", admin.getName(),
                    "email", admin.getEmail(),
                    "role", "admin"
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials");
    }
}