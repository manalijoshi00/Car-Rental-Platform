package com.car_rental.service;

import com.car_rental.entity.Booking;
import com.car_rental.repo.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {


    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public String createBooking(Booking booking) {
        List<Booking> existing = bookingRepository.findBookingsForCarOnDate(
                booking.getCar().getCarId().longValue(),
                booking.getBookingDate()
        );
        if (!existing.isEmpty()) {
            return "This car is already booked for the selected date.";
        }
        bookingRepository.save(booking);
        return "Booking confirmed successfully!";
    }

    public List<Booking> getBookingsByUserId(int i) {
        return bookingRepository.findByUsers_Id(i);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateBookingStatus(Long bookingId, String newStatus) {
        String normalized = newStatus == null ? "" : newStatus.toLowerCase();
        if (!normalized.equals("pending") && !normalized.equals("confirmed") && !normalized.equals("cancelled")) {
            throw new IllegalArgumentException("Invalid status. Allowed: pending, confirmed, cancelled");
        }
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.setStatus(normalized);
        return bookingRepository.save(booking);
    }
}