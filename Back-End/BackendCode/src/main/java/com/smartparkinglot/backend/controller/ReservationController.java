package com.smartparkinglot.backend.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.service.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/reservation")
public class ReservationController {
    private final ReservationService reservationService;
    private final TokenService tokenService;
    private final ParkingSpotService parkingSpotService;

    @Autowired
    public ReservationController(ReservationService reservationService, TokenService tokenService, ParkingSpotService parkingSpotService, UserService userService) {
        this.reservationService = reservationService;
        this.tokenService = tokenService;
        this.parkingSpotService = parkingSpotService;
    }
    @PostMapping("/reserve")
    public ResponseEntity<String> registerNewReservation(@RequestHeader("Authorization") String authorizationHeader, @RequestBody ReservationRequest reservationRequest) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneId.of("UTC+3"));
        Timestamp startTimestamp = Timestamp.from(Instant.from(formatter.parse(reservationRequest.startTime)));
        Timestamp endTimestamp = Timestamp.from(Instant.from(formatter.parse(reservationRequest.endTime)));

        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            if(parkingSpotService.checkParkingSpotAvailability(reservationRequest.spotID, startTimestamp, endTimestamp)) {
                int reservationCost = parkingSpotService.calculateReservationCost(startTimestamp, endTimestamp, reservationRequest.spotID);
                if(reservationCost < userAuthorized.getBalance()) {
                    return reservationService.createReservation(userAuthorized, reservationRequest.spotID, startTimestamp, endTimestamp, reservationCost);
                }
                else {
                    return ResponseEntity.badRequest().body("User does not have enough money in his balance");
                }

            }
            else {
                return ResponseEntity.badRequest().body("Parking spot not available");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class ReservationRequest {
        private Long spotID;
        private String startTime;
        private String endTime;
    }
}
