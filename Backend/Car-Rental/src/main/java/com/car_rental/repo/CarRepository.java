package com.car_rental.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.car_rental.entity.Car;

public interface CarRepository extends JpaRepository<Car, Integer> {
	
	List<Car> findByBrand(String brand);

    List<Car> findByModel(String model);
}