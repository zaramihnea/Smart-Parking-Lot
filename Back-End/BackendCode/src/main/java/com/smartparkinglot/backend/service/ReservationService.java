package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.entity.User;
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
    @Autowired
    public ReservationService(ReservationRepository reservationRepository, UserService userService, ParkingSpotService parkingSpotService) {
        this.reservationRepository = reservationRepository;
        this.userService = userService;
        this.parkingSpotService = parkingSpotService;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public void addNewReservation(Reservation reservation) {
        reservationRepository.save(reservation);
    }

    @Transactional
    public ResponseEntity<String> createReservation(User userAuthorized, Long spotId, Timestamp startTimestamp, Timestamp endTimestamp, int reservationCost) {
        try {
            userAuthorized.setBalance(userAuthorized.getBalance() - reservationCost);
            userService.saveUser(userAuthorized);  // Save the user's new balance

            ParkingSpot spot = parkingSpotService.getById(spotId);
            Reservation reservation = new Reservation(userAuthorized.getId(), spot, startTimestamp, endTimestamp);
            reservationRepository.save(reservation);  // Persist the reservation

            return ResponseEntity.ok("Spot reserved successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.internalServerError().body("Spot could not be reserved");
    }
}
