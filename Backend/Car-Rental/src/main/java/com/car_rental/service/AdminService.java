package com.car_rental.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.car_rental.entity.Admin;
import com.car_rental.repo.AdminRepository;

@Service
public class AdminService {
    
    @Autowired  // Add this annotation
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
    
    // Add login method
    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }
    
    public Optional<Admin> findByName(String name) {
        return adminRepository.findByName(name);
    }
}