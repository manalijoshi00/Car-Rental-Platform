package com.car_rental.repo;

import com.car_rental.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.car.carId = :carId AND b.bookingDate = :bookingDate")
    List<Booking> findBookingsForCarOnDate(Long carId, LocalDate bookingDate);

    List<Booking> findByUsers_Id(int i);
}