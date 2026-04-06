package com.car_rental.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.car_rental.entity.Car;
import com.car_rental.repo.CarRepository;

@Service
public class CarService {
	
	@Autowired
	private CarRepository carRepositoryRef;

	// Get all cars
    public List<Car> getAllCars() {
        return carRepositoryRef.findAll();
    }

    public List<Car> searchBrand(String keyword) {
        return carRepositoryRef.findByBrand(keyword);
    }

    public List<Car> searchByModel(String model) {
        return carRepositoryRef.findByModel(model);
    }

    public Optional<Car> getCarById(Integer id) {
        return carRepositoryRef.findById(id);
    }

    public Car saveCar(Car car) {
        return carRepositoryRef.save(car);
    }

    public void deleteCar(Integer id) {
        carRepositoryRef.deleteById(id);
    }

    public Car updateCar(Integer id, Car updatedCar) {
        Optional<Car> existingCarOpt = carRepositoryRef.findById(id);
        if (existingCarOpt.isPresent()) {
            Car car = existingCarOpt.get();

            car.setBrand(updatedCar.getBrand());
            car.setModel(updatedCar.getModel());
            car.setYear(updatedCar.getYear());
            car.setDailyPrice(updatedCar.getDailyPrice());
            car.setCategory(updatedCar.getCategory());
            car.setTransmission(updatedCar.getTransmission());
            car.setFuelType(updatedCar.getFuelType());
            car.setSeatingCapacity(updatedCar.getSeatingCapacity());
            car.setLocation(updatedCar.getLocation());
            car.setDescription(updatedCar.getDescription());

            return carRepositoryRef.save(car);
        } else {
            return null;
        }
    }
}