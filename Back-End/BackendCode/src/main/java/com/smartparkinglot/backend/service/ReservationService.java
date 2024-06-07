package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.DTO.PaymentDetailsDTO;
import com.smartparkinglot.backend.entity.*;
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
    private final PaymentService paymentService;
    @Autowired
    public ReservationService(ReservationRepository reservationRepository, UserService userService, ParkingSpotService parkingSpotService, CarService carService, PaymentService paymentService) {
        this.reservationRepository = reservationRepository;
        this.userService = userService;
        this.parkingSpotService = parkingSpotService;
        this.carService = carService;
        this.paymentService = paymentService;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationByParkingSpotId(Long id) {
        return reservationRepository.getReservationByParkingSpotId(id).orElse(null);
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
    public ResponseEntity<String> createReservation(User userAuthorized, Long spotId, Timestamp startTimestamp, Timestamp endTimestamp, Double reservationCost, Car car) {
        try {
            System.out.println("HELLOOOOOOOO");
            ParkingSpot spot = parkingSpotService.getById(spotId);
            if(spot == null) {
                return ResponseEntity.badRequest().body("Spot could not be reserved. Spot not found");
            }
            System.out.println("HELOOOOOOOOOO");

            Reservation reservation = new Reservation(car, spot, startTimestamp, endTimestamp, "active");
            reservationRepository.save(reservation);  // Persist the reservation
            PaymentDetailsDTO paymentDetailsDTO = new PaymentDetailsDTO(userAuthorized.getEmail(), reservationCost, reservation.getParkingSpot().getId());
            String result = paymentService.payForParkingSpot(paymentDetailsDTO);
            if(!result.equals("success")) {
                System.out.println(result);
                return ResponseEntity.badRequest().body(result);
            }
            System.out.println("paid for parking spot with these details: ");
            System.out.println(paymentDetailsDTO.getAmount());
            System.out.println(paymentDetailsDTO.getEmail());
            System.out.println(paymentDetailsDTO.getParkingSpotId());

            return ResponseEntity.ok("Spot reserved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Reservation error: " + e.getMessage());
        }
    }

    public ResponseEntity<String> deleteReservation(User userAuthorized, Long id) {
        Reservation reservation = reservationRepository.getReservationById(id);
        if(reservation == null) {
            return ResponseEntity.badRequest().body("Reservation not found");
        }
        if(!reservation.getCar_id().getUser().getEmail().equals(userAuthorized.getEmail())) {
            return ResponseEntity.badRequest().body("You are not authorized to delete this reservation");
        }
        reservationRepository.delete(reservation);
        return ResponseEntity.ok("Reservation deleted successfully");
    }
}
