package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.service.ParkingLotService;
import com.smartparkinglot.backend.service.ParkingSpotService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/parking_lot")
public class ParkingLotController {

    private final ParkingLotService parkingLotService;
    private final ParkingSpotService parkingSpotService;

    @Autowired
    public ParkingLotController(ParkingLotService parkingLotService, ParkingSpotService parkingSpotService) {
        this.parkingLotService = parkingLotService;
        this.parkingSpotService = parkingSpotService;
    }

    @GetMapping("/search")
    public List<ParkingLotAndSpots> getParkingLots(@RequestParam BigDecimal latitude, @RequestParam BigDecimal longitude, @RequestParam long radius) {
        List<ParkingLot> parkingLots = parkingLotService.getParkingLotsWithinRadius(latitude, longitude, radius);
        parkingLots.forEach(parkingLot -> {
            System.out.println(parkingLot.getId());
        });
        return parkingLots.stream().map(parkingLot -> {
            List<ParkingSpot> spots = parkingSpotService.findByParkingLot(parkingLot);
            List<ParkingSpotData> spotsTrimmed = spots.stream().map(parkingSpot -> new ParkingSpotData(parkingSpot.getId(), parkingSpot.getStatus())).toList();
            return new ParkingLotAndSpots(parkingLot, spotsTrimmed);
        }).collect(Collectors.toList());
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
        private List<ParkingSpotData> parkingSpots;

    }

    @Getter @Setter
    @AllArgsConstructor
    public static class ParkingSpotData {
        private Long id;
        private String status;
    }


}
