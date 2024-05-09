package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.service.ParkingSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/parking_spots")
public class ParkingSpotController {
    private final ParkingSpotService parkingSpotService;

    @Autowired
    public ParkingSpotController(ParkingSpotService parkingSpotService) {
        this.parkingSpotService = parkingSpotService;
    }

    @GetMapping("/get-price")
    public int getParkingSpotPrice(@RequestParam Timestamp start_time, @RequestParam Timestamp stop_time, @RequestParam Long id){
        System.out.println(start_time);
        System.out.println(stop_time);

        return parkingSpotService.calculateReservationCost(start_time, stop_time, id);
    }

    @PostMapping
    public void registerNewParkingSpot(@RequestBody ParkingSpot parkingSpot){
        parkingSpotService.addNewParkingSpot(parkingSpot);
    }
}
