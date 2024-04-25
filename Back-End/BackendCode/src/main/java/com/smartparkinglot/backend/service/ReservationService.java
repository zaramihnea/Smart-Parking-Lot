package com.smartparkinglot.backend.service;

import com.smartparkinglot.backend.entity.Card;
import com.smartparkinglot.backend.entity.Reservation;
import com.smartparkinglot.backend.repository.CardRepository;
import com.smartparkinglot.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public void addNewReservation(Reservation reservation) {
        if (reservationRepository.existsById(reservation.getId())) {
            throw new IllegalStateException("Reservation with ID " + reservation.getId() + " already exists");
        }
        reservationRepository.save(reservation);
    }
}
