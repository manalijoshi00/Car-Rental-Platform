package com.car_rental.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.car_rental.entity.Owner;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

}
