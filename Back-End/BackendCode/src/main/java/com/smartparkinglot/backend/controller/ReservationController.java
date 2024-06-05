package com.smartparkinglot.backend.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smartparkinglot.backend.entity.*;
import com.smartparkinglot.backend.service.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/reservation")
public class ReservationController {
    private final ReservationService reservationService;
    private final TokenService tokenService;
    private final ParkingSpotService parkingSpotService;

    private final ParkingLotService parkingLotService;
    private final CarService carService;
    private final UserService userService;

    @Autowired
    public ReservationController(ReservationService reservationService, TokenService tokenService, ParkingSpotService parkingSpotService, UserService userService, ParkingLotService parkingLotService, CarService carService) {
        this.reservationService = reservationService;
        this.tokenService = tokenService;
        this.parkingSpotService = parkingSpotService;
        this.carService = carService;
        this.userService = userService;
        this.parkingLotService = parkingLotService;
    }
    @GetMapping("get-own-active-reservations")
    public ResponseEntity<?> getOwnReservations(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);

            return ResponseEntity.ok().body(reservationService.getOwnActiveReservations(userAuthorized.getEmail()).stream().map(reservation -> {
                String startTimestampWithoutMilliseconds = reservation.getStartTime().toString().substring(0, reservation.getStartTime().toString().length() - 2);
                String stopTimestampWithoutMilliseconds = reservation.getStopTime().toString().substring(0, reservation.getStopTime().toString().length() - 2);

                return new ReservationDetails(reservation.getId(), reservation.getCar_id().getId(), reservation.getParkingSpot().getId(), startTimestampWithoutMilliseconds, stopTimestampWithoutMilliseconds, reservation.getStatus());
            }));
        }
        else {
            return ResponseEntity.badRequest().body("Authentication token invalid. Protected resource could not be accessed");
        }
    }
    @GetMapping("get-user-reservations")
    public ResponseEntity<?> getUsersReservations(@RequestHeader("Authorization") String authorizationHeader, @RequestParam String userEmail) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            if(userAuthorized.getType() == 2 ) {
                if(!userService.existsByEmail(userEmail)) {
                    return ResponseEntity.badRequest().body("User for which data is requested does not exist");
                }
                return ResponseEntity.ok().body(reservationService.getUsersReservations(userEmail).stream().map(reservation -> {
                    String startTimestampWithoutMilliseconds = reservation.getStartTime().toString().substring(0, reservation.getStartTime().toString().length() - 2);
                    String stopTimestampWithoutMilliseconds = reservation.getStopTime().toString().substring(0, reservation.getStopTime().toString().length() - 2);

                    return new ReservationDetails(reservation.getId(), reservation.getCar_id().getId(), reservation.getParkingSpot().getId(), startTimestampWithoutMilliseconds, stopTimestampWithoutMilliseconds, reservation.getStatus());
                }));
            }
            else {
                return ResponseEntity.badRequest().body("User is not administrator");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Authentication token invalid. Protected resource could not be accessed");
        }
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
                    Car userCar;
                    if(carService.existsByPlate(reservationRequest.carPlate)) {
                        userCar = carService.getByPlate(reservationRequest.carPlate);
                    }
                    else {
                        userCar = new Car(reservationRequest.carPlate, reservationRequest.carCapacity, reservationRequest.carType, userAuthorized);
                        carService.addNewCar(userCar);
                    }
                    return reservationService.createReservation(userAuthorized, reservationRequest.spotID, startTimestamp, endTimestamp, reservationCost, userCar);
                }
                else {
                    ///// COMMENT THIS IN PRODUCTION, RIGHT NOW ALL RESERVATIONS ARE FREE
                    Car userCar;
                    if(carService.existsByPlate(reservationRequest.carPlate)) {
                        userCar = carService.getByPlate(reservationRequest.carPlate);
                    }
                    else {
                        userCar = new Car(reservationRequest.carPlate, reservationRequest.carCapacity, reservationRequest.carType, userAuthorized);
                        carService.addNewCar(userCar);
                    }
                    return reservationService.createReservation(userAuthorized, reservationRequest.spotID, startTimestamp, endTimestamp, reservationCost, userCar);
                    /////

//                    return ResponseEntity.badRequest().body("User does not have enough money in his balance");
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

    @GetMapping("get-own-active-reservations-with-name")
    public ResponseEntity<?> getOwnReservationsWithAdress(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);

            List<ParkingLot> parkingLots = parkingLotService.getAllParkingLots();

            return ResponseEntity.ok().body(reservationService.getOwnActiveReservations(userAuthorized.getEmail()).stream().map(reservation -> {
                ParkingLot parkingLot = parkingLots.stream().filter(parkingLot1 -> {
                    List<ParkingSpot> parkingSpots = parkingSpotService.getParkingSpotsByParkingLot(parkingLot1);
                    return parkingSpots.stream().anyMatch(parkingSpot -> Objects.equals(parkingSpot.getId(), reservation.getParkingSpot().getId()));
                }).findFirst().get();

                String startTimestampWithoutMilliseconds = reservation.getStartTime().toString().substring(0, reservation.getStartTime().toString().length() - 2);
                String stopTimestampWithoutMilliseconds = reservation.getStopTime().toString().substring(0, reservation.getStopTime().toString().length() - 2);

                return new ReservationDetailsWithNameAndCoordinates(reservation.getId(), reservation.getCar_id().getId(), reservation.getParkingSpot().getId(), startTimestampWithoutMilliseconds, stopTimestampWithoutMilliseconds, reservation.getStatus(), parkingLot.getName(), parkingLot.getLatitude(), parkingLot.getLongitude());
            }));
        }
        else {
            return ResponseEntity.badRequest().body("Authentication token invalid. Protected resource could not be accessed");
        }
    }

    @DeleteMapping("cancel/{id}")
    public ResponseEntity<String> deleteReservation(@RequestHeader("Authorization") String authorizationHeader, @PathVariable Long id) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            return reservationService.deleteReservation(userAuthorized, id);
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
        private String carPlate;
        private int carCapacity;
        private String carType;
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class ReservationDetails {
        private Long id;
        private Long car_id;
        private Long parking_spot_id;
        private String start_time;
        private String stop_time;
        private String status;
    }

    @Getter @Setter
    @AllArgsConstructor
    public static class ReservationDetailsWithNameAndCoordinates {
        private Long id;
        private Long car_id;
        private Long parking_spot_id;
        private String start_time;
        private String stop_time;
        private String status;
        private String name;
        private BigDecimal latitude;
        private BigDecimal longitude;
    }
}
