package com.car_rental.controller;

import com.car_rental.entity.Car;
import com.car_rental.service.CarService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = {
    "http://localhost:5173", "http://localhost:3000", 
    "http://127.0.0.1:5500"
})
public class CarApiController {

    private final CarService carService;

    public CarApiController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping("")
    public List<Car> getAll() {
        return carService.getAllCars();
    }

    @GetMapping("/{id}")
    public Car getOne(@PathVariable Integer id) {
        return carService.getCarById(id).orElseThrow();
    }

    @PostMapping("/savecar")
    public ResponseEntity<Car> saveCar(@RequestBody Car car) {
        Car savedCar = carService.saveCar(car);
        return new ResponseEntity<>(savedCar, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCar(@PathVariable Integer id) {
        try {
            carService.deleteCar(id);
            return new ResponseEntity<>("Car deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete car", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}