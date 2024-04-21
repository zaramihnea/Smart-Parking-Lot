package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.service.ParkingLotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parking_lot")
public class ParkingLotController {

    private final ParkingLotService parkingLotService;

    @Autowired
    public ParkingLotController(ParkingLotService parkingLotService) {
        this.parkingLotService = parkingLotService;
    }

    @GetMapping
    public List<ParkingLot> getParkingLots(){
        return parkingLotService.getAllParkingLots();
    }

    @PostMapping
    public void registerNewParkingLot(@RequestBody ParkingLot parkingLot) {
        parkingLotService.addNewParkingLot(parkingLot);
    }
}
