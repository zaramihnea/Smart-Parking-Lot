package com.smartparkinglot.backend.tasks;

import com.smartparkinglot.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.Instant;

@Component
public class ReservationCancellingTask {
    @Autowired
    private ReservationRepository reservationRepository;

    @Scheduled(fixedRate = 900000) // Run every 15 minutes
    @Async
    public void cancelExpiredReservations() {
        Timestamp currentTimestamp = Timestamp.from(Instant.now());
        int updatedRows = reservationRepository.cancelExpiredReservations(currentTimestamp);
        System.out.println("Cancelled " + updatedRows + " expired reservations.");
    }
}
