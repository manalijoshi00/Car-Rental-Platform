package com.car_rental.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.car_rental.entity.Booking;
import com.car_rental.entity.Users;
import com.car_rental.repo.UserRepository;
import com.car_rental.service.BookingService;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5500"
})
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("")
    public ResponseEntity<String> createBooking(@RequestBody Booking booking) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
        }

        String userEmail = authentication.getName();

        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        booking.setUsers(user);

        String result = bookingService.createBooking(booking);
        if (result.contains("successfully")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String userEmail = authentication.getName();

        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingService.getBookingsByUserId(user.getId());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long bookingId, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            Booking updated = bookingService.updateBookingStatus(bookingId, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
