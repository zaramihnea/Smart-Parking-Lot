package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.*;
import com.smartparkinglot.backend.repository.CardRepository;
import com.smartparkinglot.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserService userService;
    private final ParkingSpotService parkingSpotService;
    private final CarService carService;
    @Autowired
    public ReservationService(ReservationRepository reservationRepository, UserService userService, ParkingSpotService parkingSpotService, CarService carService) {
        this.reservationRepository = reservationRepository;
        this.userService = userService;
        this.parkingSpotService = parkingSpotService;
        this.carService = carService;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.getReservationById(id).orElse(null);
    }
    
    public void addNewReservation(Reservation reservation) {
        reservationRepository.save(reservation);
    }

    public List<Reservation> getOwnActiveReservations(String email) {
        return reservationRepository.getOwnActiveReservations(email).orElse(null);
    }
    public List<Reservation> getUsersReservations(String email) {
        return reservationRepository.getUsersReservations(email).orElse(null);
    }
    @Transactional
    public ResponseEntity<String> createReservation(User userAuthorized, Long spotId, Timestamp startTimestamp, Timestamp endTimestamp, int reservationCost, Car car) {
        try {


            ParkingSpot spot = parkingSpotService.getById(spotId);
            if(spot == null) {
                return ResponseEntity.badRequest().body("Spot could not be reserved. Spot not found");
            }
            Reservation reservation = new Reservation(car, spot, startTimestamp, endTimestamp, "active");
            reservationRepository.save(reservation);  // Persist the reservation

            return ResponseEntity.ok("Spot reserved successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.internalServerError().body("Spot could not be reserved");
    }
}
