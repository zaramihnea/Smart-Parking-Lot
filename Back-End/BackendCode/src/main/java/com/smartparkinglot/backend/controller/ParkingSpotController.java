package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.repository.ReservationRepository;
import com.smartparkinglot.backend.service.ParkingSpotService;
import com.smartparkinglot.backend.service.ReservationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/parking_spots")
public class ParkingSpotController {
    private final ParkingSpotService parkingSpotService;
    private final ReservationService reservationService;

    @Autowired
    public ParkingSpotController(ParkingSpotService parkingSpotService, ReservationService reservationService) {
        this.parkingSpotService = parkingSpotService;
        this.reservationService = reservationService;
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

    @PostMapping("/update/{id}")
    public ResponseEntity<String> updateParkingSpot(@PathVariable("id") Long id, @RequestBody ParkingSpot updatedParkingSpot) {
        ParkingSpot existingParkingSpot = parkingSpotService.getById(updatedParkingSpot.getId());

        if (existingParkingSpot == null) {
            return ResponseEntity.notFound().build();
        }
        
        if(updatedParkingSpot.getStatus().equals("unoccupied"))
        {
        	existingParkingSpot.setStatus(null);
            existingParkingSpot.setPlate(null);
            parkingSpotService.updateParkingSpot(existingParkingSpot);
            return ResponseEntity.ok("Spot freed");
        }
        Reservation res = reservationService.getReservationById(updatedParkingSpot.getId());
        if(res == null)
        {
        	return ResponseEntity.ok("There is no reservation on that parking spot");
        }
        else
        {
        	if(res.getCar_id().getPlate().equals(updatedParkingSpot.getPlate()))
        	{
        		existingParkingSpot.setStatus(updatedParkingSpot.getStatus());
                existingParkingSpot.setPlate(updatedParkingSpot.getPlate());
                parkingSpotService.updateParkingSpot(existingParkingSpot);
                return ResponseEntity.ok("The correct plate is occupying the spot");
        	}
        	else
        	{
        		return ResponseEntity.ok("An incorrect plate is occupying the spot");
        	}
        }
     }

    @PutMapping("/update-name/{id}")
    public ResponseEntity<String> updateParkingSpotName(@PathVariable("id") Long id, @RequestBody ParkingSpot updatedParkingSpot) {
        ParkingSpot existingParkingSpot = parkingSpotService.getById(id);

        if (existingParkingSpot == null) {
            return ResponseEntity.notFound().build();
        }

        existingParkingSpot.setName(updatedParkingSpot.getName());
        parkingSpotService.updateParkingSpot(existingParkingSpot);

        return ResponseEntity.ok("Parking spot updated successfully");
    }



    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteParkingSpot(@RequestBody ParkingSpot parkingSpot) {
        try {
            parkingSpotService.deleteParkingSpot(parkingSpot);
            return ResponseEntity.ok("Parking spot deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to delete parking spot");
        }
    }
}
