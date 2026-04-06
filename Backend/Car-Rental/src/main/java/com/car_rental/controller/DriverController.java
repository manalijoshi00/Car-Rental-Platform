package com.car_rental.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.car_rental.entity.Driver;
import com.car_rental.service.DriverService;

@RestController
@RequestMapping("/drivers")
//@CrossOrigin(origins = "*")
public class DriverController {
	
	@Autowired
    private DriverService driverService;
    
    @GetMapping("")
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable Integer id) {
        return new ResponseEntity<Driver>(driverService.getDriverById(id), HttpStatus.OK);
    }

    @PostMapping("/savedriver")
    public ResponseEntity<Driver> saveDriver(@RequestBody Driver driver) {
        return new ResponseEntity<Driver>(driverService.saveDriver(driver), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Integer id, @RequestBody Driver driver) {
        return new ResponseEntity<Driver>(driverService.updateDriver(id, driver), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDriver(@PathVariable Integer id) {
        driverService.deleteDriver(id);
        return new ResponseEntity<String>("Driver deleted successfully", HttpStatus.OK);
    }

}

