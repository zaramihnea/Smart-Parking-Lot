package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.ParkingLot;
import com.smartparkinglot.backend.service.ParkingLotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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

    //PutMapping <=> PUT requests
    @PutMapping(path = "{parkingLotId}")
    // the names must be the same as in the ParkingLot class
    // PathVariable <=> se cauta dupa el
    // RequestParam <=> parametru care va fi modificat
    public void updateParkingLot(@PathVariable("parkingLotId") String parkingLotId,
                                 @RequestParam(required = false) Long nrSpots,
                                 @RequestParam(required = false) BigDecimal latitude,
                                 @RequestParam(required = false) BigDecimal longitude){
        parkingLotService.updateParkingLot(parkingLotId, nrSpots, latitude, longitude);
    }
}
