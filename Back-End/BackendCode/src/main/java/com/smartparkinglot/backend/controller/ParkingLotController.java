package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.DTO.ParkingLotDTO;
import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.service.ParkingLotService;
import com.smartparkinglot.backend.service.ParkingSpotService;
import com.smartparkinglot.backend.service.TokenService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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

    @GetMapping("/get-by-id")
    public ResponseEntity<?> getParkingLotById(@RequestParam Long id) {
        if(parkingLotService.existsById(id)) {
            List<ParkingSpot> spots = parkingSpotService.findByParkingLot(parkingLotService.getParkingLotById(id));
            List<Long> spotsTrimmed = spots.stream().map(parkingSpot -> parkingSpot.getId()).toList();

            return ResponseEntity.ok().body(new ParkingLotAndSpots(new ParkingLotDTO(parkingLotService.getParkingLotById(id)), spotsTrimmed));
        }
        else {
            return ResponseEntity.badRequest().body("Parking lot with specified id could not be found");
        }

    }

    @GetMapping("/get-by-id/available-spots")
    public ResponseEntity<?> getParkingLotByIdWithAvailableSpots(@RequestParam Long id, @RequestParam Timestamp start_time, @RequestParam Timestamp stop_time) {
        if(parkingLotService.existsById(id)) {
            List<ParkingSpot> availableParkingSpots = parkingSpotService.findAvailableParkingSpots(start_time, stop_time);
            ParkingLot parkingLot = parkingLotService.getParkingLotById(id);

            List<ParkingSpot> availableSpotsForThisLot = availableParkingSpots.stream().filter(parkingSpot -> {
                return parkingSpot.getParkingLot().getId().equals(parkingLot.getId());
            }).toList();

            List<Long> spotsTrimmed = availableSpotsForThisLot.stream().map(parkingSpot -> parkingSpot.getId()).toList();

            return ResponseEntity.ok().body(new ParkingLotAndSpots(new ParkingLotDTO(parkingLotService.getParkingLotById(id)), spotsTrimmed));
        }
        else {
            return ResponseEntity.badRequest().body("Parking lot with specified id could not be found");
        }

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
            ParkingLotDTO parkingLotDTO = new ParkingLotDTO(parkingLot);
            return new ParkingLotAndSpots(parkingLotDTO, spotsIds);
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
            ParkingLotDTO parkingLotDTO = new ParkingLotDTO(parkingLot);
            List<Long> spotsTrimmed = spots.stream().map(parkingSpot -> parkingSpot.getId()).toList();
            return new ParkingLotAndSpots(parkingLotDTO, spotsTrimmed);
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

    @PostMapping("/save")
    public ResponseEntity<String> saveParkingLot(@RequestHeader("Authorization") String authorizationHeader,@RequestBody ParkingLotSaveReq parkingLotSaveReq) {
        String token = authorizationHeader.substring(7);// Assuming the scheme is "Bearer "
        if(tokenService.validateToken(token)) {
            User userAuthorized = tokenService.getUserByToken(token);
            if(userAuthorized.getType() == 3 || userAuthorized.getType() == 2) {
                if(parkingLotSaveReq.getName() == null || parkingLotSaveReq.getNrSpots() == null || parkingLotSaveReq.getPrice() == null || parkingLotSaveReq.getLatitude() == null || parkingLotSaveReq.getLongitude() == null)
                    return ResponseEntity.badRequest().body("Invalid request body. All fields must be filled in.");
                ParkingLot newParkingLot = new ParkingLot(userAuthorized, parkingLotSaveReq.getName(), parkingLotSaveReq.getNrSpots(), parkingLotSaveReq.getPrice(), parkingLotSaveReq.getLatitude(), parkingLotSaveReq.getLongitude());

                parkingLotService.save(newParkingLot); // save the lot to give it an id

                for (int i = 0; i < parkingLotSaveReq.getNrSpots(); i++) {
                    ParkingSpot newParkingSpot = new ParkingSpot(newParkingLot);
                    parkingSpotService.addNewParkingSpot(newParkingSpot);
                }


                return ResponseEntity.ok().body("Parking lot has been saved");
            }
            else {
                return ResponseEntity.badRequest().body("User is not admin");
            }
        }
        else {
            return ResponseEntity.badRequest().body("Authentication token invalid. Protected resource could not be accessed");
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
        private ParkingLotDTO parkingLot;
        private List<Long> parkingSpotsIds;

    }

    @ToString
    @AllArgsConstructor
    @Getter @Setter
    public static class ParkingLotSaveReq {
        private String name;
        private Integer nrSpots;
        private Float price;
        private BigDecimal latitude;
        private BigDecimal longitude;
    }


}
