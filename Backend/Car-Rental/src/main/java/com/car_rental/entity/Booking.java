package com.car_rental.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private LocalDate bookingDate;
    private Double amount;
    private String timing;
    private String carDetails;

    @Column(nullable = false)
    private String status; // pending, confirmed, cancelled

    @ManyToOne
    @JoinColumn(name = "id")
    @JsonIgnoreProperties({"bookings"})
    private Users users;

    @ManyToOne
    @JoinColumn(name = "car_id")
    @JsonIgnoreProperties({"bookings"})
    private Car car;

    public Booking() {}

    public Booking(Long bookingId, LocalDate bookingDate, Double amount, String timing,
                   String carDetails, Users users, Car car, String status) {
        this.bookingId = bookingId;
        this.bookingDate = bookingDate;
        this.amount = amount;
        this.timing = timing;
        this.carDetails = carDetails;
        this.users = users;
        this.car = car;
        this.status = status;
    }

    @PrePersist
    public void prePersist() {
        if (this.status == null || this.status.isBlank()) {
            this.status = "pending";
        }
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getTiming() { return timing; }
    public void setTiming(String timing) { this.timing = timing; }

    public String getCarDetails() { return carDetails; }
    public void setCarDetails(String carDetails) { this.carDetails = carDetails; }

    public Users getUsers() { return users; }
    public void setUsers(Users users) { this.users = users; }

    public Car getCar() { return car; }
    public void setCar(Car car) { this.car = car; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}