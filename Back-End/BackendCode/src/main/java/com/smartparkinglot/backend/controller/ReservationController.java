package com.smartparkinglot.backend.controller;

import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.service.CardService;
import com.smartparkinglot.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
public class ReservationController {
    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<Reservation> getReservations(){
        return reservationService.getAllReservations();
    }

    @PostMapping
    public void registerNewReservation(@RequestBody Reservation reservation) {
        reservationService.addNewReservation(reservation);
    }
}