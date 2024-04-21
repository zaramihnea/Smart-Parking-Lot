package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.service.ParkingSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parking_spots")
public class ParkingSpotController {
    private final ParkingSpotService parkingSpotService;

    @Autowired
    public ParkingSpotController(ParkingSpotService parkingSpotService) {
        this.parkingSpotService = parkingSpotService;
    }

    @GetMapping
    public List<ParkingSpot> getParkingSpots(){
        return parkingSpotService.getAllParkingSpots();
    }

    @PostMapping
    public void registerNewParkingSpot(@RequestBody ParkingSpot parkingSpot){
        parkingSpotService.addNewParkingSpot(parkingSpot);
    }
}
