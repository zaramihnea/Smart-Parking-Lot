package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.Message;
import com.smartparkinglot.backend.entity.ParkingSpot;
import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.entity.User;
import com.smartparkinglot.backend.service.MessageService;
import com.smartparkinglot.backend.service.ParkingSpotService;
import com.smartparkinglot.backend.service.ReservationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;

@RestController
@RequestMapping("/parking_spots")
public class ParkingSpotController {
    private final ParkingSpotService parkingSpotService;
    private final ReservationService reservationService;
    private final MessageService messageService;

    @Autowired
    public ParkingSpotController(ParkingSpotService parkingSpotService, ReservationService reservationService, MessageService messageService) {
        this.parkingSpotService = parkingSpotService;
        this.reservationService = reservationService;
        this.messageService = messageService;
    }

    @GetMapping("/get-price")
    public Double getParkingSpotPrice(@RequestParam Timestamp start_time, @RequestParam Timestamp stop_time, @RequestParam Long id){
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

        if (updatedParkingSpot.getStatus().equals("unoccupied")) {
            existingParkingSpot.setStatus(null);
            existingParkingSpot.setPlate(null);
            parkingSpotService.updateParkingSpot(existingParkingSpot);
            return ResponseEntity.ok("Spot freed");
        }

        Reservation res = reservationService.getReservationByParkingSpotId(updatedParkingSpot.getId());
        if (res == null) {
            String message = String.format("A car with the plate %s is on parking spot %d here from parking lot %s WITHOUT A RESERVATION.",
                    updatedParkingSpot.getPlate(), updatedParkingSpot.getId(), existingParkingSpot.getParkingLot().getName());
            saveMessage(existingParkingSpot.getParkingLot().getUser(), message);
            return ResponseEntity.ok(message);
        } else {
            if (res.getCar_id().getPlate().equals(updatedParkingSpot.getPlate())) {
                existingParkingSpot.setStatus(updatedParkingSpot.getStatus());
                existingParkingSpot.setPlate(updatedParkingSpot.getPlate());
                parkingSpotService.updateParkingSpot(existingParkingSpot);
                return ResponseEntity.ok("The correct plate is occupying the spot");
            } else {
                String message = String.format("A car with the plate %s is here on parking spot %d from parking lot %s OCCUPYING SOMEONE ELSE'S SPOT.",
                        updatedParkingSpot.getPlate(), updatedParkingSpot.getId(), existingParkingSpot.getParkingLot().getName());
                saveMessage(existingParkingSpot.getParkingLot().getUser(), message);
                return ResponseEntity.ok(message);
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

    private void saveMessage(User admin, String messageContent) {
        Message message = new Message(admin, messageContent, new Date(), false);
        messageService.saveMessage(message);
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
