package com.car_rental.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.car_rental.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long>{
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByName(String name);
}