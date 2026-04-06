package com.car_rental.repo;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.car_rental.entity.Driver;

@Repository
public interface DriverRepository extends MongoRepository<Driver, Integer> {

}
