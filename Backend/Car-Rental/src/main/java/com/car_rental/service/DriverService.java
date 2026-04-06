package com.car_rental.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.car_rental.entity.Driver;
import com.car_rental.repo.DriverRepository;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepo;
    
    public List<Driver> getAllDrivers() {
        return driverRepo.findAll();
    }

  
    public Driver getDriverById(Integer id) {
        return driverRepo.findById(id).orElse(null);
    }

    public Driver saveDriver(Driver driver) {
        return driverRepo.save(driver);
    }
    
    public Driver updateDriver(Integer id, Driver updatedDriver) {
        Optional<Driver> optionalDriver = driverRepo.findById(id);
        if (optionalDriver.isPresent()) {
            Driver existingDriver = optionalDriver.get();
            existingDriver.setName(updatedDriver.getName());
            existingDriver.setLicenseNo(updatedDriver.getLicenseNo());
            existingDriver.setPhone(updatedDriver.getPhone());
            existingDriver.setEmail(updatedDriver.getEmail());
            existingDriver.setAddress(updatedDriver.getAddress());
            existingDriver.setStatus(updatedDriver.getStatus());
            return driverRepo.save(existingDriver);
        } else {
            return null;
        }
    }

    public void deleteDriver(Integer id) {
        driverRepo.deleteById(id);
    }
}
