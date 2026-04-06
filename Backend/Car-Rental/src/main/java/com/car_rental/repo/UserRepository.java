package com.car_rental.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.car_rental.entity.Users;

public interface UserRepository extends JpaRepository<Users, Integer>{
	
	Optional<Users> findByEmail(String email);

}
