package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.service.ParkingLotService;
import com.smartparkinglot.backend.service.ParkingSpotService;
import com.smartparkinglot.backend.service.TokenService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/parking_lot")
public class ParkingLotController {

    private final ParkingLotService parkingLotService;
    private final ParkingSpotService parkingSpotService;
    private final TokenService tokenService;

    @Autowired
    public ParkingLotController(ParkingLotService parkingLotService, ParkingSpotService parkingSpotService, TokenService tokenService) {
        this.parkingLotService = parkingLotService;
        this.parkingSpotService = parkingSpotService;
        this.tokenService = tokenService;
    }

    @GetMapping("/available-spots-search")
    public List<ParkingLotAndSpots> getParkingLots(@RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude, @RequestParam long radius, @RequestParam Timestamp start_time, @RequestParam Timestamp stop_time) {
        List<ParkingLot> parkingLots = parkingLotService.getParkingLotsWithinRadius(latitude, longitude, radius);
        List<ParkingSpot> availableParkingSpots = parkingSpotService.findAvailableParkingSpots(start_time, stop_time);

        parkingLots.forEach(parkingLot -> {
            System.out.println(parkingLot.getId());
        });
        return parkingLots.stream().map(parkingLot -> {
            List<ParkingSpot> availableSpots = availableParkingSpots.stream().filter(parkingSpot -> {
                return parkingSpot.getParkingLot().getId().equals(parkingLot.getId());
            }).toList();

            List<Long> spotsIds = availableSpots.stream().map(parkingSpot -> parkingSpot.getId()).toList();

            return new ParkingLotAndSpots(parkingLot, spotsIds);
        }).collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<ParkingLotAndSpots> getParkingLots(@RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude, @RequestParam long radius) {
        List<ParkingLot> parkingLots = parkingLotService.getParkingLotsWithinRadius(latitude, longitude, radius);
        parkingLots.forEach(parkingLot -> {
            System.out.println(parkingLot.getId());
        });
        return parkingLots.stream().map(parkingLot -> {
            List<ParkingSpot> spots = parkingSpotService.findByParkingLot(parkingLot);
            List<Long> spotsTrimmed = spots.stream().map(parkingSpot -> parkingSpot.getId()).toList();
            return new ParkingLotAndSpots(parkingLot, spotsTrimmed);
        }).collect(Collectors.toList());
    }

    @PostMapping(value = "/delete/{lot}")
    public ResponseEntity<String> deleteParkingLot(@RequestHeader("Authorization") String authorizationHeader, @PathVariable("lot") Long lot) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            if(userAuthorized.getType() == 3 || userAuthorized.getType() == 2) {
                ParkingLot parkingLot = parkingLotService.getParkingLotById(lot);

                if(parkingLot == null)
                    return ResponseEntity.badRequest().body("The parking lot does not exist.");

                if(userAuthorized.getEmail().equals(parkingLot.getUser().getEmail())){
                    try {
                        parkingLotService.deleteParkingLot(parkingLot);
                        return ResponseEntity.ok("Parking lot deleted successfully.");
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting parking lot.");
                    }
                } else {
                    return ResponseEntity.badRequest().body("The parking lot has different admin.");
                }
            }
            else {
                return ResponseEntity.badRequest().body("User is not admin");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }


    @Getter @Setter
    public static class ParkingLotsReq {
        private Long radius;
        private BigDecimal latitude;
        private BigDecimal longitude;
    }
    @AllArgsConstructor
    @Getter @Setter
    public static class ParkingLotAndSpots {
        private ParkingLot parkingLot;
        private List<Long> parkingSpotsIds;

    }


}
